# Manufacturing Intelligence

> **From Single Rejections to Plant-Wide Intelligence**

---

## Overview

The inspection pipeline detects defects in individual castings. But **Manufacturing Intelligence** takes it further: it learns from patterns across thousands of inspections, understands context, and provides strategic insights that help you prevent defects before they occur.

This layer transforms raw rejection data into actionable intelligence for continuous improvement.

---

## Prototype & Reference Systems

### The Challenge: Aligning AI with Your Standards

Every foundry has its own definition of "acceptable" quality. What one plant rejects, another might accept based on:
- Customer specifications
- Application criticality  
- Historical tolerance
- Downstream rework capabilities

**How does the AI learn your standards?**

### The Prototype System

During initial deployment, your quality team provides **reference parts** labeled as:
- ✓ **Good examples** — acceptable castings
- ✗ **Bad examples** — clear rejections
- ⚠ **Borderline cases** — marginal quality

The system builds a **prototype bank** of feature patterns from these examples. When inspecting new castings, it compares them to your prototypes and asks: *"Is this more similar to our 'good' references or 'bad' references?"*

This creates a **human bridge** between AI detection and plant-specific standards.

### The SCRATA System

**SCRATA** (Standard Casting Reference for Anomaly Testing and Analysis) provides:
- Industry-standard defect classification
- Reference images for common defect types
- Common vocabulary across shifts and engineers

When the AI detects a defect, SCRATA mapping ensures everyone—from shop floor to engineering—uses consistent terminology in reports and documentation.

**Example:** AI detects "irregular cavity with dendritic pattern" → SCRATA maps to → **"Shrinkage (SCRATA Class 2.1)"**

---

## Reasoning Pipeline

Traditional systems just score pixels. TvastrRAS **reasons** across time, context, and multiple sources of evidence.

### How Reasoning Works

The reasoning engine considers:
1. **Multiple inspections** for the same part (if available)
2. **Heat context** — properties of the melt batch
3. **Mold history** — cycle count, maintenance records, prior defects
4. **Shift patterns** — operator experience, time of day, equipment state
5. **Process flags** — furnace temperature deviations, sand quality alerts

### Example Reasoning Scenario

**Casting ABC-5678** shows moderate porosity (AI confidence: 65%).

**Without reasoning:** Borderline case → MANUAL_REVIEW

**With reasoning:**
- This heat (HT-9912) has 8 prior rejections for porosity today
- Mold M-450 is at cycle 2,847 (near replacement threshold)
- Temperature logs show furnace ran 15°C low during pour
- Previous casting from same heat was rejected

**Reasoning conclusion:** *"High probability of real defect due to heat-level pattern + process conditions"*

**Decision:** Escalate to REJECT with **high confidence**, skip manual review

### The Value

Reasoning reduces:
- **False positives** — borderline visual signals get downweighted if context is normal
- **Manual review burden** — more confident automated decisions
- **Missed patterns** — catch systemic issues across multiple castings

---

## Auto-Calibration & Self-Tuning

### The Problem with Static Thresholds

Traditional inspection systems are **set once and drift forever**:
- Thresholds too sensitive → nuisance alarms, production slowdown
- Thresholds too loose → defects slip through, customer complaints
- Manual tuning required → expensive, time-consuming, reactive

### How Auto-Calibration Works

TvastrRAS continuously monitors:
- **Supervisor corrections** — when a human overrides an AI decision
- **Downstream outcomes** — did "accepted" castings actually pass final QC?
- **False alarm rate** — are we generating too many MANUAL_REVIEW cases?

The system automatically adjusts:
- Detection sensitivity per defect class
- Fusion weights for different signals  
- ACCEPT/REJECT thresholds
- Zone-specific rules (gate vs. riser vs. body)

### Real-World Example

**Week 1:** System rejects 25% of castings (too sensitive)  
→ Operators validate → many false positives

**Week 4:** Auto-calibration reduces rejection threshold  
→ Rejection rate drops to 12% with same true positive rate

**Week 8:** New sand supplier causes texture change  
→ Anomaly system detects drift → auto-adjusts to new baseline

**Result:** No manual knob-twiddling. The plant's own behavior trains the system.

---

## Fingerprinting

### What Is a Fingerprint?

A **fingerprint** is a unique pattern signature for:
- A specific part over time
- A heat (melt batch)
- A mold or tool
- A shift or operator

Think of it as a "quality DNA" that captures the characteristic defect pattern.

### How Fingerprinting Helps

#### 1. Rapid Pattern Matching

**New casting arrives with defect pattern X**  
→ System checks: "Have I seen this pattern before?"  
→ Matches fingerprint from Heat H-5500 (rejected yesterday)  
→ **Alert:** "Same pattern as H-5500 — likely systemic issue"

#### 2. Drift Detection

**Mold M-320 fingerprint:**
- Month 1: Clean, minimal defects
- Month 2: Small increase in gate porosity
- Month 3: **Alert!** Fingerprint shows consistent degradation  
→ **Recommendation:** Schedule mold refurbishment before quality crashes

