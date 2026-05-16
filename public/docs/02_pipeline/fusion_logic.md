# Fusion Logic

## Purpose
Multi-signal weighted fusion that combines Signal, LLM, and Agreement scores into a single final confidence score for defect classification.

**Phase 10 Update**: YOLO has been completely removed from the fusion layer (0% weight). YOLO is now purely a spatial detector for casting body cropping, with zero influence on defect classification.

## Where Used
- **Pipeline Stage**: Stage 4 (Multi-Signal Fusion)
- **Entry Point**: `core/reasoning/multi_signal_fusion.py::fuse_scores()`
- **Called By**: `core/ui/run_pipeline.py` (after consolidation)

## Related Docs
- **Algorithms**: See `../01_overview/technical_reference.md` §6 (Scoring & Fusion)
- **Signal System**: See `signal_system.md` (signal classifier output)
- **Auto-Calibration**: See `../03_intelligence/auto_calibration.md` (weight optimization)

---

## Architecture Overview

### Fusion Flow (Phase 10)
```
Individual Signals:
  ├─> YOLO Score (REMOVED — 0% weight, spatial detector only)
  ├─> Signal Score (0.75) — PRIMARY CLASSIFIER
  ├─> LLM Score (0.92) — VALIDATION LAYER
  └─> Agreement Score (0.85) — CONSENSUS LAYER
      ↓
Weighted Fusion:
  final_confidence = 0.45*signal + 0.35*llm + 0.20*agreement
      ↓
Agreement Adjustment (2-Tier):
  ├─> Strong Agreement (signal+LLM agree) → ×1.1 boost
  ├─> Strong Disagreement (high-conf conflict) → ×0.85 penalty
  └─> Mild/Partial → ×1.0 (no adjustment)
      ↓
Final Confidence (clamped to [0, 1])
```

### Weight Distribution (Phase 10)
| Signal | Weight | Role |
|--------|--------|------|
| **Signal** | **45%** | PRIMARY CLASSIFIER (signal intelligence - texture, edge, blob, intensity, geometry) |
| **LLM** | **35%** | VALIDATION LAYER (multimodal reasoning validates signal findings) |
| **Agreement** | **20%** | CONSENSUS LAYER (signal+LLM agreement bonus) |
| ~~YOLO~~ | ~~0%~~ | **REMOVED FROM FUSION** — purely spatial detector for casting body cropping |

**Phase 10 Architecture Change**: 
- YOLO **COMPLETELY REMOVED** from defect classification (0% weight)
- YOLO role: **spatial detector only** (casting body localization/cropping)
- Signal promoted from 40% → **45%** (dominant voice)
- LLM promoted from 20% → **35%** (validation layer)
- Agreement remains at **20%** (but now 2-tier: signal+LLM only, no YOLO)

---

## Fusion Formula (Phase 10)

### Basic Weighted Fusion
**File**: `core/reasoning/multi_signal_fusion.py::fuse_scores()`

**Formula** (Phase 10 - YOLO removed):
```
final_confidence = w_signal * signal + w_llm * llm + w_agreement * agreement

where:
  w_signal = 0.45 (PRIMARY - signal intelligence)
  w_llm = 0.35 (VALIDATION - multimodal reasoning)
  w_agreement = 0.20 (CONSENSUS - agreement bonus)
  
  Constraint: w_signal + w_llm + w_agreement = 1.0
  
  Note: YOLO score is HARD-CODED to 0.0 in code (spatial detector only)
```

### Graceful Degradation
If a signal is missing, its weight is redistributed proportionally:

**Example**: If LLM unavailable (35% weight missing):
```
w_signal' = 0.45 / 0.65 = 0.692
w_agreement' = 0.20 / 0.65 = 0.308

final_confidence = 0.692*signal + 0.308*agreement
```

---

## Agreement Logic (3-Tier Refinement)

### TIER 1: Strong Agreement
**Condition**: All 3 classifiers (Signal, LLM, YOLO) predict same defect type

**Action**: Boost confidence by **×1.1**

**Rationale**: Multiple independent signals agreeing increases reliability

**Example**:
```
Signal: porosity (0.75)
YOLO: porosity (0.87)
LLM: porosity (0.92)

→ Strong agreement detected
→ Multiplier: ×1.1
```

---

### TIER 2: Strong Disagreement
**Condition**: 
- Signal confidence > 0.7 **AND** LLM confidence > 0.7
- BUT they predict **different defect types**

**Action**: Penalize confidence by **×0.85**

