# Software Update System

Technical reference for OTA updates, update server setup, and release versioning.

---

## Update Flow

```
Startup → Check API → Update Available? → Download → Verify SHA256 → Apply → Restart
```

**New in v2.0 (Embedded Python Build):**
- All third-party packages are `.py` source files (editable)
- Individual `.py` files can be patched without rebuild
- No recompilation needed for bug fixes
- Update applies by extracting `.py` files directly

---

## Configuration

`configs/system.yaml`:

```yaml
update:
  check_on_startup: true
  update_api: "https://tvastr-update-server.onrender.com/api/check-update"
  product: "rejection-analysis-system"
```

**Disable update checks:**
```yaml
update:
  check_on_startup: false
```

---

## Update Server API

**Endpoint:**
```
GET https://tvastr-update-server.onrender.com/api/check-update
```

**Query parameters:**
```
?product=rejection-analysis-system
&version=1.0
&license=TIER_2-AB91F42C77E2A1D3
```

**Response:**
```json
{
  "product":        "rejection-analysis-system",
  "latest_version": "1.4",
  "release_date":   "2026-03-26",
  "changelog": [
    "Added cavity analysis",
    "Fixed batch processing bug"
  ],
  "download_url":   "https://releases.tvastr.ai/castai-1.4-code.zip",
  "checksum":       "sha256:a1b2c3d4...",
  "tier":           "TIER_2",
  "min_python":     "3.9",
  "requires_restart": true
}
```

**Field descriptions:**

| Field | Type | Description |
|---|---|---|
| `product` | string | Must match `system.yaml → update.product` |
| `latest_version` | string | Newest available version |
| `release_date` | string | ISO date |
| `changelog` | list[string] | Bullet points |
| `download_url` | string | Direct URL to zip |
| `checksum` | string | `sha256:<hex>` |
| `tier` | string | Optional, for tier-aware updates |
| `min_python` | string | Minimum Python version |
| `requires_restart` | bool | Whether app restarts after update |

---

## Tier-Aware Updates

Update server can specify `tier` field. Launcher validates:

```
if manifest.tier != local_tier:
    BLOCK UPDATE (tier mismatch)
```

Prevents TIER_1 customers receiving TIER_3 updates.

---

## Update Types

### 1. Full Software Update (installer)

- Run `TvastrRAS_Installer.exe`
- Reinstalls system

### 2. OTA Code Update (zip) **[Recommended]**

**What can be updated:**
- ✅ All `.py` source files in `core/`, `services/`, `customers/`, `launcher/`
- ✅ Third-party packages (all `.py` source — streamlit, torch, ultralytics, etc.)
- ✅ Configuration files (`configs/`)
- ✅ Assets, templates, static files

**Process:**
- Launcher downloads zip → extracts to `runtime/updates/`
- Replaces `.py` files in place (no recompilation)
- Restarts application

**Key Advantage:** Embedded Python build keeps all code as `.py` source, enabling true file-level patching. Critical bugs can be fixed in minutes by shipping single `.py` file changes.

### 3. Model-Only Update

- Replace `.pt` files in `customers/castco/models/`
- No code change, no restart required

---

## Setting Up Update Server

### Minimal FastAPI Server

```python
# update_server.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import json
from pathlib import Path

app = FastAPI()

@app.get("/api/check-update")
def check_update(product: str, version: str, license: str):
    manifest_path = Path("manifests") / f"{product}.json"
    if not manifest_path.exists():
        return JSONResponse(status_code=404, content={"error": "Unknown product"})
    manifest = json.loads(manifest_path.read_text())
    return JSONResponse(content=manifest)
```

**Run:**
```bash
uvicorn update_server:app --host 0.0.0.0 --port 443 --ssl-keyfile key.pem --ssl-certfile cert.pem
```

---

### Nginx Static Files

```nginx
server {
    listen 443 ssl;
    server_name tvastr.ai;

    # Serve manifests as JSON
    location /api/check-update {
        alias /var/www/tvastr/manifests/rejection-analysis-system.json;
        default_type application/json;
        add_header Cache-Control "no-cache";
    }

    # Serve release zip files
    location /releases/ {
        root /var/www/tvastr;
        autoindex off;
    }
}
```

---

## Creating a New Release

### Step 1 — Bump Version

Edit `VERSION.txt`:
```
Version: 1.4
```

Add changelog entry at top.

---

### Step 2 — Build Release Package

```bash
# Code-only (OTA updates)
python packaging/release_builder.py --no-models
# → releases/castai-1.4-code.zip
# → releases/castai-1.4.sha256

# Full deployment (includes models)
python packaging/release_builder.py
# → releases/castai-1.4-full.zip
```

**Included:**
- `core/`, `services/`, `customers/`, `configs/`, `assets/`, `launcher/`
- `run_app.py`, `requirements.txt`, `VERSION.txt`, `README.md`
- Model `.pt` files (only in `--full` builds)

**Excluded:**
- `runtime/`, `dev/`, `__pycache__/`, `*.pyc`, `.git`, `*.db`

---

### Step 3 — Build Windows Installer (Optional)

```batch
packaging\build_release.bat
```

**Output:** `dist/TvastrRAS_Installer.exe`

