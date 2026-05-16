# Full Pipeline — Stages 0-10

> **Purpose:** Complete inspection pipeline flow from image to decision, reflecting Phase-K energy-based reasoning and signal-first design  
> **Where Used:** `core/pipeline/`, `core/ui/run_pipeline.py`  
> **Related:** [Architecture](../01_overview/architecture.md), [Signal System](signal_system.md), [Fusion Logic](fusion_logic.md), [Energy Reasoning](../03_intelligence/energy_reasoning.md)  
> **Version:** 2.0  
> **Last Updated:** 2026-05-16

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
Stage 2c: Signal Classification (PRIMARY classifier - 45% weight)
    ↓
Stage 3: Consolidation + Diagnosis (merge, zone mapping, KB matching, topology score)
    ↓
Stage 4: Multi-Signal Fusion (Signal + LLM + Agreement → final score)
    ↓
Stage 5: Topology and Anomaly Distribution Integration
    ↓
Stage 6: Energy-Based Reasoning (Phase-K: additive forces, Lyapunov stability)
    ↓
Stage 7: Final Decision (TIER_1/2: 3-tier threshold)
    ↓
Stage 8: Visualization + Reports (heatmaps, PDFs, annotated images)
    ↓
Stage 9: Telemetry (run logging, feedback tracking)
    ↓
Stage 10: Traceability + Persistence + Process Intelligence (ERP, SQL, fingerprinting, defect graph)
    ↓
Decision Output: REJECT | MANUAL_REVIEW | ACCEPT
```

**Pipeline Health:** Each stage reports health status (`"OK"` | `"DEGRADED"` | `"FAILED"`). Aggregate `pipeline_health` is worst status across all stages.

> **Core Architecture Property:** TvastrRAS is an edge-native, on-premise, offline-capable industrial runtime. It functions fully without internet access, cloud dependencies, or external APIs. All components are designed for deterministic, low-latency execution in manufacturing environments.

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

**Purpose:** Localize casting body and propose defect regions (0% weight in fusion).

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

**Role:** Proposal generator only. YOLO scores are hard-capped at `0.0` in fusion. Used only for initial cropping and candidate selection.

**Implementation:** `core/vision/infer.py`

> See [Technical Reference §1.1](../01_overview/technical_reference.md#11-yolo-object-detection) for YOLO algorithm.

---

## Stage 2: Patch Classification

**Purpose:** Dense patch-level defect analysis via 256×256 sliding window.

**Process:**
1. Resize image to 960px (larger side)
2. Generate patches: 256×256px, stride 128px (50% overlap)
3. Run patch classifier (CNN-based) on each patch
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

**Purpose:** PRIMARY classifier (45% weight in fusion) using hard threshold rules on signal features.

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

**Purpose:** Combine Signal, LLM, and Agreement into final classification score.

**Fusion Weights (default):**
- Signal: 45% (PRIMARY classifier)
- LLM: 35% (contextual reasoning)
- Agreement: 20% (consensus bonus)

**Fusion Formula:**
```
final_score = w_signal × signal_score + w_llm × llm_score + w_agreement × agreement_score
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

## Stage 5: Topology and Anomaly Distribution Integration

**Purpose:** Integrate topology and anomaly metrics into energy model to refine classification logic.

**Topology Score (replaces _cav_n)**
- Continuous score 0–1 based on cluster density, coverage, and signal strength
- Computed by `core/reasoning/cavity_analysis.py::compute_topology_score()`
- Reflects spatial structure and signal coherence, not discrete count

**Anomaly Distribution Metrics:**
- **Spread Ratio:** Normalized distance between top two anomaly patches
- **Variance:** Standard deviation of patch-level anomaly scores
- **Peak Anomaly:** Maximum anomaly score observed in casting

**Integration:** These metrics are embedded into the candidate state before energy conversion. They are not direct decision factors but are essential to the energy model's stability.

**Implementation:** `core/reasoning/cavity_analysis.py`

