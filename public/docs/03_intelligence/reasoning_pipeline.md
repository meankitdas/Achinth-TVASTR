# Reasoning Pipeline

## Purpose
Four-gate reasoning system that progressively analyzes defects through fast-path, geometry, signal, and LLM reasoning gates with confidence-weighted routing.

## Where Used
- **Pipeline Stage**: Stage 4b (Reasoning / Root Cause)
- **Entry Point**: `core/reasoning/pipeline.py`
- **Called By**: `core/ui/run_pipeline.py` (after multi-signal fusion)

## Related Docs
- **Algorithms**: See `../01_overview/technical_reference.md` §7 (Reasoning & Decision)
- **Full Pipeline**: See `../02_pipeline/full_pipeline.md` (Stage 4b context)
- **LLM Integration**: See configuration for API setup

---

## Architecture Overview

### Four-Gate Progression
```
Defect Detection Results
    ↓
┌─── GATE 1: Fast-Path Porosity ──────────────────┐
│  Condition: High cluster prob + strong geometry  │
│  Action: ACCEPT porosity, skip remaining gates   │
│  Cost: 0 API calls, ~5ms                         │
└──────────────────┬───────────────────────────────┘
    ↓ (if not conclusive)
┌─── GATE 2: Cavity Geometry Analysis ────────────┐
│  Condition: Circularity analysis                 │
│  Action: Classify porosity vs sand_inclusion     │
│  Cost: 0 API calls, ~50ms                        │
└──────────────────┬───────────────────────────────┘
    ↓ (if inconclusive)
┌─── GATE 3: Signal-Based Classification ─────────┐
│  Condition: Feature extraction available         │
│  Action: HARD threshold rules on texture/edge    │
│  Cost: 0 API calls, ~10ms                        │
└──────────────────┬───────────────────────────────┘
    ↓ (if unknown or low confidence)
┌─── GATE 4: LLM Multimodal Reasoning ────────────┐
│  Condition: LLM enabled + not high-conf geometry │
│  Action: Mistral multimodal with image+context   │
│  Cost: 1 API call, ~500ms                        │
└──────────────────┬───────────────────────────────┘
    ↓
Final Classification + Root Cause + Severity + Action
```

### Routing Logic
- **Confidence-weighted**: Each gate computes confidence score
- **Early termination**: High confidence at any gate skips remaining gates
- **Cost-aware**: Prefer fast, free gates before expensive LLM calls
- **Fallback hierarchy**: Always progresses to next gate if current fails

---

## Gate 1: Fast-Path Porosity Detection

### Purpose
Quickly accept obvious porosity cases without expensive geometry or LLM analysis.

### Conditions (ALL must be true)
1. **Cluster size** ≥ `min_cluster_size` (default 4 defects)
2. **Average YOLO probability** ≥ `min_avg_prob` (default 0.70)
3. **Geometry porosity score** ≥ `min_porosity_score` (default 0.70)
4. **Circularity** ≥ `min_circularity` (default 0.65)

### Logic
```python
if (
    cluster_size >= 4 
    and avg_yolo_prob >= 0.70 
    and porosity_score >= 0.70 
    and circularity >= 0.65
):
    return {
        "classification": "porosity",
        "confidence": "HIGH",
        "gate": "fast_path",
        "reasoning": "Clear porosity cluster detected"
    }
```

### Configuration
```yaml
reasoning:
  fast_path:
    enabled: true
    min_cluster_size: 4
    min_avg_prob: 0.70
    min_porosity_score: 0.70
    min_circularity: 0.65
```

### Performance
- **Latency**: ~5ms
- **API Cost**: $0
- **Hit Rate**: ~40% of porosity cases
- **Accuracy**: 95%+ (high precision, may miss edge cases)

---

## Gate 2: Cavity Geometry Analysis

### Purpose
Use contour-based shape analysis to classify cavity defects (porosity vs sand_inclusion).

### Algorithm
**File**: `core/reasoning/cavity_analysis.py`

**Steps**:
1. Extract cavity contours from defect regions
2. Compute geometric features per contour:
   - Circularity: `4πA / P²`
   - Solidity: `area / convex_hull_area`
   - Dark pixel density (bottom 25th percentile)
3. Classify using thresholds:
   - **Porosity**: `0.65 ≤ circularity ≤ 0.95`, high solidity
   - **Sand Inclusion**: `circularity < 0.65` OR low solidity

### Scoring Formula
```
porosity_score = f(circularity, solidity, dark_density)

If porosity_score > 0.70 → "porosity"
If porosity_score < 0.30 → "sand_inclusion"
Else → inconclusive (proceed to Gate 3)
```

