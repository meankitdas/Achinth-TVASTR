"""Version query and signed URL generation service."""
from app.services.supabase_service import get_client
from app.config import STORAGE_BUCKET, SIGNED_URL_EXPIRY


def get_product_by_name(product_name: str) -> dict | None:
    """Fetch product row by name (case-insensitive)."""
    db = get_client()
    response = (
        db.table("products")
        .select("id, name, description")
        .ilike("name", product_name)
        .single()
        .execute()
    )
    return response.data


def get_latest_version(product_id: str) -> dict | None:
    """Fetch the most recent version row for a product."""
    db = get_client()
    response = (
        db.table("versions")
        .select("id, version_number, release_date, changelog, file_path, checksum")
        .eq("product_id", product_id)
        .order("release_date", desc=True)
        .limit(1)
        .execute()
    )
    rows = response.data
    return rows[0] if rows else None


def get_version(product_id: str, version_number: str) -> dict | None:
    """Fetch a specific version row."""
    db = get_client()
    response = (
        db.table("versions")
        .select("id, version_number, release_date, changelog, file_path, checksum")
        .eq("product_id", product_id)
        .eq("version_number", version_number)
        .single()
        .execute()
    )
    return response.data


def generate_signed_url(file_path: str) -> str:
    """
    Generate a signed storage URL for a file in the updates bucket.
    URL expires after SIGNED_URL_EXPIRY seconds.
    Raises ValueError if URL generation fails.
    """
    db = get_client()
    response = (
        db.storage
        .from_(STORAGE_BUCKET)
        .create_signed_url(file_path, SIGNED_URL_EXPIRY)
    )
    signed_url = response.get("signedURL") or response.get("signedUrl")
    if not signed_url:
        raise ValueError(f"Failed to generate signed URL for {file_path}")
    return signed_url


def log_download(
    license_key: str,
    product_id: str,
    version_number: str,
    ip_address: str | None,
) -> None:
    """Insert a download log entry."""
    db = get_client()
    db.table("download_logs").insert({
        "license_key": license_key,
        "product_id": product_id,
        "version_number": version_number,
        "ip_address": ip_address,
    }).execute()
