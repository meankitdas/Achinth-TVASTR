# Auto-Calibration System

## Purpose

Continuously optimizes multi-modal fusion weights (YOLO + Signal + LLM + Agreement) by learning from labeled production data through grid search optimization.

## Where Used

- **Pipeline Stage**: Post-inspection (every N traces)
- **Entry Point**: `core/analytics/auto_calibration.py::maybe_run_auto_calibration()`
- **Trigger**: Automatic after N traces (default: 100) OR manual via CLI

---

## System Architecture

```
Pipeline Execution
    ↓ (every run)
Signal Trace Logger → runtime/logs/signal_traces/*.jsonl
    ↓ (every N traces)
Frequency Gate → Safety Gates (cooldown, min samples, max runtime)
    ↓
Weight Calibrator → Grid search (1260 combinations)
    ↓
Config Updater → parameters.yaml (backup + atomic update)
```

---

## How It Works

### 1. Signal Trace Logging

Every pipeline run captures full decision state as JSONL:

**Trace Structure:**
```json
{
  "timestamp": "2026-04-07T00:00:00",
  "inspection_id": "run_abc123",
  "part_type": "201044",
  "yolo_pred": "porosity",
  "yolo_score": 0.87,
  "signal_scores": {"texture": 0.65, "edge": 0.72, ...},
  "signal_score": 0.692,
  "llm_pred": "porosity",
  "llm_score": 0.92,
  "fusion": {"fused_confidence": 0.885, ...},
  "final_pred": "porosity",
  "final_confidence": 0.885,
  "ground_truth": null,  // ← Must be populated for calibration
  "classification_source": "llm_enhanced"
}
```

**Location:** `runtime/logs/signal_traces/<YYYY-MM-DD>.jsonl`

### 2. Safety Gates

Auto-calibration only runs when:

- **Cooldown**: ≥1 hour since last run
- **Min samples**: ≥50 total traces
- **Min labeled**: ≥20 ground truth labels
- **Max runtime**: <2 seconds (abort if exceeded)

### 3. Weight Calibration (Grid Search)

Searches weight combinations: `{yolo: 0.10-0.60, signal: 0.10-0.40, llm: 0.10-0.40, agreement: remainder}`

**Constraints:**
- `sum(weights) = 1.0`
- `agreement ≥ 0.05` (always need consensus)
- `yolo ≥ min_yolo_weight` (config-driven, default 0.10)
- Max weight change: ±0.15 per signal

**Scoring:** `accuracy - λ * weight_change` (stability penalty prefers smaller changes)

**Algorithm:** See `docs/01_overview/technical_reference.md` §8 (Weight Calibration Grid Search)

### 4. Config Update (Atomic)

Updates `parameters.yaml` only if:
- Dataset ≥ 50 samples
- Improvement ≥ 2%
- Weight delta cap applied (max ±0.15)
- `dry_run: false` (otherwise logs only)

**Backup:** Always creates timestamped backup before writing

---

## Per-Part Calibration

Optimizes weights separately for each part type when sufficient data exists (≥50 samples per part).

**Storage:**
```yaml
auto_calibration:
  part_specific:
    "201044":
      weights: {yolo: 0.32, signal: 0.28, llm: 0.26, agreement: 0.14}
      last_updated: "2026-04-07T00:10:00"
      last_dataset_size: 78
      improvement_delta: 0.0512
      enabled: true
```

**Fallback Hierarchy:**
1. Part-specific weights (if available and enabled)
2. Global weights (`multi_signal_fusion` section)
3. System defaults (hardcoded)

---

## Configuration

**File:** `customers/castco/configs/parameters.yaml`

