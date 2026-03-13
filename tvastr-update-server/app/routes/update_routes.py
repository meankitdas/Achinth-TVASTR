"""GET /api/check-update — check if a newer version is available."""
from fastapi import APIRouter, HTTPException, Query
from app.services.license_service import validate_license
from app.services.version_service import (
    get_product_by_name,
    get_latest_version,
    generate_signed_url,
)

router = APIRouter()


@router.get("/check-update")
def check_update(
    product: str = Query(..., description="Product name"),
    version: str = Query(..., description="Currently installed version"),
    license_key: str = Query(..., description="License key"),
):
    """
    Check if a newer version exists for the given product + license.

    Returns update metadata and a signed download URL when an update is available.
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

    # 3. Fetch latest version
    latest = get_latest_version(product_id)
    if not latest:
        raise HTTPException(status_code=404, detail="No versions found for this product.")

    latest_ver = latest["version_number"]

    # Simple string comparison — versions follow semver (x.y.z)
    if latest_ver == version:
        return {"update_available": False, "latest_version": latest_ver}

    # 4. Generate signed URL
    try:
        download_url = generate_signed_url(latest["file_path"])
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "update_available": True,
        "latest_version": latest_ver,
        "release_date": latest["release_date"],
        "changelog": latest["changelog"],
        "download_url": download_url,
        "checksum": latest["checksum"],
    }
