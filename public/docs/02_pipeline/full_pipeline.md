# Full Pipeline — Stages 0-8

> **Purpose:** Complete inspection pipeline flow from image to decision  
> **Where Used:** `core/pipeline/`, `core/ui/run_pipeline.py`  
> **Related:** [Patch System](patch_system.md), [Signal System](signal_system.md), [Fusion Logic](fusion_logic.md)

---

## Pipeline Overview

```
Image Input
    ↓
Stage 0: Quality Gate (blur, brightness, resolution validation)
    ↓
Stage 1: YOLO Detection (casting localization + defect proposals)
    ↓
Stage 2: Patch Classification (256×256 sliding window)
    ↓
Stage 2b: Signal Feature Extraction (LBP, GLCM, edge, blob, geometry)
    ↓
Stage 2c: Signal Classification (PRIMARY classifier - 40% weight)
    ↓
Stage 3: Consolidation + Diagnosis (merge, zone mapping, KB matching)
    ↓
Stage 4: Multi-Signal Fusion (YOLO + Signal + LLM + Agreement → final score)
    ↓
Stage 4b: Reasoning (root cause: LLM multimodal / geometry / rules)
    ↓
Stage 5: Visualization + Reports (heatmaps, PDFs, annotated images)
    ↓
Stage 6: Telemetry (run logging, feedback tracking)
    ↓
Stage 7: Traceability + Persistence (ERP context, SQL storage, fingerprinting)
    ↓
Stage 8: Process Intelligence (background: defect graph, heat analysis)
    ↓
Decision Output: REJECT | MANUAL_REVIEW | ACCEPT
```

**Pipeline Health:** Each stage reports health status (`"OK"` | `"DEGRADED"` | `"FAILED"`). Aggregate `pipeline_health` is worst status across all stages.

---

## Stage 0: Quality Gate

**Purpose:** Pre-pipeline validation to detect degraded input image quality.

**Checks:**
1. **Blur Detection** — Laplacian variance < 100 → flag as blurry
2. **Brightness Check** — Mean pixel value [30, 225] range
3. **Contrast Check** — Std deviation ≥ 20
4. **Resolution Validation** — Minimum dimensions enforced

**Behavior:** Non-blocking. Flags degradation but allows pipeline to continue.

**Output:**
- `image_quality` dict with metrics
- `quality_health`: `"OK"` | `"DEGRADED"`

**Implementation:** `core/vision/quality_gate.py`