```yaml
auto_calibration:
  enabled: false              # Master switch (set true to enable)
  frequency: 100              # Run every N traces
  min_samples: 50             # Min total traces required
  min_labeled: 20             # Min labeled traces required
  max_trace_days: 30          # Load traces from last N days
  cooldown_hours: 1           # Min hours between runs
  max_weight_delta: 0.15      # Cap weight changes (±)
  dry_run: true               # Log recommendations without applying
  update_weights: true        # Enable weight calibration
  update_confidence: true     # Enable confidence calibration

multi_signal_fusion:
  yolo_weight: 0.40           # YOLO detection weight
  signal_weight: 0.20         # Signal scoring weight
  llm_weight: 0.20            # LLM reasoning weight
  agreement_weight: 0.20      # Inter-signal agreement weight
  min_yolo_weight: 0.10       # Floor constraint
```

---

## Manual Calibration

**CLI Tool:** `scripts/calibrate_signals.py`

```bash
# Dry-run (show recommendations)
python scripts/calibrate_signals.py

# Apply calibration
python scripts/calibrate_signals.py --apply

# Per-part calibration
python scripts/calibrate_signals.py --per-part --apply

# Custom date range
python scripts/calibrate_signals.py --days 60 --apply
```

**Output:**
```
Calibration results:
  Baseline acc:    0.8391
  New acc:         0.8736
  Improvement:     +3.45%
  Search space:    1260 combinations

Recommended weights:
  YOLO:      0.35  (change: -0.05)
  Signal:    0.25  (change: +0.05)
  LLM:       0.25  (change: +0.05)
  Agreement: 0.15  (change: -0.05)
```

---

## Adding Ground Truth Labels

Calibration requires labeled data. Add labels via:

1. **Manual labeling:** Edit JSONL files, set `"ground_truth": "porosity"`
2. **ERP integration:** Pass `ground_truth` from feedback system
3. **Review system:** Export reviewed samples with correct labels

---

## ACO/MOS System

Multi-Objective Optimization System (MOS) balances accuracy, latency, stability, and LLM usage by auto-tuning pipeline parameters.

**Objective Function:** See `docs/01_overview/technical_reference.md` §8 (ACO/MOS Score)

**Optimizable Parameters:**
- `patch_analysis.radius` (80-140)
- `patch_analysis.entropy_penalty` (0.3-0.7)
- `cavity_analysis.geometry.dark_percentile` (18-28)
- `reasoning.fast_path.min_avg_prob` (0.5-0.9)

**Cycle:** Runs every 20 pipeline runs, adjusts one parameter at a time, reverts if objective degrades.

**Monitoring:** `configs/aco_metrics.json`, `configs/mvp_history.json`

---

## ⚠️ Two Independent Weight Systems

**System A: Multi-Modal Fusion Weights** (this document)
- **What:** Fuses YOLO + Signal + LLM + Agreement predictions
- **Stage:** Final classification
- **Optimization:** Grid search
- **Storage:** `parameters.yaml` → `multi_signal_fusion`

**System B: Signal Feature Fusion Weights** (separate)
- **What:** Fuses texture + edge + blob + intensity + geometry
- **Stage:** Signal preprocessing
- **Optimization:** Bayesian/gradient descent
- **Storage:** `runtime/calibration/weights/<part_type>.json`

**Do not confuse** — they operate at different pipeline stages with different inputs.

---

## Troubleshooting

### Auto-Calibration Not Running

**Checks:**
1. Is `auto_calibration.enabled: true`?
2. Are traces being logged? Check `runtime/logs/signal_traces/`
3. Do traces have ground truth labels?
4. Has frequency threshold been reached?
5. Is cooldown active? (check `last_updated` timestamp)

**Force run:**
```python
from core.analytics.auto_calibration import run_auto_calibration
result = run_auto_calibration(config, force=True)
```

### Calibration Keeps Skipping

**Symptom:** Status = `"skipped"`, reason = `"min_samples"` or `"min_labeled"`

**Solution:** Collect more labeled data (≥50 total, ≥20 labeled)

### Weights Not Updating

**Checks:**
1. Is `dry_run: true`? (set to `false`)
2. Is improvement < 2%? (increase data or lower threshold)
3. Is weight delta too large? (max ±0.15 cap applied)

