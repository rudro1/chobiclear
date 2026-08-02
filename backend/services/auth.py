import jwt
import time
from datetime import datetime, timedelta
from typing import Optional
from fastapi import HTTPException, Header, status
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET", "change_me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "43200"))


def create_access_token(user_id: str, tier: str = "free", credits: int = 0) -> str:
    """Create a JWT token for a user."""
    payload = {
        "sub": user_id,
        "tier": tier,   # "free" | "paid"
        "credits": credits,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and verify a JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )


def get_current_user(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    """
    Extract user from Bearer token.
    Returns None for unauthenticated (free-tier) users.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ", 1)[1]
    return decode_token(token)


def require_paid_user(authorization: Optional[str] = Header(None)) -> dict:
    """Dependency that requires a paid user token."""
    user = get_current_user(authorization)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required for HD downloads",
        )
    if user.get("tier") != "paid" and user.get("credits", 0) <= 0:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="No credits remaining. Please purchase more.",
        )
    return user