**Rationale**: High-confidence classifiers disagreeing suggests ambiguous case

**Example**:
```
Signal: crack (0.85)
LLM: porosity (0.90)

→ Strong disagreement detected
→ Multiplier: ×0.85
```

---

### TIER 3: Mild/Partial
**Condition**: Neither strong agreement nor strong disagreement

**Action**: No adjustment (**×1.0**)

**Cases**:
- Low confidence predictions (< 0.7)
- Partial agreement (2 out of 3 agree)
- Mixed confidence levels

---

## Fusion Breakdown

### Output Structure
```python
{
    "final_confidence": 0.75,
    "fusion_breakdown": {
        "signal_contrib": 0.30,    # 40% × 0.75
        "yolo_contrib": 0.15,      # 20% × 0.75
        "llm_contrib": 0.18,       # 20% × 0.90
        "agreement_contrib": 0.12   # 20% × 0.60
    },
    "available_signals": ["signal", "yolo", "llm", "agreement"],
    "fusion_method": "weighted",
    "agreement_boost_applied": true,
    "agreement_multiplier": 1.1
}
```

### Contribution Calculation
Each signal's contribution is:
```
contrib = weight × signal_score
```

Total contribution sums to `final_confidence` (before agreement adjustment).

---

## Auto-Calibration Integration

### Weight Optimization
**File**: `core/analytics/auto_calibration.py`

**Purpose**: Automatically learn optimal weights from labeled production data.

**Method**: Grid search over weight combinations
- Search space: ~1260 combinations
- Constraints:
  - `sum(weights) = 1.0`
  - `agreement ≥ 0.05` (always need consensus)
  - `yolo ≥ min_yolo_weight` (config-driven, default 0.10)
- Stability penalty: Prefers smaller weight changes
- Max weight change: ±0.15 per signal

**Trigger**: Every N traces (default 100) with cooldown

**Update Condition**:
- Improvement ≥ 2%
- Dataset ≥ 50 samples
- ≥ 20 labeled samples

**See**: `../03_intelligence/auto_calibration.md` for full details

---

## Per-Part Calibration

### Purpose
Optimize fusion weights separately for each part type.

### Storage
```yaml
# customers/castco/configs/parameters.yaml

auto_calibration:
  part_specific:
    "201044":
      weights:
        yolo: 0.32
        signal: 0.28
        llm: 0.26
        agreement: 0.14
      last_updated: "2026-04-07T00:10:00"
      last_dataset_size: 78
      improvement_delta: 0.0512
      enabled: true
```

### Fallback Hierarchy
At runtime, the system uses:
1. **Part-specific weights** (if available and `enabled: true`)
2. **Global weights** (from `multi_signal_fusion` section)
3. **System defaults** (hardcoded fallback)

**See**: `../03_intelligence/auto_calibration.md` §"Per-Part Calibration"

---

## Configuration (Phase 10)

```yaml
# customers/castco/configs/parameters.yaml

multi_signal_fusion:
  # Phase 10 Fusion weights (must sum to 1.0)
  yolo_weight: 0.0          # REMOVED — YOLO is spatial detector only (hard-coded to 0.0 in code)
  signal_weight: 0.45       # PRIMARY CLASSIFIER (signal intelligence)
  llm_weight: 0.35          # VALIDATION LAYER (multimodal reasoning)
  agreement_weight: 0.20    # CONSENSUS LAYER (signal+LLM agreement)
  
  # Constraints
  min_yolo_weight: 0.0      # Phase 10: YOLO removed (was 0.10)
  min_agreement_weight: 0.05  # Minimum agreement weight
  
  # Agreement logic (2-tier: signal+LLM only, YOLO excluded)
  agreement_boost_multiplier: 1.1      # Strong agreement boost
  disagreement_penalty_multiplier: 0.85  # Strong disagreement penalty
  disagreement_confidence_threshold: 0.7  # Min confidence for disagreement
```

**Phase 10 Changes**:
- `yolo_weight: 0.0` (YOLO completely removed from fusion)
- `signal_weight: 0.45` (increased from 0.40 — PRIMARY classifier)
- `llm_weight: 0.35` (increased from 0.20 — VALIDATION layer)
- Agreement now 2-tier (signal+LLM), YOLO excluded
- YOLO role: **Spatial detector only** (casting body cropping)

---

## Usage Examples