### Performance Degradation After Calibration

**Cause:** Insufficient or biased training data

**Solution:**
1. Check label distribution (balanced across defect types?)
2. Check dataset size (≥200 recommended)
3. Restore from backup: `customers/castco/configs/backups/`

---

---

## Baseline Auto-Update System (Welford's Algorithm)

### Overview

The reasoning pipeline uses **Welford's online algorithm** to maintain running statistics (mean, std) for adaptive threshold computation. This system eliminates the need for storing historical data while providing numerically stable incremental updates.

**See full documentation:** `energy_stability.md` §Phase G

### How It Works

#### Welford's Algorithm

Computes mean and standard deviation incrementally without storing historical values:

```python
# For each new observation:
count = count + 1
delta = value - mean
mean = mean + delta / count
delta2 = value - mean
M2 = M2 + delta * delta2
std = sqrt(M2 / count)
```

**Benefits:**
- **O(1) memory**: No historical data storage required
- **O(1) computation**: Constant time per update
- **Numerically stable**: Avoids catastrophic cancellation
- **Online**: Updates immediately on each observation

#### Tracked Metrics

| Metric | Purpose | Usage |
|--------|---------|-------|
| `topology_score` | Structural coherence | Strong/weak structure thresholds |
| `spread_ratio` | Anomaly distribution | Widespread/localized thresholds |
| `variance` | Score uncertainty | Diffuse/peaked thresholds |
| `scrata_confidence` | SCRATA match quality | SCRATA force threshold |
| `entropy` | Classification ambiguity | Ambiguity smoothing threshold |
| `avg_anomaly` | Anomaly strength | Process defect threshold |

#### Storage Format

**File:** `runtime/telemetry/baselines.json`

```json
{
  "topology_score": {
    "mean": 0.4523,
    "std": 0.1834,
    "count": 1547,
    "M2": 52.08
  },
  "spread_ratio": {
    "mean": 0.3891,
    "std": 0.2145,
    "count": 1547,
    "M2": 71.23
  }
}
```

### Adaptive Threshold Computation

Once sufficient samples collected (default: ≥10), thresholds computed as:

```python
baseline = get_baseline("topology_score")

strong_threshold = baseline["mean"] + baseline["std"]
weak_threshold = baseline["mean"] - baseline["std"]
```

**Example:**
- Mean = 0.45, Std = 0.18
- Strong threshold = 0.63 (mean + std)
- Weak threshold = 0.27 (mean - std)

**Fallback:** If insufficient data, uses conservative defaults:
```python
{
    "strong": 0.7,
    "weak": 0.3,
    "mean": 0.5,
    "std": 0.2
}
```

### Drift Detection

Uses **z-score test** to detect process regime changes:

```python
drift_result = detect_drift(
    metric="topology_score",
    value=current_value,
    z_threshold=3.0
)

if drift_result["is_drift"]:
    logger.warning(
        f"Drift detected in {metric}: "
        f"z_score={drift_result['z_score']:.2f}, "
        f"deviation={drift_result['deviation']:.3f}"
    )
    # Optional: Reset baseline after confirming regime change
    # reset_baseline(metric)
```

**Z-Score Formula:**
```
z_score = |value - mean| / std
```

**Interpretation:**
- z < 2.0: Normal variation
- 2.0 ≤ z < 3.0: Moderate outlier
- z ≥ 3.0: Significant drift (alert)

### Integration with Pipeline

Baselines updated after every successful reasoning run:

```python
# In core/reasoning/pipeline.py (after LLM classification)
try:
    # Update baselines
    if '_topology_score' in locals():
        _update_baselines("topology_score", _topology_score)
    if 'spread_ratio' in locals():
        _update_baselines("spread_ratio", spread_ratio)
    if 'variance' in locals():
        _update_baselines("variance", variance)
    if 'scrata_confidence' in locals():
        _update_baselines("scrata_confidence", scrata_confidence)
    if '_normalized_entropy' in locals():
        _update_baselines("entropy", _normalized_entropy)
    
    logger.info(f"[{casting_id}] Baselines updated")
except Exception as err:
    logger.warning(f"[{casting_id}] Baseline update failed (non-fatal): {err}")
```

