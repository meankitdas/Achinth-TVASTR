# Technical Reference — Algorithm Catalog

> **Purpose:** Complete catalog of all algorithms, formulas, and mathematical methods  
> **Format:** Name, Description, Formula, Parameters, Source File  
> **Note:** For usage context and pipeline flow, see topic-specific docs in `02_pipeline/` and `03_intelligence/`

---

## 1. Machine Learning Models

### 1.1 YOLO Object Detection
**Description:** Single-stage object detection neural network that localizes casting bodies in radiographic images.  
**Model:** YOLOv8  
**Input:** Variable resolution image  
**Output:** Bounding boxes with class labels and confidence scores  
**Parameters:**
- Confidence threshold: 0.40
- Classes: casting body + 6 defect types
**Source:** `core/vision/infer.py`

### 1.2 YOLO Patch Classifier
**Description:** YOLO-based image classification model for binary OK/DEFECT classification on 256×256 image patches.  
**Input:** 256×256 RGB patch  
**Output:** Logits → sigmoid → probability  
**Parameters:**
- Patch size: 256×256 pixels
- Temperature scaling: T (learned)
**Source:** `core/vision/casting/inference.py`

### 1.3 Temperature Scaling
**Description:** Post-hoc calibration that applies learned temperature parameter to logits before sigmoid.  
**Formula:**
```
calibrated_prob = sigmoid(logits / T)
where T > 0 is learned temperature
```
**Parameters:** T (temperature parameter)  
**Source:** `core/vision/casting/inference.py`

### 1.4 Isotonic Regression
**Description:** Non-parametric piecewise-constant monotonic function for confidence calibration.  
**Method:** sklearn's `IsotonicRegression`  
**Purpose:** Maps raw confidence → calibrated probability  
**Source:** `core/analytics/confidence_calibrator.py`

### 1.5 Platt Scaling (Fallback)
**Description:** Parametric sigmoid-based calibration for logits to probabilities.  
**Formula:**
```
calibrated_prob = 1 / (1 + exp(A × logits + B))
```
**Parameters:** A, B (learned)  
**Source:** `core/analytics/confidence_calibrator.py`

---

## 2. Image Processing

### 2.1 Sliding Window Patch Generation
**Description:** Extracts overlapping square patches using fixed stride for dense grid coverage.  
**Formula:**
```
num_patches_x = (width - PSIZ) // STRIDE + 1
num_patches_y = (height - PSIZ) // STRIDE + 1
patch[i,j] = image[y:y+PSIZ, x:x+PSIZ]
```
**Parameters:**
- Resize: 960px (larger side)
- Patch size (PSIZ): 256px
- Stride: 128px (50% overlap)
**Source:** `core/vision/casting/inference.py`

### 2.2 CLAHE
**Description:** Contrast Limited Adaptive Histogram Equalization for local contrast enhancement.  
**Parameters:**
- Clip limit: 2.0
- Tile grid: 8×8
**Source:** `core/reasoning/signal_features.py`

### 2.3 Gaussian Blur
**Description:** Low-pass filter using Gaussian kernel for noise reduction and smoothing.  
**Parameters:**
- Kernel size: (15, 15)
- Sigma: Auto-computed by OpenCV
**Source:** `core/vision/casting/heatmap.py`, `core/pipeline/patch_postprocess.py`

### 2.4 Canny Edge Detection
**Description:** Multi-stage edge detection using gradient, non-maximum suppression, hysteresis thresholding.  
**Parameters:**
- Lower threshold: 50
- Upper threshold: 150
**Output:** Binary edge map, edge_density = sum(edges) / total_pixels  
**Source:** `core/reasoning/signal_features.py`

### 2.5 Morphological Operations
**Description:** Binary image processing using structuring elements (erosion, dilation, opening, closing).  
**Operations:**
- Erosion: `cv2.erode(mask, kernel, iterations=N)`
- Dilation: `cv2.dilate(mask, kernel, iterations=N)`
**Source:** `core/reasoning/signal_features.py`, `core/reasoning/cavity_analysis.py`

### 2.6 Non-Maximum Suppression (NMS)
**Description:** Removes redundant overlapping boxes by keeping highest confidence box.  
**Algorithm:** Iteratively select highest confidence, suppress IoU > threshold  
**Parameters:**
- IoU threshold: 0.45
**Source:** `core/vision/postprocess.py`

