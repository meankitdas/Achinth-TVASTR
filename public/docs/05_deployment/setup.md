# Setup Guide

> **Purpose:** Quick start guide for installing and running TvastrRAS  
> **Where Used:** DevOps, IT, Production Teams  
> **Related:** [Architecture](../01_overview/architecture.md), [Build Process](../01_overview/architecture.md#build-process-overview), [System Configuration](../04_configuration/config_guide.md)  
> **Version:** 2.0  
> **Last Updated:** 2026-05-16

---

## Prerequisites

- **Operating System**: Windows 11 (64-bit)
- **Hardware**: 
  - 16 GB RAM minimum
  - SSD storage (recommended)
  - CPU with 8+ cores (Intel i7 or AMD Ryzen 7 or better)
- **GPU** (optional, recommended for LLM use):
  - NVIDIA GPU with 8GB+ VRAM (e.g., RTX 3060)
  - CUDA 12.1+
- **Internet Access**: Required for license activation

> **Note**: Internet access is only required for initial license activation. All inspections run **offline** with no cloud dependencies.

---

## Installation

### Step 1: Download the Installer

1. Go to: https://updates.tvastr.ai/  
2. Download `TvastrRAS_Setup_v2.0.exe`

> **Note**: This is the only approved build method. **Nuitka-based builds are obsolete and no longer supported.**

### Step 2: Run the Installer

1. Double-click `TvastrRAS_Setup_v2.0.exe`
2. Follow prompts (Administrator rights required)
3. Choose install location:
   - Recommended: `C:\Program Files\TvastrRAS`
4. Click Install

> Installation includes:  
> - Embedded Python Build System v2.0  
> - Runtime directory structure  
> - Default license and configuration files

### Step 3: License Activation

1. Launch TvastrRAS from Start Menu
2. System opens with **License Prompt**
3. Paste license key from email (or upload `license/license.key`)
4. Click Activate

> **Note**: If network unavailable, use offline activation:  
> 1. Copy `license/license.key` to `C:\Program Files\TvastrRAS\license\`  
> 2. Restart application

---

## Configuration

### Primary Config File

**`customers/castco/configs/parameters.yaml`**

This is the **only** file customers modify for tuning.

> **Rule**: All customer-specific settings go here.  
> **Never edit** `configs/system.yaml` — it is overwritten on update.

Example:
```yaml
# Update fusion weights after calibration
multi_signal_fusion:
  signal_weight: 0.45
  llm_weight: 0.35
  agreement_weight: 0.20

# Adjust thresholds for your plant
decision:
  t_low: 0.30
  t_high: 0.70
```

### Hot Reload

Changes to `parameters.yaml` take effect on the **next inspection** — **no restart required**.

### System Config

**`configs/system.yaml`**

Only used by internal builds. No user modifications.

---

## Running the System

### Mode 1: Desktop (Production)

- Launch `TvastrRAS.exe` from Start Menu
- Runs full UI with inspection interface (5 tabs: overview, detection, analysis, history, settings)
- Auto-starts batch worker for unattended processing
- Logs to `runtime/logs/ras.log`

> **Default startup**: Loads most recent inspection

### Mode 2: API Server

Start REST API from command line:

```bash
cd "C:\Program Files\TvastrRAS"
.\services\api\api.py
```

- Listen on: `http://localhost:8000`
- Endpoints:
  - `GET /health` — System status
  - `POST /inspect` — Upload image and request inspection
- Requires TIER_2+ license for batch processing

### Mode 3: Batch Processing

Run batch inspections from command line:

```bash
cd "C:\Program Files\TvastrRAS"
.\scripts\batch_process.bat "C:\data\batch_20260516"
```

- Reads `.jpg/.png` files from directory
- Saves results to `runtime/outputs/batch_results.csv`
- Outputs telemetry to `runtime/logs/batch_20260516.jsonl`

### Mode 4: Development

Run in dev mode with hot-reload:

```bash
cd "C:\Program Files\TvastrRAS"
.\run_app.py
```

- Starts Streamlit UI in browser
- Source code editable
- Automatically reloads on file change
- Use for testing and debugging

---

## Upgrade / Update Process

### Automated Update (Recommended)

1. System checks for updates on startup
2. If update available, downloads `TvastrRAS_Update_v2.1.exe`
3. Prompts: “Update available. Apply now?”
4. Click Yes → restarts automatically with new version

> Updates preserve:  
> - `customers/castco/configs/parameters.yaml`  
> - All runtime data (`runtime/`)  
> - License key  
> - History and logs

### Manual Update

1. Download `TvastrRAS_Update_v2.x.exe` from https://updates.tvastr.ai/
2. Run installer (as Administrator)
3. Follow prompts — do not change install path
4. Restart application

> **IMPORTANT**: Do not uninstall old version — installer handles migration.

---

## Troubleshooting

### Error: “License invalid or expired”

- Ensure license file is in `C:\Program Files\TvastrRAS\license\`
- Check `license/license.key` for correct customer and tier
- Contact support if license expired

### Error: “System unable to connect to API server”

- Check internet connection
- Ensure `system.api_endpoint` in `system.yaml` is accessible
- Disable firewall/antivirus temporarily to test

### Error: “Inspection hangs or freezes”

- Check CPU usage (LLM inference may use high resources)
- Reduce `max_parallel_inspections` in `system.yaml` (default 4)
- Disable LLM: `reasoning.enable_vlm: false` in `parameters.yaml`

### Error: “Missing DLL: VCRUNTIME140_1.dll”

Install Microsoft Visual C++ Redistributable:  
https://aka.ms/vs/17/release/vc_redist.x64.exe

---

## Performance Optimization

| Optimization | Description |
|--------------|-------------|
| **Use SSD** | Drastically improves patch loading and file I/O |
| **Use GPU** | Accelerates LLM inference and image processing (CUDA) |
| **Reduce Image Resolution** | Set `patch_analysis.resize_target: 640` for faster inspection on low-end systems |
| **Disable LLM** | Set `reasoning.enable_vlm: false` if LLM not needed — reduces latency from 500ms to 100ms |
| **Limit Batch Size** | Process 5–10 inspections per batch, not 100+ |

---

## Security Best Practices

- **Keep software updated** — security patches issued quarterly
- **Disable unnecessary features** — turn off LLM if not in use
- **Isolate runtime** — block external access to `runtime/` and `logs/`
- **Use service account** — run TvastrRAS under limited user account, NOT admin

> For air-gapped environments:  
> - Download updates on air-gapped machine from USB  
> - Copy license manually  
> - Set `system.api_endpoint: ""` to disable remote APIs

---

## Cross-References

- **Configuration**: [Configuration Guide](../04_configuration/config_guide.md)
- **Architecture**: [System Architecture](../01_overview/architecture.md)
- **Build Process**: [Build Process Overview](../01_overview/architecture.md#build-process-overview)
- **System Health**: `runtime/logs/ras.log`

---

**Version:** 2.0  
**Last Updated:** 2026-05-16