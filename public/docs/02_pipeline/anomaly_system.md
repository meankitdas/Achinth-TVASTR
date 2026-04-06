# Anomaly System

## Purpose
Signal-first anomaly detection that demotes YOLO from primary classifier (100%) to weak hint (30%) and promotes feature-based anomaly to primary signal (70%).

## Where Used
- **Pipeline Stage**: Stage 2 (between patch inference and signal classification)
- **Entry Point**: `core/vision/patch_anomaly.py::run_anomaly_pipeline()`
- **Called By**: `core/ui/run_pipeline.py` (injected after `run_patch_inference`)

## Related Docs
- **Algorithms**: See `../01_overview/technical_reference.md` §5 (Anomaly Detection)
- **Patch Structure**: See `patch_system.md` (patch object format)
- **Full Pipeline**: See `full_pipeline.md` (Stage 2 context)

---

## Architecture Overview

### Signal Flow
```
Patches with Features (from patch_system)
    ↓
Feature Vectorization (15-dim normalized)
    ↓
Anomaly Detection:
    ├─> Global Anomaly (z-score, 60% weight)
    ├─> Local Anomaly (spatial neighbors, 40% weight)
    └─> YOLO Hint (entropy-based, 30% weight)
    ↓
Final Anomaly = 0.7 * feature_anomaly + 0.3 * yolo_hint
    ↓
Adaptive Threshold (mu + k*sigma, capped at P90)
    ↓
Patch Filtering (high-anomaly patches only)
```

### Weight Distribution
| Component | Weight | Role |
|-----------|--------|------|
| **Feature Anomaly** | **70%** | PRIMARY signal |
| YOLO Hint | 30% | DEMOTED to weak signal |
| Global Z-Score | 60% of feature | Population-level deviation |
| Local Spatial | 40% of feature | Neighborhood consistency |

---

## Components

### 1. Feature Vectorization
**File**: `core/vision/feature_vector.py`

**Purpose**: Converts nested feature dicts into flat 15-dimensional normalized vectors.

**Features Extracted** (see `technical_reference.md` §2-3 for formulas):
- **Texture** (5): lbp_uniformity, glcm_contrast, glcm_homogeneity, glcm_energy, glcm_correlation
- **Edges** (1): edge_density
- **Blobs** (2): blob_count, blob_mean_size
- **Intensity** (2): intensity_mean, intensity_std
- **Geometry** (5): area, perimeter, circularity, solidity, aspect_ratio

**Normalization**:
- All values clamped to [0, 1]
- NaN/inf → 0.0 fallback
- Safe normalization with finite checks

**Usage**:
```python
from core.vision.feature_vector import build_feature_vector

vector = build_feature_vector(
    features=patch["signal_features"],
    geometry=patch["signal_geometry"]
)
# Returns: np.ndarray[15] with values in [0, 1]
```

---

### 2. Global Anomaly Detection
**File**: `core/vision/patch_anomaly.py::compute_global_anomaly()`

**Purpose**: Detect patches that deviate from population-level feature distribution.

**Algorithm** (see `technical_reference.md` §5.1):
- Compute z-scores for each feature dimension
- Clip z-scores to [-3, 3] (outlier protection)
- Normalize to [0, 1] range
- Average across dimensions

**Safety**:
- eps=1e-6 for safe division
- Always returns value in [0, 1]

**Weight**: 60% of feature anomaly

---

### 3. Local Anomaly Detection
**File**: `core/vision/patch_anomaly.py::compute_local_anomaly()`

**Purpose**: Detect patches inconsistent with spatial neighbors (edge/boundary detection).

**Algorithm** (see `technical_reference.md` §5.2):
- Map patch to grid position (row, col)
- Find 4 or 8-connected neighbors
- Compute mean absolute deviation from neighbors
- Normalize to [0, 1]

**Safety**:
- Skipped if < 10 patches (insufficient data)
- Bounds checking for neighbor mapping
- Always returns value in [0, 1]

**Weight**: 40% of feature anomaly

**Connectivity**:
- **4-connected**: N, S, E, W neighbors
- **8-connected**: Includes diagonals (default)

---

