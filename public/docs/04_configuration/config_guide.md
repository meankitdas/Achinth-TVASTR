# Configuration Guide

> **Purpose:** Guide for understanding system configuration files  
> **Where Used:** All teams  
> **Related:** [System Structure](../01_overview/architecture.md), [Parameters](parameters.md)  
> **Version:** 2.0  
> **Last Updated:** 2026-05-16

---

## Configuration Architecture

TvastrRAS uses a **hierarchical configuration system** with two layers:

| Layer | Type | Location | Purpose |
|-------|------|----------|---------|
| **System Defaults** | `system.yaml` | `configs/` | Factory settings, hardware-specific, read only |
| **Customer Overrides** | `parameters.yaml` | `customers/castco/configs/` | Site-specific tuning, user-modifiable |

> **Core Rule**: `parameters.yaml` **always overrides** `system.yaml` for tunable parameters.

### Load Order
1. Load `configs/system.yaml`
2. Load `customers/castco/configs/parameters.yaml`
3. Merge → Override matching keys
4. Final config passed to pipeline

### Hot Reload
- **`parameters.yaml`**: Auto-reload on modification — no restart needed
- **`system.yaml`**: Changes require full system restart

---

## Parameters File Structure

**`customers/castco/configs/parameters.yaml`** — Customer tuning only

```yaml
# Global
system:
  enabled: true
  mode: production

# Quality gate
quality_gate:
  blur_threshold: 100
  brightness_min: 30
  brightness_max: 225
  contrast_min: 20

# Patch analysis
patch_analysis:
  resize_target: 960
  patch_size: 256
  stride: 128
  min_confidence: 0.40

# Signal features
signal_features:
  feature_gate_threshold: 0.20  # Extract features if YOLO prob ≥ this

# Multi-signal fusion
multi_signal_fusion:
  signal_weight: 0.45
  llm_weight: 0.35
  agreement_weight: 0.20

# Reasoning
reasoning:
  energy_optimization:
    w_topology: 0.30
    w_scrata: 0.25
    w_anomaly: 0.20
    w_llm: 0.25
    lyapunov_epsilon: 0.01
    min_baseline_samples: 10
    z_score_threshold: 3.0
    manual_review_min_confidence: 0.30
    uncertainty_threshold: 0.6

# Decision
decision:
  t_low: 0.30
  t_high: 0.70

# File paths
paths:
  output_dir: "runtime/outputs/"
  telemetry_dir: "runtime/logs/"
```

> **Caution**: Do not modify keys under `system` or `paths`. These are system-wide and require restart or are fixed.

---

## System File Structure

**`configs/system.yaml`** — Factory defaults, protected

```yaml
# Global
system:
  enabled: true
  mode: production
  license_id: "default"

# LLM
llm:
  provider: "mistral"
  mistral:
    api_key_env: "MISTRAL_API_KEY"
    vlm_model: "mistral-small-2603"
    temperature: 0.22
    max_tokens: 800
    top_p: 0.95

# File paths
paths:
  output_dir: "runtime/outputs/"
  telemetry_dir: "runtime/logs/"
  baseline_dir: "runtime/telemetry/"

# Debug
debug:
  enable: false
  log_level: "WARNING"
```

> **Warning**: The `system.yaml` file is **not meant for user editing**.  
> **All user changes must be made in `customers/castco/configs/parameters.yaml`**.

---

## Configuration File Management

### Best Practices
- **Never commit** `parameters.yaml` to version control — it contains site-specific tuning
- Use `git ignore` for `customers/castco/configs/parameters.yaml`
- Use a **configuration template** (`parameters.template.yaml`) for new deployments
- Always diff `system.yaml` with `parameters.yaml` before release
- All parameters in `system.yaml` must have a documented default in `parameters.yaml` — ensure consistency

### Deployment Workflow
1. Install TvastrRAS from package → `system.yaml` installed automatically
2. Copy `parameters.template.yaml` → `customers/castco/configs/parameters.yaml`
3. Edit parameters for site: adjust thresholds, enable/disable components
4. Verify with `validate_config.py`
5. Restart system if `system.yaml` changed

