# Inspection Pipeline

> **How Raw Inspection Images Become Trusted Rejection Records**

---

## Pipeline Overview

The TvastrRAS inspection pipeline transforms a single casting image into a comprehensive, auditable rejection decision through a **multi-stage process** that combines computer vision, anomaly detection, and multi-signal fusion.

### The Journey: Image → Decision

```
┌──────────────┐
│ Raw Image +  │  Operator uploads image + casting ID
│  Metadata    │  System fetches ERP context (heat, mold, etc.)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 1. Patch     │  Divide image into overlapping regions
│  Extraction  │  Focus AI models on local defect areas
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 2. Defect    │  YOLO-based detection finds candidate defects
│  Detection   │  Bounding boxes + confidence scores
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 3. Anomaly   │  "Does this look unusual?" (vs. normal production)
│  Detection   │  Catches novel defects not in training data
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 4. Signal    │  Extract features from each patch
│  Aggregation │  Combine vision + anomaly + metadata signals
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 5. Fusion    │  Weighted combination of all signals
│  Logic       │  Configurable rules for accept/reject thresholds
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 6. Final     │  ACCEPT / REJECT / MANUAL_REVIEW
│  Decision    │  + confidence score + annotated images
└──────────────┘
```

**Typical processing time:** 3-5 seconds per casting

---

## Stage 1: Image & Patch System

### What Is a "Patch"?

Rather than analyzing an entire casting image at once, TvastrRAS divides it into **overlapping local regions** called "patches." This approach:
- **Zooms into critical zones** — gate areas, risers, known problem regions
- **Improves detection accuracy** — AI models see defects at higher resolution
- **Enables region-specific thresholds** — different sensitivity for different zones

### Example: Gate Area Patch

```
┌─────────────────────────────────────────┐
│         Full Casting Image              │
│                                         │
│   ┌─────────────┐                      │
│   │ Gate Patch  │  ← 256×256 region    │
│   │ Cold shut   │     zoomed in        │
│   │ detected    │                      │
│   └─────────────┘                      │
│                                         │
└─────────────────────────────────────────┘
```

The system generates **multiple patches per image** with 50% overlap to ensure no defect falls between regions.

**Patch metadata includes:**
- Spatial coordinates (x, y position)
- Zone identifier (gate, riser, body, etc.)
- Brightness and contrast metrics
- Historical defect frequency for that zone

---

## Stage 2: Defect Detection

The system applies **YOLO-based defect detection** to each patch, identifying:

| Defect Class | What It Looks Like |
|--------------|-------------------|
| **Porosity** | Small round voids, clustered or dispersed |
| **Shrinkage** | Irregular cavities, dendritic patterns |
| **Crack** | Linear discontinuities, sharp edges |
| **Sand Inclusion** | Foreign material embedded in casting |
| **Surface Roughness** | Texture irregularities, uneven finish |
| **Blow Hole** | Larger spherical voids near surface |

Each detected defect receives:
- **Bounding box** — pixel-level location
- **Confidence score** — 0.0 to 1.0 (how certain the AI is)
- **Defect class** — which of the 6 types
- **Severity estimate** — based on size and location

---

## Stage 3: Anomaly Detection System

### Why Anomaly Detection?

Traditional defect detection models are trained on **known defect types**. But what if:
- A new defect pattern emerges (e.g., new sand supplier causes unusual marks)?
- The defect looks slightly different from training examples?
- Multiple defects combine in an unusual way?

The **anomaly system** answers: *"Does this patch look unusual compared to normal production?"*

### How It Works

The system maintains a statistical model of what "normal" castings look like for your plant. When a patch deviates significantly from this norm, it's flagged as anomalous — even if no specific defect class matches.

**Example scenarios:**
- ✓ New sand mark pattern not in training data → anomaly system catches it
- ✓ Unseen combination of porosity + shrinkage → flagged for review
- ✓ Gradual drift in surface texture → anomaly score increases over time

---

## Stage 4: Signal System

Each inspection generates **multiple independent signals** — think of them as "votes" for acceptance or rejection:

### Signal Types