### 4. YOLO Hint (Entropy-Based)
**File**: `core/vision/patch_anomaly.py::compute_yolo_hint()`

**Purpose**: Use YOLO uncertainty as weak anomaly signal (replaces raw probability).

**Algorithm** (see `technical_reference.md` §5.3):
- Compute entropy of YOLO probability distribution
- Normalize to [0, 1] (higher entropy = more uncertain = more anomalous)
- Clip to valid range

**Safety**:
- eps=1e-8 for log safety
- Handles single-class predictions (entropy=0)
- Always returns value in [0, 1]

**Weight**: 30% of final anomaly (DEMOTED from 100%)

---

### 5. Final Anomaly Score
**Formula** (see `technical_reference.md` §5.4):
```
feature_anomaly = 0.6 * global_anomaly + 0.4 * local_anomaly
final_anomaly = 0.7 * feature_anomaly + 0.3 * yolo_hint
```

**Range**: [0, 1] where 1 = maximum anomaly

**Interpretation**:
- 0.0-0.3: Normal/background
- 0.3-0.6: Suspicious
- 0.6-0.8: Anomalous
- 0.8-1.0: Highly anomalous

---

### 6. Adaptive Thresholding
**File**: `core/vision/patch_anomaly.py::run_anomaly_pipeline()`

**Formula** (see `technical_reference.md` §5.5):
```
threshold = min(mu + k*sigma, percentile(anomalies, P90))
```

**Purpose**: Automatically adapt threshold to image characteristics.

**Parameters**:
- `k`: Sensitivity factor (default 2.0)
- `P90`: Percentile cap (prevents runaway thresholds)

**Tuning**:
- Lower `k` (1.5) → More sensitive (catch more defects)
- Higher `k` (2.5) → Less sensitive (reduce false positives)

---

### 7. Patch Filtering
**File**: `core/vision/patch_filter.py`

**Methods**:
1. **Threshold-based**: Keep patches where `final_anomaly > threshold`
2. **Top-K**: Keep K highest-anomaly patches

**Usage**:
```python
from core.vision.patch_filter import filter_patches, filter_patches_top_k

# Threshold filtering
filtered = filter_patches(patches, threshold)

# Top-K filtering
top_patches = filter_patches_top_k(patches, k=10)
```

**Typical Results**:
- Input: 36 patches
- After filtering: 8-12 patches (22-33%)

---

## Pipeline Integration

### Injection Point
**File**: `core/ui/run_pipeline.py` (lines 261-322)

**Flow**:
```python
# Run patch inference
inference_result = run_patch_inference(image_path)
patches = inference_result.get("patches", [])

# ═══ ANOMALY PIPELINE (NEW) ═══
try:
    # Build feature vectors
    feature_vectors = [
        build_feature_vector(p["signal_features"], p["signal_geometry"])
        if "signal_features" in p else None
        for p in patches
    ]
    
    # Run anomaly detection
    patches_with_anomaly, threshold = run_anomaly_pipeline(
        patches=patches,
        vectors=feature_vectors,
        rows=6, cols=6,  # Grid dimensions
        config=anomaly_cfg
    )
    
    # Update patches
    inference_result["patches"] = patches_with_anomaly
    
    # Filter high-anomaly patches
    filtered = filter_patches(patches_with_anomaly, threshold)
    
    logger.info(f"[ANOMALY] Processed {len(patches)} → {len(filtered)} anomalies")
    
except Exception as e:
    # SAFE FALLBACK - continue with original patches
    logger.warning(f"[ANOMALY] Pipeline failed (non-fatal): {e}")
# ═══════════════════════════════
```

**Safety**: Entire block wrapped in try/except, never breaks existing flow.

---

## Configuration

```yaml
# customers/castco/configs/parameters.yaml

patch_anomaly:
  # Fusion weights (sum to 1.0)
  feature_weight: 0.70      # Feature anomaly (PRIMARY)
  yolo_weight: 0.30         # YOLO hint (DEMOTED)
  
  # Feature anomaly composition
  global_weight: 0.60       # Global z-score weight
  local_weight: 0.40        # Local spatial weight
  
  # Adaptive threshold
  threshold_method: "adaptive"
  threshold_k: 2.0          # mu + k*sigma
  percentile_cap: 90        # Cap at P90
  
  # Safety gates
  min_patches_local: 10     # Skip local if fewer
  z_score_clip: 3.0         # Clip z-scores
  eps: 1.0e-6               # Safe division epsilon
  
  # Neighbor connectivity
  neighbor_type: "8-connected"  # or "4-connected"
  
  # Debug
  debug: false
```

