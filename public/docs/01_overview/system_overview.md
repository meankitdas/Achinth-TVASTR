# System Overview

> **Purpose:** High-level introduction to TvastrRAS casting inspection system  
> **Audience:** New users, stakeholders, decision-makers

---

## What It Does

TvastrRAS is an AI-powered casting defect detection and root cause analysis system for foundry quality control. It inspects radiographic images of castings, detects defects, classifies defect types, diagnoses root causes, and generates actionable reports.

**Core Capabilities:**
- Multi-modal defect detection (YOLO + signal-based + LLM reasoning)
- 6 defect classes: porosity, shrinkage, crack, sand inclusion, surface roughness, blow hole
- Root cause diagnosis with responsible manufacturing section
- ERP integration for heat traceability and context
- PDF/JSON reports with annotated images
- Batch processing (SQL queue, folder watch, upload)

**Decision Outputs:**
- **REJECT** — Defect severity exceeds threshold
- **MANUAL_REVIEW** — Borderline case, needs human inspector
- **ACCEPT** — No significant defects

---

## Key Technologies

| Layer | Technology |
|-------|-----------|
| **Detection** | YOLOv8 (object detection), Patch Classifier (256×256 patches) |
| **Feature Analysis** | LBP, GLCM, edge density, blob detection, geometry analysis |
| **Reasoning** | Mistral LLM (multimodal), signal-driven classification, cavity analysis |
| **Fusion** | Weighted multi-signal fusion (YOLO + Signal + LLM + Agreement) |
| **Intelligence** | Fingerprinting, prototype matching, SCRATA recovery, auto-calibration |
| **UI** | Streamlit (RAS dashboard), Next.js (PI dashboard - TIER_3) |
| **API** | FastAPI, WebSocket |
| **Database** | SQL Server, SQLite |
| **Deployment** | PyWebView (native desktop), Nuitka (compilation), Inno Setup (installer) |

---

## Pipeline Architecture

```
Image → Quality Gate → YOLO Detection → Patch Classification → Signal Extraction
  → Signal Scoring → Multi-Signal Fusion → Reasoning (LLM/Geometry/Rule)
  → Consolidation → Diagnosis → Visualization → Report → Traceability → Process Intelligence
```

> See [Full Pipeline](../02_pipeline/full_pipeline.md) for detailed stage-by-stage flow.

---

## License Tiers

| Tier | Capabilities |
|------|--------------|
| **TIER_1** | Defect detection, single-image inspection, PDF reports |
| **TIER_2** | + Batch processing, SQL integration, Process Intelligence (defect graph, heat analysis) |
| **TIER_3** | + Plant Intelligence (dashboard, SPC, FMEA, decision engine, natural language queries) |

> See [Licensing](../05_deployment/licensing.md) for activation and tier details.

---

## Signal-First Design Philosophy

TvastrRAS uses a **signal-driven architecture** where multiple independent signals vote on classification:

1. **YOLO Signal (20%)** — Object detection model (proposes regions)
2. **Signal Score (40%)** — PRIMARY CLASSIFIER — Feature-based analysis (LBP, GLCM, edge, blob, geometry)
3. **LLM Signal (20%)** — Contextual reasoning with image + features + knowledge base
4. **Agreement Signal (20%)** — Inter-signal consensus bonus/penalty

**Why Signal-First?**
- YOLO alone has ~15% error rate on subtle defects
- Signal features (texture, edge, geometry) are physics-grounded and explainable
- Multi-signal fusion with agreement logic achieves 92%+ accuracy
- Automatic weight calibration learns optimal fusion from production data

> See [Fusion Logic](../02_pipeline/fusion_logic.md) for weight optimization details.

---

## Anomaly-Driven Patch System

Traditional patch classification: YOLO model scores every 256×256 patch, uses raw probability.

**New anomaly-driven system:**
- Extracts 15-dimensional feature vector per patch (texture, edge, blob, intensity, geometry)
- Computes **feature anomaly** (70% weight): global z-score + local spatial deviation
- Demotes YOLO to **weak hint** (30% weight): entropy-based uncertainty signal
- Adaptive threshold: `mu + k*sigma` capped at P90 percentile
- Filters high-anomaly patches for downstream signal scoring

**Impact:** Reduces false positives on textured surfaces, catches subtle defects YOLO misses.

> See [Patch System](../02_pipeline/patch_system.md) and [Anomaly System](../02_pipeline/anomaly_system.md) for implementation.

---

## Auto-Calibration Loop

System continuously learns from production data to optimize fusion weights and confidence calibration:

1. **Signal Trace Logging** — Every inspection logs full decision state (YOLO, signal, LLM, fusion scores)
2. **Weight Calibration** — Grid search every 100 traces to find optimal fusion weights
3. **Confidence Calibration** — Isotonic regression to map raw confidence → calibrated probability
4. **ACO/MOS Optimization** — Adaptive parameter tuning (patch radius, entropy penalty, thresholds)
5. **Per-Part Calibration** — Part-specific weight overrides for different geometries

