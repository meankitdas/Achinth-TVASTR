# SCRATA Recovery System

## Purpose
**SCRATA** (Standard Casting Reference for Anomaly Testing and Analysis) provides a ground-truth reference bank and recovery mechanism to prevent false negatives when the anomaly detection system fails to detect defects.

## Where Used
- **Pipeline Stage**: Stage 3 (Patch Analysis) - Recovery Path
- **Entry Point**: `core/ui/run_pipeline.py` (RECOVERY PATH section)
- **Trigger**: When anomaly filter returns zero patches AND anomaly_mean < floor threshold

---

## System Architecture

SCRATA operates in **two modes**:

### Mode 1: Classification Signal (Primary)
```
All Patches with Features
    ↓
Compute SCRATA Similarity → Normalized scores (sum=1)
    ↓
Inject into _candidate_scores with 0.5 boost factor
    ↓
Double Normalization (before + after injection)
    ↓
Influences patch classification during scoring
```

### Mode 2: Recovery Mechanism (Safety Net)
```
Anomaly Filter → Zero patches detected
    ↓
Check: anomaly_mean < anomaly_floor? (0.2)
    ↓ YES
SCRATA Recovery Triggered
    ↓
Sort patches by anomaly score (top_k=5)
    ↓
Compute SCRATA + Prototype similarity
    ↓
Keep patches: similarity > threshold (0.7) AND signal_strength > gate (0.3)
    ↓
Recovered patches → Continue pipeline
```

---

## SCRATA as Classification Signal (Primary Mode)

**Purpose:** SCRATA similarity acts as a real classification signal, influencing patch scoring alongside YOLO and signal features.

**Integration Point:** `core/reasoning/pipeline.py` (Phase 6-7)

### Scoring Process

**Step 1: Compute SCRATA Similarity**

For each patch with extracted features:
```python
scrata_scores = compute_scrata_similarity_explicit(feature_vector, scrata_bank)
# Returns: {"porosity": 0.35, "sand_inclusion": 0.25, ...}
# Normalized: sum(scores) = 1.0
```

**Step 2: First Normalization**

Normalize existing `_candidate_scores`:
```python
_candidate_scores = {k: v/total for k, v in _candidate_scores.items()}
```

**Step 3: Inject SCRATA with Boost Factor**

Add SCRATA scores with 0.5 boost:
```python
for defect_type, scrata_score in scrata_scores.items():
    _candidate_scores[defect_type] += scrata_score * 0.5
```

**Step 4: Second Normalization**

Re-normalize after injection:
```python
_candidate_scores = {k: v/total for k, v in _candidate_scores.items()}
```

### Why Double Normalization?

**Problem:** Without double normalization, SCRATA injection biases scores toward defect types with higher initial scores.

**Solution:** Normalize before and after injection to:
1. Ensure all signals start on equal footing
2. Prevent amplification of existing biases
3. Keep final scores in [0, 1] range with sum=1

### Configuration
```yaml
prototype_similarity:
  scrata_boost_factor: 0.5      # Weight for SCRATA signal injection
  scrata_bank_path: "customers/castco/models/scrata_prototypes.json"
```

### SCRATA Confidence Gating (Phase E - Energy-Based)

**Entropy-Based Confidence:**

SCRATA confidence is computed using entropy to measure score distribution:

```python
entropy = -sum(v * log(v + 1e-8) for v in scrata_scores.values())
max_entropy = log(len(scrata_scores))
scrata_confidence = 1 - (entropy / max_entropy)
```

**Why Entropy?**
- Sharp distribution (e.g., [0.8, 0.1, 0.1]) → high confidence (low entropy)
- Flat distribution (e.g., [0.4, 0.3, 0.3]) → low confidence (high entropy)
- Prevents false confidence from max scores in ambiguous cases

**Energy Force Application (NEW - Phase K):**

SCRATA now operates via **energy reduction** instead of multiplicative score boosts:

```python
# When scrata_confidence exceeds adaptive threshold
scrata_thresh = get_adaptive_thresholds("scrata_confidence")
if scrata_confidence > scrata_thresh.get("strong", 0.6):
    # Identify top SCRATA defect type
    top_scrata_type = max(scrata_scores, key=scrata_scores.get)
    
    # Apply energy force (lowers energy = increases probability)
    energy_reduction = -w_scrata × scrata_confidence
    energy[top_scrata_type] += energy_reduction
```

**Key Differences from Legacy Multiplicative Approach:**
- **Additive Force:** Energy reduction rather than score multiplication
- **Adaptive Thresholds:** Uses `get_adaptive_thresholds()` instead of hardcoded 0.6
- **Type-Specific:** Only affects the top SCRATA-matched defect type
- **Lyapunov Stable:** Energy changes checked for stability before conversion back to probabilities

**Parameters:**
- w_scrata: 0.2 (default weight for SCRATA energy force)
- Threshold: Adaptive (strong tier from baseline statistics)

