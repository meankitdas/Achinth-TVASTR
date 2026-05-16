# Signal System

## Purpose
Signal-grounded defect scoring and classification system that serves as the PRIMARY CLASSIFIER (40% weight) using pure OpenCV signal processing (texture, edge, blob, intensity, geometry).

## Where Used
- **Pipeline Stage**: Stage 2b-2c (Signal Feature Extraction → Signal Classification)
- **Entry Point**: `core/reasoning/signal_scoring.py::classify_defect_from_signals()`
- **Called By**: `core/ui/run_pipeline.py` (after patch inference)

## Related Docs
- **Algorithms**: See `../01_overview/technical_reference.md` §2-4 (Feature Extraction, Scoring, Classification)
- **Patch System**: See `patch_system.md` (patch object structure)
- **Fusion Logic**: See `fusion_logic.md` (how signal score combines with YOLO/LLM)

---

## Architecture Overview

### Signal Processing Flow
```
Patch (256×256 region)
    ↓
[Gated by YOLO prob >= 0.20]
    ↓
Feature Extraction (OpenCV):
    ├─> Texture Features (LBP + GLCM)
    ├─> Edge Features (Canny)
    ├─> Blob Features (SimpleBlobDetector)
    ├─> Intensity Features (Mean, Std, Range)
    └─> Geometry Features (Contour-based)
    ↓
Signal Scoring (weighted aggregation)
    signal_score = 0.25*texture + 0.20*edge + 0.15*blob 
                 + 0.15*intensity + 0.25*geometry
    ↓
Signal Classification (HARD threshold rules)
    → Defect Type + Confidence + Reason
    ↓
Multi-Signal Fusion (40% weight, PRIMARY)
```

### Weight Distribution
| Component | Weight | Role |
|-----------|--------|------|
| Texture | 25% | Porosity, sand detection |
| Geometry | 25% | Crack, moulding error detection |
| Edge | 20% | Crack, boundary detection |
| Blob | 15% | Porosity, inclusion detection |
| Intensity | 15% | Dark cavity detection |

---

## Feature Extraction

### 1. Texture Features
**File**: `core/vision/features/extractor.py`

**Components**:
- **LBP** (Local Binary Patterns): Manual implementation, no sklearn
  - Radius: 1, Points: 8
  - Output: `lbp_uniformity` (histogram uniformity measure)
- **GLCM** (Gray Level Co-occurrence Matrix): Quantized to 32 levels
  - Distance: 1, Angles: [0°, 45°, 90°, 135°]
  - Outputs: `contrast`, `homogeneity`, `energy`, `correlation`

**Preprocessing**:
- CLAHE (Contrast Limited Adaptive Histogram Equalization)
- Gaussian blur (kernel=5, sigma=1.0)

**Scoring** (see `technical_reference.md` §4.1):
```
texture_score = 0.3 * lbp_std + 0.7 * (glcm_contrast * (1 - glcm_homogeneity))
```

**Interpretation**:
- High LBP std → non-uniform texture → defect
- High GLCM contrast + low homogeneity → irregular → defect

---

### 2. Edge Features
**File**: `core/vision/features/extractor.py`

**Algorithm**: Canny edge detection

**Outputs**:
- `edge_density`: % pixels with edges
- `edge_mean`: Mean edge intensity

**Scoring** (see `technical_reference.md` §4.2):
```
edge_score = edge_density
```

**Interpretation**:
- High edge density → defect boundaries (cracks, inclusions)

---

### 3. Blob Features
**File**: `core/vision/features/extractor.py`

**Algorithm**: OpenCV SimpleBlobDetector

**Outputs**:
- `blob_count`: Number of blobs (normalized by dividing by 10.0)
- `blob_mean_size`: Average blob area

**Scoring** (see `technical_reference.md` §4.3):
```
blob_score = 0.6 * (blob_count / 10.0) + 0.4 * blob_mean_size
```