> See [Technical Reference §5.4-5.7](../01_overview/technical_reference.md#54-final-anomaly-score) for anomaly derivation and fusion.

---

## Stage 6: Energy-Based Reasoning (Phase-K)

**Purpose:** Transform signal scores into an energy landscape for stable, additive reasoning, replacing previous 4-gate logic.

**Phase-K Core Concepts:**
- **Energy Conversion:** `E_k = -log(score_k + ε)` — converts classification scores to energy values (lower = more likely)
- **Additive Forces:** Signal contributions reduce energy additively, not multiplicatively
- **Lyapunov Stability:** Energy must monotonically decrease with each stage. Violation triggers rollback.

**Force Application:**
```python
ΔE_topology = -0.3 × topology_score
ΔE_scrata = -0.2 × scrata_confidence
ΔE_anomaly = -0.1 × avg_anomaly
ΔE_llm = -0.2 × llm_confidence  # contextual signal

E_new = E_old + ΔE_topology + ΔE_scrata + ΔE_anomaly + ΔE_llm + ΔE_signal
```

**Stability Check:**
- Compute total energy before/after forces: `ΔE_total = E_after - E_before` 
- If `ΔE_total > 0.01`, energy increased — revert to prior state and flag `stability_failed`

**Final Recalculation:**
- Convert energy back to probabilities: `p_k = exp(-E_k)`
- Normalize: `p'_k = p_k / Σp_j` (for all defect types)
- Apply safety guards: NaN/Inf → 0.0, negative scores → clamp to 0, sum must be 1.0 ±0.01

**Output:** `reasoning_energy_result` — final probabilities for each defect type (0–1), normalized

> **NOTE:** SCRATA is now an additive energy force (Phase K), NOT a multiplicative booster. This change eliminates non-linear scaling instability.

**Implementation:** `core/reasoning/pipeline.py`, `core/reasoning/baselines.py`

> See `energy_reasoning.md` for full documentation and formal derivation of energy equations.

---

## Stage 7: Final Decision

**Purpose:** Convert energy-model output into actional decision.

**Three-Tier Decision Thresholds:**
```
final_score ≥ T_high (0.70) → REJECT
T_low (0.30) < final_score < T_high → MANUAL_REVIEW
final_score ≤ T_low → ACCEPT
```

**Review Triggers (Overrides to MANUAL_REVIEW):**
- Strong signal disagreement (range > 0.4)
- High defect count (>5 defects)
- Quality gate failures (blur, brightness issues)
- Unknown classification (confidence <0.35)
- Borderline scores near thresholds
- Lyapunov instability detected
- Anomaly distribution indicates widespread pattern (process failure)

**Decision Output:**
- `decision`: `"ACCEPT"` | `"REJECT"` | `"MANUAL_REVIEW"`
- `score`: Final probability for most probable defect type
- `confidence`: Confidence level (1.0 for REJECT, 0.7–0.9 for MANUAL_REVIEW, 0.3–0.6 for ACCEPT)

**Implementation:** `core/pipeline/triggers.py`, `core/reasoning/pipeline.py`

> See [Technical Reference §7.1](../01_overview/technical_reference.md#71-three-tier-decision-thresholds) for decision algorithm.

---

## Stage 8: Visualization + Reports

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

## Stage 9: Telemetry

**Purpose:** Log inspection runs for observability and calibration.

**Logs:**
1. **Run Telemetry** — `runtime/logs/runs/YYYY-MM.jsonl`
   - Timestamp, casting_id, status, scores, health, defects
2. **Signal Traces** — `runtime/logs/signal_traces/YYYY-MM-DD.jsonl`
   - Full decision state: YOLO, signal, LLM, fusion, energy, ground truth
3. **Feedback Logs** — `runtime/logs/feedback/YYYY-MM.jsonl`
   - Inspector corrections, review outcomes

**Format:** JSONL (one JSON per line), rotated monthly/daily.

**Usage:** Auto-calibration consumes signal traces to optimize weights.

**Implementation:** `core/logging_system/`, `core/analytics/signal_trace_logger.py`

---

## Stage 10: Traceability + Persistence + Process Intelligence

**Purpose:** Link inspection to manufacturing context, persist to database, extract fingerprint, and learn patterns.

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

**Process Intelligence (Background):**
1. **Defect Graph** — NetworkX graph of defect co-occurrence patterns
2. **Temporal Model** — Time-series analysis of defect trends
3. **Heat Intelligence** — Cross-heat pattern analysis for metal quality
4. **Prototype Bank** — Learn canonical defect exemplars
5. **SCRATA System** — Similarity matching against known patterns

**Trigger:** Auto-runs every 50 inspections in background thread.

**Storage:** `runtime/process_logs/`, SQL tables (`AI_Heat_Analysis`)

**Implementation:** `core/persistence/`, `core/traceability/`, `core/fingerprints/`, `core/learning/`

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
- `stability_failed` (Stage 6)
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
- Lyapunov instability detected
- Anomaly distribution indicates widespread pattern (process failure)

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
| Stage 5 | 5-10ms | Topology/anomaly integration |
| Stage 6 | 50-150ms | Energy computation and stability check | 
| Stage 7 | <5ms | Decision thresholding |
| Stage 8 | 50-200ms | Visualization + PDF |
| Stage 9 | <5ms | Logging (async) |
| Stage 10 | 20-100ms | SQL + fingerprinting (non-blocking) |
| **Total** | **400–1200ms** | Full pipeline end-to-end |

> **Note:** Latency optimized for real-time production line use, supporting up to 5 inspections per minute on standard hardware.

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
  signal_weight: 0.45
  llm_weight: 0.35
  agreement_weight: 0.20

reasoning:
  energy_weights:
    topology: 0.30
    scrata: 0.20
    anomaly: 0.10
    llm: 0.20
  stability_tolerance: 0.01

quality_gate:
  blur_threshold: 100
  brightness_min: 30
  brightness_max: 225
  contrast_min: 20

decision:
  t_low: 0.30
  t_high: 0.70
  manual_review_thresholds:
    disagreement_range: 0.4
    max_defect_count: 5
    low_confidence: 0.35
```

---

## Cross-References

- **Patch Details:** [Patch System](patch_system.md)
- **Anomaly Detection:** [Anomaly System](anomaly_system.md) — now a low-level perception subsystem
- **Signal Features:** [Signal System](signal_system.md)
- **Fusion Weights:** [Fusion Logic](fusion_logic.md)
- **Energy Reasoning:** [Energy Reasoning](../03_intelligence/energy_reasoning.md)
- **Fingerprinting:** [Fingerprinting](../03_intelligence/fingerprinting.md)
- **Algorithms:** [Technical Reference](../01_overview/technical_reference.md)

> **NOTE:** This document is the sole authoritative source for current product behavior. All prior versions are obsolete. No component references Nuitka, YOLO classification, or 4-gate reasoning logic. All fusion and decision logic reflects Phase-K energy-based reasoning and signal-first design.

---

**Version:** 2.0  
**Last Updated:** 2026-05-16