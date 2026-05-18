# System Architecture

> **Purpose:** Directory structure, module organization, and dependency map  
> **Where Used:** System-wide understanding  
> **Related:** [System Overview](system_overview.md), [Technical Reference](technical_reference.md)

---

## Directory Structure

```
Rejection_model_castco/
│
├── launcher/                    # Entry point & startup orchestration
│   ├── launcher.py              # License check → updates → app launch
│   └── updater_ui.py            # Update prompts & UI
│
├── core/                        # Core AI engine (customer-agnostic)
│   ├── ui/                      # Streamlit web UI (5 tabs)
│   ├── pipeline/                # Defect detection pipeline orchestration
│   ├── reasoning/               # Signal scoring, multi-signal fusion, root cause
│   ├── vision/                  # YOLO + patch classifier + signal features
│   │   ├── casting/             # Casting-specific inference & scoring
│   │   ├── features/            # Feature extraction (LBP, GLCM, edge, blob)
│   │   └── prototypes/          # Prototype bank & SCRATA similarity
│   ├── fingerprints/            # Pattern matching & clustering
│   ├── learning/                # Process intelligence (drift, graphs, heat analysis)
│   ├── plant_intelligence/      # PI module (TIER_3)
│   ├── traceability/            # ERP integration, heat numbers, gate_id, context loading
│   ├── security/                # Licensing system (tier validation)
│   ├── update/                  # Software update client
│   ├── persistence/             # Database (SQL + SQLite)
│   ├── reports/                 # PDF generation
│   ├── analytics/               # Auto-calibration, weight optimization, signal evaluation
│   ├── optimization/            # ACO/MOS adaptive parameter tuning
│   ├── config/                  # Configuration management
│   ├── diagnosis/               # Diagnostic rules, responsibility assignment
│   ├── support/                 # Support utilities
│   ├── batch/                   # Batch processing
│   ├── logging_system/          # Logging infrastructure
│   └── outputs/                 # Output generation (JSON, visualization)
│
├── services/                    # External interfaces
│   ├── api/                     # FastAPI REST endpoints
│   ├── ws/                      # WebSocket (real-time updates)
│   ├── analytics/               # Analytics service
│   └── tools/                   # Service tools
│
├── customers/                   # Customer-specific assets
│   └── castco/
│       ├── models/              # .pt model files (casting_model.pt, patch_classifier.pt)
│       ├── configs/             # parameters.yaml (tunable params)
│       ├── knowledge_base/      # Defect KB YAML (causes, actions)
│       └── reference_parts/     # Visual references
│
├── configs/                     # System configuration
│   ├── system.yaml              # Database, batch source, update API, active customer
│   ├── aco_metrics.json         # MOS optimization state
│   ├── defectograph_grid.yaml   # Analytics layout
│   └── export_schema.yaml       # ERP export format
│
├── web/                         # Frontend static files
│   └── pi/                      # Plant Intelligence UI (Next.js build - TIER_3)
│
├── assets/                      # Branding & fonts
│   ├── branding/                # Icons, logos, installer images
│   └── fonts/                   # DejaVu, NotoSans (PDF rendering)
│
├── packaging/                   # Build & deployment scripts
│   ├── build_release.bat        # Embedded Python Build System v2.0
│   ├── installer.iss            # Installer configuration
│   ├── release_builder.py       # Zip packager
│   └── update_manifest.json     # Update metadata
│
├── scripts/                     # Build automation & utilities
│   ├── build_with_pi.bat        # PI module integration
│   ├── package_release.bat      # Release wrapper
│   └── calibrate_signals.py     # Manual calibration CLI
│
├── runtime/                     # Runtime directories (auto-created at launch)
│   ├── logs/                    # Run telemetry, feedback logs
│   ├── outputs/                 # Inspection results (PDF, JSON, images)
│   ├── batch_input/             # Batch processing folders
│   ├── fingerprint_index/       # Pattern index
│   ├── process_logs/            # ERP context (CSV fallback)
│   ├── calibration/             # Calibration data (weights, confidence maps)
│   └── updates/                 # Downloaded updates
│
├── license/                     # License file
│   └── license.json
│
├── docs/                        # Documentation (restructured)
│   ├── 01_overview/             # System introduction & architecture
│   ├── 02_pipeline/             # Pipeline flow & detection systems
│   ├── 03_intelligence/         # Learning & reasoning systems
│   ├── 04_configuration/        # Setup & tuning
│   ├── 05_deployment/           # Build, install, runtime
│   └── 06_reference/            # API, schemas, compliance
│
└── dev/                         # Development only (not deployed)
    ├── training/                # Model training scripts
    ├── testing/                 # Test scripts
    ├── tools/                   # Standalone utilities
    └── data/                    # Test data
```