**Example:**
```
SCRATA scores: {"porosity": 0.82, "sand_inclusion": 0.12, "crack": 0.06}
scrata_confidence: 0.85 (high confidence)
→ top_scrata_type = "porosity"
→ energy_reduction = -0.2 × 0.85 = -0.17
→ energy["porosity"] reduced by 0.17 (increases probability after conversion)
```

### Monitoring

**Log Messages:**
```
[SCRATA] Injected similarity scores → porosity=0.42, sand_inclusion=0.18
[SCRATA] Post-injection scores → porosity=0.68, sand_inclusion=0.22
[SCRATA_CONF] 0.85
[ENERGY] SCRATA force applied: porosity energy reduced by 0.17
[STABILITY] stable=True, delta=-0.12
```

---

## SCRATA Bank Structure

**Storage:** `customers/castco/models/scrata_prototypes.json`

**Format:** Same as prototype bank (defect_type → list of 15-dim feature vectors)

```json
{
  "porosity": [
    [0.45, 0.22, 0.68, ..., 0.35],  // SCRATA reference vectors
    [0.41, 0.19, 0.63, ..., 0.32],
    ...
  ],
  "sand_inclusion": [...],
  ...
}
```

**Key Difference from Prototype Bank:**
- **Prototype Bank:** Learned from high-confidence production inspections (continuous learning)
- **SCRATA Bank:** Curated reference set from validated standard castings (manual curation)

**Capacity:** Max 50 vectors per defect type (same as prototype bank)

---

## Recovery Mechanism

**Trigger Conditions:**
1. Anomaly filter returns **zero patches**
2. `anomaly_mean < anomaly_floor` (default: 0.2)

**Why This Matters:** Prevents false ACCEPT when anomaly system misses real defects.

**Recovery Process:**

### Step 1: Select Candidates

Sort all patches by anomaly score (descending), take top_k (default: 5)

### Step 2: Compute Similarities

For each candidate patch:
- Extract 15-dim feature vector
- Compute prototype similarity: `compute_similarity(vector, bank_type="prototype")`
- Compute SCRATA similarity: `compute_similarity(vector, bank_type="scrata")`
- Take maximum of both: `max_similarity = max(max_proto, max_scrata)`

### Step 3: Filter by Similarity + Signal Strength

Keep patch if:
- `max_similarity > similarity_threshold` (default: 0.7)
- `signal_strength > signal_strength_gate` (default: 0.3)

**Algorithm:** See `docs/01_overview/technical_reference.md` §10 (Cosine Similarity)

### Step 4: Update Inference Result

```python
inference_result["patches"] = recovered_patches
inference_result["anomaly_count"] = len(recovered_patches)
inference_result["recovery_triggered"] = True
```

---

## Configuration

**File:** `customers/castco/configs/parameters.yaml`

```yaml
prototype_similarity:
  # Bank paths
  scrata_bank_path: "customers/castco/models/scrata_prototypes.json"
  
  # Recovery settings
  recovery:
    enabled: true                       # Master switch for recovery
    anomaly_floor: 0.2                  # Trigger if anomaly_mean < this
    top_k: 5                            # Max candidates to evaluate
    similarity_threshold: 0.7           # Min SCRATA/proto similarity to recover
  # Signal strength gate (shared with fusion)
  signal_strength_gate: 0.3             # Min signal strength to recover
```

---

## Visual Examples Integration

SCRATA reference images are loaded as visual examples for LLM reasoning.

**Location:** `customers/castco/reference_visuals/{defect_type}/`

**Naming Convention:**
- `*scrata*.jpg` → SCRATA reference image
- `*casting*.jpg` → Real casting example image

**Loading Priority:**
1. Load SCRATA reference first (if exists)
2. Load casting example second (if exists)
3. Max 2 images per defect type (1 SCRATA + 1 casting)

**File:** `core/reasoning/visual_examples_loader.py`

**Result:**
```python
[
  {
    "defect_type": "porosity",
    "label": "SCRATA reference",
    "image_b64": "...",
    "path": "customers/castco/reference_visuals/porosity/porosity_scrata_reference.jpg"
  },
  {
    "defect_type": "porosity",
    "label": "casting example",
    "image_b64": "...",
    "path": "customers/castco/reference_visuals/porosity/porosity_casting_example.jpg"
  }
]
```

---

## When Recovery Triggers

**Scenario 1: Anomaly System Miss**
- Smooth defect (low texture variation)
- Anomaly filter removes all patches (too entropy-like)
- SCRATA similarity detects match → recovers patches

**Scenario 2: Borderline Defects**
- Anomaly scores hover around threshold
- Filter removes all as uncertain
- SCRATA + signal strength confirm defect → recovery

**Scenario 3: New Defect Pattern**
- Never seen before, low anomaly scores
- Matches SCRATA reference → recovery

---

## Monitoring Recovery

**Log Messages:**
```
[RECOVERY] Triggered via SCRATA/prototype similarity → recovered 3 patches (anomaly_mean=0.15)
[RECOVERY] Recovered patch: proto=0.68, scrata=0.82, signal_strength=0.45
[RECOVERY] Not triggered — anomaly_mean=0.35 >= floor=0.20
[RECOVERY] No patches met recovery criteria (anomaly_mean=0.18, tried 5 candidates)
```