**Safety Gates:** Cooldown (1 hour), min samples (50 total, 20 labeled), max weight delta (±0.15), dry-run mode.

> See [Auto-Calibration](../03_intelligence/auto_calibration.md) for full details.

---

## Traceability & Context

Every inspection is linked to manufacturing context:

- **Casting ID** — Unique part serial number
- **Heat Number** — Metal batch traceability
- **Gate ID** — Production gate/station identifier (passive context)
- **Mold ID** — Mold traceability
- **ERP Context** — Shift, operator, furnace, production date

**Fingerprinting:** Every defect is fingerprinted (alignment + vectorization) and indexed for recurring pattern detection across heats/molds/shifts.

> See [Traceability](../03_intelligence/traceability.md) and [Fingerprinting](../03_intelligence/fingerprinting.md).

---

## Process Intelligence (TIER_2+)

Background analytics that learn from inspection history:

- **Defect Graph** — NetworkX graph of defect co-occurrence patterns
- **Temporal Model** — Time-series analysis of defect trends
- **Heat Intelligence** — Cross-heat pattern analysis for metal quality issues
- **Prototype Bank** — Learns canonical defect exemplars from confirmed defects
- **SCRATA System** — Similarity matching against known defect patterns

**Trigger:** Auto-runs every 50 inspections in background.

> See [Plant Intelligence](../03_intelligence/plant_intelligence.md) for TIER_3 advanced analytics.

---

## Key Differentiators

| Feature | Traditional CV | TvastrRAS |
|---------|---------------|-----------|
| Classification | Single model | Multi-signal fusion (YOLO + Signal + LLM + Agreement) |
| Patch Analysis | Raw probability | Anomaly-driven (feature + spatial + entropy) |
| Root Cause | None | 4-gate reasoning (fast-path → geometry → signal → LLM) |
| Weights | Fixed | Auto-calibrated from production data |
| Confidence | Uncalibrated | Isotonic regression calibration |
| Traceability | None | Full heat/mold/ERP context + fingerprinting |
| Learning | Static | Prototype bank + SCRATA + defect graph |
| Intelligence | None | Process Intelligence (TIER_2), Plant Intelligence (TIER_3) |

---

## Documentation Map

```
01_overview/          ← You are here
  system_overview.md  ← This file (high-level intro)
  architecture.md     ← Directory structure, module dependencies
  technical_reference.md  ← Algorithm catalog (formulas, parameters)

02_pipeline/          ← How images become decisions
  full_pipeline.md    ← Stages 0-8 flow
  patch_system.md     ← 256px sliding window, patch generation
  anomaly_system.md   ← Feature anomaly detection
  signal_system.md    ← LBP, GLCM, edge, blob, geometry
  fusion_logic.md     ← Multi-signal fusion, agreement, weights

03_intelligence/      ← Learning & reasoning systems
  reasoning_pipeline.md   ← 4-gate reasoning (porosity → cavity → signal → LLM)
  auto_calibration.md     ← Weight optimization, ACO/MOS
  fingerprinting.md       ← Pattern matching, alignment
  traceability.md         ← Heat numbers, ERP context
  prototype_system.md     ← Prototype bank, SCRATA
  plant_intelligence.md   ← PI module (TIER_3)

04_configuration/     ← Setup & tuning
  parameters.md       ← All tunable parameters
  config_guide.md     ← system.yaml, parameters.yaml

05_deployment/        ← Build, install, license
  setup.md            ← Quick start, build, deployment
  runtime.md          ← Logs, outputs, batch modes
  licensing.md        ← Tier activation
  software_updates.md ← OTA updates

06_reference/         ← API, schemas, compliance
  api_contracts.md    ← REST endpoints
  data_structures.md  ← PipelineResult, CastingState, schemas
  dashboard_guide.md  ← RAS UI guide
  iso_compliance.md   ← Audit trail, traceability
```

---

## Quick Navigation

**I want to...**
- Understand the system → Read this file
- Deploy the system → [Setup](../05_deployment/setup.md)
- Tune parameters → [Parameters](../04_configuration/parameters.md)
- Understand decisions → [Full Pipeline](../02_pipeline/full_pipeline.md)
- Integrate via API → [API Contracts](../06_reference/api_contracts.md)
- Learn about algorithms → [Technical Reference](technical_reference.md)
- Enable auto-calibration → [Auto-Calibration](../03_intelligence/auto_calibration.md)
- Access TIER_3 analytics → [Plant Intelligence](../03_intelligence/plant_intelligence.md)

---

**Version:** 1.0  
**Last Updated:** 2026-04-07
