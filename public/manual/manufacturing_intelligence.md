# Manufacturing Intelligence

> **Technical Reference: Reasoning, Calibration, Fingerprinting, and Traceability**

---

## Overview

Manufacturing Intelligence extends the inspection pipeline (see [Inspection Pipeline](inspection_pipeline.md)) with four advanced capabilities:

1. **Reasoning Pipeline:** 4-gate contextual decision-making system
2. **Auto-Calibration:** Grid search optimization of fusion weights
3. **Fingerprinting:** DBSCAN clustering of spatial defect patterns
4. **Traceability:** Heat number resolution and audit trail system

These capabilities are available in **TIER_2** (Process Intelligence) and **TIER_3** (Plant Intelligence) licenses.

---

## Reasoning Pipeline

### 4-Gate Architecture

The reasoning pipeline processes each inspection through 4 sequential gates, with early-exit fast paths for clear decisions:

**Gate 0: Fast-Path (Geometric Rules)**
- Simple geometric checks on defect properties
- IF defect_area > 1000px² AND confidence > 0.90 → REJECT (exit)
- IF defect_count == 0 AND anomaly_score < 0.20 → ACCEPT (exit)
- IF ambiguous → proceed to Gate 1
- **Purpose:** Handle ~40% of inspections with zero latency

**Gate 1: Geometric Reasoning**
- Analyze defect shape, size, location, distribution
- Compute geometric features: circularity, aspect ratio, solidity, extent
- Apply rule-based logic:
  - IF gate_region AND defect_size > threshold → HIGH_RISK
  - IF body_region AND small_scattered_defects → LOW_RISK
- Decision: ACCEPT / REJECT / PROCEED_TO_GATE_2

**Gate 2: Signal Reasoning**
- Combine signal features (LBP, GLCM, edge, blob, geometry)
- Apply HARD threshold rules (see [Inspection Pipeline](inspection_pipeline.md))
- Check signal agreement (range of signal scores)
- Decision: ACCEPT / REJECT / PROCEED_TO_GATE_3

**Gate 3: LLM Reasoning**
- Generate natural language description of defect
- Query LLM with: image patches, signal scores, context metadata
- LLM provides: reasoning explanation, confidence adjustment, recommended decision
- Final decision: ACCEPT / REJECT / MANUAL_REVIEW

**Gate Exit Statistics (typical):**
- Gate 0 (fast-path): 40% of inspections
- Gate 1 (geometric): 25% of inspections
- Gate 2 (signal): 20% of inspections
- Gate 3 (LLM): 15% of inspections

**Average Latency:**
- Gate 0: <10ms
- Gate 1: 50-100ms
- Gate 2: 200-400ms
- Gate 3: 1000-2000ms (LLM inference)

### Contextual Reasoning

At each gate, the system considers:
- **Defect properties:** Size, shape, location, confidence scores
- **Patch context:** Which patches contain defects (grid positions)
- **Signal agreement:** Do Signal, YOLO, LLM agree or conflict?
- **Historical data:** Similar castings from recent history (if available)

**Example Gate 2 reasoning:**
```
IF signal_score > 0.75 AND YOLO_score > 0.60 AND agreement_range < 0.20:
  → High confidence REJECT (signals agree)
  
IF signal_score > 0.80 BUT YOLO_score < 0.30 AND agreement_range > 0.50:
  → Conflicting signals → MANUAL_REVIEW
```

---

## Auto-Calibration System

### Weight Optimization Problem

The fusion formula (see [Inspection Pipeline](inspection_pipeline.md)) uses weights:
```
Final_Score = (Signal × w1) + (YOLO × w2) + (LLM × w3) + (Agreement × w4)
```

Default weights: w1=0.40, w2=0.20, w3=0.20, w4=0.20

**Goal:** Find optimal weights that minimize disagreement between AI decisions and operator validations.

### Grid Search Algorithm

Auto-calibration uses grid search over weight combinations:

**Search Space:**
- w1 (Signal): [0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60]
- w2 (YOLO): [0.10, 0.15, 0.20, 0.25, 0.30]
- w3 (LLM): [0.10, 0.15, 0.20, 0.25, 0.30]
- w4 (Agreement): [0.10, 0.15, 0.20, 0.25, 0.30]
- Constraint: w1 + w2 + w3 + w4 = 1.0

**Total combinations:** ~1260 valid weight sets

**Optimization Objective:**
```
Minimize: Disagreement_Rate = (FP + FN) / Total_Validations

Where:
  FP = False Positives (AI REJECT, Operator ACCEPT)
  FN = False Negatives (AI ACCEPT, Operator REJECT)
  Total_Validations = Operator-validated MANUAL_REVIEW cases
```

