# Fingerprinting System

## Purpose

Converts defect detections into normalized spatial vectors, clusters them into recurring patterns, and tracks their occurrence across inspections for root cause tracing and process diagnostics.

## Where Used

- **Pipeline Stage**: Stage 7 (Traceability)
- **Entry Point**: `core/fingerprints/vectorizer.py::vectorize_defects()`
- **Called From**: `core/traceability/traceable_record.py` during inspection finalization

---

## System Architecture

```
YOLO Bounding Boxes
    ↓
Alignment (contour → ORB → PCA)
    ↓
Normalization (crop-relative coordinates)
    ↓
Zone Assignment (polygon matching)
    ↓
Vector Creation (12-field normalized vector)
    ↓
DBSCAN Clustering (grouped by defect_type + zone)
    ↓
Similarity Matching (Euclidean distance + region filter)
    ↓
Storage (SQL primary, JSON fallback)
```

---

## Vector Format (v4)

```python
{
    "type": "porosity",           # Defect class
    "x": 0.523,                   # Normalized center x (template-space)
    "y": 0.187,                   # Normalized center y (template-space)
    "zone": "riser_zone",         # Engineering zone (polygon-based)
    "secondary_zone": None,       # Fallback zone if near boundary
    "zone_confidence": 0.95,      # Confidence of zone assignment (0-1)
    "surface": "top",             # "top" | "bottom" | "unknown"
    "width": 0.042,               # Normalized width (0-1)
    "height": 0.038,              # Normalized height (0-1)
    "severity": 0.87,             # Confidence score (0-1)
    "region": "top",              # Spatial label (top/bottom/left/right/center)
    "orientation_angle": 0.0      # PCA angle in degrees (0.0 for aligned)
}
```

**Key Change (v3 → v4):** Coordinates are **crop-relative** (normalized against casting body bbox), not full image.

---

## Alignment Pipeline (3 Methods)

### Method 1: Contour Alignment (PRIMARY)

**File:** `core/fingerprints/contour_alignment.py`

**Process:**
1. Extract casting body contour from inspection image (edge detection)
2. Load reference contour from `customers/castco/reference_parts/{surface}_reference.jpg`
3. Compute affine transform (M) that maps inspection → template space
4. Apply M to all defect bbox centers

**Advantages:**
- Fast (~50-100ms)
- Geometry-based (works on any casting)
- Robust to lighting variations

**Output:**
```python
{
    "success": True,
    "M": affine_matrix_3x3,
    "orientation": "top",
    "match_score": 0.87,
    "template_w": 1280,
    "template_h": 1280
}
```

### Method 2: ORB Template Alignment (FALLBACK 1)

**File:** `core/fingerprints/template_alignment.py`

**Process:**
1. Extract ORB keypoints from inspection image
2. Match against reference template keypoints
3. Estimate homography (H) using RANSAC (≥8 inliers required)

**Disadvantages:**
- Fails on featureless castings
- Slower (~500ms)
- Sensitive to lighting

### Method 3: PCA Orientation (FALLBACK 2)

**File:** `core/fingerprints/orientation.py`

**Process:**
1. Compute principal component axis from image intensity
2. Rotate image to align principal axis vertically
3. Rotate all bbox coordinates by same angle

**Disadvantages:**
- Less accurate (PCA affected by asymmetric defects)
- No true template-space alignment

---

## Coordinate Normalization

**Formula:**
```python
cx = (bbox_center_x - crop_x1) / crop_width
cy = (bbox_center_y - crop_y1) / crop_height
```

**Discard Rule:** If `cx < -0.05` or `cx > 1.05` (or same for `cy`), defect is outside casting body → discard as background noise.

**Why Crop-Relative?**
- Immune to casting placement in frame
- Directly comparable to reference template
- Always lands inside [0, 1] × [0, 1] space

---

## Zone Assignment

**Files:** `core/pipeline/zone_assignment.py` + `core/config/zone_loader.py`

Engineering zones are polygon-based regions tied to casting geometry:

**Example Zones:**
- `riser_zone` — Feeding system (shrinkage defects)
- `gate_zone` — Gating system (turbulence, inclusions)
- `thin_wall` — Thin sections (cold shuts, misruns)
- `heavy_section` — Thick sections (porosity, hot tears)

**Assignment Logic:**
1. Load zone polygons from `configs/zones/{part_type}.yaml`
2. Check if defect (cx, cy) falls inside each polygon
3. If inside multiple zones → return closest centroid + confidence
4. If outside all zones → `"unknown"` + low confidence

---

