"""
ChobiClear — FastAPI Backend
Endpoints:
  POST /remove-bg       — remove background from an uploaded image
  GET  /download/{id}   — download free (watermarked) result
  GET  /download/{id}/hd — download HD result (paid users)
  POST /payment/initiate — start SSLCommerz payment session
  POST /payment/ipn     — SSLCommerz IPN webhook
  POST /auth/token      — issue a demo JWT (replace with real user system)
"""

import io
import os
import uuid
import logging
from typing import Optional

from fastapi import (
    FastAPI, File, UploadFile, HTTPException,
    Request, Depends, Form, Header, status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from dotenv import load_dotenv

from services.bg_remover import remove_background
from services.watermark import apply_watermark, resize_to_preview
from services.storage import save_result, cleanup_old_files, RESULT_DIR, ensure_dirs
from services.auth import get_current_user, require_paid_user, create_access_token
from services.payment import initiate_payment, validate_ipn

# ─── Config ──────────────────────────────────────────────────────────────────
load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
FREE_RATE_LIMIT = os.getenv("FREE_RATE_LIMIT_PER_DAY", "10")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

# ─── Rate Limiter ─────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

# ─── FastAPI App ──────────────────────────────────────────────────────────────
app = FastAPI(
    title="ChobiClear API",
    description="Background removal API — ছবির ব্যাকগ্রাউন্ড রিমুভ",
    version="1.0.0",
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Scheduler: auto-cleanup ──────────────────────────────────────────────────
scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup():
    ensure_dirs()
    scheduler.add_job(cleanup_old_files, "interval", minutes=30, id="cleanup")
    scheduler.start()
    logger.info("ChobiClear API started.")


@app.on_event("shutdown")
async def shutdown():
    scheduler.shutdown()


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _validate_image(file: UploadFile):
    allowed_types = {"image/jpeg", "image/png", "image/webp"}
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Use JPG, PNG, or WebP.",
        )


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "ChobiClear"}


@app.post("/remove-bg")
@limiter.limit(f"{FREE_RATE_LIMIT}/day")
async def remove_bg(
    request: Request,
    file: UploadFile = File(...),
    user: Optional[dict] = Depends(get_current_user),
):
    """
    Remove the background from an uploaded image.
    Returns a JSON with a `result_id` to use for download.
    Free users are rate-limited per IP.
    """
    _validate_image(file)

    raw = await file.read()
    if len(raw) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File exceeds 10 MB limit.")

    try:
        processed = remove_background(raw)
    except Exception as exc:
        logger.error("Background removal failed: %s", exc)
        raise HTTPException(status_code=500, detail="Background removal failed. Please try a different image.")

    result_id = str(uuid.uuid4())
    save_result(result_id, processed)

    is_paid = user and (user.get("tier") == "paid" or user.get("credits", 0) > 0)
    return {"result_id": result_id, "is_paid": is_paid}


@app.get("/download/{result_id}")
async def download_free(result_id: str):
    """
    Download free (watermarked + lower-res) result PNG.
    """
    path = RESULT_DIR / f"{result_id}.png"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Result not found or expired.")

    img_bytes = path.read_bytes()
    # Apply lower resolution first, then watermark
    img_bytes = resize_to_preview(img_bytes, max_dimension=1200)
    img_bytes = apply_watermark(img_bytes)

    return Response(
        content=img_bytes,
        media_type="image/png",
        headers={"Content-Disposition": f'attachment; filename="chobiclear_free_{result_id[:8]}.png"'},
    )


@app.get("/download/{result_id}/hd")
async def download_hd(
    result_id: str,
    user: dict = Depends(require_paid_user),
):
    """
    Download the full-resolution, clean result PNG (paid users only).
    """
    path = RESULT_DIR / f"{result_id}.png"
    if not path.exists():
        raise HTTPException(status_code=404, detail="Result not found or expired.")

    img_bytes = path.read_bytes()
    return Response(
        content=img_bytes,
        media_type="image/png",
        headers={"Content-Disposition": f'attachment; filename="chobiclear_hd_{result_id[:8]}.png"'},
    )


# ─── Auth ─────────────────────────────────────────────────────────────────────

@app.post("/auth/token")
async def get_demo_token(user_id: str = Form(...)):
    """
    DEMO ONLY — issue a free-tier token for a given user ID.
    Replace with a real registration/login system in production.
    """
    token = create_access_token(user_id, tier="free", credits=0)
    return {"access_token": token, "token_type": "bearer"}


# ─── Payments ─────────────────────────────────────────────────────────────────

@app.post("/payment/initiate")
async def payment_initiate(
    plan: str = Form(...),
    user: dict = Depends(get_current_user),
):
    """Start an SSLCommerz payment session for a given plan."""
    user_id = user["sub"] if user else "anonymous"
    result = await initiate_payment(user_id, plan)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result


@app.post("/payment/ipn")
async def payment_ipn(request: Request):
    """
    SSLCommerz IPN webhook — called by SSLCommerz after payment.
    Validates the payment and upgrades the user's tier/credits.
    """
    form = await request.form()
    post_data = dict(form)

    is_valid = await validate_ipn(post_data)
    if not is_valid:
        logger.warning("Invalid IPN received: %s", post_data)
        return JSONResponse({"status": "invalid"}, status_code=400)

    # TODO: Update user record in your database with the new credits/tier.
    # For now, log the successful payment.
    tran_id = post_data.get("tran_id", "unknown")
    logger.info("Payment confirmed. tran_id=%s", tran_id)

    return {"status": "ok", "tran_id": tran_id}
