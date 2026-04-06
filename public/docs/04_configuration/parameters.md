# Tuning Guide

## Purpose

Comprehensive reference for tuning pipeline parameters in `customers/castco/configs/parameters.yaml`. All parameters have safe defaults and hot-reload on next inspection (no restart required).

## Where Configured

**File:** `customers/castco/configs/parameters.yaml`

---

## Quick Reference

### Critical Parameters (Start Here)

| Parameter | Default | Impact | Recommended Range |
|-----------|---------|--------|-------------------|
| `thresholds.surface_detection` | 0.20 | Global YOLO confidence threshold | 0.18-0.25 |
| `scoring.T_high` | 0.65 | REJECT threshold | 0.60-0.70 |
| `scoring.T_low` | 0.35 | MANUAL_REVIEW threshold | 0.30-0.40 |
| `patch_analysis.entropy_penalty` | 0.5 | Anomaly suppression | 0.4-0.6 |
| `reasoning.enable_vlm` | true | Enable LLM reasoning | true (prod) |

---

## Models & Inference

### Model Paths

```yaml
models:
  casting_model: "casting_model.pt"      # Stage 1: Casting body detector
  patch_classifier: "patch_classifier.pt" # Stage 2: Patch classifier
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §1 (YOLO Detection)

### Inference Settings

```yaml
models:
  casting_conf: 0.40         # Min confidence for casting detection
  crop_padding: 0.05         # Padding around casting bbox (5%)
  patch_resize: 960          # Resize before sliding window
  patch_size: 256            # Patch dimensions (MUST match training)
  patch_stride: 128          # Sliding window stride (50% overlap)
```

**Impact:**
- **casting_conf:** Lower (0.30-0.35) = more sensitive, may detect background
- **patch_resize:** Higher (1280) = better detail, slower; Lower (640) = faster
- **patch_stride:** Smaller (64) = more coverage, slower; Larger (192) = faster

**Algorithm:** See `docs/01_overview/technical_reference.md` §2 (Sliding Window)

---

## Detection Thresholds

### Global Threshold

```yaml
thresholds:
  surface_detection: 0.20    # Minimum YOLO confidence (any class)
```

**Impact:**
- Lower (0.15-0.18): More detections, more false positives
- Higher (0.25-0.30): Fewer false positives, may miss subtle defects

### Per-Class Overrides

```yaml
thresholds:
  per_class_conf:
    porosity: 0.20           # Sensitive (subtle defects)
    sand_inclusion: 0.20     # Sensitive
    moulding_error: 0.30     # Strict (common false positives)
    slag_inclusion: 0.25     # Moderate
```

**Strategy:**
- Lower thresholds (0.15-0.20) for critical/subtle defects
- Higher thresholds (0.30-0.35) for defects with common false positives

---

## Patch Analysis

### Clustering & Density

```yaml
patch_analysis:
  radius: 100                # DBSCAN eps + density radius
  dbscan_min_samples: 3      # Min patches to form cluster
  max_cluster_patches: 25    # Top-N patches for heatmap
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §3 (DBSCAN)

**Impact:**
- **radius:** Broader (150) = larger clusters, may merge; Tighter (80) = more clusters
- **dbscan_min_samples:** Lower (2) = more clusters; Higher (5) = stricter

### Entropy Suppression

```yaml
patch_analysis:
  entropy_range: [0.4, 0.6]  # Uncertain probability range
  entropy_penalty: 0.5       # Score multiplier for uncertain patches
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §5 (Entropy Suppression)

**Impact:**
- **entropy_penalty:** Lower (0.3) = aggressive suppression; Higher (0.8) = trust ambiguous patches
- Set to 1.0 to disable entropy suppression

**Tuning:**
- Too many false positives? Lower to 0.4
- Missing defects? Raise to 0.6-0.7

---

## Scoring & Decision Thresholds

### Casting Score Thresholds

```yaml
scoring:
  T_patch: 0.55              # Patch probability threshold
  T_high: 0.65               # Score >= this → REJECT
  T_low: 0.35                # Score >= this → MANUAL_REVIEW
  K: 5                       # Average top-K patches for score
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §4 (Casting Score)

**Impact:**
- **T_high:** Critical parameter — balance sensitivity vs false alarms
  - Higher (0.70): Fewer rejects, risk passing defects
  - Lower (0.60): More rejects, conservative
- **T_low:** Controls manual review rate
  - Higher (0.40): More reviews (safer)
  - Lower (0.30): Fewer reviews (trust system)
- **K:** Higher (7-10) = smoother score; Lower (3-4) = more sensitive

**Maintain:** `T_high - T_low ≥ 0.25` (clear separation)

---

## Fusion Weights

### Multi-Signal Fusion

