# Topology Reasoning

> **Purpose:** Explain topology score calculation and its role in classification routing  
> **Related:** [Signal Pipeline](../02_pipeline/signal_pipeline.md), [Energy-Based Reasoning](../03_intelligence/energy_reasoning.md), [Full Pipeline](../02_pipeline/full_pipeline.md)  
> **Version:** 1.0  
> **Last Updated:** 2026-05-16

---

## Overview

The **topology score** is the **primary classifier** in the TvastrRAS system under Phase-K. It replaces the legacy YOLO-based defect classification with a **physics-informed, spatial-structural analysis** that measures the **continuity, coverage, and connectivity** of defects in the casting surface.

Unlike traditional object detectors that classify isolated blobs, topology reasoning determines **whether a defect constitutes a systemic failure** based on its **spatial structure** — a critical capability for high-integrity castings.

> **Core Insight**:  
> A single small void may be harmless.  
> A network of interconnected voids (high topology) is catastrophic.

---

## Topology Score Definition

The topology score quantifies the **geometric integrity** of a defect region on a scale from 0.0 to 1.0:

```python
topology_score = 0.7 * coverage_ratio + 0.3 * connectivity_index
```

### 1. Coverage Ratio
Measures the **proportion of the casting surface** affected by the defect.

- **Input**: Binary mask of defect pixels (thresholded from anomaly map)
- **Calculation**:
  ```python
  coverage_ratio = defect_pixel_count / total_image_pixels
  ```
- **Normalized**: Clamped to [0.0, 1.0]
- **Purpose**: Filters out tiny artifacts — only large regions contribute significantly

> Example:  
> - `coverage_ratio = 0.02` → 2% of image covered → low score  
> - `coverage_ratio = 0.25` → 25% covered → high score

### 2. Connectivity Index
Measures **how well defect pixels are connected** — a proxy for crack networks or internal void chains.

- **Method**: Connected Component Analysis (CCA) on defect mask
- **Steps**:
  1. Find all connected regions (using 8-connectivity)
  2. Count regions: `num_components`
  3. Compute expected components if randomly distributed: `expected = sqrt(total_defect_pixels)`
  4. Calculate:
     ```python
     connectivity_index = 1.0 - (num_components - 1) / max(expected, 1)
     ```

> **Why?**  
> - One large cluster → `connectivity_index ≈ 1.0` → high risk  
> - Many small isolated blobs → `connectivity_index ≈ 0.0` → low risk (likely noise)

### Example Scenarios

| Scenario | Coverage | Components | Topology Score | Interpretation |
|----------|----------|------------|----------------|----------------|
| Isolated pore | 0.01 | 1 | 0.10 | Insignificant — single manufacturing flaw |
| Cluster of pores | 0.05 | 4 | 0.18 | Elevated — may indicate process drift |
| Crack network | 0.15 | 1 | 0.72 | Critical — structural weakness |
| Fused voids | 0.30 | 1 | 0.92 | Catastrophic — batch reject |

> The score is designed to **emphasize continuity over size** — a long, thin crack scores higher than a large round void.

---

## Integration with Energy Model

The topology score is **not used directly** for classification — it feeds into the **energy-based reasoning pipeline** as a force:

```python
ΔE_topology = -w_topology × topology_score
```

- `w_topology = 0.30` (highest weight among signals)
- Applied during energy adjustment in `EnergyReasoning` step

> **Why high weight?**  
> Physical defects with high topology are structural hazards, not statistical anomalies.

### Synergy with Anomaly Strength
- **Anomaly strength**: Detects intensity deviations
- **Topology score**: Detects structural coherence
- **Combined**:  
  - High anomaly + high topology → **High confidence REJECT**  
  - High anomaly + low topology → **Manual review (likely artifact)**

> This synergy eliminates false positives from surface glare or sensor noise.

---

## Calibration and Drift Adaptation

- **Baseline**: Calculated over 100+ inspections per plant
- **Stored in**: `runtime/telemetry/baselines.json`
- **Update**: Welford’s online algorithm after every 10 inspections
- **Drift flag**: When `z-score of topology_score > 3.0` for >3 consecutive runs

> **Example drift trigger**:  
> - Baseline mean: 0.12  
> - Recent value: 0.36  
> - z-score = 3.8 → **Auto-reject threshold adjusted upward from 0.60 to 0.70**

> **Purpose**:  
> - Adapts to different casting alloys  
> - Compensates for changing camera illumination  
> - Adjusts to new mold coatings or cleaning procedures

---

## Cross-References

- **Signal Pipeline**: [Signal Pipeline](../02_pipeline/signal_pipeline.md)
- **Energy-Based Reasoning**: [Energy Reasoning](../03_intelligence/energy_reasoning.md)
- **Full Pipeline**: [Full Pipeline](../02_pipeline/full_pipeline.md)
- **Runtime Execution**: [Runtime Execution](../02_pipeline/runtime_execution.md)
- **Auto-Calibration**: [Auto-Calibration](auto_calibration.md)

**Version:** 1.0  
**Last Updated:** 2026-05-16