> **Validation Tool**: `scripts/validate_config.py` — checks key presence, type, bounds

---

## Parameter Documentation

| Parameter | Type | Default | Description | Override |
|---------|------|---------|-------------|----------|
| `system.mode` | string | "production" | System mode: production, testing, dev | ❌ |
| `quality_gate.blur_threshold` | int | 100 | Laplacian variance threshold to flag blur | ✅ |
| `patch_analysis.resize_target` | int | 960 | Pixel length of longer image dimension | ✅ |
| `signal_features.feature_gate_threshold` | float | 0.20 | Minimum YOLO prob to extract features | ✅ |
| `multi_signal_fusion.signal_weight` | float | 0.45 | Weight of signal-based classification (PRIMARY) | ✅ |
| `multi_signal_fusion.llm_weight` | float | 0.35 | Weight of LLM reasoning | ✅ |
| `multi_signal_fusion.agreement_weight` | float | 0.20 | Bonus for signal agreement | ✅ |
| `reasoning.energy_optimization.w_topology` | float | 0.30 | Topology force weight (Phase-K) | ✅ |
| `reasoning.energy_optimization.w_scrata` | float | 0.25 | SCRATA force weight (Phase-K) | ✅ |
| `reasoning.energy_optimization.w_anomaly` | float | 0.20 | Anomaly force weight (Phase-K) | ✅ |
| `reasoning.energy_optimization.w_llm` | float | 0.25 | LLM force weight (Phase-K) | ✅ |
| `reasoning.energy_optimization.lyapunov_epsilon` | float | 0.01 | Energy stability tolerance | ✅ |
| `reasoning.energy_optimization.min_baseline_samples` | int | 10 | Min samples before adaptive threshold | ✅ |
| `reasoning.energy_optimization.z_score_threshold` | float | 3.0 | Drift detection z-score | ✅ |
| `reasoning.energy_optimization.manual_review_min_confidence` | float | 0.30 | Trigger manual review if low confidence | ✅ |
| `reasoning.energy_optimization.uncertainty_threshold` | float | 0.6 | Trigger manual review if entropy high | ✅ |
| `decision.t_low` | float | 0.30 | Lower decision threshold (ACCEPT) | ✅ |
| `decision.t_high` | float | 0.70 | Higher decision threshold (REJECT) | ✅ |
| `paths.output_dir` | string | "runtime/outputs/" | Directory for inspection outputs | ❌ |
| `paths.telemetry_dir` | string | "runtime/logs/" | Directory for telemetry logs | ❌ |

> **Legend**: ✅ = customer-override allowed, ❌ = system-only

---

## Troubleshooting Configuration

### Issue: Config not reloading
**Fix**:
- Confirm `parameters.yaml` is in `customers/castco/configs/`
- Check write permissions on file
- Check file encoding: UTF-8, no BOM
- Log: `Configuration file modified - reloading`

### Issue: Parameter ignored
**Fix**:
- Confirm key hierarchy matches: `multi_signal_fusion.signal_weight` not `signal_weight`
- Confirm not in `system.yaml` (overrides only apply to `parameters.yaml`)
- Restart if `system.yaml` was edited

### Issue: `parameters.yaml` missing
**Fix**:
- Copy from `customers/castco/configs/parameters.template.yaml`
- Default values assume optimal for castco — no need to change

> **Important**: All parameters listed in `parameters.yaml` must be documented in `system.yaml` — no undocumented keys.

---

## Cross-References

- **Configuration Architecture**: [Architecture](../01_overview/architecture.md)
- **Full Parameter List**: [Parameters](parameters.md)
- **Validation Tool**: `scripts/validate_config.py`
- **Hot-Reloading**: [Architecture](../01_overview/architecture.md#3-configuration-hot-reload)
- **Baseline Storage**: `runtime/telemetry/baselines.json`
- **Energy-Based Reasoning**: [Reasoning Pipeline](../03_intelligence/reasoning_pipeline.md)

---

**Version:** 2.0  
**Last Updated:** 2026-05-16