---

## Entry Points

| Entry Point | Mode | Use Case |
|------------|------|----------|
| `launcher/launcher.py` | Development | License check → updates → Streamlit UI |
| `launcher.exe` | Production | Compiled launcher (native desktop via PyWebView) |
| `services/api/api.py` | API Server | REST API for external integrations |
| `run_app.py` | Legacy | Direct Streamlit start (bypasses license/updates) |

---

## Module Dependencies

```
launcher/
  ├─→ core/security          (license validation, tier check)
  ├─→ core/update            (update check, download, install)
  └─→ core/ui                (Streamlit app launch)

core/ui/
  ├─→ core/pipeline          (run_pipeline, CastingState)
  ├─→ core/reasoning         (signal_scoring, fusion, LLM reasoning)
  ├─→ core/reports           (PDF generation)
  ├─→ core/persistence       (SQL read/write)
  └─→ core/plant_intelligence (PI analytics - TIER_3)

core/pipeline/
  ├─→ core/vision            (YOLO inference, patch classification)
  ├─→ core/reasoning         (signal scoring, multi-signal fusion)
  ├─→ core/fingerprints      (pattern extraction, indexing)
  ├─→ core/traceability      (heat resolution, context loading)
  └─→ core/diagnosis         (rule-based diagnosis, KB lookup)

core/vision/
  ├─→ core/vision/casting    (patch inference, scoring, heatmap)
  ├─→ core/vision/features   (LBP, GLCM, edge, blob extraction)
  └─→ core/vision/prototypes (similarity engine, prototype bank)

core/reasoning/
  ├─→ core/llm               (multimodal LLM reasoning)
  ├─→ core/vision/casting    (cavity analysis, geometry classification)
  └─→ core/diagnosis         (KB-driven cause diagnosis)

core/analytics/
  ├─→ core/persistence       (signal trace queries)
  └─→ core/config            (config updates, backup)

core/learning/
  ├─→ core/persistence       (SQL queries for defect graph)
  └─→ networkx               (graph construction, analysis)

core/plant_intelligence/
  ├─→ core/persistence       (shared database access)
  └─→ all PI submodules      (FMEA, SPC, risk scoring, decision engine)

services/api/
  ├─→ core/pipeline          (inspection pipeline execution)
  ├─→ core/plant_intelligence (PI routes - TIER_3)
  └─→ core/security          (license middleware)

services/ws/
  ├─→ asyncio                (WebSocket server)
  └─→ core/plant_intelligence (PI updates streaming)
```

---

## Architecture Principles

### 1. Separation of Concerns
- **`core/`** — AI engine, customer-agnostic logic
- **`customers/`** — Customer-specific assets (models, configs, KB)
- **`services/`** — External interfaces (API, WebSocket)
- **`runtime/`** — Generated data (logs, outputs)

### 2. Tier-Based Capability Gating
All TIER_3 features (Plant Intelligence) are gated by license checks:
```python
if license.has_capability("plant_intelligence"):
    # PI routes, analytics, dashboard
```