**Interpretation**:
- More/larger blobs → defect regions (porosity, inclusions)

---

### 4. Intensity Features
**File**: `core/vision/features/extractor.py`

**Outputs**:
- `intensity_mean`: Average brightness [0, 1]
- `intensity_std`: Brightness variation [0, 1]
- `intensity_range`: max - min [0, 1]

**Scoring** (see `technical_reference.md` §4.4):
```
intensity_score = (1 - intensity_mean) + intensity_std
```

**Interpretation**:
- Darker regions (low mean) → cavities/inclusions
- High variation (high std) → defects

---

### 5. Geometry Features
**File**: `core/vision/features/geometry.py`

**Algorithm**: Contour-based shape analysis

**Preprocessing**:
- Otsu thresholding
- Morphological cleanup (erosion + dilation)

**Outputs**:
- `area`: Contour area [0, 1]
- `perimeter`: Contour perimeter [0, 1]
- `circularity`: 4πA / P²
- `solidity`: area / convex_hull_area
- `aspect_ratio`: width / height (normalized by dividing by 5.0)
- `irregularity`: 1 - circularity

**Scoring** (see `technical_reference.md` §4.5):
```
geometry_score = 0.3 * irregularity + 0.3 * (1 - solidity) 
               + 0.2 * area + 0.2 * (aspect_ratio / 5.0)
```

**Interpretation**:
- Irregular shapes (low circularity) → defects
- Large area/perimeter → significant defects
- Low solidity (concave) → cracks, moulding errors

---

### 6. Flow Features
**File**: `core/vision/features/flow.py`

**Algorithm**: Directional gradient analysis for flow-pattern defects

**Purpose**: Detect directional defects (pouring_temperature_delay, cold shut) that exhibit elongated flow patterns but lack strong cavity/blob/edge signals.

**Image-Level Computation** (computed ONCE per image):
- Sobel gradients (gx, gy) → magnitude + angle arrays
- Direction consistency via circular variance
- Hough line detection for elongated patterns

**Outputs**:
- `direction_consistency`: Circular variance [0, 1] — higher = more aligned gradients
- `line_count`: Number of detected Hough lines (minLineLength=40, maxLineGap=10)
- `flow_score`: Composite score [0, 1] — flow pattern strength

**Flow Score Calculation**:
```python
flow_score = 0.0
if direction_consistency > 0.6:
    flow_score += 0.5
if line_count >= 2:
    flow_score += 0.5
# Result: 0.0, 0.5, or 1.0
```

**Patch-Level Extraction**:
- Extract per-patch flow from pre-computed image-level arrays (no duplicate Sobel computation)
- Use 70th percentile threshold to filter weak gradients
- Aggregate direction consistency and line count within patch bbox

**Interpretation**:
- High direction consistency (>0.6) → aligned flow pattern
- Line count ≥ 2 → elongated directional defect
- Flow score = 1.0 → strong directional defect (pouring_temperature_delay, cold shut)
- Flow score = 0.0 → no directional pattern

**Usage in Classification**:
Flow features are used by `hypothesis_builder.py` with strict multi-signal gating:
```python
if (flow_score > 0.6 and cavity_count < 3 and 
    blob_count < 3 and edge_density < 0.15):
    # Trigger pouring_temperature_delay
```