Requires: Inno Setup 6 + C compiler (auto-detects MSVC/GCC/C# csc.exe)

**Build Time:** 3-5 minutes (Embedded Python build system)

---

### Step 4 — Update Manifest

After `release_builder.py` runs, `packaging/update_manifest.json` is auto-updated:

```json
{
  "product":        "rejection-analysis-system",
  "version":        "1.4",
  "release_date":   "2026-03-26",
  "changelog":      ["..."],
  "download_url":   "https://releases.tvastr.ai/castai-1.4-code.zip",
  "checksum":       "sha256:abc123...",
  "requires_restart": true
}
```

Update `download_url` to point to hosted zip location.

---

### Step 5 — Publish

```bash
# Upload zip to release server
scp releases/castai-1.4-code.zip tvastr.ai:/var/www/tvastr/releases/

# Upload updated manifest
scp packaging/update_manifest.json tvastr.ai:/var/www/tvastr/manifests/rejection-analysis-system.json
```

All online installations detect update on next launch.

---

## Model-Only Updates

Ship zip with this structure:

```
CastAI_Model_Update_v1.4.zip
└── models/
    ├── casting_model.pt
    ├── patch_classifier.pt
    └── version.json
```

`version.json`:
```json
{
  "model_version": "1.4",
  "updated_at": "2026-03-26",
  "models": {
    "casting_model": "casting_model.pt",
    "patch_classifier": "patch_classifier.pt"
  }
}
```

**Apply:**

```python
from core.update.model_updater import apply_model_update, check_model_versions

# Check installed versions
info = check_model_versions()
print(info["model_version"])

# Apply update
result = apply_model_update("CastAI_Model_Update_v1.4.zip")
if result["success"]:
    print(f"Updated to {result['version']}")
    print(f"Files: {result['files_updated']}")
```

Logged to `runtime/logs/model_updates.log`. No restart required.

---

## Manual Update Check

```bash
python core/update/update_client.py
```

---

## Troubleshooting

### Update check fails

**Error:**
```
Could not check for updates
```

**Cause:** Update server unreachable (no internet).

**Fix:** System continues with current version. Update check optional.

---

### Download fails

**Error:**
```
Failed to download update
```

**Cause:** Network timeout or invalid URL.

**Fix:**
1. Check internet connection
2. Verify `download_url` in manifest is accessible
3. Retry update check

---

### Checksum mismatch

**Error:**
```
Checksum verification failed
```

**Cause:** Downloaded file corrupted or manifest checksum incorrect.

**Fix:**
1. Delete `runtime/updates/*.zip`
2. Retry download
3. Verify manifest checksum matches actual file:
   ```bash
   certutil -hashfile castai-1.4-code.zip SHA256
   ```

---

## OTA Update Examples

### Example 1: Single File Bug Fix

**Scenario:** Critical bug in `core/vision/detector.py`

**Process:**
1. Fix the bug locally in `core/vision/detector.py`
2. Create update zip containing only the changed file:
   ```
   castai-1.4.1-hotfix.zip
   └── core/
       └── vision/
           └── detector.py
   ```
3. Upload to release server
4. Update manifest with new version + checksum
5. All installations receive the fix on next startup

**Time to deploy:** Minutes (vs hours with compiled builds)

### Example 2: Third-Party Package Patch

**Scenario:** Fix streamlit import error

**Process:**
1. Edit `streamlit/runtime/scriptrunner/magic.py` locally
2. Create update zip:
   ```
   castai-1.4.2-streamlit-fix.zip
   └── streamlit/
       └── runtime/
           └── scriptrunner/
               └── magic.py
   ```
3. Deploy via OTA update

**Why This Works:** Embedded Python build keeps all third-party packages as `.py` source files (not compiled), so they can be patched just like your own code.

### Example 3: Configuration Update

**Scenario:** Update default batch processing settings

**Process:**
1. Modify `configs/system.yaml`
2. Create update zip with config file only
3. Deploy — no restart required for most config changes

---

## Build System Comparison

### v1.0 (Nuitka) vs v2.0 (Embedded Python)

| Aspect | Nuitka (v1.0) | Embedded Python (v2.0) |
|--------|---------------|------------------------|
| **OTA Capability** | Limited (only Python source) | Full (source + dependencies) |
| **Third-Party Packages** | Compiled to C | `.py` source files |
| **Bug Fix Deployment** | Rebuild + redeploy (hours) | Patch `.py` file (minutes) |
| **Update Size** | Full package required | Single file updates possible |
| **Testing** | Requires full rebuild | Edit + test directly |
| **Versioning** | Versioned executable | Versioned source files + manifest |
| **Integration with Phase-K** | Not applicable | Core to Phase-K energy-based reasoning system |
| **Legacy Support** | Supports v1.0-only features | Replaces all v1.0 logic, including Nuitka build and 4-gate reasoning |
| **Compliance** | Obsolete | Compliant with current product architecture and documentation |
| **Deployment Model** | Monolithic executable | Modular, patchable, continuous update enabled |
| **Reasoning System** | Uses 4-gate logic | Uses Phase-K energy-based reasoning |
| **Support Status** | Deprecated | Active (v2.0+ only) |

---

## References

- **Build & Deployment:** `docs/build_and_deploy.md`
- **Architecture:** `docs/architecture.md`
- **Licensing:** `docs/licensing.md`

---

**Last Updated:** April 4, 2026  
**Build System:** Embedded Python v2.0