**Inspection Result Field:**
```python
inference_result["recovery_triggered"] = True  # or False
```

**Tracking:**
- Check `recovery_triggered` flag in inspection records
- Monitor recovery rate: `COUNT(recovery_triggered=True) / COUNT(*)`
- If recovery rate > 10% → anomaly system needs tuning

---

## Performance

**Typical Timing:**
- SCRATA bank loading: 20–50ms (first use, cached)
- Recovery evaluation: 10–30ms (5 candidates × similarity computation)
- Total overhead: 30–80ms (only when triggered)

**Frequency:**
- Recovery triggers on ~2-5% of inspections (well-tuned system)
- If > 10% → anomaly filter too aggressive

---

## Troubleshooting

### Recovery Never Triggers

**Symptom:** `recovery_triggered=False` always, even on known defects

**Causes:**
1. Anomaly system working well (zero patches rare)
2. `anomaly_mean` always above floor threshold
3. `recovery.enabled: false`

**Fix:**
- This is actually good — recovery is safety net, not primary detection
- If you see false ACCEPTs, lower `anomaly_floor` (0.2 → 0.25)

### Recovery Triggers Too Often

**Symptom:** `recovery_triggered=True` on > 10% of inspections

**Causes:**
1. Anomaly filter too aggressive (removing valid patches)
2. `anomaly_floor` too high

**Fix:**
1. Tune anomaly system: Lower `entropy_penalty` (0.5 → 0.4)
2. Lower `anomaly_floor` (0.2 → 0.15)
3. Check SCRATA bank quality (may contain bad examples)

### SCRATA Similarity Always Low

**Symptom:** `scrata_scores` all < 0.5

**Causes:**
1. SCRATA bank not loaded or empty
2. Feature mismatch (SCRATA vectors from different feature extractor version)
3. SCRATA bank contains poor-quality examples

**Fix:**
1. Check bank exists: `customers/castco/models/scrata_prototypes.json`
2. Rebuild SCRATA bank from validated standard castings
3. Check logs: `[SIMILARITY] Loaded SCRATA bank: X defect types`

---

## Building a SCRATA Bank

### 1. Prepare Standard Castings

Select validated standard castings with known defects:
- **Porosity:** Multiple examples (macro, micro, dispersed)
- **Sand inclusion:** Various sizes
- **Crack:** Different orientations
- **Shrinkage:** Feed-related vs isolated
- **Surface defects:** Flash, cold shuts, etc.

### 2. Extract Features

Run inspections, extract feature vectors from high-confidence patches:

```python
from core.vision.casting.inference import run_patch_inference
from core.reasoning.signal_scoring import compute_region_signal_score

# Run patch inference
inference_result = run_patch_inference(image_path, config)

# Extract features from patches
scrata_vectors = {}
for patch in inference_result["patches"]:
    if patch.get("final_confidence", 0) > 0.90:
        defect_type = patch.get("predicted_class")
        feature_vec = patch.get("signal_features", {})
        
        if defect_type not in scrata_vectors:
            scrata_vectors[defect_type] = []
        
        # Convert feature dict to 15-dim vector
        vec = extract_15dim_vector(feature_vec)
        scrata_vectors[defect_type].append(vec.tolist())
```

### 3. Save SCRATA Bank

```python
import json
from pathlib import Path

bank_path = Path("customers/castco/models/scrata_prototypes.json")
bank_path.parent.mkdir(parents=True, exist_ok=True)

with open(bank_path, "w") as f:
    json.dump(scrata_vectors, f, indent=2)
```

### 4. Add Visual Examples

Save SCRATA reference images to:
```
customers/castco/reference_visuals/
  porosity/
    porosity_scrata_reference.jpg
  sand_inclusion/
    sand_inclusion_scrata_reference.jpg
  ...
```

---

## Best Practices

### 1. Curate SCRATA Bank Carefully

- Use only validated standard castings
- Include diversity (different defect manifestations)
- Avoid edge cases (keep representative examples only)
- 5-10 examples per defect type is sufficient

### 2. Keep SCRATA Separate from Prototype Bank

- **SCRATA:** Stable reference (rarely changes)
- **Prototype:** Continuous learning (grows with production)

Don't mix them — SCRATA is ground truth, prototypes are learned patterns.

### 3. Monitor Recovery Rate

- Recovery rate 2-5%: Healthy (safety net working)
- Recovery rate > 10%: Anomaly system needs tuning
- Recovery rate < 1%: May be too conservative (increase `anomaly_floor`)

### 4. Periodically Validate SCRATA Bank

Every 6-12 months:
- Review SCRATA examples against current standards
- Remove outdated patterns
- Add new defect types if needed

---

## Related Docs
- **Algorithms:** `docs/01_overview/technical_reference.md` §10
- **Prototype System:** `docs/03_intelligence/prototype_system.md`
- **Anomaly System:** `docs/02_pipeline/anomaly_system.md`
- **Configuration:** `docs/04_configuration/tuning_guide.md`