### Configuration
```yaml
cavity_analysis:
  geometry:
    dark_percentile: 25    # Use darkest 25% pixels
    min_area: 200          # Min contour area (pixels²)
    max_area_fraction: 0.5 # Max fraction of image
    blur_radius: 5         # Preprocessing blur

reasoning:
  geometry_confidence_threshold: 0.85  # Route to Gate 2 if below
```

### Performance
- **Latency**: ~50ms
- **API Cost**: $0
- **Hit Rate**: ~50% of cavity defects
- **Accuracy**: 88% (shape-based heuristics)

---

## Gate 3: Signal-Based Classification

### Purpose
Use signal features (texture, edge, blob, intensity, geometry) for deterministic classification.

### Algorithm
**File**: `core/reasoning/signal_scoring.py::classify_defect_from_signals()`

**Method**: HARD boolean threshold rules (see `../02_pipeline/signal_system.md` for details)

**Defect Rules** (2 STRONG + 1 supporting condition):
- **Porosity**: `blob_count > 0.5` AND `glcm_contrast > 0.4` AND `0.4 ≤ circularity ≤ 0.85`
- **Crack**: `edge_density > 0.5` AND `aspect_ratio > 0.4` AND `circularity < 0.4`
- **Sand Inclusion**: `blob_count > 0.4` AND `solidity < 0.6` AND `lbp_std > 0.4`
- (See full table in `signal_system.md`)

### Signal Strength Gate
- Compute: `signal_strength = max(texture_score, edge_score, geometry_score)`
- If `signal_strength < 0.3` → return "unknown" (proceed to Gate 4)
- Else → return highest-scoring defect type

### Confidence Levels
- **1.0**: Both STRONG conditions pass
- **0.7**: 1 STRONG + supporting condition pass
- **0.0**: No match (unknown)

### Configuration
```yaml
signal_scoring:
  texture_weight: 0.25
  edge_weight: 0.20
  blob_weight: 0.15
  intensity_weight: 0.15
  geometry_weight: 0.25
```

### Performance
- **Latency**: ~10ms
- **API Cost**: $0
- **Hit Rate**: ~70% of defects with signal features
- **Accuracy**: 85% (deterministic rules)

---

## Gate 4: LLM Multimodal Reasoning

### Purpose
Final reasoning gate using Mistral multimodal LLM for ambiguous/complex cases.

### Algorithm
**File**: `core/reasoning/pipeline.py`, `core/llm/`

**Inputs**:
1. **Image patches**: Up to 5 defect regions
2. **Signal features**: Texture, edge, blob, geometry scores
3. **YOLO predictions**: Bbox locations + probabilities
4. **Knowledge base**: Defect type definitions, process context
5. **Geometry analysis**: Circularity, solidity from Gate 2

**Prompt Structure**:
```
You are a casting defect expert. Analyze this image with the following context:

YOLO Detections: [list of bboxes + types]
Signal Features: [texture=0.65, edge=0.72, geometry=0.58]
Geometry Analysis: [circularity=0.45, porosity_score=0.32]

Classify the defect type and provide root cause analysis.
Output JSON: {"defect_type": "...", "root_cause": "...", "severity": "...", "action": "..."}
```

**Model**: `mistral-small-2603` (multimodal)

**Output**:
```python
{
    "defect_type": "porosity",
    "root_cause": "Insufficient feeding, shrinkage in heavy section",
    "severity": "MEDIUM",
    "recommended_action": "Check riser design, increase feeding path",
    "confidence": "HIGH",
    "gate": "llm"
}
```

### Fallback Logic
If LLM call fails or disabled:
1. Use signal classification result (from Gate 3)
2. Lookup KB diagnosis based on signal class + zone
3. Return rule-based text report

### Configuration
```yaml
reasoning:
  enable_vlm: true              # Master switch
  gate2_score_threshold: 0.60   # Skip LLM if score > this
  max_images: 5                 # Max patches per LLM call
  yolo_override_conf: 0.45      # Trust YOLO if > this

llm:
  provider: "mistral"
  mistral:
    api_key_env: "MISTRAL_API_KEY"
    vlm_model: "mistral-small-2603"
    temperature: 0.22
    max_tokens: 800
    top_p: 0.95
```

### Performance
- **Latency**: ~500ms (API latency)
- **API Cost**: $0.002 per call (~$2/1000 inspections)
- **Hit Rate**: ~30% of ambiguous cases
- **Accuracy**: 92% (benefits from visual context)

---

## Routing Decision Tree

### Decision Logic
```python
# Gate 1: Fast-Path
if fast_path_conditions_met():
    return fast_path_result()

# Gate 2: Geometry
geometry_result = cavity_analysis()
if geometry_result.confidence >= 0.85:
    return geometry_result

# Gate 3: Signal
signal_result = signal_classification()
if signal_result.defect_type != "unknown" and signal_result.confidence >= 0.7:
    return signal_result

# Gate 4: LLM
if llm_enabled and should_use_llm(geometry_result, signal_result):
    return llm_reasoning()
else:
    return rule_based_fallback(signal_result, geometry_result)
```