## Clustering (DBSCAN)

**File:** `core/fingerprints/clustering.py`

**Zone-First Grouping (v3):** Vectors grouped by `(defect_type, zone)` **before** DBSCAN runs. This ensures defects in different engineering zones never merge.

**Configuration:**
```yaml
fingerprints:
  clustering:
    eps: 0.08             # Max distance (8% of image)
    min_samples: 2        # Min defects to form dense cluster
    group_by_type: true   # Separate defect types
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §9 (DBSCAN Clustering)

**Cluster Naming:** `"porosity::riser_zone"`, `"sand_drop::gate_zone"`

**Output:**
```python
{
    "cluster_id": 42,
    "defect_type": "porosity",
    "zone": "riser_zone",
    "center_x": 0.523,
    "center_y": 0.187,
    "density": 7,           # Member count
    "members": [vector1, vector2, ...]
}
```

---

## Similarity Matching

**File:** `core/fingerprints/similarity.py`

**Region-Aware Matching:**

**Filters:**
1. Type filter: `cluster.defect_type == vector.type`
2. Region filter: `cluster.region == vector.region`
3. Distance filter: `euclidean_distance < threshold` (default: 0.05)

**Algorithm:** See `docs/01_overview/technical_reference.md` §9 (Euclidean Distance)

**Why Region-Aware?** Prevents cross-region false positives (top vs. bottom defects).

---

## Storage (Dual-Path)

**File:** `core/fingerprints/indexer.py`

### SQL Storage (Primary)

**Tables:**
- `AI_Defect_Clusters` — Cluster records
- `AI_Cluster_Members` — Links clusters → inspections

**Concurrency:** `find_or_create_cluster()` uses `UPDLOCK + HOLDLOCK` transaction (no duplicates).

### JSON Storage (Fallback)

**Location:** `runtime/fingerprint_index/{part_type}_fingerprints.json`

**Concurrency:** File-level lock (`.castco_index.lock`)

---

## Integration Point

Called from `core/traceability/traceable_record.py`:

```python
# Stage 7: Fingerprint extraction
from core.fingerprints.vectorizer import vectorize_defects
from core.fingerprints.indexer import update_fingerprint_index

vectors = vectorize_defects(state, image_path)
traceable_record.fingerprint_metadata.defect_vectors = vectors

update_fingerprint_index(traceable_record, threshold=0.05)
# → Sets is_recurring flag
# → Sets cluster_ids
```

---

## Configuration

**File:** `customers/castco/configs/parameters.yaml`

```yaml
fingerprints:
  clustering:
    eps: 0.08              # DBSCAN epsilon (normalized distance)
    min_samples: 2         # Minimum cluster size
    group_by_type: true    # Separate defect types

  similarity:
    max_distance: 0.15     # Max distance for match
```

---

## Performance

**Typical Timing:**
- Contour alignment: 50–100ms
- ORB alignment: 400–600ms
- PCA alignment: 80–120ms
- Vectorization: 10–20ms per defect
- Clustering: 5–10ms (10 defects)
- SQL index update: 20–50ms per vector

**Total Overhead:** 100–300ms (contour), 500–800ms (ORB)

---

## Troubleshooting

### All Defects Discarded

**Symptom:** `vectorize_defects()` returns empty list

**Cause:** Defect centers fall outside casting crop

**Fix:** Check YOLO Stage 1 casting detector confidence threshold in `parameters.yaml` → `models.casting_conf`

### No Recurring Patterns Detected

**Symptom:** `is_recurring=False` on every inspection

**Cause:** Coordinate normalization drift or alignment failure

**Fix:**
1. Check alignment method in logs: `[FINGERPRINT] 🟢 Contour alignment OK`
2. If "PCA fallback" → add reference template to `customers/castco/reference_parts/`
3. Increase similarity threshold (0.15 → 0.20)

### Clusters Merge Across Different Zones

**Symptom:** Defects in `riser_zone` and `gate_zone` in same cluster

**Cause:** Zone polygons not loaded or zone assignment failed

**Fix:**
1. Check `configs/zones/{part_type}.yaml` exists
2. Verify polygon format (list of (x, y) tuples in [0, 1] space)
3. Check logs for zone assignment: `zone='riser_zone' conf=0.95`

---

## Related Docs

- **Algorithms:** `docs/01_overview/technical_reference.md` §9
- **Architecture:** `docs/01_overview/architecture.md`
- **Configuration:** `docs/04_configuration/tuning_guide.md`
- **Process Intelligence:** `docs/03_intelligence/plant_intelligence.md`