---

## Tuning Guide

### Adjust Sensitivity

**More Sensitive** (catch more defects, may increase false positives):
```yaml
patch_anomaly:
  threshold_k: 1.5        # Lower k = lower threshold
  percentile_cap: 85      # Lower percentile cap
```

**Less Sensitive** (reduce false positives, may miss subtle defects):
```yaml
patch_anomaly:
  threshold_k: 2.5        # Higher k = higher threshold
  percentile_cap: 95      # Higher percentile cap
```

### Adjust Signal Balance

**Trust features more** (recommended for textured defects):
```yaml
patch_anomaly:
  feature_weight: 0.80    # Increase feature weight
  yolo_weight: 0.20       # Decrease YOLO weight
```

**Trust YOLO more** (recommended for clean surfaces):
```yaml
patch_anomaly:
  feature_weight: 0.60    # Decrease feature weight
  yolo_weight: 0.40       # Increase YOLO weight
```

### Adjust Spatial Context

**More global** (population-level anomaly detection):
```yaml
patch_anomaly:
  global_weight: 0.80     # Focus on global deviation
  local_weight: 0.20      # Reduce local influence
```

**More local** (neighborhood consistency detection):
```yaml
patch_anomaly:
  global_weight: 0.40     # Reduce global influence
  local_weight: 0.60      # Focus on local neighbors
```

---

## Monitoring

### Key Metrics
Track these in production:
- **Anomaly Rate**: `anomalies / total_patches` (expect 20-40% for defective castings)
- **Threshold Stability**: Monitor `anomaly_threshold` over time (should be ~0.6-0.7)
- **Feature Coverage**: % patches with `feature_vector != None` (should be >80%)

### Log Messages

**Success**:
```
[ANOMALY] Processed 36 patches → 12 anomalies (threshold=0.634)
```

**Partial Failure** (feature extraction failed for some patches):
```
[ANOMALY] Vector build failed for patch (2,3): <error>
```

**Complete Failure** (entire pipeline failed):
```
[ANOMALY] Anomaly pipeline failed (non-fatal): <error>
```

---

## Rollback Options

### Option 1: Config-Based Disable (Recommended)
Set YOLO weight to 100%:
```yaml
patch_anomaly:
  feature_weight: 0.00    # Disable feature anomaly
  yolo_weight: 1.00       # Use YOLO only
```

### Option 2: Feature Gate Disable
Prevent feature extraction:
```yaml
signal_features:
  feature_gate_threshold: 1.01  # Impossible threshold
```

### Option 3: Code Comment (Nuclear Option)
Comment out the anomaly pipeline block in `run_pipeline.py` (lines 263-322).

---

## Performance

### Latency
- **Feature Vector Construction**: ~1ms per patch with features
- **Anomaly Computation**: ~5ms for 36 patches
- **Total Overhead**: ~10-15ms per image (negligible vs 200-750ms patch inference)

### Memory
- **Per Patch**: +200 bytes (new fields in dict)
- **Total**: ~7KB for 36 patches (negligible)

---

## Troubleshooting

### All patches filtered out (0 anomalies)
**Fix**: Lower `threshold_k` in config or check if feature extraction is working.

### Too many false positives
**Fix**: Increase `threshold_k` or reduce `feature_weight`.

### Import errors
**Fix**: Ensure Python path includes project root. Run from project directory.

### KeyError: 'patch_anomaly'
**Fix**: Config not loaded. Verify `parameters.yaml` has `patch_anomaly:` section.

---

## See Also
- **Algorithms**: `../01_overview/technical_reference.md` §5 (Anomaly Detection formulas)
- **Patch System**: `patch_system.md` (patch generation and structure)
- **Signal System**: `signal_system.md` (feature extraction details)
- **Implementation Doc**: `docs/anomaly_system_implementation.md` (full technical details)
