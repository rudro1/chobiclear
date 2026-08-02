"""
SSLCommerz payment integration for ChobiClear.

Docs: https://developer.sslcommerz.com/doc/v4/
Sandbox API: https://sandbox.sslcommerz.com/gwprocess/v4/api.php
"""

import os
import httpx
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

STORE_ID = os.getenv("SSLCOMMERZ_STORE_ID", "")
STORE_PASS = os.getenv("SSLCOMMERZ_STORE_PASS", "")
IS_SANDBOX = os.getenv("SSLCOMMERZ_SANDBOX", "True").lower() == "true"
SUCCESS_URL = os.getenv("SSLCOMMERZ_SUCCESS_URL", "")
FAIL_URL = os.getenv("SSLCOMMERZ_FAIL_URL", "")
CANCEL_URL = os.getenv("SSLCOMMERZ_CANCEL_URL", "")
IPN_URL = os.getenv("SSLCOMMERZ_IPN_URL", "")

SSLCOMMERZ_BASE = (
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
    if IS_SANDBOX
    else "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
)

PLANS = {
    "pack_100": {"amount": 199, "currency": "BDT", "credits": 100, "name": "100 Image Pack"},
    "monthly":  {"amount": 299, "currency": "BDT", "credits": 9999, "name": "Monthly Unlimited"},
}


async def initiate_payment(user_id: str, plan_key: str) -> dict:
    """
    Initiate an SSLCommerz payment session.
    Returns the GatewayPageURL for redirect or an error dict.
    """
    plan = PLANS.get(plan_key)
    if not plan:
        return {"error": f"Unknown plan: {plan_key}"}

    tran_id = f"CHOBICLEAR-{user_id}-{plan_key}-{os.urandom(4).hex()}"

    payload = {
        "store_id": STORE_ID,
        "store_passwd": STORE_PASS,
        "total_amount": plan["amount"],
        "currency": plan["currency"],
        "tran_id": tran_id,
        "success_url": SUCCESS_URL,
        "fail_url": FAIL_URL,
        "cancel_url": CANCEL_URL,
        "ipn_url": IPN_URL,
        "cus_name": user_id,
        "cus_email": f"{user_id}@chobiclear.com",
        "cus_phone": "01700000000",
        "cus_add1": "Dhaka",
        "cus_city": "Dhaka",
        "cus_country": "Bangladesh",
        "shipping_method": "NO",
        "product_name": plan["name"],
        "product_category": "SaaS",
        "product_profile": "general",
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(SSLCOMMERZ_BASE, data=payload)
        resp.raise_for_status()
        data = resp.json()

    if data.get("status") == "SUCCESS":
        return {
            "gateway_url": data["GatewayPageURL"],
            "tran_id": tran_id,
            "plan": plan_key,
            "credits": plan["credits"],
        }
    else:
        logger.error("SSLCommerz init failed: %s", data)
        return {"error": data.get("failedreason", "Payment initiation failed")}


async def validate_ipn(post_data: dict) -> bool:
    """
    Validate an SSLCommerz IPN (Instant Payment Notification) notification.
    Returns True if the payment is genuinely verified.
    """
    val_id = post_data.get("val_id")
    if not val_id:
        return False

    validation_url = (
        "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php"
        if IS_SANDBOX
        else "https://securepay.sslcommerz.com/validator/api/validationserverAPI.php"
    )

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(
            validation_url,
            params={
                "val_id": val_id,
                "store_id": STORE_ID,
                "store_passwd": STORE_PASS,
                "format": "json",
            },
        )
        resp.raise_for_status()
        data = resp.json()

    return data.get("status") == "VALID"
