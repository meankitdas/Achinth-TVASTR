# Patch System

## Purpose
Generates fixed-size patches from casting images using a sliding window approach for patch-level defect classification.

## Where Used
- **Pipeline Stage**: Stage 2 (Patch Classification)
- **Entry Point**: `core/vision/casting/inference.py::run_patch_inference()`
- **Called By**: `core/ui/run_pipeline.py` (main pipeline orchestrator)

## Related Docs
- **Algorithms**: See `../01_overview/technical_reference.md` §1 (ML Models)
- **Anomaly System**: See `anomaly_system.md` (uses patch structure)
- **Full Pipeline**: See `full_pipeline.md` (Stage 2 context)

---

## System Architecture

### Sliding Window Parameters
```python
RESIZE = 960    # Input image resized to 960×960
PSIZ = 256      # Patch size (256×256 pixels)
STRIDE = 128    # Stride (50% overlap)
```

**Grid Dimensions**: 6×6 = 36 patches per image
- Row/Col positions: (0,0) to (5,5)
- Pixel coordinates: (x, y, w, h) in resized image space

### Processing Flow
```
Input Image
    ↓
Resize to 960×960
    ↓
Sliding Window (256×256, stride=128)
    → Generates 36 patches
    ↓
YOLO Patch Classifier (model: best.pt)
    → Returns probability distribution
    ↓
Overlap-Tile Fusion (average overlapping pixels)
    → Refined probabilities
    ↓
Calibration (optional, per-part adjustment)
    ↓
Patch Object Construction
    ↓
Return patches + metadata
```

---

## Patch Object Structure

Each patch is represented as a dictionary with the following fields:

### Core Fields (Always Present)
```python
{
    "x": int,              # Left coordinate in 960×960 space
    "y": int,              # Top coordinate in 960×960 space
    "w": 256,              # Width (fixed)
    "h": 256,              # Height (fixed)
    "row": int,            # Grid row (0-5)
    "col": int,            # Grid column (0-5)
    "prob": float,         # Defect probability [0,1]
    "defect_prob": float,  # Alias for compatibility
}
```

### YOLO Outputs (Added for Anomaly Hint)
```python
{
    "yolo_probs": List[float],   # Full probability distribution
    "yolo_max_prob": float,       # Max probability
    "yolo_class": str,            # Predicted class name
}
```

### Signal Features (Populated if extracted)
```python
{
    "signal_features": {
        "texture": {...},         # LBP + GLCM features
        "edge": {...},            # Edge density, mean
        "blob": {...},            # Blob count, mean size
        "intensity": {...},       # Mean, std, range
    },
    "signal_geometry": {          # Contour-based geometry
        "area": float,
        "perimeter": float,
        "circularity": float,
        "solidity": float,
        "aspect_ratio": float,
    }
}
```

### Anomaly System Fields (Populated by Pipeline)
```python
{
    "feature_vector": List[float] | None,   # 15-dim normalized vector
    "feature_anomaly": float | None,        # Global+Local anomaly [0,1]
    "yolo_hint": float | None,              # Entropy-based hint [0,1]
    "final_anomaly": float | None,          # 0.7*feature + 0.3*yolo
}
```

### Signal Classification Fields (PRIMARY Classifier)
```python
{
    "signal_class": str | None,             # Classified defect type
    "signal_confidence": float | None,      # Classification confidence
    "signal_reason": str | None,            # Explanation (low_signal, clear_match, etc.)
}
```

---

## Patch Generation Details

### Model Loading
- **Model Paths**: Searches in order:
  1. `runs/classify/castco_patch_classifier_v3/weights/best.pt`
  2. `runs/classify/castco_patch_classifier_v2/weights/best.pt`
  3. `customers/castco/models/patch_classifier.pt`
- **Caching**: Model loaded once and cached globally
- **Reset**: `reset_model_cache()` forces reload

### Overlap-Tile Fusion (FIX #1)
**Problem**: 75% overlap means each pixel covered by up to 4 patches with different predictions.

**Solution**: Weighted averaging
1. Create 960×960 heatmap
2. For each patch prediction, paint probabilities onto heatmap (weighted by overlap count)
3. Average overlapping pixels
4. Read back refined probabilities at each patch center

**Impact**: ±5-10% probability adjustment for overlapping regions

