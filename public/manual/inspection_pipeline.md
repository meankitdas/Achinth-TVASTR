# Inspection Pipeline

> **Technical Reference: Multi-Stage Defect Detection Architecture**

---

## Pipeline Architecture

TvastrRAS processes casting images through an 8-stage pipeline (stages 0-7) that combines computer vision, anomaly detection, and multi-signal fusion to produce ACCEPT / REJECT / MANUAL_REVIEW decisions.

### Pipeline Stages

**Stage 0: Image Preprocessing**
- Resize images to standardized 960px dimensions
- Normalize brightness and contrast
- Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
- Extract EXIF metadata (timestamp, camera settings)

**Stage 1: Patch Extraction**
- Sliding window: 256×256 pixels per patch
- Grid layout: 6×6 grid (36 patches per image)
- Overlap: 50% between adjacent patches
- Each patch tagged with spatial coordinates (grid position)

**Stage 2: YOLO Defect Detection**
- Run YOLOv8 model on each patch
- Detect 6 defect classes: porosity, shrinkage, crack, sand inclusion, surface roughness, blow hole
- Output: bounding boxes, confidence scores (0.0-1.0), defect classes
- NMS (Non-Maximum Suppression) to remove duplicate detections

**Stage 3: Anomaly Detection**
- Feature extraction: 70% weight on signal features (LBP, GLCM, edge density)
- YOLO hint: 30% weight on YOLO confidence scores
- Adaptive thresholding: Compare against rolling baseline of normal production
- Output: anomaly score per patch (0.0-1.0)

**Stage 4: Signal Feature Extraction**
- Extract 15-dimensional feature vectors per patch:
  - **Texture features:** Local Binary Patterns (LBP), Gray Level Co-occurrence Matrix (GLCM)
  - **Edge features:** Canny edge density, gradient magnitude histograms
  - **Blob features:** Connected component analysis, blob count/size distribution
  - **Geometric features:** Circularity, aspect ratio, solidity
  - **Intensity features:** Mean, standard deviation, histogram statistics

**Stage 5: Signal Scoring**
- Weight and combine signal features:
  - Texture: 25%
  - Geometry: 25%
  - Edge: 20%
  - Blob: 15%
  - Intensity: 15%
- Apply HARD threshold classification rules:
  - IF texture_score > 0.8 AND blob_count > 10 → HIGH_RISK
  - IF edge_density < 0.2 AND circularity > 0.9 → CLEAN
  - IF geometry_score > 0.7 → MANUAL_REVIEW
- Output: per-patch signal score (0.0-1.0)

**Stage 6: Multi-Signal Fusion**
- Combine scores using weighted formula:
  ```
  Final_Score = (Signal × 0.40) + (YOLO × 0.20) + (LLM × 0.20) + (Agreement × 0.20)
  ```
- Agreement adjustment:
  - IF all signals agree (within 0.15 range) → multiply by 1.1 (boost confidence)
  - IF signals conflict (range > 0.50) → multiply by 0.85 (penalize disagreement)

**Stage 7: Decision Logic**
- Threshold-based classification:
  - Final_Score ≥ 0.70 → REJECT
  - Final_Score ≤ 0.30 → ACCEPT
  - 0.30 < Final_Score < 0.70 → MANUAL_REVIEW
- Generate annotated images with bounding boxes
- Compile evidence package (scores, reasoning, traceability)

**Performance:** 2.5-5 seconds per casting (average 3.5s)

---

## Patch System Details

### Sliding Window Implementation

The patch system divides the 960px resized image into overlapping regions:

**Grid Specification:**
- Patch size: 256×256 pixels
- Grid dimensions: 6×6 (36 patches total)
- Horizontal stride: 128px (50% overlap)
- Vertical stride: 128px (50% overlap)
- Total coverage: Full image with redundant defect detection

### Patch Coordinate System

Each patch is identified by:
- Grid position: (row, col) from (0,0) to (5,5)
- Pixel coordinates: (x_min, y_min, x_max, y_max)
- Center point: (x_center, y_center)
- Zone label: gate, riser, body, edge (if zone mapping enabled)

**Example patch (row=2, col=3):**
- x_min = 3 × 128 = 384px
- y_min = 2 × 128 = 256px
- x_max = 384 + 256 = 640px
- y_max = 256 + 256 = 512px
- center = (512px, 384px)

### Overlap Strategy

50% overlap ensures:
- No defect falls entirely in patch boundary regions
- Multiple patches capture same defect for consensus voting
- Reduces edge effect artifacts in AI detection

---

## Anomaly Detection System

### Hybrid Anomaly Scoring