### Example 1: Basic Fusion
```python
from core.reasoning.multi_signal_fusion import fuse_scores

result = fuse_scores(
    yolo=0.87,
    signal=0.75,
    llm=0.92,
    agreement=0.85,
    config=config
)

print(f"Final confidence: {result['final_confidence']}")
print(f"Fusion breakdown: {result['fusion_breakdown']}")
print(f"Agreement multiplier: {result.get('agreement_multiplier', 1.0)}")
```

### Example 2: Missing Signal (Graceful Degradation)
```python
# LLM not available
result = fuse_scores(
    yolo=0.87,
    signal=0.75,
    llm=None,  # Missing signal
    agreement=0.85,
    config=config
)

# Weights automatically redistributed
print(f"Available signals: {result['available_signals']}")
# Output: ['signal', 'yolo', 'agreement']
```

### Example 3: Defect-Level Fusion
```python
from core.reasoning.multi_signal_fusion import fuse_defect_scores

defect = {
    "signal_prediction": "porosity",
    "signal_score": 0.75,
    "yolo_prediction": "porosity",
    "confidence": 0.87,  # YOLO confidence
    "llm_prediction": "porosity",
    "llm_confidence": 0.92,
    "agreement_score": 0.85
}

result = fuse_defect_scores(defect, config)
print(f"Fused confidence: {result['final_confidence']}")
```

### Example 4: Inspection-Level Fusion
```python
from core.reasoning.multi_signal_fusion import fuse_inspection_scores

inspection = {
    "defects": [
        {
            "signal_prediction": "porosity",
            "signal_score": 0.75,
            "yolo_prediction": "porosity",
            "confidence": 0.87,
            "llm_prediction": "porosity",
            "llm_confidence": 0.92,
            "agreement_score": 0.85
        }
    ]
}

fused = fuse_inspection_scores(inspection, config)
print(f"Overall confidence: {fused['overall_confidence']}")
print(f"Per-defect fusion: {fused['defects'][0]['fusion_info']}")
```

---

## Tuning Guide

### Increase Signal Influence
```yaml
multi_signal_fusion:
  signal_weight: 0.50    # Increase signal
  yolo_weight: 0.15      # Decrease YOLO
  llm_weight: 0.20       # Keep LLM
  agreement_weight: 0.15  # Decrease agreement
```

### Increase YOLO Influence
```yaml
multi_signal_fusion:
  signal_weight: 0.30    # Decrease signal
  yolo_weight: 0.30      # Increase YOLO
  llm_weight: 0.20       # Keep LLM
  agreement_weight: 0.20  # Keep agreement
```

### More Conservative (Stronger Agreement Requirement)
```yaml
multi_signal_fusion:
  agreement_weight: 0.30              # Increase agreement weight
  agreement_boost_multiplier: 1.2     # Stronger boost for agreement
  disagreement_penalty_multiplier: 0.75  # Harsher penalty for disagreement
```

---

## Monitoring

### Key Metrics
Track these in production:
- **Fusion Method**: Should always be "weighted" (not fallback)
- **Available Signals**: Count how often each signal is available
- **Agreement State**: Distribution of strong/disagreement/mild
- **Weight Drift**: Monitor weight changes over time (auto-calibration)

### Log Messages
```
[FUSION] Fusion result: confidence=0.885, method=weighted, agreement_multiplier=1.1
[FUSION] Available signals: ['signal', 'yolo', 'llm', 'agreement']
[FUSION] Strong agreement detected (all signals agree)
[FUSION] Strong disagreement detected (signal=crack, llm=porosity)
```

---

## Troubleshooting

### Confidence always too high/low
**Fix**: Adjust weights or enable auto-calibration

### Agreement logic not triggering
**Check**: 
1. Are all 3 signals (Signal, YOLO, LLM) available?
2. Do they have valid defect type predictions?
3. Is disagreement_confidence_threshold too high?

### Weight changes not applying
**Check**:
1. Is `auto_calibration.enabled: true`?
2. Is `dry_run: true`? (Set to false to apply)
3. Check logs for auto-calibration status

---

## Performance

### Timing
- **Fusion computation**: < 1ms (pure arithmetic)
- **Negligible overhead** compared to inference

### Memory
- **Fusion result dict**: ~1KB per defect

---

## See Also
- **Algorithms**: `../01_overview/technical_reference.md` §6 (Fusion formulas)
- **Signal System**: `signal_system.md` (signal classifier details)
- **Auto-Calibration**: `../03_intelligence/auto_calibration.md` (weight optimization)
- **Full Pipeline**: `full_pipeline.md` (Stage 4 context)
- **Implementation Doc**: `docs/auto_tuning_calibration.md` (full technical details)