### 2.7 IoU-Based Bounding Box Merging
**Description:** Combines overlapping boxes using weighted average of coordinates.  
**Formula:**
```
IoU = intersection_area / union_area
merged_bbox = weighted_average(boxes, weights=confidences)
```
**Source:** `core/vision/postprocess.py`

### 2.8 Bounding Box Padding
**Description:** Expands boxes by percentage while maintaining aspect ratio and image bounds.  
**Formula:**
```
pad_w = bbox_width × padding
pad_h = bbox_height × padding
padded_bbox = [x-pad_w, y-pad_h, x+w+pad_w, y+h+pad_h]
```
**Parameters:** padding = 0.10 (10%)  
**Source:** `core/vision/infer.py`

---

## 3. Feature Extraction

### 3.1 Local Binary Patterns (LBP)
**Description:** Texture descriptor encoding local intensity patterns as binary numbers.  
**Formula:**
```
LBP(x,y) = Σ(i=0 to P-1) s(g_i - g_c) × 2^i
where s(x) = 1 if x ≥ 0, else 0
```
**Parameters:**
- Points (P): 24
- Radius (R): 3
- Method: Uniform patterns
**Output:** Histogram of uniform LBP patterns  
**Source:** `core/reasoning/signal_features.py`

### 3.2 Gray-Level Co-occurrence Matrix (GLCM)
**Description:** Statistical texture analysis via frequency of pixel intensity pairs at spatial relationships.  
**Parameters:**
- Distances: [1, 2, 3]
- Angles: [0°, 45°, 90°, 135°]
- Levels: 256
**Derived Metrics:**
```
Contrast = Σ(i,j) (i-j)² × P(i,j)
Dissimilarity = Σ(i,j) |i-j| × P(i,j)
Homogeneity = Σ(i,j) P(i,j) / (1 + (i-j)²)
Energy = Σ(i,j) P(i,j)²
Correlation = linear dependency measure
```
**Source:** `core/reasoning/signal_features.py`

### 3.3 Blob Detection
**Description:** Detects regions differing in properties using multi-scale Laplacian of Gaussian.  
**Method:** OpenCV `SimpleBlobDetector`  
**Output:** Blob count, size distribution  
**Source:** `core/reasoning/signal_features.py`

### 3.4 Contour Analysis
**Description:** Extracts connected component boundaries for geometric shape descriptors.  
**Metrics:**
```
Circularity = 4π × area / perimeter² (1.0 = perfect circle)
Solidity = contour_area / convex_hull_area (1.0 = convex)
Aspect Ratio = width / height
Irregularity = 1.0 - solidity
```
**Source:** `core/reasoning/signal_features.py`, `core/reasoning/cavity_analysis.py`

### 3.5 Laplacian Variance (Blur Detection)
**Description:** Measures image sharpness via Laplacian operator variance.  
**Formula:**
```
blur_score = variance(Laplacian(grayscale_image))
```
**Threshold:** blur_score < 100 = blurry  
**Source:** `core/vision/quality_gate.py`

### 3.6 Luminance Statistics
**Description:** Brightness and contrast metrics from grayscale image.  
**Metrics:**
- Brightness: mean(grayscale) [0-255]
- Contrast: std(grayscale)
**Source:** `core/vision/quality_gate.py`

### 3.7 Feature Vectorization (15-Dimensional)
**Description:** Converts nested feature dicts into flat normalized 15-dim vector for anomaly detection.  
**Features:** lbp_uniformity, glcm_contrast, glcm_homogeneity, glcm_energy, glcm_correlation, edge_density, blob_count, blob_mean_size, intensity_mean, intensity_std, area, perimeter, circularity, solidity, aspect_ratio  
**Normalization:** All values clamped to [0, 1], NaN/inf → 0.0  
**Source:** `core/vision/feature_vector.py`

---

## 4. Statistical & Mathematical Methods

### 4.1 DBSCAN Clustering
**Description:** Density-based spatial clustering without predefined cluster count.  
**Parameters:**
- eps: 10.0 (max distance)
- min_samples: 2
**Output:** Cluster labels, noise (-1)  
**Source:** `core/pipeline/patch_postprocess.py`, `core/reasoning/cavity_analysis.py`