### Calibration (Optional)
**Purpose**: Per-part bias correction (e.g., adjust thresholds for specific part types)

**Application**:
```python
calibrated_prob = apply_calibration(
    raw_prob, 
    part_type="201044", 
    calibration_map=config["calibration"]
)
```

**Storage**: `runtime/calibration/patch_calibration.json`

---

## Patch Filtering

### Feature Extraction Gate
Only extract signal features if `prob >= feature_gate_threshold` (default 0.20):
```python
if patch["prob"] >= 0.20:
    extract_signal_features(patch)  # ~38ms per patch
else:
    skip  # Saves ~70% compute
```

### Anomaly Filtering
After anomaly detection, filter patches:
```python
threshold = mu + k*sigma  # Adaptive threshold
high_anomaly_patches = [p for p in patches if p["final_anomaly"] > threshold]
```

**Typical Rates**:
- Input: 36 patches
- After feature gate: ~12 patches (33%)
- After anomaly filter: ~8 patches (22%)

### Classification Filtering
Before final decision, skip low-quality patches:
```python
valid_patches = [
    p for p in patches 
    if p.get("signal_confidence", 0.0) > 0.4 
    and p.get("signal_reason") != "low_signal"
]
```

---

## Performance Characteristics

### Timing (per image)
- **Patch generation**: ~5ms (grid computation)
- **YOLO inference**: 200-750ms (36 patches, batch=8)
- **Overlap fusion**: ~15ms
- **Total**: 220-770ms

### Memory
- **Per patch**: ~500 bytes (dict overhead)
- **36 patches**: ~18KB
- **With features**: ~200KB (feature arrays)

---

## Configuration

```yaml
# customers/castco/configs/parameters.yaml

models:
  patch_resize: 960        # Input resize dimension
  patch_size: 256          # Patch dimensions
  patch_stride: 128        # Stride (50% overlap)

signal_features:
  feature_gate_threshold: 0.20   # Min YOLO prob for feature extraction

patch_anomaly:
  threshold_method: "adaptive"   # Anomaly filtering method
  threshold_k: 2.0               # mu + k*sigma
```

---

## Error Handling

### Model Not Found
**Error**: `FileNotFoundError: Patch classifier not found`

**Fix**: Train model first:
```bash
python vision/train_patch_classifier.py
```

### Import Errors
**Error**: `ModuleNotFoundError: No module named 'ultralytics'`

**Fix**: Install YOLO:
```bash
pip install ultralytics
```

### Memory Issues
**Error**: OOM during batch inference

**Tune**: Reduce batch size in model config

---

## Usage Example

```python
from core.vision.casting.inference import run_patch_inference

# Run patch inference
result = run_patch_inference(
    image_path="casting.jpg",
    enable_feature_extraction=True,  # Enable signal features
    config=config
)

# Access patches
patches = result["patches"]  # List[Dict]
print(f"Generated {len(patches)} patches")

# Iterate patches
for patch in patches:
    print(f"Patch ({patch['row']}, {patch['col']}): prob={patch['prob']:.3f}")
    
    if "signal_features" in patch:
        print(f"  Signal features extracted: {len(patch['signal_features'])} categories")
    
    if "final_anomaly" in patch:
        print(f"  Anomaly score: {patch['final_anomaly']:.3f}")
```

---

## Testing

### Unit Tests
```bash
# Test patch generation
python -m pytest tests/vision/test_patch_generation.py

# Test overlap fusion
python -m pytest tests/vision/test_overlap_fusion.py
```

### Validation
```bash
# Verify patch count
python -c "from core.vision.casting.inference import run_patch_inference; \
  result = run_patch_inference('test.jpg'); \
  assert len(result['patches']) == 36, 'Expected 36 patches'"

# Check patch structure
python -c "from core.vision.casting.inference import run_patch_inference; \
  result = run_patch_inference('test.jpg'); \
  p = result['patches'][0]; \
  assert all(k in p for k in ['x', 'y', 'w', 'h', 'prob']), 'Missing core fields'"
```

---

## See Also
- **Anomaly Detection**: `anomaly_system.md` (uses patch structure)
- **Signal Classification**: `signal_system.md` (processes patch features)
- **Fusion Logic**: `fusion_logic.md` (aggregates patch predictions)
- **Algorithms Reference**: `../01_overview/technical_reference.md` §1