The anomaly system uses a weighted combination:

**Formula:**
```
Anomaly_Score = (Feature_Distance × 0.70) + (YOLO_Hint × 0.30)
```

**Feature_Distance (70% weight):**
- Extract signal features: LBP, GLCM, edge density, blob detection, geometry
- Compute Mahalanobis distance from normal production baseline
- Normalize to 0.0-1.0 range using adaptive thresholding

**YOLO_Hint (30% weight):**
- Use YOLO confidence scores as anomaly hint
- High YOLO confidence on known defects → higher anomaly score
- Helps distinguish "unusual normal" from "unusual defective"

### Adaptive Baseline

The system maintains a rolling baseline of normal production:
- Store feature statistics (mean, covariance) for ACCEPT castings
- Update baseline using Welford's algorithm (online mean/variance)
- Decay factor: 0.95 (newer data weighted more heavily)
- Minimum sample size: 100 castings before baseline stabilizes

**Anomaly threshold:**
- Distance > 3 standard deviations → HIGH anomaly
- Distance > 2 standard deviations → MODERATE anomaly
- Distance < 2 standard deviations → NORMAL

---

## Signal Feature System

### 15-Dimensional Feature Vector

Each patch produces a 15-element feature vector:

**1-3: Texture Features (LBP)**
- Local Binary Pattern histogram statistics
- Captures micro-texture variations
- Sensitive to surface roughness, porosity patterns

**4-7: Texture Features (GLCM)**
- Gray Level Co-occurrence Matrix: contrast, homogeneity, energy, correlation
- Captures spatial texture relationships
- Sensitive to directional patterns (cracks, shrinkage dendrites)

**8-9: Edge Features**
- Canny edge density (edge pixels / total pixels)
- Gradient magnitude histogram (mean, std dev)
- Sensitive to sharp discontinuities (cracks, blow hole boundaries)

**10-11: Blob Features**
- Connected component count
- Blob size distribution (mean, std dev)
- Sensitive to porosity clusters, sand inclusions

**12-15: Geometric Features**
- Circularity: 4π × area / perimeter²
- Aspect ratio: major axis / minor axis
- Solidity: blob area / convex hull area
- Extent: blob area / bounding box area
- Sensitive to defect shape characteristics

### Signal Scoring Weights

Features are weighted and combined:

```
Signal_Score = (Texture × 0.25) + (Geometry × 0.25) + (Edge × 0.20) + (Blob × 0.15) + (Intensity × 0.15)
```

Where each component is computed from the 15-dim feature vector.

### HARD Threshold Classification

Signal system applies rule-based thresholds:

**HIGH_RISK triggers:**
- texture_score > 0.8 AND blob_count > 10
- edge_density > 0.6 AND circularity < 0.3 (irregular shapes)
- GLCM_contrast > 0.9 (high texture variation)

**CLEAN indicators:**
- edge_density < 0.2 AND circularity > 0.9 (smooth, round regions)
- blob_count < 3 AND texture_score < 0.3
- All feature components < 0.4

**MANUAL_REVIEW conditions:**
- geometry_score > 0.7 (ambiguous shape)
- Mixed signals: some features HIGH_RISK, others CLEAN
- Near decision boundaries

---

## Multi-Signal Fusion

### Signal-First Architecture

TvastrRAS uses a signal-first fusion strategy with fixed weights:

**Fusion Formula:**
```
Final_Score = (Signal × 0.40) + (YOLO × 0.20) + (LLM × 0.20) + (Agreement × 0.20)
```

**Weight Rationale:**
- **Signal (40%):** Dominant weight on feature-based detection (robust, explainable)
- **YOLO (20%):** Reduced from traditional 100% reliance (addresses false positives)
- **LLM (20%):** Contextual reasoning and natural language explanations
- **Agreement (20%):** Consensus bonus/penalty based on signal alignment

### Agreement Adjustment

After computing the weighted average, apply agreement modifier:

**Agreement Check:**
- Compute range: max(Signal, YOLO, LLM) - min(Signal, YOLO, LLM)
- IF range ≤ 0.15 (tight consensus) → multiply Final_Score by 1.1 (boost confidence)
- IF range > 0.50 (conflict) → multiply Final_Score by 0.85 (penalize disagreement)
- Clamp final result to [0.0, 1.0]

**Example:**
```
Signal = 0.75, YOLO = 0.60, LLM = 0.70
Range = 0.75 - 0.60 = 0.15 (tight consensus)
Weighted_Avg = (0.75×0.4) + (0.60×0.2) + (0.70×0.2) + (0.68×0.2) = 0.696
Final_Score = 0.696 × 1.1 = 0.766 (boosted to 0.766, clamped to [0,1])
```