**Evaluation Process:**
1. Collect ≥50 operator-validated decisions (MANUAL_REVIEW cases)
2. For each weight combination (k=1 to 1260):
   - Recompute Final_Score for each validation case
   - Apply decision thresholds (REJECT ≥ 0.70, ACCEPT ≤ 0.30)
   - Count disagreements with operator decisions
3. Select weight set with minimum disagreement rate
4. If improvement > 5% → update production weights
5. If improvement ≤ 5% → keep current weights (avoid overfitting)

**Frequency:** Auto-calibration runs:
- Weekly (if ≥50 new validations collected)
- On-demand (triggered by quality engineer)
- After major process changes (new part, new mold, new material)

### Statistical Updates (Welford's Algorithm)

The system maintains rolling statistics for anomaly detection baseline using Welford's online algorithm:

**Welford's Algorithm for Mean and Variance:**
```
Initialize: n=0, mean=0, M2=0

For each new ACCEPT casting with features x:
  n = n + 1
  delta = x - mean
  mean = mean + delta / n
  delta2 = x - mean
  M2 = M2 + delta * delta2
  variance = M2 / (n - 1)
```

**Advantages:**
- Online updates (no need to store all historical data)
- Numerically stable (avoids floating-point overflow)
- Constant memory (O(1) storage per feature dimension)

**Decay Factor:**
- Apply exponential decay: weight recent data more heavily
- Decay rate: α = 0.95
- Effective window: ~20 recent ACCEPT castings

**Minimum Sample Size:**
- Require n ≥ 100 ACCEPT castings before anomaly baseline stabilizes
- Until n=100, use conservative thresholds (higher false positive rate acceptable)

---

## Fingerprinting System

### 12-Field Spatial Vector

Each casting generates a fingerprint: a normalized 12-dimensional spatial vector capturing defect distribution patterns.

**Vector Components:**
1. **defect_density:** Total defects / total patches (0.0-1.0)
2. **gate_region_ratio:** Defects in gate patches / total defects
3. **riser_region_ratio:** Defects in riser patches / total defects
4. **body_region_ratio:** Defects in body patches / total defects
5. **edge_region_ratio:** Defects in edge patches / total defects
6. **center_of_mass_x:** Weighted X coordinate of defect centroids (normalized 0-1)
7. **center_of_mass_y:** Weighted Y coordinate of defect centroids (normalized 0-1)
8. **spatial_spread:** Standard deviation of defect positions (normalized)
9. **cluster_count:** Number of defect clusters (DBSCAN with eps=50px)
10. **max_cluster_size:** Largest cluster size / total defects
11. **defect_uniformity:** Entropy of defect distribution across patches
12. **anomaly_concentration:** Ratio of anomaly_score in top 25% patches / total

**Normalization:**
- All components scaled to [0.0, 1.0] range
- Enables distance metrics (Euclidean, cosine similarity)

**Example Fingerprint:**
```
Casting ID: C-12345
Fingerprint: [0.42, 0.65, 0.15, 0.15, 0.05, 0.58, 0.62, 0.22, 3.0, 0.48, 0.71, 0.83]

Interpretation:
  - 42% of patches contain defects (high density)
  - 65% of defects in gate region (concentrated)
  - Center of mass at (0.58, 0.62) in normalized coords
  - 3 distinct defect clusters
  - High anomaly concentration (0.83) in top patches
```

### DBSCAN Clustering

Defect spatial clustering uses DBSCAN (Density-Based Spatial Clustering of Applications with Noise):

**Parameters:**
- **eps (epsilon):** 50 pixels (neighborhood radius)
- **min_samples:** 3 defects (minimum cluster size)

**Algorithm:**
1. For each defect centroid (x, y):
   - Find all neighbors within eps=50px radius
   - If ≥3 neighbors → mark as core point
2. Form clusters by connecting core points
3. Assign non-core points to nearest cluster (if within eps)
4. Mark isolated points as noise (not in any cluster)

**Output:**
- Cluster labels: [0, 0, 1, -1, 1, 2, 2, 0, ...] (-1 = noise)
- Cluster count: Number of unique non-noise labels
- Max cluster size: Largest cluster member count

**Purpose:**
- Distinguish "scattered porosity" from "localized shrinkage cavity"
- Identify gate-specific vs. body-specific defect patterns
- Enable fingerprint matching: similar cluster patterns → similar root cause

### Fingerprint Matching

**Similarity Metric (Euclidean Distance):**
```
Distance(F1, F2) = sqrt(sum((F1[i] - F2[i])^2 for i=1 to 12))
```