### 4.2 Euclidean Spatial Density
**Description:** Local point density via neighbor count within radius.  
**Formula:**
```
density(p) = count({q : ||p - q|| ≤ radius})
```
**Parameters:** radius = 50.0 pixels  
**Source:** `core/pipeline/patch_postprocess.py`

### 4.3 Min-Max Normalization
**Description:** Linear scaling to [0,1] range.  
**Formula:**
```
normalized = (x - min(X)) / (max(X) - min(X))
```
**Source:** Used throughout

### 4.4 Entropy Suppression
**Description:** Filters uncertain predictions using Shannon entropy.  
**Formula:**
```
entropy = -Σ p(x) log₂(p(x))
suppress if entropy > threshold
```
**Threshold:** 0.5  
**Source:** `core/pipeline/patch_postprocess.py`

### 4.5 Cosine Similarity
**Description:** Measures vector similarity via angle cosine.  
**Formula:**
```
cosine_similarity = (A · B) / (||A|| × ||B||)
```
**Range:** [-1, 1], 1 = identical direction  
**Source:** `core/fingerprints/indexer.py`

### 4.6 Expected Calibration Error (ECE)
**Description:** Measures calibration quality via weighted average of confidence-accuracy gaps.  
**Formula:**
```
ECE = Σ(b=1 to B) (|B_b| / N) × |accuracy(B_b) - confidence(B_b)|
```
**Source:** `core/analytics/confidence_calibrator.py`

### 4.7 Confusion Matrix
**Description:** 2×2 table of TP, FP, TN, FN for classification evaluation.  
**Structure:**
```
              Predicted
           OK       DEFECT
Actual OK  TN       FP
     DEFECT FN      TP
```
**Source:** `core/analytics/signal_evaluator.py`

### 4.8 Precision, Recall, F1-Score
**Description:** Standard classification metrics.  
**Formulas:**
```
Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```
**Source:** `core/analytics/signal_evaluator.py`

### 4.9 PCA (Principal Component Analysis)
**Description:** Dimensionality reduction identifying principal variance axes.  
**Use Case:** Rotation normalization in fingerprint alignment  
**Source:** `core/fingerprints/extractor.py`

---

## 5. Anomaly Detection (NEW)

### 5.1 Global Anomaly Detection (Z-Score)
**Description:** Population-level anomaly via z-score with epsilon safety and clipping.  
**Formula:**
```
z_score = (x - mean) / (std + eps)
z_score_clipped = clip(z_score, -3, 3)
anomaly = (z_score_clipped + 3) / 6  # normalize to [0,1]
```
**Parameters:**
- eps: 1e-6 (division safety)
- clip: [-3, 3]
**Source:** `core/vision/patch_anomaly.py`

### 5.2 Local Anomaly Detection (Spatial)
**Description:** Neighborhood consistency via mean absolute deviation from spatial neighbors.  
**Formula:**
```
local_anomaly = mean(|vec - neighbor_vecs|) for all neighbors
normalized to [0,1]
```
**Parameters:**
- Neighbor type: 8-connected (default)
- Min patches: 10 (skip if fewer)
**Source:** `core/vision/patch_anomaly.py`

### 5.3 YOLO Entropy Hint
**Description:** Uncertainty signal from YOLO probability distribution entropy.  
**Formula:**
```
entropy = -Σ p(x) log(p(x) + eps)
normalized and clamped to [0,1]
```
**Parameters:** eps = 1e-8 (log safety)  
**Source:** `core/vision/patch_anomaly.py`

### 5.4 Feature Anomaly Fusion
**Description:** Weighted combination of global and local anomaly scores.  
**Formula:**
```
feature_anomaly = w_global × global_anomaly + w_local × local_anomaly
```
**Default Weights:**
- w_global: 0.60
- w_local: 0.40
**Source:** `core/vision/patch_anomaly.py`

### 5.5 Final Anomaly Score
**Description:** Fuses feature anomaly and YOLO hint into final patch anomaly score.  
**Formula:**
```
final_anomaly = w_feature × feature_anomaly + w_yolo × yolo_hint
```
**Default Weights:**
- w_feature: 0.70 (PRIMARY)
- w_yolo: 0.30 (demoted from 100%)
**Source:** `core/vision/patch_anomaly.py`

### 5.6 Adaptive Threshold
**Description:** Statistical threshold based on mean + k×sigma, capped at percentile.  
**Formula:**
```
threshold = mu + k × sigma
threshold = min(threshold, percentile(anomalies, P))
```
**Parameters:**
- k: 2.0 (default)
- P: 90 (P90 cap)
**Source:** `core/vision/patch_anomaly.py`