| Signal | What It Measures |
|--------|-----------------|
| **Vision Score** | Defect detection confidence from YOLO model |
| **Anomaly Score** | Statistical deviation from normal production |
| **Metadata Checks** | Heat properties, mold cycle count, process flags |
| **Operator Flags** | Manual notes or concerns from inspector |
| **Historical Pattern** | Similar castings from this heat/mold |

Each signal produces a **score between 0.0 and 1.0**, where:
- **0.0** = strong evidence for ACCEPT
- **1.0** = strong evidence for REJECT
- **0.5** = uncertain, needs more information

---

## Stage 5: Fusion Logic

The fusion engine combines all signals using **configurable weighting** to arrive at a final score:

### Decision Rules (Conceptual)

```
Final Score = Weighted Average of All Signals

IF Final Score ≥ High Threshold:
  → REJECT (automatic rejection)
  
ELSE IF Final Score ≤ Low Threshold:
  → ACCEPT (automatic acceptance)
  
ELSE:
  → MANUAL_REVIEW (human inspector decides)
```

### Example Fusion Scenario

**Casting XYZ-1234:**
- Vision signal: 0.75 (detected porosity, moderate confidence)
- Anomaly signal: 0.40 (patch looks somewhat unusual)
- Metadata signal: 0.60 (heat had prior issues)
- Historical pattern: 0.70 (similar castings from this mold were rejected)

**Weighted fusion:** (0.75 × 0.4) + (0.40 × 0.2) + (0.60 × 0.2) + (0.70 × 0.2) = **0.68**

**Decision:** If threshold is 0.70 for REJECT → **Result: MANUAL_REVIEW** (close call, needs human judgment)

### Why This Approach Works

Traditional systems rely on a single AI model. If it's wrong, you get a false positive or false negative. TvastrRAS combines **multiple independent signals**, so:
- No single model failure breaks the system
- Uncertain cases route to human review rather than automatic errors
- System learns from real outcomes and adjusts weights over time

---

## Stage 6: Decision Output

Every inspection produces a **structured rejection record** containing:

### Core Data
- **Decision:** ACCEPT / REJECT / MANUAL_REVIEW
- **Confidence:** 0-100% (how certain the system is)
- **Primary defect:** Most significant issue found
- **Defect count:** Total defects detected
- **Severity score:** Weighted importance of defects

### Supporting Evidence
- **Annotated images:** Bounding boxes showing defect locations
- **Signal breakdown:** Individual scores from each signal
- **Reasoning:** Plain-language explanation of decision
- **Root cause (if rejected):** Manufacturing section responsible
- **Corrective action:** Recommended fix

### Traceability
- **Casting ID** and part number
- **Heat ID** and melt properties
- **Mold ID** and cycle count
- **Timestamp** and inspector name
- **Model versions** used for detection
- **All intermediate scores** and thresholds

This full traceability supports:
- Customer audits and PPAP submissions
- 8D problem solving
- ISO 9001 / IATF 16949 compliance
- Continuous improvement analysis

---

## Pipeline Performance

### Speed
- **Typical processing time:** 3-5 seconds per casting
- **Batch mode:** 20-30 castings per minute
- **Bottleneck:** Usually network or disk I/O, not AI inference

### Accuracy Metrics
The system tracks and displays:
- **True positive rate** — correctly identified rejects
- **False positive rate** — false alarms (REJECT when should ACCEPT)
- **False negative rate** — missed rejects (ACCEPT when should REJECT)
- **Manual review rate** — % of castings needing human judgment

Target performance:
- True positive rate > 95%
- False positive rate < 5%
- False negative rate < 2%
- Manual review rate: 10-15%

---

## Continuous Improvement

The pipeline is **self-tuning**:

1. **Operator validates** MANUAL_REVIEW cases
2. **System compares** AI prediction vs. human decision
3. **Weights adjust** automatically to reduce disagreement
4. **Thresholds refine** based on real outcomes
5. **Performance improves** over time with minimal human intervention

For details on the learning mechanism, see [Manufacturing Intelligence](manufacturing_intelligence.md).

---

**Next:** [Manufacturing Intelligence](manufacturing_intelligence.md) — How the system learns and improves