> See [Technical Reference §3.5-3.6](../01_overview/technical_reference.md#35-laplacian-variance-blur-detection) for blur detection and luminance algorithms.

---

## Stage 1: YOLO Detection

**Purpose:** Localize casting body and propose defect regions (20% weight in fusion).

**Process:**
1. YOLO model inference on full image
2. Detect casting body bounding box
3. Detect 6 defect classes with confidence scores
4. Pad bounding boxes by 10%
5. Apply NMS (IoU threshold 0.45)

**Confidence Thresholds:**
- Casting body: 0.40
- Defects: 0.15-0.30 (per class)

**Output:**
- List of bounding boxes (casting + defects)
- `detection_health`: `"OK"` | `"DEGRADED"` (if casting not found)

**Role:** Proposal generator, not primary classifier. Demoted from 100% to 20% weight.

**Implementation:** `core/vision/infer.py`

> See [Technical Reference §1.1](../01_overview/technical_reference.md#11-yolo-object-detection) for YOLO algorithm.

---

## Stage 2: Patch Classification

**Purpose:** Dense patch-level defect analysis via 256×256 sliding window.

**Process:**
1. Resize image to 960px (larger side)
2. Generate patches: 256×256px, stride 128px (50% overlap)
3. Run patch classifier (YOLO-based) on each patch
4. Apply temperature scaling for calibration
5. Store patch objects with coordinates, probabilities
6. **Cluster filtering:** Remove DBSCAN noise clusters, apply MIN_CLUSTER_SCORE (0.08) and MIN_CLUSTER_SIZE (3) thresholds
7. **Hybrid scoring:** Score clusters using `max * 0.7 + mean * 0.3` to prevent dilution

**Grid:** Typically 6×6 = 36 patches for 960px image → filtered to 3-8 valid clusters.

**Patch Object Structure:**
```python
{
    "x": int, "y": int, "w": int, "h": int,
    "prob": float,                    # Calibrated defect probability
    "yolo_probs": List[float],        # Full distribution
    "feature_vector": List[float],    # 15-dim features (Stage 2b)
    "final_anomaly": float,           # Anomaly score (Stage 2b)
    "signal_class": str,              # Signal classification (Stage 2c)
    "signal_confidence": float
}
```

**Overlap-Tile Fusion:** Overlapping regions averaged for smooth heatmap.

**Implementation:** `core/vision/casting/inference.py`

> See [Patch System](patch_system.md) for detailed patch generation. See [Technical Reference §1.2-1.3](../01_overview/technical_reference.md#12-yolo-patch-classifier) for classifier algorithm.

---

## Stage 2b: Signal Feature Extraction

**Purpose:** Extract physics-grounded features from each patch for signal-based classification.

**Features Extracted (15-dimensional vector):**
- **Texture:** LBP uniformity, GLCM (contrast, homogeneity, energy, correlation)
- **Edges:** Edge density, edge strength
- **Blobs:** Blob count, mean blob size
- **Intensity:** Mean, standard deviation
- **Geometry:** Area, perimeter, circularity, solidity, aspect ratio

**Normalization:** All features clamped to [0, 1], NaN/inf → 0.0

**Gating:** Only extract features for patches with YOLO prob ≥ 0.20 (efficiency).

**Output:** `feature_vector` attached to each patch object.

**Implementation:** `core/reasoning/signal_features.py`, `core/vision/feature_vector.py`

> See [Signal System](signal_system.md) for feature details. See [Technical Reference §3](../01_overview/technical_reference.md#3-feature-extraction) for extraction algorithms.

---

## Stage 2c: Signal Classification

**Purpose:** PRIMARY classifier (40% weight in fusion) using hard threshold rules on signal features.

**Classification Rules:** Per defect type, requires **2 STRONG + 1 supporting** signal:
- **Porosity:** High circularity + low solidity + high blob count
- **Shrinkage:** High irregularity + low energy + high edge density
- **Crack:** Very high edge density + low circularity + elongated aspect ratio
- **Sand Inclusion:** High texture variation + moderate blob count + irregular shape
- **Surface Roughness:** High LBP variance + high dissimilarity + moderate edge density
- **Blow Hole:** Circular + dark intensity + isolated blob

**Aggregation:** Patch classifications aggregated to casting-level decision via voting + confidence weighting.

**Why Signal-First?**
- YOLO has ~15% error rate on subtle defects
- Signal features are physics-grounded and explainable
- Texture/edge/geometry capture material properties YOLO misses

**Output:** `signal_class`, `signal_confidence` per patch → `signal_score` for casting.

**Implementation:** `core/reasoning/signal_scoring.py`

> See [Signal System](signal_system.md) for classification rules. See [Technical Reference §3](../01_overview/technical_reference.md#3-feature-extraction) for feature algorithms.

---

## Stage 3: Consolidation + Diagnosis

**Purpose:** Merge detections, map to zones, assign root causes, integrate SCRATA similarity, compute topology score.

**Consolidation:**
1. **Zone Mapping** — Assign each defect to grid cell (5×5 or 7×7 grid)
2. **Widespread Merge** — If defects widespread (>50% of zones), merge into single region
3. **Confidence Clamping** — Cap merged confidence at 0.95 (avoid overconfidence)
4. **Unknown Classification** — If confidence <0.35 or ambiguous, label as "unknown"
5. **SCRATA Integration** — Inject SCRATA similarity scores into `_candidate_scores` with 0.5 boost factor and double normalization
6. **Topology Score** — Compute continuous topology score (0-1) from cluster coverage, density, and strength
7. **Anomaly Distribution** — Analyze spread ratio, variance, and peak to distinguish process vs structural defects

**Diagnosis:**
1. **KB Matching** — Match defect patterns against knowledge base rules
2. **Zone Weighting** — Score causes based on defect spatial zones
3. **Responsible Section** — Identify manufacturing section (melting, molding, finishing)

**Output:**
- `defect_profile`: List of consolidated defects with zones
- `causes`: Ranked list of probable root causes
- `responsible_section`: Manufacturing section
- `consolidation_health`: `"OK"` | `"DEGRADED"`

**Implementation:** `core/pipeline/consolidate.py`, `core/diagnosis/rules.py`

> See [Reasoning Pipeline](../03_intelligence/reasoning_pipeline.md) for diagnosis details.

---

## Stage 4: Multi-Signal Fusion

**Purpose:** Combine YOLO, Signal, SCRATA, LLM, Agreement into final classification score.

**Fusion Weights (default):**
- YOLO: 20% (proposal generator)
- Signal: 40% (PRIMARY classifier)
- SCRATA: Injected with 0.5 boost into candidate scores (influences all signals)
- LLM: 20% (contextual reasoning)
- Agreement: 20% (consensus bonus)

**Fusion Formula:**
```
final_score = w_yolo × yolo_score + w_signal × signal_score 
            + w_llm × llm_score + w_agreement × agreement_score
```

**Proportional Redistribution:** When signals missing, weights redistributed to maintain relative proportions.

**Agreement Logic:**
- Strong Agreement (range ≤ 0.15): ×1.1 boost
- Mild Disagreement (0.15 < range ≤ 0.35): ×1.0 neutral
- Strong Disagreement (range > 0.35): ×0.85 penalty

**Output:** `fused_confidence` [0, 1], `fusion_breakdown` dict

**Implementation:** `core/reasoning/multi_signal_fusion.py`

> See [Fusion Logic](fusion_logic.md) for detailed fusion mechanics. See [Technical Reference §6.3-6.6](../01_overview/technical_reference.md#63-multi-signal-weighted-fusion) for fusion algorithms.

---

## Stage 4b: Reasoning (Root Cause)

**Purpose:** Generate human-readable root cause explanation with severity and actions using continuous signal fusion.

**Signal Fusion (Phases 9-13):**
- **Topology Score** — Replaces binary `_cav_n` with continuous 0-1 score (coverage + density + strength)
- **Anomaly Distribution** — Spread ratio, variance (relative), peak anomaly
- **SCRATA Confidence** — Entropy-based confidence with scaled boost
- **Disambiguation** — Spread + variance + peak corrections with normalization
- **Soft Final Guard** — Boost process_defect without clearing candidates

**Three Paths (adaptive routing):**

### Path A: Geometry Conclusive (0 API calls)
- **Condition:** Circularity decisively indicates porosity or sand
- **Logic:** circ > 0.58 → porosity | circ < 0.45 → sand inclusion
- **Output:** Text report with confidence
- **Speed:** <5ms

### Path B: Multimodal LLM (1 API call)
- **Condition:** Geometry inconclusive or complex defect
- **Model:** Mistral-small-2603 (multimodal)
- **Input:** Image + signal features + YOLO + KB + geometry + topology + anomaly distribution
- **Output:** JSON with root_cause, severity, recommended_action
- **Speed:** ~500ms

### Path C: Rule-Based Fallback (0 API calls)
- **Condition:** LLM unavailable or disabled
- **Logic:** Signal class + topology + KB lookup → text report
- **Speed:** <10ms

**Routing Decision:** Topology + anomaly distribution guide routing. High topology score with localized anomaly → porosity. Low topology with widespread anomaly → process defect.

**Output:** `reasoning_result` with cause, severity, action, path used

**Implementation:** `core/reasoning/pipeline.py`, `core/reasoning/cavity_analysis.py`

> See [Reasoning Pipeline](../03_intelligence/reasoning_pipeline.md) for 4-gate reasoning details.

---

## Stage 5: Visualization + Reports

**Purpose:** Generate human-readable outputs (heatmaps, PDFs, annotated images).

**Outputs:**
1. **Annotated Image** — Bounding boxes + labels + confidence scores
2. **Heatmap** — Color-coded anomaly overlay (alpha blending)
3. **Summary Image** — Tiled layout with original + annotated + heatmap
4. **PDF Report** — Multi-page with metadata, images, defect table, causes
5. **JSON Report** — Machine-readable inspection data

**Heatmap Generation:**
1. Project patch probabilities to heatmap grid
2. Apply Gaussian blur (15×15 kernel) for smoothing
3. Apply colormap (jet/hot)
4. Alpha blend with original image (40% heatmap, 60% original)

**Implementation:** `core/outputs/visualize.py`, `core/reports/generate.py`

> See [Technical Reference §10.1](../01_overview/technical_reference.md#101-heatmap-alpha-overlay) for heatmap algorithm.

---

## Stage 6: Telemetry

**Purpose:** Log inspection runs for observability and calibration.

**Logs:**
1. **Run Telemetry** — `runtime/logs/runs/YYYY-MM.jsonl`
   - Timestamp, casting_id, status, scores, health, defects
2. **Signal Traces** — `runtime/logs/signal_traces/YYYY-MM-DD.jsonl`
   - Full decision state: YOLO, signal, LLM, fusion, ground truth
3. **Feedback Logs** — `runtime/logs/feedback/YYYY-MM.jsonl`
   - Inspector corrections, review outcomes

**Format:** JSONL (one JSON per line), rotated monthly/daily.

**Usage:** Auto-calibration consumes signal traces to optimize weights.

**Implementation:** `core/logging_system/`, `core/analytics/signal_trace_logger.py`

---

## Stage 7: Traceability + Persistence

**Purpose:** Link inspection to manufacturing context, persist to database, extract fingerprint.

**Traceability:**
1. **Heat Number** — Metal batch traceability
2. **Gate ID** — Production gate/station (passive context)
3. **Mold ID** — Mold identifier
4. **ERP Context** — Shift, operator, furnace, production date

**Persistence:**
1. **SQL Tables:**
   - `AI_Inspections` — Inspection records
   - `AI_Defects` — Detected defects
   - `AI_Defect_Clusters` — Fingerprint clusters
2. **ERP Export:** CSV export to `runtime/outputs/erp_exports/YYYY-MM.csv`
3. **Fallback:** JSON/CSV in `runtime/` if database unavailable

**Fingerprinting:**
1. Three-stage alignment cascade (contour → ORB → PCA)
2. Extract fingerprint vector
3. Index for recurring pattern detection

**Implementation:** `core/persistence/`, `core/traceability/`, `core/fingerprints/`

> See [Traceability](../03_intelligence/traceability.md) and [Fingerprinting](../03_intelligence/fingerprinting.md).

---

## Stage 8: Process Intelligence (Background)

**Purpose:** Background analytics learning from inspection history (TIER_2+).

**Analytics:**
1. **Defect Graph** — NetworkX graph of defect co-occurrence patterns
2. **Temporal Model** — Time-series analysis of defect trends
3. **Heat Intelligence** — Cross-heat pattern analysis for metal quality
4. **Prototype Bank** — Learn canonical defect exemplars
5. **SCRATA System** — Similarity matching against known patterns

**Trigger:** Auto-runs every 50 inspections in background thread.

**Storage:** `runtime/process_logs/`, SQL tables (`AI_Heat_Analysis`)

**Implementation:** `core/learning/`, `core/vision/prototypes/`

> See [Plant Intelligence](../03_intelligence/plant_intelligence.md) for TIER_3 advanced analytics.

---

## Pipeline Health Tracking

Each stage reports health status:

| Status | Meaning |
|--------|---------|
| `"OK"` | Normal operation, all validations passed |
| `"DEGRADED"` | Non-critical issues detected (e.g., casting not found, quality warnings) |
| `"FAILED"` | Critical failure, pipeline cannot continue |

**Aggregate Health:** `pipeline_health` = worst status across all stages.

**Decision Impact:**
- `"OK"` → Proceed normally
- `"DEGRADED"` → Flag for manual review, log warnings
- `"FAILED"` → Abort inspection, return error

**Tracked Health:**
- `image_quality_health` (Stage 0)
- `detection_health` (Stage 1)
- `consolidation_health` (Stage 3)
- `pipeline_health` (aggregate)

---

## Decision Routing

**Three-Tier Decision Thresholds:**
```
final_score ≥ T_high (0.70) → REJECT
T_low (0.30) < final_score < T_high → MANUAL_REVIEW
final_score ≤ T_low → ACCEPT
```

**Review Triggers (overrides to MANUAL_REVIEW):**
- Strong signal disagreement (range > 0.4)
- High defect count (>5 defects)
- Quality gate failures (blur, brightness issues)
- Unknown classification (confidence <0.35)
- Borderline scores near thresholds

**Implementation:** `core/pipeline/triggers.py`

> See [Technical Reference §7.1](../01_overview/technical_reference.md#71-three-tier-decision-thresholds) for decision algorithm.

---

## Performance Benchmarks

| Stage | Typical Latency | Notes |
|-------|----------------|-------|
| Stage 0 | <5ms | Quality checks |
| Stage 1 | 50-150ms | YOLO inference |
| Stage 2 | 200-750ms | Patch classification (36 patches) |
| Stage 2b | 10-30ms | Feature extraction |
| Stage 2c | 5-15ms | Signal classification |
| Stage 3 | 10-30ms | Consolidation + diagnosis |
| Stage 4 | 5-10ms | Fusion |
| Stage 4b | 5ms (Path A) / 500ms (Path B) / 10ms (Path C) | LLM reasoning |
| Stage 5 | 50-200ms | Visualization + PDF |
| Stage 6 | <5ms | Logging (async) |
| Stage 7 | 20-100ms | SQL + fingerprinting |
| Stage 8 | Background (non-blocking) | Process intelligence |
| **Total** | **400-1500ms** | Full pipeline end-to-end |

---

## Configuration

Key parameters in `customers/castco/configs/parameters.yaml`:

```yaml
yolo:
  confidence_threshold: 0.40
  nms_iou_threshold: 0.45

patch_analysis:
  resize_target: 960
  patch_size: 256
  stride: 128
  min_confidence: 0.40

signal_features:
  feature_gate_threshold: 0.20  # Extract features if YOLO prob ≥ this

multi_signal_fusion:
  yolo_weight: 0.20
  signal_weight: 0.40
  llm_weight: 0.20
  agreement_weight: 0.20

reasoning:
  geometry_confidence_threshold: 0.85  # Route to Path A if above
  llm_enabled: true

quality_gate:
  blur_threshold: 100
  brightness_min: 30
  brightness_max: 225
  contrast_min: 20
```

---

## Cross-References

- **Patch Details:** [Patch System](patch_system.md)
- **Anomaly Detection:** [Anomaly System](anomaly_system.md)
- **Signal Features:** [Signal System](signal_system.md)
- **Fusion Weights:** [Fusion Logic](fusion_logic.md)
- **Root Cause:** [Reasoning Pipeline](../03_intelligence/reasoning_pipeline.md)
- **Fingerprinting:** [Fingerprinting](../03_intelligence/fingerprinting.md)
- **Algorithms:** [Technical Reference](../01_overview/technical_reference.md)

---

**Version:** 1.0  
**Last Updated:** 2026-04-07