### 5.7 Top-K Patch Filtering
**Description:** Selects K patches with highest anomaly scores.  
**Formula:**
```
top_k_patches = sort(patches, key=anomaly_score, desc=True)[:K]
```
**Source:** `core/vision/patch_filter.py`

---

## 6. Scoring & Fusion

### 6.1 Top-K Mean Casting Score
**Description:** Overall defect score as mean of K most suspicious patches.  
**Formula:**
```
casting_score = mean(top_K_patches_sorted_by_probability)
```
**Parameters:** K = 5-10  
**Source:** `core/vision/casting/scoring.py`

### 6.2 Hybrid Fusion Scoring
**Description:** Combines model probability, spatial density, cluster membership.  
**Formula:**
```
hybrid_score = α × model_prob + β × spatial_density + γ × cluster_size
```
**Source:** `core/pipeline/patch_postprocess.py`

### 6.3 Multi-Signal Weighted Fusion
**Description:** Combines YOLO, Signal, LLM, Agreement into final score.  
**Formula:**
```
final_score = w_yolo × yolo_score + w_signal × signal_score 
            + w_llm × llm_score + w_agreement × agreement_score
```
**Default Weights:**
- w_yolo: 0.20
- w_signal: 0.40 (PRIMARY)
- w_llm: 0.20
- w_agreement: 0.20
**Constraint:** Σw_i = 1.0  
**Source:** `core/reasoning/multi_signal_fusion.py`

### 6.4 Proportional Weight Redistribution
**Description:** Dynamically reallocates weights when signals missing.  
**Algorithm:**
```
If signal_i missing:
  w'_j = w_j / (1 - w_i) for all j ≠ i
  Renormalize so Σw'_j = 1.0
```
**Source:** `core/reasoning/multi_signal_fusion.py`

### 6.5 Three-Tier Agreement Logic
**Description:** Evaluates consensus among signals using three tiers.  
**Tiers:**
- Strong Agreement: range ≤ 0.15 → boost ×1.1
- Mild Disagreement: 0.15 < range ≤ 0.35 → neutral ×1.0
- Strong Disagreement: range > 0.35 → penalty ×0.85
**Output:** Agreement score [0,1]  
**Source:** `core/reasoning/multi_signal_fusion.py`

### 6.6 Disagreement Penalty
**Description:** Multiplicative penalty when signals strongly disagree.  
**Formula:**
```
penalized_score = base_score × (1 - penalty_factor × disagreement_magnitude)
```
**Source:** `core/reasoning/multi_signal_fusion.py`

### 6.7 Weighted Signal Scoring
**Description:** Aggregates sub-category features into signal score.  
**Formula:**
```
signal_score = Σ(i) w_i × subcategory_score_i
```
**Sub-categories:** texture, edge, geometry, blob  
**Source:** `core/reasoning/signal_scoring.py`

---

## 7. Reasoning & Decision

### 7.1 Three-Tier Decision Thresholds
**Description:** Classification using two thresholds for three outcome zones.  
**Logic:**
```
score ≥ T_high → REJECT
T_low < score < T_high → MANUAL_REVIEW
score ≤ T_low → ACCEPT
```
**Typical Values:** T_low = 0.30, T_high = 0.70  
**Source:** `core/vision/casting/scoring.py`

### 7.2 Heuristic Porosity/Sand Scoring
**Description:** Rule-based scoring using saturation functions.  
**Formula:**
```
porosity_score = f_density(density) × f_size(size) × f_shape(circularity)
where f(x) = min(1.0, x / threshold)
```
**Source:** `core/reasoning/cavity_analysis.py`

### 7.3 Zone-Weighted Cause Scoring
**Description:** Weighs diagnostic matches by defect spatial zone.  
**Formula:**
```
cause_score = Σ(zones) zone_weight[zone] × rule_match_score[zone]
```
**Source:** `core/diagnosis/rules.py`

---

## 8. Optimization & Calibration

### 8.1 Grid Search Weight Optimization
**Description:** Exhaustive search over weight combinations to maximize F1 score.  
**Algorithm:**
1. Generate grid of weight combinations (simplex constraint)
2. Evaluate F1 for each
3. Select weights with highest macro F1
**Constraint:** Σw_i = 1.0  
**Source:** `core/analytics/weight_calibrator.py`

