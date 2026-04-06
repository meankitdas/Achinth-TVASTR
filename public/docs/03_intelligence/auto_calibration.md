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

## Related Docs

- **Algorithms:** `docs/01_overview/technical_reference.md` §8
- **Fusion Logic:** `docs/02_pipeline/fusion_logic.md`
- **Configuration:** `docs/04_configuration/tuning_guide.md`