**Matching Threshold:**
- Distance < 0.15 → STRONG_MATCH (very similar pattern)
- Distance < 0.30 → MODERATE_MATCH (similar pattern)
- Distance ≥ 0.30 → NO_MATCH (different pattern)

**Use Cases:**

**1. Heat-Level Pattern Detection**
- Compute fingerprints for all castings in Heat H-5500
- Cluster fingerprints using DBSCAN
- IF all castings in same cluster → consistent heat-level defect pattern
- Alert: "Heat H-5500 shows uniform porosity pattern (likely furnace issue)"

**2. Mold Degradation Tracking**
- Store fingerprint history for Mold M-450: [F_cycle_100, F_cycle_500, F_cycle_1000, ...]
- Compute drift: Distance(F_current, F_baseline)
- IF drift > 0.40 → Alert: "Mold M-450 degradation detected"

**3. Rapid Pattern Recognition**
- New casting arrives with fingerprint F_new
- Search recent history (last 100 castings) for similar fingerprints
- IF match found → "Similar pattern to Casting C-12300 (rejected yesterday, root cause: sand moisture)"

---

## Traceability System

### Heat Number Resolution

The system resolves casting-to-heat traceability through multiple sources:

**Resolution Priority:**
1. **User input:** Operator manually enters heat number during inspection
2. **ERP lookup:** Query connected ERP system with casting ID → heat number
3. **Database lookup:** Search inspection history for previous castings with same part number
4. **Fallback:** Generate formatted heat ID: `FH_YYYYMMDD_HHMMSS` (Foundry Heat + timestamp)

**Heat ID Format (Fallback):**
```
FH_20260421_143000
  ^    ^      ^
  |    |      └─ Time: 14:30:00 (2:30 PM)
  |    └──────── Date: 2026-04-21 (April 21, 2026)
  └───────────── Prefix: Foundry Heat
```

**Traceability Chain:**
```
Casting ID (C-12345)
  └─> Part Number (PN-5678)
  └─> Heat ID (H-9912 or FH_20260421_143000)
  └─> Mold ID (M-450)
  └─> Inspection Timestamp
  └─> Operator Name
  └─> Decision (ACCEPT/REJECT/MANUAL_REVIEW)
  └─> All Signal Scores
  └─> Model Versions (YOLO v8.2, Signal v3.1, LLM v1.5)
  └─> Images (original + annotated)
```

### Audit Trail

Every inspection record stores:

**Decision Data:**
- Decision: ACCEPT / REJECT / MANUAL_REVIEW
- Final_Score: 0.0-1.0
- Signal breakdown: [Signal, YOLO, LLM, Agreement] scores
- Thresholds: [accept_threshold, reject_threshold]
- Reasoning: Plain-language explanation (if LLM used)

**Context Data:**
- Casting ID, Part Number, Heat ID, Mold ID
- Timestamp (ISO 8601 format)
- Operator name/ID
- License tier (TIER_1/TIER_2/TIER_3)

**Technical Data:**
- Model versions: YOLO, Signal, LLM, Anomaly detection
- Calibration state: Current fusion weights [w1, w2, w3, w4]
- Processing time: Per-stage latencies (ms)
- Gate exit: Which reasoning gate produced the decision

**Evidence Data:**
- Original image: Full-resolution JPEG/PNG
- Annotated image: Bounding boxes + heatmap overlay
- Patch scores: 6×6 grid of per-patch scores
- Defect list: [class, confidence, bbox, patch_location] for each detection
- Fingerprint: 12-dimensional vector

**Validation Data (if MANUAL_REVIEW validated):**
- Validator name/ID
- Validation timestamp
- Validation decision: ACCEPT / REJECT
- Validation notes: Freeform text comments
- Disagreement flag: TRUE if validator disagrees with AI

### Traceability Queries

The system supports:

**By Casting ID:**
```sql
SELECT * FROM inspections WHERE casting_id = 'C-12345'
→ Returns: Full inspection record with all metadata
```

**By Heat ID:**
```sql
SELECT * FROM inspections WHERE heat_id = 'H-9912'
→ Returns: All castings inspected from Heat H-9912
→ Aggregates: Rejection rate, primary defects, timeline
```

**By Mold ID:**
```sql
SELECT * FROM inspections WHERE mold_id = 'M-450' ORDER BY timestamp
→ Returns: Mold quality history over time
→ Enables: Degradation tracking, cycle count correlation
```

**By Date Range + Decision:**
```sql
SELECT * FROM inspections 
WHERE timestamp BETWEEN '2026-04-01' AND '2026-04-30'
  AND decision = 'REJECT'
→ Returns: All rejections in April 2026
→ Enables: Monthly quality reports, trend analysis
```

