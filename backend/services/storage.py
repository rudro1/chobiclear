import os
import time
import logging
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "uploads"))
RESULT_DIR = Path(os.getenv("RESULT_DIR", "results"))
FILE_EXPIRY_MINUTES = int(os.getenv("FILE_EXPIRY_MINUTES", "60"))


def ensure_dirs():
    """Create upload/result directories if they don't exist."""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    RESULT_DIR.mkdir(parents=True, exist_ok=True)


def save_upload(file_id: str, data: bytes) -> Path:
    """Save uploaded image bytes to the upload directory."""
    ensure_dirs()
    path = UPLOAD_DIR / f"{file_id}.png"
    path.write_bytes(data)
    return path


def save_result(file_id: str, data: bytes) -> Path:
    """Save processed image bytes to the result directory."""
    ensure_dirs()
    path = RESULT_DIR / f"{file_id}.png"
    path.write_bytes(data)
    return path


def cleanup_old_files():
    """
    Delete uploaded and result files older than FILE_EXPIRY_MINUTES.
    Called periodically by APScheduler.
    """
    expiry_seconds = FILE_EXPIRY_MINUTES * 60
    now = time.time()
    deleted = 0

    for directory in (UPLOAD_DIR, RESULT_DIR):
        if not directory.exists():
            continue
        for fpath in directory.iterdir():
            if fpath.is_file():
                age = now - fpath.stat().st_mtime
                if age > expiry_seconds:
                    try:
                        fpath.unlink()
                        deleted += 1
                    except OSError as exc:
                        logger.warning("Could not delete %s: %s", fpath, exc)

    if deleted:
        logger.info("Storage cleanup: removed %d file(s) older than %d min", deleted, FILE_EXPIRY_MINUTES)