### LLM Gating Conditions (skip LLM if ANY true)
1. **High geometry confidence**: `geometry_confidence ≥ 0.85`
2. **High casting score**: `casting_score ≥ gate2_score_threshold` AND `defect_count < 2`
3. **Strong signal match**: `signal_confidence = 1.0` AND `signal_reason = "clear_match"`
4. **LLM disabled**: `enable_vlm = false`

---

## Output Structure

### Reasoning Result
```python
{
    "defect_type": str,           # Final classification
    "root_cause": str,            # Explanation
    "severity": str,              # "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    "recommended_action": str,    # Corrective action
    "confidence": str,            # "LOW" | "MEDIUM" | "HIGH"
    "gate": str,                  # "fast_path" | "geometry" | "signal" | "llm" | "fallback"
    "geometry_score": float,      # From Gate 2
    "signal_strength": float,     # From Gate 3
    "llm_used": bool              # Whether Gate 4 was invoked
}
```

---

## Configuration Tuning

### Increase Fast-Path Usage (reduce LLM cost)
```yaml
reasoning:
  fast_path:
    min_avg_prob: 0.65          # Lower (was 0.70)
    min_porosity_score: 0.65    # Lower (was 0.70)
  gate2_score_threshold: 0.70   # Higher (was 0.60)
```

### Increase LLM Usage (improve accuracy)
```yaml
reasoning:
  gate2_score_threshold: 0.50   # Lower (was 0.60)
  geometry_confidence_threshold: 0.90  # Higher (was 0.85)
  fast_path:
    enabled: false              # Disable fast-path
```

### Balance Cost vs Accuracy
```yaml
reasoning:
  fast_path:
    enabled: true               # Use for obvious cases
    min_avg_prob: 0.70          # Moderate threshold
  gate2_score_threshold: 0.60   # Use LLM for low scores
  max_images: 3                 # Reduce images per call (was 5)
```

---

## Monitoring

### Key Metrics
Track gate usage distribution:
- **Fast-path**: Should be ~40% for porosity-heavy production
- **Geometry**: Should be ~30-40% for cavity defects
- **Signal**: Should be ~60-70% coverage (with feature extraction)
- **LLM**: Should be <30% (cost control)

### Log Messages
```
[REASONING] Fast-path HIT: porosity (cluster_size=7, avg_prob=0.82)
[REASONING] Geometry CONCLUSIVE: porosity_score=0.87 (confidence=HIGH)
[REASONING] Signal MATCH: crack (confidence=1.0, reason=clear_match)
[REASONING] LLM CALLED: ambiguous geometry (porosity_score=0.52)
[REASONING] FALLBACK: LLM disabled, using signal class + KB
```

---

## Performance Benchmarks

| Gate | Avg Latency | API Cost | Accuracy | Hit Rate |
|------|-------------|----------|----------|----------|
| Fast-Path | 5ms | $0 | 95% | 40% |
| Geometry | 50ms | $0 | 88% | 50% |
| Signal | 10ms | $0 | 85% | 70% |
| LLM | 500ms | $0.002 | 92% | 30% |
| **Overall** | **~100ms** | **~$0.0006** | **90%** | **100%** |

**Cost Calculation** (assuming 30% LLM usage):
- 1000 inspections × 0.30 × $0.002 = **$0.60 per 1000 inspections**

---

## Troubleshooting

### Too many LLM calls (high cost)
**Fix**: 
1. Enable fast-path: `fast_path.enabled: true`
2. Raise gate2 threshold: `gate2_score_threshold: 0.70`
3. Reduce max_images: `max_images: 3`

### Low accuracy on porosity
**Fix**:
1. Lower fast-path thresholds (catch more cases)
2. Tune cavity_analysis dark_percentile
3. Check geometry feature extraction quality

### "Unknown" classifications too frequent
**Fix**:
1. Enable LLM: `enable_vlm: true`
2. Lower signal_strength threshold (0.3 → 0.2)
3. Check signal feature extraction coverage

### LLM timeouts or errors
**Fix**:
1. Verify API key: `MISTRAL_API_KEY` env var
2. Check rate limits (60 req/min for Mistral)
3. Enable fallback: System auto-falls back to rule-based

---

## See Also
- **Algorithms**: `../01_overview/technical_reference.md` §7 (Reasoning formulas)
- **Signal System**: `../02_pipeline/signal_system.md` (Gate 3 details)
- **Fusion Logic**: `../02_pipeline/fusion_logic.md` (how reasoning feeds into fusion)
- **Configuration**: `docs/configuration.md` §12 (full parameter list)