### 3. Configuration Hot-Reload
- `parameters.yaml` changes take effect immediately (no restart)
- `system.yaml` requires restart (database, batch source)

### 4. Database Abstraction
- Supports SQL Server (production) and SQLite (dev/testing)
- Connection string configured in `configs/system.yaml`
- Falls back to CSV/JSON in `runtime/` if database unavailable

### 5. Safe Fallbacks
- Every advanced feature (anomaly detection, LLM, auto-calibration) has safe fallbacks
- Pipeline never breaks due to feature failure
- Errors logged, system continues with degraded functionality

---

## Configuration Files

| File | Purpose | Hot Reload |
|------|---------|-----------|
| `configs/system.yaml` | Database, batch source, update API, active customer | No (restart required) |
| `customers/{customer}/configs/parameters.yaml` | Pipeline thresholds, fusion weights, LLM config, ERP schema | Yes |
| `configs/aco_metrics.json` | MOS optimization state (auto-managed) | N/A |
| `configs/defectograph_grid.yaml` | Defectograph grid layout | Yes |
| `configs/export_schema.yaml` | ERP export format | Yes |
| `license/license.json` | Hardware-locked license (tier, capabilities, expiry) | No (validated at startup) |

---

## Data Flow

```
Image Upload/Batch
    ↓
[core/pipeline] Orchestration
    ├─→ [core/vision] Detection & Patch Classification
    ├─→ [core/reasoning] Signal Scoring & Fusion
    ├─→ [core/reasoning] Root Cause Analysis
    ├─→ [core/diagnosis] KB Diagnosis
    ├─→ [core/fingerprints] Pattern Extraction
    ├─→ [core/traceability] Context Loading
    ├─→ [core/reports] PDF/JSON Generation
    ├─→ [core/outputs] Visualization
    └─→ [core/persistence] SQL Storage
    ↓
[core/learning] Process Intelligence (background, every 50 runs)
    ├─→ Defect Graph Update
    ├─→ Temporal Model Update
    └─→ Heat Intelligence Update
    ↓
[core/analytics] Auto-Calibration (every 100 traces)
    ├─→ Weight Calibration
    └─→ Confidence Calibration
    ↓
[core/optimization] ACO/MOS (every 20 runs)
    └─→ Parameter Tuning
```

---

## External Integrations

### ERP System
- **Read:** `Production_Daywise` table (heat, mold, shift, operator context)
- **Write:** `AI_Inspections`, `AI_Defects`, `AI_Defect_Clusters` tables
- **Fallback:** CSV files in `runtime/process_logs/`

### Update Server
- **URL:** Configured in `configs/system.yaml`
- **Protocol:** HTTPS, signed manifests
- **Trigger:** Startup check + periodic polling

### LLM API
- **Providers:** Mistral AI (default), OpenAI (configurable)
- **Model:** `mistral-small-2603` (multimodal)
- **Usage:** Root cause reasoning (PATH B in 4-gate reasoning)

---

## Deployment Modes

### Mode 1: Desktop Application (Production)
- Built with Embedded Python Build System v2.0 → `launcher.exe`
- Packaged with Inno Setup → Windows installer
- Runs in native window via PyWebView (no browser)
- Auto-updates enabled
- Edge-native, on-premise, offline-capable industrial runtime

### Mode 2: API Server
- Run `python services/api/api.py`
- RESTful endpoints for external systems
- WebSocket for real-time updates
- Requires TIER_2+ license for batch processing
- Edge-native, on-premise, offline-capable industrial runtime

### Mode 3: Development
- Run `python launcher/launcher.py`
- Streamlit in browser mode
- Hot-reload enabled
- Full logging
- Edge-native, on-premise, offline-capable industrial runtime

---

## Key Modules

