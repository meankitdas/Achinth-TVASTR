"""License validation service."""
from datetime import date
from app.services.supabase_service import get_client


def validate_license(license_key: str, product_id: str) -> tuple[bool, str]:
    """
    Validate a license key for a given product.

    Returns:
        (is_valid, reason) — reason is empty string when valid.
    """
    db = get_client()

    response = (
        db.table("licenses")
        .select("active, expiry_date, product_id")
        .eq("license_key", license_key)
        .eq("product_id", product_id)
        .single()
        .execute()
    )

    row = response.data
    if not row:
        return False, "License key not found."

    if not row["active"]:
        return False, "License is inactive."

    if row["expiry_date"]:
        expiry = date.fromisoformat(row["expiry_date"])
        if date.today() > expiry:
            return False, "License has expired."

    return True, ""
