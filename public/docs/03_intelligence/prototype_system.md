# Prototype Learning System

## Purpose

Continuously learns defect patterns from high-confidence inspections and maintains a prototype bank for similarity-based classification enhancement through cosine similarity matching.

## Where Used

- **Pipeline Stage**: Stage 6 (Reasoning) + Stage 7 (Learning Hook)
- **Entry Point**: `core/vision/prototypes/similarity_engine.py::compute_similarity()`
- **Learning Hook**: `core/vision/prototypes/prototype_learning.py::update_prototype_bank_batch()`

---

## System Architecture

```
High-Confidence Patches (final_anomaly > threshold)
    ↓
Feature Extraction (15-dim vector)
    ↓
Similarity Engine → Cosine similarity vs Prototype Bank
    ↓
Score Fusion (signal + prototype + SCRATA)
    ↓
Learning Hook → Collect candidates → Batch update bank
```

---

## Prototype Bank Structure

**Storage:** `customers/castco/models/prototypes.json`

**Format:**
```json
{
  "porosity": [
    [0.42, 0.18, 0.65, ..., 0.31],  // 15-dim feature vectors
    [0.38, 0.22, 0.58, ..., 0.29],
    ...
  ],
  "sand_inclusion": [
    [0.51, 0.33, 0.72, ..., 0.44],
    ...
  ]
}
```

**Capacity:** Max 50 prototypes per defect type (runtime safety cap)

**Caching:** Lazy-loaded on first use, cached in memory (`_PROTOTYPE_BANK` global)

---

## Similarity Computation

**Algorithm:** Cosine similarity (normalized to [0, 1])

**Formula:** See `docs/01_overview/technical_reference.md` §10 (Cosine Similarity)

**Process:**
1. Compute cosine similarity between input vector and all prototypes for each defect type
2. Take maximum similarity as score for that defect type
3. Return dict: `{defect_type: max_similarity}`

**Example:**
```python
from core.vision.prototypes.similarity_engine import compute_similarity

feature_vector = np.array([0.42, 0.18, ...])  # 15-dim
proto_scores = compute_similarity(feature_vector, bank_type="prototype")
# → {"porosity": 0.87, "sand_inclusion": 0.45, "crack": 0.32}
```

---

## Score Fusion

**Module:** `core/reasoning/signal_scoring.py::fuse_with_prototypes()`

**Fusion Formula:**
```
final_score[k] = w_signal * signal_score[k] + w_proto * proto_score[k] + w_scrata * scrata_score[k]
```

**Default Weights:**
- Signal: 50%
- Prototype: 30%
- SCRATA: 20%

**Signal-Strength Gating:**
- If `signal_strength < 0.3` → halve prototype/SCRATA weights
- Prevents over-reliance on similarity when signal evidence is weak

**Configuration:**
```yaml
prototype_similarity:
  fusion_weights:
    signal: 0.5
    prototype: 0.3
    scrata: 0.2
  signal_strength_gate: 0.3
```

---

## Continuous Learning

**Learning Hook:** Runs after every inspection (Step 7 in pipeline)

**Candidate Selection Criteria:**
1. **High confidence:** `final_confidence > 0.85`
2. **Strong anomaly:** `final_anomaly > 0.60`
3. **Agreement:** YOLO + Signal + LLM consensus
4. **Not unknown:** `predicted_class != "unknown"`
5. **Has features:** 15-dim feature vector present

**Process:**
1. Collect all candidates that pass criteria
2. Load existing bank
3. Add new prototypes (up to max_per_class limit)
4. **Single atomic write** at end (batch pattern)

**Configuration:**
```yaml
prototype_similarity:
  learning:
    enabled: false                # Master switch
    confidence_threshold: 0.85    # Min confidence
    anomaly_threshold: 0.60       # Min anomaly score
    max_per_class: 50             # Max prototypes per defect type
```

---

## Bank Management

### Loading

**Function:** `core/vision/prototypes/prototype_bank.py::load_prototype_bank()`

**Behavior:**
- Lazy-loaded on first use
- Cached in memory (`_PROTOTYPE_BANK` global)
- Graceful degradation if file not found (empty bank)
- Runtime safety: Caps at 50 prototypes per defect type

### Saving

**Function:** `core/vision/prototypes/prototype_bank.py::save_prototype_bank()`

**Behavior:**
- Atomic write (temp file + rename)
- Converts numpy arrays to JSON lists
- Thread-safe (atomic filesystem operation)

### Cache Clearing

**Function:** `core/vision/prototypes/prototype_bank.py::clear_caches()`

**When to Use:**
- After manual bank edits
- During testing/debugging
- Bank reload needed without restart

---

## Integration Points

### 1. Similarity Computation (Stage 6)

