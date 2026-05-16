# SCRATA System — Legacy Component (Phase-K Replacement)

> **Purpose:** Legacy SCRATA (Statistical Classification and Retrospective Topology Analysis) implementation — now obsolete  
> **Where Used:** `core/learning/scrata_similarity.py` (deprecated)  
> **Related:** [Reasoning Pipeline](reasoning_pipeline.md), [Fusion Logic](fusion_logic.md)  
> **Version:** 1.2  
> **Last Updated:** 2026-05-16

---

## Overview

SCRATA was a **multiplicative confidence booster** applied in pre-Phase-K systems (v1–v4), designed to amplify defect confidence scores by matching patch features against a database of known exemplars.

**Formula (Deprecated):**
```
final_confidence = signal_score × scrata_boost
scrata_boost = 1.0 + (scrata_similarity × 0.5)
```

**Limitations:**
- Non-linear amplification → runaway confidence (e.g., 0.8 → 1.0)
- Not physically grounded — no energy conservation
- Caused instability in decision pipeline and violated Lyapunov stability

**Status: Obsolete**  
SCRATA has been entirely replaced by **Phase-K**, which uses additive energy forces for stable, scalable classification.

> ⚠️ **DO NOT USE IN CURRENT SYSTEM** — this module was removed from `core/reasoning/pipeline.py` as of Phase-K deployment (v2.0+). All references to SCRATA as a booster are invalid.

---

## Legacy SCRATA Implementation

```python
# Pre-Phase-K code — now deprecated and archived
def apply_scrata_boost(signal_score, similarity):
    return signal_score * (1.0 + similarity * 0.5)
```

**Similarity threshold:** `similarity > 0.7` activated boost.

**Database Size:** 1200+ exemplars from 2020–2024 production runs.

**Storage:** `runtime/scrata_exemplars.pkl` (read-only, for historical audit only)

---

## Phase-K Replacement

In Phase-K, SCRATA similarity scores are still computed — but **only as a signal feature**, not a multiplier.

**Replacement Mechanism:**
```python
ΔE_scrata = -0.25 × scrata_confidence
```

**Why This Change?**
- **Stable**: Additive forces avoid runaway scoring
- **Consistent**: Fits within energy-based thermodynamic model
- **Explainable**: Contribution to energy state is linear and measurable
- **Compliant**: Ensures Lyapunov stability

SCRATA is now one of **five additive energy forces**:
- Topology: 30%
- Scrata: 25%
- Anomaly: 20%
- LLM: 25%
- Signal: 100% base (not weighted separately)

**Output:** `scrata_confidence` is still available as part of the state trace, but must not be used for direct score scaling.

---

## Cross-References

- [Reasoning Pipeline](reasoning_pipeline.md) — Phase-K system specification
- [Energy Reasoning](energy_reasoning.md) — Complete derivation of energy forces
- [Fusion Logic](fusion_logic.md) — Signal integration and weighting
- [Full Pipeline](../02_pipeline/full_pipeline.md) — End-to-end system flow

---

**Version:** 1.0  
**Last Updated:** 2026-05-16  
**Status:** ARCHIVED — NO LONGER ACTIVE IN PRODUCTION