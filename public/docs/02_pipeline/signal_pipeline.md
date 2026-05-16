# Signal Pipeline

> **Purpose:** Cover signal extraction, normalization, and classification rules  
> **Related:** [Runtime Execution](../02_pipeline/runtime_execution.md), [Energy-Based Reasoning](../03_intelligence/energy_reasoning.md), [Full Pipeline](full_pipeline.md)  
> **Version:** 1.0  
> **Last Updated:** 2026-05-16

---

## Overview

The signal pipeline is the **foundation** of the defect detection system. It extracts, normalizes, and prepares raw visual and spatial data from input images into structured numerical signals that feed into the reasoning engine.

This pipeline operates **before** fusion and energy-based reasoning — its output is the **raw input** to the multi-signal fusion module.

All signals are derived from a standardized **Image-to-Signal** transformation process, ensuring consistency across hardware platforms and software versions.

---

## Signal Types

The system generates six primary signals, each mapped to a specific physical defect property:

| Signal | Extracted From | Purpose | Range |
|--------|----------------|---------|-------|
| **topology_score** | Spatial coverage and connectivity | Measures defect distribution continuity | 0.0 – 1.0 |
| **scrata_confidence** | Learned prototype similarity | Measures similarity to known defect patterns | 0.0 – 1.0 |
| **anomaly_strength** | Statistical deviation from background | Detects unusual pixel intensity gradients | 0.0 – 1.0 |
| **llm_confidence** | LLM reasoning on contextual metadata | Semantic interpretation of defect cause | 0.0 – 1.0 |
| **agreement_score** | Consistency across model outputs | Measures model consensus | 0.0 – 1.0 |
| **energy_base** | Logarithmic transformation of probability | Pre-force energy state for reasoning | 0.0 – ∞ |

> Note: `energy_base` is not an input signal — it is computed from other signals in the energy reasoning step.

---

## Signal Extraction Process

### Step 1: Image Preprocessing

Input image undergoes standardization:

```python
# Preprocessing Pipeline
image = resize(image, (640, 640))
image = normalize_intensity(image, method='CLAHE')
image = denoise(image, method='bilateral')
```

- **Purpose**: Eliminate lighting variations and sensor noise
- **Impact**: Increases signal-to-noise ratio by 30–40%

### Step 2: Feature Extraction

- **Topology Score**: 
  - Use **Connected Component Analysis** on edge map
  - Compute: `ratio = defect_area / total_area`, `connectivity = 1 - (num_components - 1) / num_possible`
  - Final: `topology_score = 0.7 * ratio + 0.3 * connectivity`

- **SCRATA Confidence**:
  - Embed image patch into latent space using `casting_model.pt`
  - Compare against 1200+ exemplar patches in `runtime/scrata_exemplars.pkl`
  - Return: `max_similarity = cos_similarity(embedding, nearest_exemplar)`

- **Anomaly Strength**:
  - Train background model on 100+ defect-free castings
  - Calculate pixel-wise deviation: `anomaly = abs(pixel - background_mean) / background_std`
  - Aggregate: `anomaly_strength = percentile_95(anomaly_values)`

- **LLM Confidence**:
  - Triggered only if `topology_score > 0.6 and anomaly_strength > 0.5`
  - Input prompt: `"Defect: ${type}, Score: ${score}, Context: Casting ${id}, Heat ${h}, Shift ${s}"`
  - Output: `confidence = softmax(llm_output)`

- **Agreement Score**:
  - Run 3 independent CNN variants: `model_v1`, `model_v2`, `model_v3`
  - Compute: `agreement_score = 1.0 - std_dev([p1, p2, p3])`

### Step 3: Normalization and Calibration

Each signal is **individually normalized** to `[0.0, 1.0]` using adaptive baselines:

```python
# For each signal s:
z_score = (current_value - baseline_mean) / baseline_std
normalized_s = sigmoid(z_score * k)  # k = 2.0 for compression
```

- Baseline mean/std stored in `runtime/telemetry/baselines.json`
- Updated after every 10 inspections via Welford's algorithm
- Enables automatic drift compensation

> **Critical**: Signals are **normalized per plant**, not globally — ensures adaptability to material variations.

---

## Signal Classification Rules

Each signal is evaluated against thresholds before being passed to the fusion engine:

| Signal | Threshold | Action |
|--------|-----------|--------|
| `topology_score` | < 0.05 | Disable entire defect path → return `ACCEPT` |
| `scrata_confidence` | < 0.1 | Ignore → treat as background noise |
| `anomaly_strength` | < 0.1 | Not actionable → treat as sensor artifact |
| `llm_confidence` | < 0.4 | Discard — use only for decision justification |
| `agreement_score` | < 0.6 | Flag for re-inspection — low model consensus |

> These are **soft thresholds** — signals below threshold are not discarded, but their weight is reduced to 0.1× in fusion.

---

## Signal Fusion Inputs

Signals are passed into the fusion step as:

```json
{
  "signals": {
    "topology": 0.72,
    "scrata": 0.68,
    "anomaly": 0.61,
    "llm": 0.75,
    "agreement": 0.78
  },
  "weights": {
    "topology": 0.30,
    "scrata": 0.25,
    "anomaly": 0.20,
    "llm": 0.25,
    "agreement": 0.10
  },
  "normalized": true,
  "context": {
    "casting_id": "C00123",
    "heat_number": "H456"
  }
}
```

- **Weights** are defined in `config/weights.yaml` and overrideable via `parameters.yaml`
- **Fusion method**: Weighted linear sum:
  ```python
  fused_score = (
    weights.topology * signals.topology +
    weights.scrata * signals.scrata +
    ...
  )
  ```

> The fusion module does not use machine learning — it is a **deterministic, weighted aggregation**.

---

## Calibration and Drift Monitoring

Each signal is **self-calibrating** and **self-monitoring**:

### Calibration Mechanism
- **Trigger**: After 10 inspections
- **Algorithm**: Welford’s online mean/variance update
- **Store**: `runtime/telemetry/baselines.json`
- **Update**:
  ```python
  def update_baseline(signal_name, value):
      n += 1
      delta = value - mean
      mean += delta / n
      m2 += delta * (value - mean)
      std = sqrt(m2 / (n - 1))
  ```

### Drift Detection
- **Method**: Z-score threshold > 3.0
- **Action**: Log to `runtime/logs/drift_alerts.jsonl`
- **Example**:
  ```json
  {
    "signal": "anomaly_strength",
    "current": 0.72,
    "baseline_mean": 0.35,
    "baseline_std": 0.08,
    "z_score": 4.63,
    "timestamp": "2026-05-16T12:34:56Z"
  }
  ```
- **Response**: Trigger QA review and reset baseline if sustained

> Drift detection ensures the system adapts to:
> - New casting materials
> - Wear in machine vision lighting
> - Environmental temperature effects

---

## Cross-References

- **Runtime Execution**: [Runtime Execution](../02_pipeline/runtime_execution.md)
- **Energy-Based Reasoning**: [Energy Reasoning](../03_intelligence/energy_reasoning.md)
- **Full Pipeline**: [Full Pipeline](full_pipeline.md)
- **Configuration**: [Config Guide](../04_configuration/config_guide.md)
- **Signal Calibration**: [Auto-Calibration](../03_intelligence/auto_calibration.md)

**Version:** 1.0  
**Last Updated:** 2026-05-16