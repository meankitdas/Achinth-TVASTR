"""GET /api/download/{product}/{version} — generate a signed download URL."""
from fastapi import APIRouter, HTTPException, Query, Request
from app.services.license_service import validate_license
from app.services.version_service import (
    get_product_by_name,
    get_version,
    generate_signed_url,
    log_download,
)

router = APIRouter()


@router.get("/download/{product}/{version}")
def download(
    product: str,
    version: str,
    request: Request,
    license_key: str = Query(..., description="License key"),
):
    """
    Generate a signed download URL for a specific product version.

    Steps:
      1. Resolve product by name
      2. Validate license key
      3. Fetch requested version
      4. Generate signed storage URL (60s expiry)
      5. Log the download
      6. Return signed URL
    """
    # 1. Resolve product
    product_row = get_product_by_name(product)
    if not product_row:
        raise HTTPException(status_code=404, detail=f"Product '{product}' not found.")

    product_id = product_row["id"]

    # 2. Validate license
    valid, reason = validate_license(license_key, product_id)
    if not valid:
        raise HTTPException(status_code=403, detail=reason)

    # 3. Fetch the requested version
    version_row = get_version(product_id, version)
    if not version_row:
        raise HTTPException(
            status_code=404,
            detail=f"Version '{version}' not found for product '{product}'.",
        )

    # 4. Generate signed URL
    try:
        download_url = generate_signed_url(version_row["file_path"])
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    # 5. Log the download
    ip = request.client.host if request.client else None
    try:
        log_download(license_key, product_id, version, ip)
    except Exception:
        pass  # Logging failure must not block the download

    # 6. Return signed URL + metadata
    return {
        "product": product_row["name"],
        "version": version,
        "download_url": download_url,
        "checksum": version_row["checksum"],
        "expires_in_seconds": 60,
    }