### Decision Thresholds

**Default thresholds:**
- REJECT: Final_Score ≥ 0.70
- ACCEPT: Final_Score ≤ 0.30
- MANUAL_REVIEW: 0.30 < Final_Score < 0.70

Thresholds are configurable per plant and can be adjusted during auto-calibration (see [Manufacturing Intelligence](manufacturing_intelligence.md)).

---

## Defect Classification

### 6 Defect Classes

The system detects and classifies:

| Defect Class | Visual Characteristics | Common Causes |
|--------------|----------------------|---------------|
| **Porosity** | Small round voids, clustered or dispersed | Gas entrapment, improper degassing |
| **Shrinkage** | Irregular cavities, dendritic patterns | Insufficient feeding, thermal gradients |
| **Crack** | Linear discontinuities, sharp edges | Thermal stress, rapid cooling |
| **Sand Inclusion** | Foreign particles, rough texture | Sand erosion, core breakage |
| **Surface Roughness** | Texture irregularities, uneven finish | Mold condition, metal-mold interface |
| **Blow Hole** | Large spherical voids near surface | Gas release during solidification |

Each detection includes:
- Bounding box coordinates (pixel-level location)
- Confidence score (0.0-1.0)
- Defect class label
- Patch location (grid position)

---

## Decision Output Structure

### Core Decision Data

Every inspection produces:
- **Decision:** ACCEPT / REJECT / MANUAL_REVIEW
- **Confidence:** Final_Score (0.0-1.0)
- **Signal breakdown:** Individual scores for Signal, YOLO, LLM, Agreement
- **Primary defect:** Highest confidence detection
- **Defect count:** Total detections across all patches
- **Processing time:** Milliseconds per stage

### Annotated Images

Generated artifacts:
- Original image with bounding boxes
- Heatmap overlay showing high-risk patches
- Per-patch anomaly scores visualized
- Comparison with historical castings (if available)

### Traceability Metadata

Linked to:
- **Casting ID** and part number
- **Heat ID** and traceability data (see [Manufacturing Intelligence](manufacturing_intelligence.md))
- **Timestamp** and operator name
- **Model versions:** YOLO, Signal, LLM, Anomaly detection
- **Threshold settings:** Accept/reject/review boundaries
- **Calibration state:** Current weight configuration

---

## Performance Characteristics

### Processing Time

**Per-casting average:** 2.5-5 seconds (typical: 3.5s)

**Stage breakdown (typical):**
- Stage 0 (Preprocessing): 200-300ms
- Stage 1 (Patch extraction): 100-150ms
- Stage 2 (YOLO detection): 800-1200ms
- Stage 3 (Anomaly detection): 400-600ms
- Stage 4 (Signal features): 300-500ms
- Stage 5 (Signal scoring): 200-300ms
- Stage 6 (Fusion): 50-100ms
- Stage 7 (Decision + artifacts): 300-500ms

**Batch mode:** Process multiple castings sequentially with shared model loading (faster per-casting average).

### Accuracy Tracking

The system continuously monitors:
- **Confusion matrix:** TP, TN, FP, FN counts
- **Agreement rate:** % of MANUAL_REVIEW cases where operator agrees with AI
- **Signal correlation:** Which signals predict operator decisions best
- **Per-defect performance:** Accuracy by defect class

**Metrics are used for:**
- Auto-calibration weight optimization (see [Manufacturing Intelligence](manufacturing_intelligence.md))
- Threshold adjustment over time
- Identifying weak model components for retraining

---

## Integration Points

### Input Requirements

Pipeline expects:
- **Image file:** JPEG/PNG, minimum 640×480px (recommended 1920×1080px)
- **Casting ID:** Unique identifier for traceability
- **Optional metadata:** Heat ID, part number, mold ID, operator name

### Output Formats

Results delivered as:
- **JSON:** Structured decision data (scores, defects, metadata)
- **Annotated images:** PNG with overlays (bounding boxes, heatmaps)
- **Database records:** Persisted to inspection history (Supabase)
- **ERP updates:** Rejection records sent to connected systems (if configured)

### License Tier Requirements

- **TIER_1:** Full pipeline access (stages 0-7), single-casting mode
- **TIER_2:** Adds batch processing mode
- **TIER_3:** Adds LLM reasoning (without LLM, fusion formula uses 3-signal weighting)

---

**Next:** [Manufacturing Intelligence](manufacturing_intelligence.md) — Auto-calibration, fingerprinting, and reasoning pipeline