### API Usage

```python
from core.reasoning.baselines import (
    _update_baselines,
    get_adaptive_thresholds,
    detect_drift,
    reset_baseline
)

# Update baseline with new observation
_update_baselines("topology_score", 0.68)

# Get adaptive thresholds
thresholds = get_adaptive_thresholds("topology_score")
print(f"Strong: {thresholds['strong']:.3f}")  # mean + std
print(f"Weak: {thresholds['weak']:.3f}")      # mean - std

# Detect drift
drift = detect_drift("topology_score", 0.92, z_threshold=3.0)
if drift["is_drift"]:
    print(f"Drift detected! Z-score: {drift['z_score']:.2f}")
    
# Reset baseline after confirmed regime change
reset_baseline("topology_score")
```

### Configuration

```yaml
reasoning:
  energy_optimization:
    # Adaptive thresholds
    min_baseline_samples: 10      # Min samples before using adaptive
    z_score_threshold: 3.0        # Drift detection threshold
    
    # Drift handling
    auto_reset_on_drift: false    # Automatically reset on drift (use cautiously)
    drift_confirmation_runs: 5    # Consecutive drifts before auto-reset
```

### Monitoring

**Key Metrics:**
- Baseline update frequency (should be every run)
- Sample counts (should grow continuously)
- Z-scores (should stay < 3.0)
- Threshold values (should stabilize after ~100 samples)

**Log Messages:**
```
[BASELINE] Updated topology_score: mean=0.452 std=0.183 count=1547
[BASELINE] Adaptive thresholds: strong=0.635 weak=0.269
[DRIFT] Detected in topology_score: z=3.42 (threshold=3.0)
[DRIFT] Deviation: 0.627 from baseline mean=0.452
```

### Troubleshooting

**Baselines not updating:**
- **Cause**: Pipeline errors preventing update block
- **Fix**: Check pipeline logs for exceptions, verify telemetry integration

**Thresholds always at default (0.7/0.3):**
- **Cause**: Insufficient samples (< 10)
- **Fix**: Wait for more runs, check baseline file exists

**Frequent drift alerts:**
- **Cause**: Process regime change (new casting type, season change, equipment adjustment)
- **Fix**: 
  1. Confirm change is real (check production logs)
  2. Reset affected baselines: `reset_baseline("topology_score")`
  3. Allow ~50 runs to re-establish baseline

**Baseline file corrupted:**
- **Cause**: Disk I/O error, improper shutdown
- **Fix**: Delete `runtime/telemetry/baselines.json`, system will rebuild from scratch

### Difference from Multi-Modal Fusion Calibration

**Welford Baseline System (this section):**
- **What**: Incremental mean/std for adaptive thresholds
- **Metrics**: topology_score, spread_ratio, entropy, etc.
- **Update**: Every reasoning run (online)
- **Storage**: `runtime/telemetry/baselines.json`
- **Purpose**: Replace hardcoded thresholds with data-driven values

**Multi-Modal Fusion Calibration (main document):**
- **What**: Grid search optimization for fusion weights
- **Metrics**: yolo_weight, signal_weight, llm_weight, agreement_weight
- **Update**: Every N traces (batch)
- **Storage**: `parameters.yaml`
- **Purpose**: Optimize final classification fusion

Both systems are complementary and operate independently.

---

## Related Docs

- **Algorithms:** `docs/01_overview/technical_reference.md` §8
- **Energy-Based Reasoning:** `energy_stability.md` (complete documentation)
- **Reasoning Pipeline:** `reasoning_pipeline.md` §Energy-Based Stable Reasoning
- **Fusion Logic:** `docs/02_pipeline/fusion_logic.md`
- **Configuration:** `docs/04_configuration/tuning_guide.md`
