# System Overview

> **TvastrRAS** — AI-Powered Casting Defect Detection System

---

## What TvastrRAS Is

TvastrRAS (Rejection Analysis System) is an AI-powered casting defect detection system designed for foundries. It uses computer vision, signal processing, and multi-modal reasoning to detect and classify defects in metal casting images.

---

## Signal-First Architecture

TvastrRAS uses a **signal-first design philosophy** where traditional computer vision (YOLO) has been demoted from primary classifier (100%) to a proposal generator (20%), with signal-based scoring promoted to primary classifier (40%).

### Multi-Signal Fusion

Every inspection combines four independent signals:

| Signal | Weight | Role |
|--------|--------|------|
| **Signal** | **40%** | PRIMARY CLASSIFIER - OpenCV-based feature extraction (texture, edge, blob, intensity, geometry) |
| YOLO | 20% | Proposal generator - Bounding box detection |
| LLM | 20% | Validator - Multimodal reasoning (Mistral) |
| Agreement | 20% | Consensus bonus - Inter-signal agreement scoring |

**Formula:**
```
final_confidence = 0.4 × signal + 0.2 × yolo + 0.2 × llm + 0.2 × agreement
```

---

## Defect Classification

### 6 Defect Classes

1. **Porosity** — Small round voids, clustered or dispersed
2. **Shrinkage** — Irregular cavities, dendritic patterns
3. **Crack** — Linear discontinuities, sharp edges
4. **Sand Inclusion** — Foreign material embedded in casting
5. **Surface Roughness** — Texture irregularities
6. **Blow Hole** — Larger spherical voids near surface

### 3-Tier Decision System

- **ACCEPT** — Casting meets quality standards
- **REJECT** — Casting fails quality standards
- **MANUAL_REVIEW** — Human inspection required (ambiguous cases)

---

## License Tiers

### TIER_1 (Basic)
- Single inspection
- Batch processing
- Basic analytics

### TIER_2 (Process Intelligence)
- Everything in TIER_1
- Process Intelligence (Learning tab)
- Heat analysis
- Drift detection
- Auto-calibration

### TIER_3 (Plant Intelligence)
- Everything in TIER_2
- Plant Intelligence module
- 25 REST API endpoints
- Real-time WebSocket updates
- 8 dashboard tabs (FMEA, SPC, Decision Engine, etc.)

---

## Deployment Modes

1. **Standalone** — Single workstation deployment
2. **Server** — Multi-client architecture with central processing
3. **Edge** — Distributed processing at inspection stations

---

## System Components

### Inspection Pipeline
- Patch-based analysis (256×256 sliding window)
- Anomaly detection (70% feature + 30% YOLO hint)
- Signal feature extraction (15-dimensional normalized vectors)
- Multi-signal fusion with adaptive thresholds

### Process Intelligence
- 4-gate reasoning pipeline (fast-path → geometry → signal → LLM)
- Auto-calibration (grid search over ~1260 weight combinations)
- Fingerprinting (12-field normalized spatial vectors)
- Traceability (heat number resolution with fallback system)

### Plant Intelligence (TIER_3)
- Analytics dashboard (rejection rate, Pareto, trends, spatial maps)
- Quality frameworks (FMEA, fishbone, quality gates, TPM, COPQ)
- SPC (control charts, process capability)
- Decision engine (recommended actions, feedback tracking)

---

## Performance

- **Processing time:** 2.5-5 seconds per casting (typical)
- **Batch throughput:** ~50 castings/hour (LLM enabled), ~120 castings/hour (LLM disabled)
- **Memory usage:** ~500MB per inspection, ~1GB for batch processing

---

## Related Documentation

- [Inspection Pipeline](inspection_pipeline.md) — Technical details of defect detection process
- [Manufacturing Intelligence](manufacturing_intelligence.md) — Reasoning, fingerprinting, and learning systems
- [Dashboard & Reporting](dashboard_reporting.md) — User interface and reporting features
- [Quality & Compliance](quality_compliance.md) — ISO alignment and traceability