### 8.2 Frequency Gating (Modulo)
**Description:** Triggers calibration at specific intervals.  
**Formula:**
```
trigger = (trace_count % frequency_checkpoint == 0)
```
**Default:** frequency_checkpoint = 100  
**Source:** `core/analytics/auto_calibration.py`

### 8.3 Weight Delta Capping
**Description:** Limits max weight change per calibration.  
**Formula:**
```
new_weight = clip(proposed_weight, current_weight ± max_delta)
```
**Parameters:** max_delta = 0.15  
**Source:** `core/analytics/auto_calibration.py`

### 8.4 Cooldown Mechanism
**Description:** Enforces minimum time between calibration runs.  
**Parameters:** cooldown = 3600 seconds (1 hour)  
**Logic:** Block if last_time + cooldown > current_time  
**Source:** `core/analytics/auto_calibration.py`

---

## 9. Fingerprinting & Alignment

### 9.1 Three-Stage Alignment Cascade
**Description:** Hierarchical alignment using progressively refined methods.  
**Stages:**
1. Contour-Based Affine Transform (centroid + principal axes)
2. ORB Feature Matching + Homography (keypoint correspondences)
3. PCA Rotation Normalization (variance axes)
**Fallback:** Each stage falls back to previous if unsuccessful  
**Source:** `core/fingerprints/extractor.py`

### 9.2 Crop-Relative Coordinate Normalization
**Description:** Normalizes defect coordinates relative to casting bbox.  
**Formula:**
```
normalized_x = (defect_x - bbox_x) / bbox_width
normalized_y = (defect_y - bbox_y) / bbox_height
```
**Source:** `core/fingerprints/extractor.py`

---

## 10. Visualization

### 10.1 Heatmap Alpha Overlay
**Description:** Semi-transparent color-coded overlay of anomaly scores.  
**Process:**
1. Generate heatmap from patch probabilities
2. Apply colormap (jet/hot)
3. Blend with original using alpha
**Parameters:** alpha = 0.4 (40% heatmap, 60% original)  
**Source:** `core/vision/casting/heatmap.py`, `core/outputs/visualize.py`

### 10.2 Dark Percentile Thresholding
**Description:** Adaptive thresholding identifying dark regions.  
**Formula:**
```
threshold = percentile(casting_pixels, dark_percentile)
dark_mask = (image < threshold)
```
**Parameters:** dark_percentile = 25 (darkest 25%)  
**Source:** `core/reasoning/cavity_analysis.py`

---

## 11. Constants & Key Parameters

| Parameter | Value | Usage |
|-----------|-------|-------|
| **Image Processing** | | |
| Resize target | 960px | Longer dimension |
| Patch size | 256×256px | Sliding window |
| Stride | 128px | Patch overlap |
| Blur kernel | (15, 15) | Gaussian smoothing |
| **Detection** | | |
| YOLO confidence | 0.40 | Detection threshold |
| NMS IoU | 0.45 | Box suppression |
| Bbox padding | 10% | Expansion factor |
| **Clustering** | | |
| DBSCAN eps | 10.0 | Max distance |
| DBSCAN min_samples | 2 | Min cluster size |
| Spatial density radius | 50.0px | Neighbor radius |
| **Anomaly Detection** | | |
| Feature weight | 0.70 | PRIMARY signal |
| YOLO hint weight | 0.30 | Demoted signal |
| Global anomaly weight | 0.60 | Z-score weight |
| Local anomaly weight | 0.40 | Spatial weight |
| Adaptive threshold k | 2.0 | mu + k×sigma |
| Percentile cap | 90 | P90 threshold cap |
| **Fusion** | | |
| YOLO weight | 0.20 | Proposal generator |
| Signal weight | 0.40 | PRIMARY classifier |
| LLM weight | 0.20 | Contextual reasoning |
| Agreement weight | 0.20 | Consensus bonus |
| Strong agreement | 0.15 | Range threshold |
| Mild disagreement | 0.35 | Range threshold |
| **Calibration** | | |
| Weight delta cap | ±0.15 | Max change |
| Cooldown | 3600s | Min interval |
| Frequency checkpoint | 100 | Trace modulo |
| Min samples | 50 | Dataset minimum |
| Min labeled | 20 | Labeled minimum |
| **Quality Gates** | | |
| Blur threshold | 100 | Laplacian variance |
| Brightness min | 30 | Pixel value |
| Brightness max | 225 | Pixel value |
| Contrast min | 20 | Std threshold |