**File:** `core/ui/run_pipeline.py` (PROTOTYPE + SCRATA SIMILARITY INTEGRATION section)

**Process:**
- Compute prototype similarity for all anomalous patches
- Compute SCRATA similarity for all anomalous patches
- Store scores on patch dict: `patch["prototype_scores"]`, `patch["scrata_scores"]`

### 2. Score Fusion (Stage 6)

**File:** `core/ui/run_pipeline.py` (signal/prototype/scrata fusion section)

**Process:**
- Fuse signal + prototype + SCRATA scores
- Compute margin confidence (top1 - top2)
- Store fused scores: `patch["fused_scores"]`

### 3. Learning Hook (Step 7)

**File:** `core/ui/run_pipeline.py` (PROTOTYPE LEARNING HOOK section)

**Process:**
- Collect learning candidates from inspection
- Batch update prototype bank (single write)
- Non-blocking: Learning failure never breaks pipeline

---

## Configuration

**File:** `customers/castco/configs/parameters.yaml`

```yaml
prototype_similarity:
  enabled: true                         # Master switch for similarity computation
  
  # Bank paths
  prototype_bank_path: "customers/castco/models/prototypes.json"
  scrata_bank_path: "customers/castco/models/scrata_prototypes.json"
  
  # Fusion weights
  fusion_weights:
    signal: 0.5                         # Signal-based classification weight
    prototype: 0.3                      # Prototype similarity weight
    scrata: 0.2                         # SCRATA similarity weight
  
  # Signal-strength gating
  signal_strength_gate: 0.3             # If signal_strength < this, halve proto/scrata weights
  
  # Margin confidence
  margin_confidence_threshold: 0.15     # Min margin (top1 - top2) for high confidence
  
  # Continuous learning
  learning:
    enabled: false                      # Learning master switch
    confidence_threshold: 0.85          # Min confidence to add as prototype
    anomaly_threshold: 0.60             # Min anomaly score to add
    max_per_class: 50                   # Max prototypes per defect type
```

---

## Performance

**Typical Timing:**
- Bank loading: 20–50ms (first use, cached afterward)
- Similarity computation: 2–5ms per patch (50 prototypes × 8 defect types)
- Score fusion: <1ms per patch
- Learning hook: 10–30ms (batch write, only when candidates exist)

**Memory Usage:**
- Bank cache: ~500KB (50 prototypes × 8 defect types × 15 dims × 4 bytes)

---

## Troubleshooting

### Prototype Scores Always Zero

**Symptom:** `patch["prototype_scores"] = {}`

**Causes:**
1. Bank file not found or empty
2. Feature extraction failed (no 15-dim vector)
3. `prototype_similarity.enabled: false`

**Fix:**
1. Check bank exists: `customers/castco/models/prototypes.json`
2. Check logs: `[PROTOTYPE] Loaded prototype bank: X defect types`
3. Enable in config: `prototype_similarity.enabled: true`

### Learning Not Working

**Symptom:** Bank not growing despite inspections

**Causes:**
1. `learning.enabled: false`
2. Confidence threshold too high
3. Already at max_per_class capacity

**Fix:**
1. Enable learning: `learning.enabled: true`
2. Lower thresholds temporarily: `confidence_threshold: 0.70`
3. Check logs: `[LEARNING] Added X prototypes to bank`

### Bank Corruption

**Symptom:** JSON decode error on load

**Cause:** Interrupted write or manual edit error

**Fix:**
1. Restore from backup (if exists)
2. Delete corrupt bank (system will create empty bank)
3. Re-run inspections to rebuild bank

---

## Best Practices

### 1. Start with Pre-Seeded Bank

Don't rely on learning from scratch — seed bank with known-good examples:
- Extract features from validated defect images
- Manually create `prototypes.json` with 5-10 examples per defect type

### 2. Monitor Bank Growth

Check bank statistics periodically:
```python
from core.vision.prototypes.prototype_bank import load_prototype_bank
bank = load_prototype_bank()
for defect_type, prototypes in bank.items():
    print(f"{defect_type}: {len(prototypes)} prototypes")
```

### 3. Periodic Bank Cleanup

If bank quality degrades:
- Export current bank as backup
- Filter prototypes by quality metrics
- Rebuild with high-confidence examples only

### 4. Use Learning in Controlled Fashion

Start with `learning.enabled: false` until:
- Signal classifier is well-tuned
- YOLO model is validated
- LLM reasoning is stable

Then enable learning with high thresholds (`confidence: 0.90`) and gradually lower.

---

## Related Docs

- **Algorithms:** `docs/01_overview/technical_reference.md` §10
- **SCRATA System:** `docs/03_intelligence/scrata_system.md`
- **Signal Scoring:** `docs/02_pipeline/signal_system.md`
- **Configuration:** `docs/04_configuration/tuning_guide.md`