#### 3. Root Cause Correlation

**Heat fingerprints with high porosity** correlate with:
- Furnace zone 2 temperature < 1520°C
- Sand moisture > 4.2%
- Specific ladle operator

System automatically surfaces these correlations for investigation.

### Use Case: "Good Run" Comparison

Before starting a new production batch, quality engineer asks:  
*"Does the current fingerprint match our last good run?"*

- ✓ **Match** → Proceed with confidence
- ✗ **Deviation** → Investigate before mass production

---

## Traceability

### Full Decision Audit Trail

Every inspection decision is **completely traceable**:

| Data Point | Purpose |
|------------|---------|
| **Images** | Original + annotated with bounding boxes |
| **Signal scores** | Vision, anomaly, metadata, historical — all recorded |
| **Model versions** | Which AI models were used (for reproducibility) |
| **Thresholds** | What rules were active at inspection time |
| **User actions** | Who validated, when, and what they decided |
| **Process context** | Heat ID, mold ID, shift, timestamp |

### Why Traceability Matters

#### For Compliance
- **ISO 9001 / IATF 16949** — documented quality system
- **Customer audits** — prove inspection rigor
- **PPAP submissions** — production part approval process
- **8D reports** — when customers complain, show what happened

#### For Continuous Improvement
- **Root cause analysis** — trace rejected parts back to heat/mold/shift
- **Performance tracking** — measure AI accuracy over time
- **Process correlation** — link defects to upstream manufacturing steps

#### For Legal/Liability
- **Product recalls** — identify affected batches
- **Warranty claims** — verify inspection was proper
- **Dispute resolution** — objective evidence for quality disagreements

---

## Plant-Level Intelligence

### From One Part to the Whole Plant

Individual inspections are tactical. Plant Intelligence is **strategic**.

### Heat-Level Quality Maps

```
Heat H-9912 (Melt: 2024-04-07 06:00)
├─ Total parts inspected: 47
├─ Rejection rate: 28% (13 rejects)
├─ Primary defect: Porosity (9 cases)
├─ Secondary defect: Shrinkage (4 cases)
├─ Root cause hypothesis: Low pouring temp + high sand moisture
└─ Recommended action: Adjust furnace zone 2, check sand conditioning
```

### Tool & Mold Health Tracking

The system tracks **every mold's quality history**:
- Rejection rate by cycle count
- Dominant defect types per mold
- Performance degradation curves
- Optimal replacement timing

**Example:**  
Mold M-450 shows **linear increase in gate erosion** after cycle 2,500. System recommends maintenance at 2,800 cycles *before* quality crashes.

### Shift & Operator Patterns

Not to police workers, but to identify:
- **Training opportunities** — which operators need defect recognition refresher?
- **Equipment issues** — one shift's high rejection rate → check that shift's furnace
- **Process variations** — day shift uses different sand mix than night shift?

### Rejection Contribution Analysis

**Where do your rejects come from?**

```
Top Rejection Contributors (Last 30 Days):
1. Gate region porosity        → 34% of rejects
2. Riser shrinkage             → 22% of rejects  
3. Sand inclusion (body)       → 18% of rejects
4. Surface roughness (general) → 15% of rejects
5. Other                       → 11% of rejects
```

Focus improvement efforts on **gate region porosity** first — biggest impact.

---

## The Intelligence Loop

Manufacturing Intelligence creates a **virtuous cycle**:

```
┌─────────────────────────────────────────────────┐
│  1. Inspect → Detect defects                    │
└───────────────────┬─────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────┐
│  2. Learn → Build fingerprints, detect patterns │
└───────────────────┬─────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────┐
│  3. Reason → Understand context and root causes │
└───────────────────┬─────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────┐
│  4. Adjust → Auto-calibrate thresholds          │
└───────────────────┬─────────────────────────────┘
                    ▼
┌─────────────────────────────────────────────────┐
│  5. Prevent → Alert before defects occur        │
└───────────────────┬─────────────────────────────┘
                    │
                    └──────────► (back to step 1)
```

**Result:** Quality improves continuously without manual intervention.

---

## Real-World Impact

### Case Study: From Alert to Action

**Monday 06:00** — Plant Intelligence detects heat-level drift  
→ Heat H-5601 shows 18% rejection rate (normal: 8%)

**Monday 06:15** — Shift supervisor reviews dashboard  
→ Sees primary defect: porosity in gate region  
→ Checks furnace logs: Zone 2 temp dropped overnight

**Monday 06:30** — Corrective action taken  
→ Furnace tech adjusts temperature  
→ Next heat (H-5602) returns to 9% rejection rate

**Impact:** Caught and fixed in 30 minutes instead of after 200 bad castings.

---

**Next:** [Dashboard & Reporting](dashboard_reporting.md) — Visualizing intelligence for decision-making