---

## Mathematical Notation

- **Σ** — Summation
- **||·||** — Euclidean norm (L2)
- **·** — Dot product
- **sigmoid(x)** — 1 / (1 + e^(-x))
- **log₂(x)** — Logarithm base 2
- **exp(x)** — e^x
- **percentile(X, p)** — p-th percentile
- **clip(x, a, b)** — Clamp to [a, b]

---

## 12. Energy-Based Reasoning (Phase K)

### 12.1 Adaptive Threshold System
**Description:** Dynamic thresholds based on online Welford statistics with strong/weak tiers.  
**Formula:**
```
threshold_strong = mean + 1.0 × std
threshold_weak = mean - 0.5 × std
```
**Source:** `core/reasoning/baselines.py::get_adaptive_thresholds()`

### 12.2 Welford Algorithm (Online Statistics)
**Description:** Incremental mean and variance computation without storing data.  
**Formula:**
```
n = n + 1
delta = x - mean
mean = mean + delta / n
M2 = M2 + delta × (x - mean)
variance = M2 / (n - 1) if n > 1 else 0
```
**Source:** `core/reasoning/baselines.py::update_baseline()`

### 12.3 Energy Conversion (Scores to Energy)
**Description:** Converts probability scores to energy landscape (higher probability = lower energy).  
**Formula:**
```
E_k = -log(p_k + ε)
where ε = 1e-8 (log safety)
```
**Purpose:** Enables additive force operations instead of multiplicative score adjustments.  
**Source:** `core/reasoning/pipeline.py::_scores_to_energy()`

### 12.4 Signal Forces (Energy Reduction)
**Description:** Additive energy reduction based on signal confidence (strong signals lower energy).  
**Formula:**
```
ΔE_topology = -w_topology × topology_score
ΔE_scrata = -w_scrata × scrata_confidence
ΔE_anomaly = -w_anomaly × avg_anomaly

E'_k = E_k + ΔE_topology + ΔE_scrata + ΔE_anomaly
```
**Default Weights:**
- w_topology: 0.3
- w_scrata: 0.2
- w_anomaly: 0.1
**Purpose:** Strong signals pull down energy for corresponding defect types.  
**Source:** `core/reasoning/pipeline.py::_apply_signal_forces()`

### 12.5 Lyapunov Stability Check
**Description:** Ensures energy monotonically decreases across iterations (guarantees convergence).  
**Formula:**
```
E_total = Σ E_k
ΔE = E_total(current) - E_total(previous)
is_stable = (ΔE ≤ ε)
```
**Parameters:** ε = 0.01 (stability tolerance)  
**Action:** If unstable (energy increased), revert to previous energy state.  
**Source:** `core/reasoning/pipeline.py::_check_lyapunov_stability()`

### 12.6 Energy to Probability Conversion
**Description:** Converts energy back to normalized probability scores.  
**Formula:**
```
p_k = exp(-E_k)
p'_k = p_k / Σ p_j  (normalize to sum=1)
```
**Source:** `core/reasoning/pipeline.py::_energy_to_scores()`

### 12.7 SCRATA Energy Force (Phase E)
**Description:** SCRATA confidence acts as energy reduction force (not multiplicative boost).  
**Formula:**
```
When scrata_confidence > threshold_strong:
  ΔE_scrata = -w_scrata × scrata_confidence × I(defect_type matches top_scrata)
  E_defect_type = E_defect_type + ΔE_scrata
```
**Purpose:** High SCRATA confidence lowers energy for matching defect type, increasing its probability after conversion.  
**Source:** `core/reasoning/pipeline.py::_apply_signal_forces()`

### 12.8 Safety Normalization
**Description:** Ensures scores remain valid after energy conversions.  
**Checks:**
```
1. NaN/Inf Guard: Replace with uniform distribution
2. Negative Guard: Clamp to 0, renormalize
3. Normalization Check: |sum - 1.0| < 0.01
```
**Source:** `core/reasoning/pipeline.py` (energy pipeline safety checks)

---

**Version:** 2.0  
**Last Updated:** 2026-04-16 (Phase K: Energy-Based Reasoning)