This ensures flow detection only activates when:
- Strong directional pattern exists
- Weak cavity signal (incomplete fills don't create many cavities)
- Not porosity (blob_count < 3)
- Not crack/edge defect (edge_density < 0.15)

---

## Signal Classification (PRIMARY Classifier)

### Classification Rules
**File**: `core/reasoning/signal_scoring.py::classify_defect_from_signals()`

**Method**: HARD boolean threshold rules (deterministic, no ML training)

Each defect requires **2 STRONG conditions + 1 supporting condition**:

| Defect | STRONG #1 | STRONG #2 | Supporting |
|--------|-----------|-----------|------------|
| **Porosity** | `blob_count > 0.5` | `glcm_contrast > 0.4` | `0.4 ≤ circularity ≤ 0.85` |
| **Crack** | `edge_density > 0.5` | `aspect_ratio_norm > 0.4` | `circularity < 0.4` |
| **Sand Inclusion** | `blob_count > 0.4` | `solidity < 0.6` | `lbp_std > 0.4` |
| **Slag Inclusion** | `intensity_std > 0.5` | `blob_count > 0.3` | `edge_mean < 0.5` |
| **Moulding Error** | `irregularity > 0.6` | `solidity < 0.5` | `area > 0.4` |
| **Sand Drop** | `blob_count < 0.3` | `intensity_range > 0.5` | `0.3 < edge_density < 0.7` |

### Scoring Logic
- **1.0**: Both STRONG conditions pass
- **0.7**: 1 STRONG + supporting condition pass
- **0.0**: No match

### Signal Strength Gate
Classification uses **max(texture_score, edge_score, geometry_score)** for signal strength:
- If `signal_strength < 0.3` → return "unknown" (low signal)
- Allows any single strong channel to trigger detection

### Uncertainty Reasoning
Returns a `"reason"` field for explainability:
- `"no_features"` — No features extracted
- `"low_signal"` — Signal strength < 0.3
- `"conflicting_signals"` — Top 2 rule scores within 0.2 (ambiguous)
- `"clear_match"` — Confident classification

### Output Format
```python
{
    "defect_type": "porosity",  # or "unknown"
    "confidence": 1.0,           # 0.0, 0.7, or 1.0
    "signal_strength": 0.65,
    "rule_scores": {
        "porosity": 1.0,
        "crack": 0.0,
        "sand_inclusion": 0.7,
        ...
    },
    "reason": "clear_match"
}
```

---

## Patch Aggregation

### Weighted Voting
**File**: `core/reasoning/signal_scoring.py::aggregate_patch_classifications()`

**Algorithm**:
1. Filter patches: `confidence > 0.4` AND `reason != "low_signal"`
2. Weight each patch by: `patch_weight = confidence * yolo_prob`
3. Accumulate weighted votes per defect type
4. Return type with highest weighted vote

**Example**:
```python
Patch 1: porosity (conf=1.0, yolo=0.8) → weight=0.8
Patch 2: porosity (conf=0.7, yolo=0.6) → weight=0.42
Patch 3: crack (conf=1.0, yolo=0.5) → weight=0.5

Vote distribution:
  porosity: 1.22 (winner)
  crack: 0.5
```

---

## Configuration

```yaml
# customers/castco/configs/parameters.yaml

signal_features:
  # Gating
  feature_gate_threshold: 0.20   # Only extract if YOLO prob >= this
  
  # LBP parameters
  lbp_radius: 1
  lbp_points: 8
  
  # GLCM parameters
  glcm_levels: 32
  glcm_distance: 1
  
  # Preprocessing
  clahe_clip_limit: 2.0
  clahe_tile_size: 8
  gaussian_kernel: 5
  gaussian_sigma: 1.0
  
  # Morphology
  morph_kernel_size: 5
  morph_iterations: 2

signal_scoring:
  # Category weights (sum to 1.0)
  texture_weight: 0.25
  edge_weight: 0.20
  blob_weight: 0.15
  intensity_weight: 0.15
  geometry_weight: 0.25
  
  # Sub-weights for texture
  texture_lbp_weight: 0.3
  texture_glcm_weight: 0.7
  
  # Sub-weights for blob
  blob_count_weight: 0.6
  blob_size_weight: 0.4
```

---

## Performance

### Timing (per 256×256 patch)
- **LBP + GLCM**: ~15ms
- **Edge detection**: ~5ms
- **Blob detection**: ~10ms
- **Geometry**: ~8ms
- **Total**: ~38ms per patch

**With Gating** (threshold=0.20):
- ~70% of patches skipped
- Effective cost: ~11ms per patch average

### Memory
- **Feature dict**: ~2KB per patch
- **15-dim vector**: 120 bytes per patch

---

## Troubleshooting

### Features not extracted
**Symptom**: `signal_features` missing from patch objects

**Checks**:
1. YOLO prob >= feature_gate_threshold?
2. OpenCV installed? (`import cv2`)
3. Check logs for `[SignalFeatures]` warnings

### Low signal_scores or always "unknown"
**Symptom**: All patches classified as "unknown"

**Tune**:
- Increase weights for dominant feature category
- Adjust preprocessing (CLAHE, blur) parameters
- Lower feature_gate_threshold (0.20 → 0.15)
- Check signal_strength threshold (default 0.3)

### Wrong defect classifications
**Symptom**: Misclassifications (e.g., calling cracks "porosity")

**Debug**:
1. Enable DEBUG logging to see top-3 rule scores
2. Check feature normalization (blob_count, aspect_ratio)
3. Verify feature extraction quality with visualization
4. Adjust HARD threshold values if domain knowledge suggests

### High inference latency
**Symptom**: Slow processing (>1s per image)

**Optimize**:
- Increase feature_gate_threshold (0.20 → 0.30)
- Reduce GLCM quantization levels (32 → 16)
- Disable for batch processing if not needed

---

## Usage Example

```python
from core.vision.casting.inference import run_patch_inference
from core.reasoning.signal_scoring import classify_defect_from_signals, aggregate_patch_classifications

# Run patch inference with feature extraction
result = run_patch_inference(
    "casting_image.jpg",
    enable_feature_extraction=True,
    config=config
)

# Classify each patch
patch_classifications = []
for patch in result["patches"]:
    if "signal_features" in patch:
        classification = classify_defect_from_signals(
            patch["signal_features"],
            geometry=patch.get("signal_geometry")
        )
        patch_classifications.append(classification)
        print(f"Patch classified as {classification['defect_type']} "
              f"(conf={classification['confidence']:.2f}, "
              f"reason={classification['reason']})")

# Aggregate patch classifications
aggregated = aggregate_patch_classifications(
    patch_results=patch_classifications,
    patches=result["patches"]
)

print(f"\nFinal defect type: {aggregated['defect_type']}")
print(f"Aggregate confidence: {aggregated['confidence']:.3f}")
print(f"Patches used: {aggregated['num_patches_used']}/{len(result['patches'])}")
print(f"Vote distribution: {aggregated['vote_distribution']}")
```

---

## Testing

### Unit Tests
```bash
# Test feature extraction
python -m pytest tests/vision/test_feature_extraction.py

# Test signal scoring
python -m pytest tests/reasoning/test_signal_scoring.py

# Test classification rules
python -m pytest tests/reasoning/test_signal_classification.py
```

### Validation
```bash
# Verify features extracted
python -c "from core.vision.casting.inference import run_patch_inference; \
  result = run_patch_inference('test.jpg', enable_feature_extraction=True); \
  assert any('signal_features' in p for p in result['patches']), 'No features'"

# Check classification
python -c "from core.reasoning.signal_scoring import classify_defect_from_signals; \
  features = {'texture': {...}, 'edge': {...}}; \
  result = classify_defect_from_signals(features); \
  assert 'defect_type' in result, 'Missing defect_type'"
```

---

## See Also
- **Algorithms**: `../01_overview/technical_reference.md` §2-4 (Feature extraction formulas)
- **Patch System**: `patch_system.md` (patch generation)
- **Anomaly System**: `anomaly_system.md` (uses signal features)
- **Fusion Logic**: `fusion_logic.md` (combines signal with YOLO/LLM)
- **Implementation Doc**: `docs/signal_scoring_implementation.md` (full technical details)