**By Fingerprint Similarity:**
```sql
SELECT casting_id, fingerprint, 
       euclidean_distance(fingerprint, target_fingerprint) AS distance
FROM inspections
WHERE distance < 0.30
ORDER BY distance
→ Returns: Castings with similar defect patterns
→ Enables: Root cause correlation, pattern-based alerts
```

---

## Plant Intelligence (TIER_3)

### REST API Endpoints

Plant Intelligence (TIER_3 license) provides 25 REST endpoints for advanced analytics:

**Inspection Endpoints (6):**
- `POST /api/inspect` - Submit inspection
- `GET /api/inspect/{id}` - Retrieve inspection record
- `POST /api/validate/{id}` - Operator validation
- `GET /api/history` - Inspection history (filtered by date, decision, etc.)
- `GET /api/statistics` - Aggregate statistics (rejection rate, accuracy, etc.)
- `POST /api/batch` - Batch inspection mode

**Heat Analytics (4):**
- `GET /api/heat/{heat_id}/castings` - All castings from heat
- `GET /api/heat/{heat_id}/quality` - Heat quality summary
- `GET /api/heat/{heat_id}/fingerprint` - Heat-level fingerprint
- `GET /api/heat/compare` - Compare multiple heats

**Mold Analytics (4):**
- `GET /api/mold/{mold_id}/history` - Mold quality history
- `GET /api/mold/{mold_id}/degradation` - Degradation curve
- `GET /api/mold/{mold_id}/fingerprint` - Mold-level fingerprint
- `GET /api/mold/comparison` - Compare multiple molds

**Calibration (3):**
- `GET /api/calibration/status` - Current weights and thresholds
- `POST /api/calibration/run` - Trigger auto-calibration
- `GET /api/calibration/history` - Calibration history

**Fingerprinting (4):**
- `GET /api/fingerprint/{casting_id}` - Get casting fingerprint
- `POST /api/fingerprint/match` - Find similar fingerprints
- `GET /api/fingerprint/cluster` - Cluster analysis
- `GET /api/fingerprint/drift` - Detect pattern drift

**Reasoning (4):**
- `GET /api/reasoning/{inspection_id}` - Detailed reasoning trace
- `GET /api/reasoning/gates` - Gate performance statistics
- `POST /api/reasoning/explain` - Request LLM explanation
- `GET /api/reasoning/validation` - Validation agreement analysis

**Dashboard Data Endpoints:**
- See [Dashboard & Reporting](dashboard_reporting.md) for dashboard-specific endpoints

---

## Performance Considerations

### Processing Overhead

Manufacturing Intelligence adds minimal latency:
- **4-gate reasoning:** Average +150ms (most inspections exit early at Gate 0-1)
- **Fingerprint computation:** +50-100ms (runs in parallel with decision)
- **Traceability logging:** +20-50ms (asynchronous database write)
- **Auto-calibration:** Runs offline (does not impact inspection latency)

**Total overhead:** ~200-300ms typical (7-9% of total inspection time)

### Storage Requirements

**Per Inspection:**
- JSON record: ~5-10 KB
- Original image: ~200-500 KB (JPEG)
- Annotated image: ~300-600 KB (PNG)
- Fingerprint: ~200 bytes (12 floats)

**Typical database growth:**
- 1000 inspections/day → ~700 MB/day (~250 GB/year)
- Archival strategy recommended: compress images after 90 days, purge after 2 years

### Calibration Compute Cost

**Grid search (1260 combinations):**
- Per combination: ~10ms to recompute 50 validation scores
- Total time: 1260 × 10ms = ~12-15 seconds
- Acceptable for weekly offline execution

---

## License Tier Comparison

| Feature | TIER_1 | TIER_2 (Process Intelligence) | TIER_3 (Plant Intelligence) |
|---------|--------|-------------------------------|----------------------------|
| **4-Gate Reasoning** | ✗ (single-stage) | ✓ (Gates 0-2) | ✓ (Gates 0-3, includes LLM) |
| **Auto-Calibration** | ✗ | ✓ | ✓ |
| **Fingerprinting** | ✗ | ✓ | ✓ |
| **Traceability** | Basic (casting-level) | ✓ (heat/mold resolution) | ✓ (full audit trail) |
| **REST API** | ✗ | 10 endpoints | 25 endpoints |
| **Batch Mode** | ✗ | ✓ | ✓ |
| **LLM Reasoning** | ✗ | ✗ | ✓ |
| **Dashboard** | ✗ | 4 tabs | 8 tabs |

---

**Next:** [Dashboard & Reporting](dashboard_reporting.md) — Visualizing intelligence for decision-making

