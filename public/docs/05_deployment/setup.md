# Setup Guide — Build, Install, Deploy

> **Purpose:** Complete guide for building releases, installing in production, and initial configuration  
> **Audience:** DevOps engineers, system administrators, deployment teams

---

## Table of Contents

- [Building Production Releases](#building-production-releases)
- [Production Installation](#production-installation)
- [Post-Installation Setup](#post-installation-setup)
- [First Launch](#first-launch)
- [Verify Installation](#verify-installation)
- [Troubleshooting](#troubleshooting)

---

# Building Production Releases

## Build System Overview

**Embedded Python Build System** (v2.0) — Replaces previous Nuitka compilation

**Key advantages:**
- **Build Time:** 3-5 minutes (vs 1.5+ hours with Nuitka)
- **All Code as Source:** Python files remain editable (OTA-updateable)
- **No Compilation:** Only tiny launcher stub is compiled
- **Fast Iterations:** Cached artifacts speed up subsequent builds
- **OTA-Friendly:** Individual `.py` files can be patched without rebuild

### Build Process Flow

```
Source → Download Embedded Python → Smart Package Copy → Compile Launcher Stub → Copy Assets → Inno Setup → Installer.exe
```

**6-Step Build Process:**

1. **Clean & Cache** — Preserve cached files (python-embed.zip, launcher.exe)
2. **Python Runtime** — Download/extract official Python embeddable distribution
3. **Package Copy** — Smart copy of required packages from site-packages (source only)
4. **Launcher Stub** — Compile tiny C/C# wrapper (auto-detects compiler)
5. **Project Files** — Copy configs, assets, models, runtime directories
6. **Installer** — Create Windows installer with Inno Setup

---

## Prerequisites

### Required Software

| Tool | Version | Purpose |
|------|---------|---------|
| Python | 3.11+ | Core runtime |
| Inno Setup | 6.x | Create Windows installer |
| Node.js | 18+ | Build PI module (TIER_3) |
| Git | Latest | Version control |
| C compiler | Any | Launcher stub compilation (auto-detected) |

**C Compiler Options** (auto-detected, in order of preference):
1. **MSVC** (`cl.exe`) — Visual Studio Build Tools
2. **GCC** (`gcc.exe`) — MinGW-w64
3. **C# csc.exe** — Always available on Windows (.NET Framework)

**Note:** At least one compiler must be available. C# compiler (`csc.exe`) is pre-installed on Windows and used as fallback.

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Install Build Tools

**Inno Setup:**  
Download: [jrsoftware.org/isinfo.php](https://jrsoftware.org/isinfo.php)  
Default path: `C:\Program Files (x86)\Inno Setup 6\ISCC.exe`

**Visual Studio Build Tools (optional, recommended):**  
Download: [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)  
Select: "Desktop development with C++"

**MinGW-w64 (optional alternative):**  
Download: [mingw-w64.org](https://www.mingw-w64.org/)

---

## Standard Build Commands

### TIER_1/TIER_2 Build (No Plant Intelligence)

```batch
cd packaging
build_release.bat
```

**Output:**
```
build/
├── launcher.dist/              # Embedded Python deployment
└── launcher.exe                # Cached launcher stub

dist/
└── TvastrRAS_Installer.exe    # Final installer (~500MB with models)
```

### Resume from Specific Step

Useful if build interrupted or only specific steps need re-running:

```batch
# Resume from Step 4 (launcher compilation)
packaging\build_release.bat 4

# Resume from Step 5 (project file copy)
packaging\build_release.bat 5
```

### TIER_3 Build (with Plant Intelligence)

```batch
# Step 1: Build and integrate PI module
scripts\build_with_pi.bat

# Step 2: Run standard build
packaging\build_release.bat
```

**PI Build Process:**
1. `npm install && npm run build` from `../plant-intelligence/pi_dashboard/`
2. Copies build output to `web/pi/`
3. Standard build auto-detects and includes `web/pi/` if present

---

## Release Packaging

### Create Versioned Zip Packages

**Python script:**
```bash
python packaging/release_builder.py --version 1.4
```

**Options:**
```bash
# Full deployment (code + models + PI)
python packaging/release_builder.py --version 1.4

# Code-only (no models)
python packaging/release_builder.py --version 1.4 --no-models

# TIER_1/TIER_2 (no PI)
python packaging/release_builder.py --version 1.4 --no-pi

# TIER_1 (no PI, no models)
python packaging/release_builder.py --version 1.4 --no-pi --no-models

# Custom output directory
python packaging/release_builder.py --version 1.4 --output /path/to/releases/
```

**Batch wrapper:**
```batch
scripts\package_release.bat --version 1.4 --tier TIER_3
```

**Tier mappings:**
- `TIER_1` — No PI, no models
- `TIER_2` — No PI, models included
- `TIER_3` — Full package (PI + models)

### Output Files

```
releases/
├── castai-1.4-full.zip
├── castai-1.4-code.zip
└── castai-1.4.sha256
```

**Checksum format:**
```
sha256:a1b2c3d4e5f6...  castai-1.4-full.zip
```

---

## Build Performance

### Build Times

| Task | Time (est.) | Cacheable |
|------|-------------|-----------|
| **Full Build (first time)** | 5-8 min | Python runtime cached |
| **Subsequent Builds** | 3-5 min | Uses cached runtime + stub |
| **Resume from Step 4** | < 1 min | Uses cached packages |

Compare to previous Nuitka builds: **1.5-2+ hours**

---

# Production Installation

## Installation Process

### Run Installer

```
TvastrRAS_Installer.exe
```

**Installation wizard:**
1. Accept license agreement
2. Choose install path (default: `C:\Program Files\TvastrRAS\`)
3. Select components (if customizable)
4. Create shortcuts (Desktop, Start Menu)
5. Install

**Install time:** ~2-5 minutes (depends on disk speed)

**Disk space:** ~500MB (with models), ~150MB (without models)

---

# Post-Installation Setup

## 1. License Configuration

Place `license.json` at:
```
C:\Program Files\TvastrRAS\license\license.json
```

**Format:**
```json
{
  "customer": "CastCo",
  "machine_id": "AB91F42C77E2A1D3",
  "tier": "TIER_2",
  "expiry": "2027-12-31",
  "features": ["pi_analytics", "process_intelligence"]
}
```

**machine_id generation:**
- Hardware-locked (CPU + MAC address hash)
- Obtain from vendor
- Use license generation tool: `python services/tools/generate_license.py`

**Tier capabilities:**
- **TIER_1:** Basic inspection (no models, no PI)
- **TIER_2:** Full inspection (models included, no PI)
- **TIER_3:** Full system (models + Plant Intelligence)

See [licensing.md](licensing.md) for detailed tier matrix.

---

## 2. Database Configuration

Edit `C:\Program Files\TvastrRAS\configs\system.yaml`:

**MS SQL Server (Recommended):**
```yaml
database:
  type: mssql
  connection_string: "mssql+pyodbc://USER:PASSWORD@SERVER/DATABASE?driver=ODBC+Driver+17+for+SQL+Server"
```

**Windows Authentication:**
```yaml
database:
  type: mssql
  connection_string: "mssql+pyodbc://@SERVER/DATABASE?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"
```

**SQLite (Development/Testing):**
```yaml
database:
  type: sqlite
  connection_string: "sqlite:///runtime/castai.db"
```

**Prerequisites:**
1. Install ODBC Driver 17 for SQL Server
   - Download: https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server
2. Verify network access to SQL Server (port 1433)
3. Create database and grant permissions

**Test connection:**
```bash
sqlcmd -S SERVER_IP -U USERNAME -P PASSWORD -Q "SELECT 1"
```

See [config_guide.md](../04_configuration/config_guide.md) for detailed database setup.

---

## 3. Model Files

Place model files at:
```
C:\Program Files\TvastrRAS\customers\castco\models\
├── casting_model.pt          # YOLO detector (6 defect classes)
├── patch_classifier.pt       # Patch-level anomaly classifier
└── model_metadata.json       # Version info, checksums
```

**Obtain models from:**
- Vendor (included in TIER_2/TIER_3 installers)
- Separate model package
- Model training pipeline

**Important:** Models are **not** included in TIER_1 licenses.

---

## 4. System Configuration

Review and adjust `configs/system.yaml`:

```yaml
# Application settings
app:
  name: "TvastrRAS"
  port: 8501
  log_level: "INFO"

# Hardware settings
hardware:
  device: "cuda"              # "cuda" or "cpu"
  gpu_id: 0

# Batch processing
batch:
  source: "sql"               # "sql" or "folder"
  sql_poll_interval: 5
  sql_batch_size: 20

# Update checking
update:
  check_on_startup: true
  update_api: "https://tvastr-update-server.onrender.com/api/check-update"
  product: "rejection-analysis-system"
```

See [config_guide.md](../04_configuration/config_guide.md) for all options.

---

## 5. Parameter Tuning (Optional)

Review default parameters in:
```
C:\Program Files\TvastrRAS\customers\castco\configs\parameters.yaml
```

**Key parameters to review:**
```yaml
thresholds:
  surface_detection: 0.20      # Minimum YOLO confidence
  human_review: 0.40           # Review threshold

scoring:
  T_high: 0.65                 # Reject threshold
  T_low: 0.35                  # Manual review threshold
  K: 5                         # Top-K patches for scoring

reasoning:
  enable_vlm: true             # Enable LLM reasoning

llm:
  mistral:
    api_key_env: "MISTRAL_API_KEY"  # Use env var for API key
```

See [parameters.md](../04_configuration/parameters.md) for comprehensive parameter reference.

---

# First Launch

## Start Application

**Desktop shortcut:** Double-click `TvastrRAS` icon

**Or Start Menu:** TvastrRAS → TvastrRAS

**Or Command line:**
```bash
cd "C:\Program Files\TvastrRAS"
launcher.exe
```

**Expected behavior:**
1. Launcher finds embedded Python runtime
2. Validates license (if present)
3. Connects to database (if configured)
4. Loads models (~5-10 seconds)
5. Starts Streamlit UI
6. Opens browser at `http://localhost:8501`

**Startup time:** ~10-15 seconds (GPU), ~20-30 seconds (CPU)

---

# Verify Installation

## 1. Check License Status

**In UI:** Navigate to Settings tab → License section

**Expected display:**
- Customer name
- Tier level
- Expiry date
- Active features

**Without license:**
- System runs in dev mode
- Limited functionality
- Watermarks on reports

---

## 2. Test Model Loading

**In UI:** Tab 1 (Upload Casting Image)
- Upload test image
- Verify model loads without errors
- Check detection results

**Expected:**
- YOLO model loads successfully
- Patch classifier loads successfully
- No CUDA errors (if GPU configured)

---

## 3. Test Database Connection

**Check logs:**
```
C:\Program Files\TvastrRAS\runtime\logs\*.log
```

**Expected entries:**
```
[INFO] Database connection established
[INFO] ERP tables accessible: Production_Daywise
[INFO] AI tables created/verified
```

**If database unavailable:**
```
[WARNING] Database connection failed, using CSV fallback
```

---

## 4. Run Test Inspection

**Upload sample image:**
1. Navigate to Tab 1
2. Upload casting image (JPG/PNG)
3. Click "Run Inspection"

**Expected results:**
- Processing completes in 1-3 seconds (GPU) or 5-10 seconds (CPU)
- Detection boxes displayed
- Heatmap overlay shown
- Decision rendered (ACCEPT/REJECT/MANUAL_REVIEW)
- Report generated

---

# Troubleshooting

## Build Issues

### No C compiler found

**Error:**
```
[ERROR] No compiler found. Tried:
        - MSVC (cl.exe) - not found
        - GCC (gcc.exe) - not found
        - C# (csc.exe) - not found
```

**Fix:**
1. **Check for C# compiler:**
   ```batch
   dir C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe
   ```

2. **Install Visual Studio Build Tools** (recommended)

3. **Or install MinGW-w64**

---

### Package copying warnings

**Warning:**
```
[WARNING] dask not found in site-packages
[WARNING] pytest not found in site-packages
```

**Cause:** Optional/extra dependencies not installed.

**Fix:** These warnings are **normal and safe**. The smart copier filters out optional extras. If you see 50-100 warnings but 150+ packages copied successfully, the build is fine.

---

## Installation Issues

### License validation fails

**Error:** `[LICENSE ERROR] License file is invalid or corrupted.`

**Solutions:**
1. Verify `license/license.json` exists
2. Validate JSON format (use JSON validator)
3. Check expiry date: `"expiry": "2027-12-31"`
4. Verify machine_id matches hardware
5. For testing: delete license file → system runs in dev mode

---

### Model files not found

**Error:** `FileNotFoundError: customers/castco/models/casting_model.pt`

**Solutions:**
1. Verify files exist: `dir "C:\Program Files\TvastrRAS\customers\castco\models"`
2. Check TIER license (TIER_1 doesn't include models)
3. Obtain models from vendor
4. Check file permissions (read access required)

---

### Database connection fails

**Error:** `[DATABASE] Connection failed: [ODBC Driver 17 for SQL Server]`

**Solutions:**
1. Install ODBC Driver 17
2. Test connection: `sqlcmd -S SERVER -U USER -P PASSWORD`
3. Verify SQL Server accessibility:
   - Ping server: `ping SERVER_IP`
   - Check port 1433 is open
   - Enable remote connections in SQL Server
4. System falls back to CSV files in `runtime/process_logs/` if DB unavailable

---

### GPU not detected

**Warning:** `[WARNING] CUDA not available, using CPU`

**Solutions:**
1. Verify NVIDIA drivers installed
2. Check CUDA toolkit installed
3. Test CUDA availability:
   ```python
   import torch
   print(torch.cuda.is_available())  # Should be True
   print(torch.cuda.get_device_name(0))
   ```
4. Update `system.yaml`:
   ```yaml
   hardware:
     device: "cuda"  # Force CUDA
   ```

---

### Port already in use

**Error:** `OSError: [Errno 98] Address already in use`

**Cause:** Port 8501 already occupied

**Solutions:**
1. **Change port in config:**
   ```yaml
   app:
     port: 8502  # Use different port
   ```

2. **Kill existing process:**
   ```bash
   # Windows
   netstat -ano | findstr :8501
   taskkill /PID <PID> /F
   ```

3. **Auto-assign port:**
   ```yaml
   app:
     port: 0  # System assigns available port
   ```

---

## Network Configuration

### Firewall Rules

**Inbound:**
- Port 8501 (Streamlit UI) — Allow from local network
- Port 8000 (REST API, if enabled) — Allow from local network
- Port 3000 (PI Dashboard, TIER_3) — Allow from local network

**Outbound:**
- SQL Server (port 1433) — Allow to ERP database
- Mistral API (HTTPS) — Allow for LLM reasoning
- Update server (HTTPS) — Allow for software updates

### Windows Firewall Configuration

**Add rules manually:**
```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "TvastrRAS UI" -Direction Inbound -LocalPort 8501 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "TvastrRAS API" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

**Or allow program:**
```powershell
New-NetFirewallRule -DisplayName "TvastrRAS" -Direction Inbound -Program "C:\Program Files\TvastrRAS\launcher.exe" -Action Allow
```

---

## Environment Variables

**Optional configuration via environment variables:**

### Database Connection
```bash
set DATABASE_CONNECTION_STRING="mssql+pyodbc://..."
```

### LLM API Key
```bash
set MISTRAL_API_KEY="your_api_key_here"
```

### License Path (Custom)
```bash
set LICENSE_PATH="D:\TvastrRAS\custom_license.json"
```

**Priority:** Environment variables override config files.

---

## Build Commands Reference

```batch
# Standard release build (TIER_1/TIER_2)
packaging\build_release.bat

# Resume from specific step
packaging\build_release.bat 4

# TIER_3 build (with PI)
scripts\build_with_pi.bat
packaging\build_release.bat

# Package full release
python packaging\release_builder.py --version 1.4

# Package code-only update
python packaging\release_builder.py --version 1.4 --no-models

# Package TIER_1 release
python packaging\release_builder.py --version 1.4 --no-pi --no-models

# Batch wrapper
scripts\package_release.bat --version 1.4 --tier TIER_3
```

---

## Directory Structure

```
C:\Program Files\TvastrRAS\
├── python.exe                   # Embedded Python runtime
├── pythonw.exe
├── python311.dll
├── launcher.exe                 # Application launcher
├── core/                        # Core modules (.py source)
├── services/                    # Services (.py source)
├── customers/                   # Customer configs
│   └── castco/
│       ├── configs/
│       │   ├── parameters.yaml
│       │   └── aco_metrics.json
│       └── models/
│           ├── casting_model.pt
│           └── patch_classifier.pt
├── configs/
│   └── system.yaml              # System configuration
├── assets/                      # Static assets
├── license/
│   └── license.json             # License file (manual placement)
├── runtime/                     # Runtime data
│   ├── batch_input/             # Batch processing queue
│   ├── outputs/                 # Inspection results
│   ├── logs/                    # Application logs
│   ├── process_logs/            # CSV fallback storage
│   └── fingerprint_index/       # Fingerprint database
├── web/pi/                      # Plant Intelligence (TIER_3 only)
└── VERSION.txt                  # Version info
```

---

## Related Documentation

- **Configuration**: [config_guide.md](../04_configuration/config_guide.md), [parameters.md](../04_configuration/parameters.md)
- **Runtime**: [runtime.md](runtime.md) — Runtime directories, batch modes, logs
- **Updates**: [software_updates.md](software_updates.md) — OTA update system
- **Security**: [system_hardening.md](system_hardening.md) — Production hardening
- **Licensing**: [licensing.md](licensing.md) — License tiers and features

---

**Version:** 1.0  
**Last Updated:** 2026-04-07