```yaml
fusion:
  yolo_weight: 0.5           # YOLO patch probability weight
  anomaly_weight: 0.5        # CV-based anomaly weight
  density_weight: 0.5        # Spatial density multiplier
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §4 (Patch Score Fusion)

**Impact:**
- **yolo_weight vs anomaly_weight:** Should sum close to 1.0
  - Trust YOLO more: `yolo: 0.6, anomaly: 0.4`
  - Trust anomaly more: `yolo: 0.4, anomaly: 0.6`
- **density_weight:** Higher (0.7-0.9) = prefer clustered defects

---

## Anomaly Filters

### Text & Gradient Filters

```yaml
anomaly_filters:
  text_threshold: 0.2        # Text score triggers 0.3x suppression
  global_gradient_threshold: 0.25  # Global defect signal threshold
```

**Impact:**
- **text_threshold:** Lower (0.15) = more text suppression; Higher (0.30) = less suppression
- **global_gradient_threshold:** Lower (0.20) = more sensitive to widespread defects

---

## Cavity Analysis (Deep Inspection)

### Geometry Detection

```yaml
cavity_analysis:
  geometry:
    dark_percentile: 22      # Pixels darker than this → cavity
    min_area: 12             # Min contour area (pixels²)
    blur_radius: 7           # Gaussian blur before threshold
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §6 (Cavity Geometry)

**Impact:**
- **dark_percentile:** Lower (18-20) = more sensitive; Higher (25-28) = stricter
- **min_area:** Lower (8-10) = detect smaller cavities; Higher (15-20) = only larger

### Classification Thresholds

```yaml
cavity_analysis:
  classify:
    porosity_circ_threshold: 0.58  # Circularity >= this → porosity
    sand_circ_threshold: 0.45      # Circularity < this → sand
    min_cavity_count_high: 5       # Count >= this → HIGH severity
```

**Impact:**
- **porosity_circ_threshold:** Higher (0.65) = stricter circularity requirement
- **sand_circ_threshold:** Lower (0.40) = fewer sand classifications

---

## Reasoning Pipeline

### LLM Configuration

```yaml
reasoning:
  enable_vlm: true           # Master switch for LLM reasoning
  gate2_score_threshold: 0.60  # Skip LLM if score < this
  yolo_override_conf: 0.40   # YOLO conf > this overrides gate skip
  max_images: 5              # Max images per LLM call
```

**Algorithm:** See `docs/03_intelligence/reasoning_pipeline.md`

**Impact:**
- **enable_vlm:** `false` = always use rule-based (faster, no API cost)
- **gate2_score_threshold:** Higher (0.70) = skip LLM more often (faster, lower cost)
- **max_images:** Lower (3-4) = faster, less cost; Higher (7-10) = more context

### Fast-Path Bypass

```yaml
reasoning:
  fast_path:
    enabled: true
    min_cluster_size: 5
    min_avg_prob: 0.70       # Avg patch prob threshold
    min_porosity_score: 0.70 # Geometry porosity score
    min_circularity: 0.60    # Circularity threshold
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §7 (Fast-Path Logic)

**Impact:**
- **enabled:** `false` = always use LLM (slower, more accurate for edge cases)
- **min_avg_prob:** Lower (0.65) = trigger fast-path more often (faster)

### Confidence Gating

```yaml
reasoning:
  confidence:
    high_threshold: 0.50     # Avg YOLO conf >= this → HIGH
    medium_threshold: 0.35   # Avg YOLO conf >= this → MEDIUM
    low_skip_max_defects: 2  # Skip LLM when LOW + defects < this
```

**Impact:**
- **high_threshold:** Higher (0.60) = stricter HIGH classification
- **low_skip_max_defects:** Higher (3-4) = skip LLM more on LOW confidence

---

## LLM Provider

### Mistral Configuration

```yaml
llm:
  provider: "mistral"
  mistral:
    api_key_env: "MISTRAL_API_KEY"  # Use env var (recommended)
    vlm_model: "mistral-small-2603"
    temperature: 0.22        # Lower = more deterministic
    max_tokens: 800          # Max response length
    top_p: 0.80              # Nucleus sampling
```

**Impact:**
- **temperature:** Lower (0.15-0.20) = consistent; Higher (0.4-0.6) = varied
- **max_tokens:** Lower (600) = concise (faster); Higher (1000) = detailed (slower)

---

## Fingerprinting

### Clustering

```yaml
fingerprints:
  clustering:
    eps: 0.08                # DBSCAN max distance
    min_samples: 2           # Min cluster size
    group_by_type: true      # Separate defect types
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §9 (DBSCAN)

### Similarity Matching

```yaml
fingerprints:
  similarity:
    max_distance: 0.15       # Max distance for match
```

**Algorithm:** See `docs/01_overview/technical_reference.md` §9 (Euclidean Distance)

---

## Multi-Modal Fusion

### Fusion Weights

```yaml
multi_signal_fusion:
  yolo_weight: 0.40          # YOLO detection weight
  signal_weight: 0.20        # Signal scoring weight
  llm_weight: 0.20           # LLM reasoning weight
  agreement_weight: 0.20     # Inter-signal agreement weight
```