| Module | Purpose | Key Files |
|--------|---------|-----------|
| **core/vision/** | Detection & feature extraction | `infer.py`, `casting/inference.py`, `feature_vector.py`, `patch_anomaly.py` |
| **core/reasoning/** | Classification & root cause | `signal_scoring.py`, `multi_signal_fusion.py`, `cavity_analysis.py`, `pipeline.py` |
| **core/pipeline/** | Orchestration | `state.py`, `consolidate.py`, `triggers.py` |
| **core/analytics/** | Auto-calibration | `auto_calibration.py`, `weight_calibrator.py`, `confidence_calibrator.py` |
| **core/traceability/** | ERP integration | `trace_record_builder.py`, `context_loader.py`, `heat_resolver.py` |
| **core/fingerprints/** | Pattern matching | `extractor.py`, `indexer.py`, `similarity.py` |
| **core/plant_intelligence/** | TIER_3 analytics | 50+ modules (FMEA, SPC, risk scoring, decision engine) |

---

## Cross-References

- **Pipeline Flow:** [Full Pipeline](../02_pipeline/full_pipeline.md)
- **Runtime Storage:** [Runtime](../05_deployment/runtime.md)
- **Configuration:** [Config Guide](../04_configuration/config_guide.md)
- **Build Process:** [Setup](../05_deployment/setup.md)
- **API Endpoints:** [API Contracts](../06_reference/api_contracts.md)

---

## Build Process Overview

### Build System Overview
**Embedded Python Build System** (v2.0) — Replacement for Nuitka; reflects current production deployment

**Key advantages:**
- Build Time: 3-5 minutes (vs 1.5+ hours with Nuitka)
- All Code as Source: Python files remain editable (OTA-updateable)
- No Compilation: Only tiny launcher stub is compiled
- Fast Iterations: Cached artifacts speed up subsequent builds
- OTA-Friendly: Individual .py files can be patched without rebuild
- Edge-native, on-premise, offline-capable industrial runtime

### Build Process Flow
```
Source → Download Embedded Python → Smart Package Copy → Compile Launcher Stub → Copy Assets → Inno Setup → Installer.exe
```
> This is the only supported build method. Nuitka is obsolete and removed from all build pipelines.

### Standard Build Commands

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

> This build process creates an edge-native, on-premise, offline-capable industrial runtime. The system functions fully without internet access or cloud dependencies.

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

> All builds produce a self-contained, offline-capable deployment. Nuitka-based builds are deprecated and no longer supported.

---

## Key Modules

| Module | Purpose | Key Files |
|--------|---------|-----------|
| **core/vision/** | Detection & feature extraction | `infer.py`, `casting/inference.py`, `feature_vector.py`, `patch_anomaly.py` |
| **core/reasoning/** | Classification & root cause | `signal_scoring.py`, `multi_signal_fusion.py`, `cavity_analysis.py`, `pipeline.py` |
| **core/pipeline/** | Orchestration | `state.py`, `consolidate.py`, `triggers.py` |
| **core/analytics/** | Auto-calibration | `auto_calibration.py`, `weight_calibrator.py`, `confidence_calibrator.py` |
| **core/traceability/** | ERP integration | `trace_record_builder.py`, `context_loader.py`, `heat_resolver.py` |
| **core/fingerprints/** | Pattern matching | `extractor.py`, `indexer.py`, `similarity.py` |
| **core/plant_intelligence/** | TIER_3 analytics | 50+ modules (FMEA, SPC, risk scoring, decision engine) |

---

## Cross-References

- **Pipeline Flow:** [Full Pipeline](../02_pipeline/full_pipeline.md)
- **Runtime Storage:** [Runtime](../05_deployment/runtime.md)
- **Configuration:** [Config Guide](../04_configuration/config_guide.md)
- **Build Process:** [Setup](../05_deployment/setup.md)
- **API Endpoints:** [API Contracts](../06_reference/api_contracts.md)

---

**Version:** 1.0  
**Last Updated:** 2026-04-07