**Algorithm:** See `docs/02_pipeline/fusion_logic.md`

**Impact:**
- Weights must sum to 1.0
- Auto-calibration can optimize these (see `docs/03_intelligence/auto_calibration.md`)

---

## Quick Tuning Scenarios

### Scenario 1: Too Many False Positives

**Symptoms:** System flags clean castings as defective

**Adjustments:**
```yaml
thresholds:
  surface_detection: 0.30    # was 0.20
  per_class_conf:
    moulding_error: 0.40     # was 0.30

scoring:
  T_high: 0.70               # was 0.65
  T_low: 0.40                # was 0.35

patch_analysis:
  entropy_penalty: 0.4       # was 0.5 (more suppression)
```

### Scenario 2: Missing Subtle Defects

**Symptoms:** System accepts castings with visible defects

**Adjustments:**
```yaml
thresholds:
  surface_detection: 0.18    # was 0.20
  per_class_conf:
    porosity: 0.15           # was 0.20
    sand_inclusion: 0.15     # was 0.20

scoring:
  T_high: 0.60               # was 0.65
  T_low: 0.30                # was 0.35
  K: 7                       # was 5 (smoother score)
```

### Scenario 3: Speed Optimization

**Symptoms:** Batch processing too slow

**Adjustments:**
```yaml
reasoning:
  enable_vlm: false          # Skip LLM entirely
  gate2_score_threshold: 0.70  # Skip LLM more often
  
  fast_path:
    enabled: true
    min_avg_prob: 0.65       # was 0.70 (trigger more)

models:
  patch_resize: 640          # was 960 (faster)
```

### Scenario 4: Cost Reduction

**Symptoms:** High Mistral API costs

**Adjustments:**
```yaml
reasoning:
  gate2_score_threshold: 0.70  # was 0.60 (skip more)
  max_images: 3              # was 5 (fewer images)
  
  fast_path:
    enabled: true
    min_avg_prob: 0.60       # was 0.70 (use more)
  
  few_shot:
    skip_when_high_conf: true
    max_images: 1            # was 2 (minimal few-shot)

llm:
  mistral:
    max_tokens: 600          # was 800 (shorter)
```

---

## Parameter Interaction Matrix

| If you change | Also consider adjusting |
|---------------|-------------------------|
| `thresholds.surface_detection` | `per_class_conf`, `T_high`, `T_low` |
| `scoring.T_high` | `T_low` (maintain gap of 0.25-0.35) |
| `patch_analysis.radius` | `dbscan_min_samples` |
| `fusion.yolo_weight` | `anomaly_weight` (should sum ~1.0) |
| `reasoning.enable_vlm` | `gate2_score_threshold`, `fast_path.enabled` |
| `models.patch_resize` | `heatmap.resize` (should match) |

---

## Safety Limits

**Do NOT set:**
- Any threshold < 0.05 (except when explicitly intended)
- Any threshold > 0.95
- `max_detections` > 50 (UI rendering slowdown)
- `patch_resize` ≠ training resolution (breaks classifier)
- `patch_size` ≠ training size (breaks classifier)

**Always validate:**
- After changes, run 5-10 test inspections
- Compare results with previous config
- Monitor false positive/negative rates

---

## Configuration Backup

**Before modifying:**
```bash
cp customers/castco/configs/parameters.yaml customers/castco/configs/parameters.yaml.backup
```

**Restore:**
```bash
cp customers/castco/configs/parameters.yaml.backup customers/castco/configs/parameters.yaml
```

**Git tracking:** Config files should be version-controlled for audit trail.

---

## Troubleshooting

### Changes Not Taking Effect

**Cause:** Config cached or wrong file edited

**Fix:**
1. Verify editing correct file: `customers/castco/configs/parameters.yaml`
2. Check YAML syntax: `python -c "import yaml; yaml.safe_load(open('customers/castco/configs/parameters.yaml'))"`
3. Restart application if editing `configs/system.yaml` (not `parameters.yaml`)

### Invalid Parameter Values

**Symptom:** Warnings in logs about invalid values

**Cause:** Out-of-range values or wrong types

**Fix:**
- Check parameter type (float vs int vs bool)
- Verify range (most thresholds: 0.0-1.0)
- Review error message in logs

### System Behavior Changed Unexpectedly

**Cause:** Unintended parameter interaction

**Fix:**
1. Restore from backup
2. Change one parameter at a time
3. Test after each change
4. Document working configurations

---

## Related Docs

- **Algorithms:** `docs/01_overview/technical_reference.md`
- **Pipeline:** `docs/02_pipeline/full_pipeline.md`
- **System Config:** `docs/04_configuration/system_configuration.md`
- **Auto-Calibration:** `docs/03_intelligence/auto_calibration.md`
