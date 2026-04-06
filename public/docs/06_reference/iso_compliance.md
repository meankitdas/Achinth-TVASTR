# ISO Compliance & Traceability

> **Purpose:** Traceability, auditability, and reproducibility mechanisms  
> **Alignment:** ISO 9001:2015 (QMS), ISO/IEC 17025:2017 (Testing Labs) — selected principles  
> **Note:** Full compliance requires additional organizational QMS processes outside this system.

---

## Overview

TvastrRAS ensures every quality decision is:

- **Traceable** — Full lineage from raw input to final decision
- **Reproducible** — Exact re-execution produces identical results
- **Auditable** — Complete audit trail in machine-readable format
- **Explainable** — Human-interpretable reasoning included

**ISO Alignment:**
- **ISO 9001:2015** — Clause 7.5 (Documented Information), Clause 8.5.1 (Control of Production)
- **ISO/IEC 17025:2017** — Clause 7.5 (Technical Records), Clause 6.6 (Metrological Traceability)

---

## Scope

This document defines **software-level traceability** within TvastrRAS.

**OUT OF SCOPE** (assumed handled by foundry QMS):
- Operator training and competency management
- Equipment calibration and maintenance
- Environmental condition control
- Risk management and business processes
- Corrective/preventive action workflows
- Internal audits and management review

TvastrRAS provides supporting evidence and traceability data, but does not independently constitute a full ISO 9001 or ISO/IEC 17025 compliant QMS.

---

## Signal Engine Versioning

**File:** `core/analytics/signal_engine.py`

```python
SIGNAL_ENGINE_VERSION = "v1.0.0"

def final_signal(...) -> Dict[str, Any]:
    return {
        "signal_score": float(signal_score),
        "confidence": classify_confidence(total),
        "trend": classify_trend(daily_rates),
        "version": SIGNAL_ENGINE_VERSION,  # ← Versioned
        ...
    }
```

**Purpose:**
- **Reproducibility:** Same inputs + same version → identical results
- **Change Tracking:** Version bump when algorithm changes
- **Audit Trail:** Every alert includes engine version
- **Rollback:** Version identifies which alerts used which engine

**Version History:**

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | 2026-03-28 | Initial versioned release |

---

## Audit Trail

**File:** `core/analytics/audit_logger.py`

```python
LOG_PATH = Path("logs/alerts_log.jsonl")

def log_alert(alert: Dict[str, Any], inputs: Optional[Dict[str, Any]] = None):
    entry = {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        **alert,
    }
    if inputs:
        entry["inputs"] = inputs
    
    with open(LOG_PATH, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry) + "\n")
```

**Format:** JSONL (JSON Lines) — one JSON object per line, append-only.

**Example entry:**

```json
{
  "timestamp": "2026-03-28T12:34:56.789Z",
  "type": "heat_rejection_spike",
  "severity": "HIGH",
  "entity_type": "heat",
  "entity_id": "CC391",
  "message": "Heat CC391 signal severity HIGH: reject rate 18.5% vs baseline 8.2%...",
  "value": 18.5,
  "threshold": 10.0,
  "signal_score": 2.134,
  "confidence": "high",
  "rejection_rate": 0.185,
  "baseline_rate": 0.082,
  "deviation": 1.256,
  "samples": 200,
  "trend": "increasing",
  "version": "v1.0.0",
  "inputs": {
    "rejects": 37,
    "total": 200,
    "baseline_rate": 0.082
  }
}
```

**Retention:**
- **Append-only:** Never overwritten during normal operation
- **Location:** `logs/alerts_log.jsonl`
- **Rotation:** Manual archive recommended quarterly (`alerts_log_YYYY-QN.jsonl`)
- **Backup:** Include in daily backup procedures

**Querying:**

```bash
# Count total alerts
wc -l logs/alerts_log.jsonl

# Filter by entity
grep '"entity_id": "CC391"' logs/alerts_log.jsonl

# Extract HIGH severity alerts
jq 'select(.severity == "HIGH")' logs/alerts_log.jsonl

# Alerts on specific date
grep '"timestamp": "2026-03-28' logs/alerts_log.jsonl
```

---

## Alert Traceability

Every manufacturing alert includes:

| Field | Purpose | ISO Alignment |
|-------|---------|---------------|
| `timestamp` | When alert generated (UTC) | ISO 9001 §7.5.3.2 |
| `type` | Alert category | Classification |
| `severity` | CRITICAL / HIGH / MEDIUM / LOW | Risk assessment |
| `entity_type` | heat / mould / process | Context |
| `entity_id` | Specific entity identifier | Traceability |
| `message` | Human-readable explanation | Documentation |
| `value` | Measured metric | Objective evidence |
| `threshold` | Trigger limit | Control limit |
| `signal_score` | Statistical significance | Quantitative assessment |
| `confidence` | high / medium / low | Data quality |
| `rejection_rate` | Current rate (0-1 fraction) | Performance metric |
| `baseline_rate` | Historical baseline | Comparison |
| `deviation` | Relative deviation | Delta measurement |
| `samples` | Sample count | Statistical validity |
| `trend` | increasing / decreasing / stable / volatile | Trend analysis |
| `version` | Signal engine version | Reproducibility |
| `inputs` | Raw inputs | Reproducibility |

**Reproducibility Test:** Given audit log entry, anyone can extract `inputs`, load signal_engine at `version`, call `final_signal()`, and verify output matches logged values.

---

## Data Integrity

### SQL Persistence

**Database:** MS SQL Server or SQLite

#### AI_Inspections
Primary inspection records (immutable after insert).

| Column | Type | Purpose |
|--------|------|---------|
| `inspection_id` | INT PK | Unique record ID |
| `casting_id` | NVARCHAR | Casting identifier |
| `heat` | NVARCHAR | Heat batch number |
| `mould_serial_no` | NVARCHAR | Mold identifier |
| `decision` | NVARCHAR | ACCEPT / REJECT / MANUAL_REVIEW |
| `inspection_time` | DATETIME | Timestamp (ISO 8601) |
| `casting_score` | FLOAT | Patch classifier score (0-1) |
| `defect_count` | INT | Number of defects detected |
| `primary_defect` | NVARCHAR | Top defect type |
| `pipeline_health` | NVARCHAR | OK / DEGRADED / FAILED |
| `llm_status` | NVARCHAR | used / skipped / failed |
| `classification_source` | NVARCHAR | yolo_only / fused / fast_path / geometry |

**Constraints:**
- Primary key ensures uniqueness
- Foreign keys to ERP `Production_Daywise` for manufacturing context
- No UPDATE/DELETE operations in production (insert-only)

**Hardening Enhancements (2026-04-05):**
- `pipeline_health` tracks system reliability
- `llm_status` indicates LLM reasoning invocation
- `classification_source` shows decision pathway for traceability

#### AI_Defects
Detected defects per inspection (immutable).

| Column | Type | Purpose |
|--------|------|---------|
| `defect_id` | INT PK | Unique defect ID |
| `inspection_id` | INT FK | Links to AI_Inspections |
| `defect_type` | NVARCHAR | porosity, sand_inclusion, unknown, etc. |
| `confidence` | FLOAT | YOLO confidence (0-1) |
| `bbox_x`, `bbox_y`, `bbox_w`, `bbox_h` | INT | Bounding box |
| `grid_cell` | NVARCHAR | Defectograph position (A1-F4, G5-L8) |
| `surface` | NVARCHAR | top / bottom / unknown |
| `zone` | NVARCHAR | Spatial zone (TL, TC, TR, ML, MC, MR, BL, BC, BR) |
| `secondary_zone` | NVARCHAR | Additional zone if boundary |
| `zone_confidence` | FLOAT | Zone assignment confidence (0-1) |

**Hardening Enhancements (2026-04-05):**
- Spatial fields (`grid_cell`, `surface`, `zone`) for grid-based analytics
- "unknown" defect classification when confidence < 0.35
- Zone assignment enables spatial root cause analysis

> See [Data Structures](data_structures.md) for complete schema reference.

#### AI_Defect_Clusters
Spatial defect pattern fingerprints.

| Column | Type | Purpose |
|--------|------|---------|
| `cluster_id` | INT PK | Cluster identifier |
| `part_type` | NVARCHAR | Part number |
| `defect_type` | NVARCHAR | Defect type |
| `centroid_x`, `centroid_y` | FLOAT | Spatial center (0-1 normalized) |
| `mean_size` | FLOAT | Average defect size |
| `created_at` | DATETIME | First observation |
| `updated_at` | DATETIME | Last update |

#### AI_Heat_Analysis
Heat batch intelligence records.

| Column | Type | Purpose |
|--------|------|---------|
| `heat_number` | NVARCHAR PK | Heat identifier |
| `total_castings` | INT | Castings in heat |
| `defective_castings` | INT | Rejected count |
| `defect_rate` | FLOAT | Rejection rate (0-1) |
| `anomaly_flag` | BIT | 1 if >20% defect rate |
| `dominant_defect` | NVARCHAR | Most frequent defect |

### Fallback Storage

If SQL unavailable, system writes to:

- `runtime/outputs/` — Per-inspection JSON files
- `runtime/process_logs/` — CSV manufacturing context
- `runtime/logs/runs/` — Pipeline execution logs (JSONL)

**All fallback files are timestamped and include casting_id for traceability.**

---

## Inspection Pipeline Traceability

**File:** `runtime/logs/runs/YYYY-MM.jsonl`

Every inspection logged with:

```json
{
  "run_id": "20260328-123456-a1b2c3d4",
  "casting_id": "CAST-20260328-123456-0001",
  "timestamp": "2026-03-28T12:34:56Z",
  "pipeline_version": "1.0",
  "model_versions": {
    "casting_model": "yolov8_v2.4",
    "patch_classifier": "resnet50_v1.3"
  },
  "decision": "REJECT",
  "defect_count": 3,
  "primary_defect": "porosity",
  "casting_score": 0.68,
  "execution_time_ms": 2847,
  "yolo_detections": 2,
  "patch_score": 0.72,
  "llm_call": true,
  "llm_response_time_ms": 1523,
  "fast_path": false,
  "geometry_conclusive": false,
  "confidence": "high",
  "reasoning_mode": "LOCAL",
  "pipeline_health": "OK",
  "degradation_reasons": [],
  "llm_status": "used",
  "classification_source": "fused",
  "image_quality": {
    "valid": true,
    "score": 0.92,
    "issues": [],
    "metrics": {
      "blur_score": 87.3,
      "brightness": 142.5,
      "resolution": [1920, 1080]
    }
  }
}
```

**Hardening Enhancements (2026-04-05):**
- `pipeline_health` — System health (OK/DEGRADED/FAILED)
- `degradation_reasons` — Issues causing degradation
- `llm_status` — LLM invocation status
- `classification_source` — Decision pathway used
- `image_quality` — Pre-pipeline quality assessment

### PDF Reports

Generated for every inspection:

**Location:** `runtime/outputs/{casting_id}/{casting_id}_report.pdf`

**Contents:**
- Casting ID, date, decision banner
- Annotated surface image with bounding boxes
- Defect heatmap overlay
- Root cause analysis (LLM reasoning)
- Recommended corrective actions
- Review triggers (if human review needed)
- System metadata (version, models, execution time)

**ISO Alignment:** ISO 9001 §7.5.3.2 (Control of documented information)

---

## System Hardening (2026-04-05)

Comprehensive system hardening enhanced ISO compliance through improved failure visibility, data integrity, and decision transparency.

### Image Quality Gate

**Module:** `core/vision/quality_gate.py`

Pre-pipeline assessment prevents "garbage in → confident garbage out" scenarios.

**Quality Checks:**
- **Blur Detection** — Laplacian variance (default: 50.0)
- **Brightness** — Mean pixel value (range: 20-235)
- **Resolution** — Minimum dimension (default: 300px)

**Traceability Impact:**
- Every inspection includes `image_quality` metrics
- Quality issues trigger `pipeline_health = "DEGRADED"`
- Enables root cause analysis of false positives/negatives

**ISO Alignment:** ISO 9001 §8.5.1 (Control of production) — Input validation

### Health Tracking

System explicitly tracks degradation at every stage:

**Health States:**
- `OK` — All subsystems operational
- `DEGRADED` — Subsystem failure with graceful fallback
- `FAILED` — Critical failure preventing inspection

**Traceability Benefits:**
- No silent failures
- `degradation_reasons` provides actionable diagnostics
- Supports predictive maintenance
- Enables statistical failure pattern analysis

**ISO Alignment:** ISO 9001 §9.1.1 (Monitoring and measurement)

### Unknown Classification

**Implementation:** `core/pipeline/consolidate.py`

System classifies defects as "unknown" when confidence is insufficient, rather than forcing classification.

**Logic:**
- Primary defect confidence < 0.35 (configurable) → `defect_type = "unknown"`
- Multiple similar confidence scores → ambiguity flag

**ISO Alignment:** ISO/IEC 17025 §7.8.6 (Reporting opinions) — Uncertainty acknowledgment

### Two-Stage LLM Reasoning

**Module:** `core/reasoning/two_stage_llm.py`

Reduces confirmation bias by separating visual observation from classification.

**Stage 1:** Pure visual description without candidate labels  
**Stage 2:** Classification based on Stage 1 observations

**ISO Alignment:** ISO/IEC 17025 §7.5 (Technical records) — Complete reasoning documentation

### Agreement-Based Decision Engine

**Module:** `core/reasoning/agreement_engine.py`

Multi-signal consensus quantifies agreement between YOLO, Geometry, LLM, and Zone signals.

**Agreement Scoring:**
- 3-way match → HIGH (0.85-1.0)
- 2-way match → MEDIUM (0.50-0.80)
- 1-way/no match → LOW (0.0-0.50)

**ISO Alignment:** ISO/IEC 17025 §7.8.3 (Validation of results) — Multi-method verification

### Configuration

Add to `customers/castco/configs/parameters.yaml`:

```yaml
quality_gate:
  blur_threshold: 50.0
  min_brightness: 20
  max_brightness: 235
  min_resolution: 300

consolidation:
  unknown_threshold: 0.35

reasoning:
  agreement:
    high_threshold: 0.75
    medium_threshold: 0.50
```

> See [System Hardening](../05_deployment/system_hardening.md) for complete implementation details.

---

## Human Validation

### Review Queue

**File:** `runtime/review_queue.json`

Castings flagged for human review stored persistently:

```json
{
  "queue": [
    {
      "casting_id": "CAST-20260328-123456-0001",
      "added_at": "2026-03-28T12:34:56Z",
      "system_decision": "MANUAL_REVIEW",
      "predicted_defect": "porosity",
      "casting_score": 0.42,
      "output_folder": "runtime/outputs/CAST-20260328-123456-0001/"
    }
  ]
}
```

### Validation Records

**File:** `{output_folder}/review.json`

Operator validation logged:

```json
{
  "casting_id": "CAST-20260328-123456-0001",
  "reviewed_at": "2026-03-28T14:22:10Z",
  "reviewer": "Operator-23109",
  "system_prediction": {
    "decision": "MANUAL_REVIEW",
    "defect_type": "porosity",
    "confidence": "medium"
  },
  "human_validation": {
    "classification_correct": false,
    "actual_defect": "sand_inclusion",
    "disposition": "REJECT",
    "notes": "Misclassified - clearly sand, not porosity"
  }
}
```

### Feedback Telemetry

**File:** `runtime/logs/feedback/YYYY-MM.jsonl`

All validations logged for model retraining and accuracy tracking.

---

## Configuration Control

### Parameters File

**File:** `customers/castco/configs/parameters.yaml`

All pipeline parameters centralized in version-controlled YAML.

**Version Control:** Git tracks every change with commit hash, timestamp, author, change reason.

**Hot Reload:** Changes take effect immediately on next inspection (no restart).

### Change Log

```bash
# View parameter changes
git log --follow -- customers/castco/configs/parameters.yaml

# Compare two versions
git diff abc123 def456 -- customers/castco/configs/parameters.yaml

# Restore previous version
git checkout abc123 -- customers/castco/configs/parameters.yaml
```

### MOS Parameter Tuning

**File:** `configs/mvp_history.json`

Multi-Objective System (MOS) auto-tuning logs every parameter change with before/after scores, reason, and evaluation runs.

---

## Licensing & Access Control

**File:** `license/license.json`

```json
{
  "customer": "CastCo Foundry",
  "machine_id": "AB91F42C77E2A1D3",
  "tier": "TIER_2",
  "expiry": "2027-01-01",
  "capabilities": {
    "inspection": true,
    "batch_processing": true,
    "analytics": true,
    "erp_integration": true,
    "process_intelligence": true,
    "plant_intelligence": false
  },
  "signature": "..."
}
```

**Hardware Binding:** `machine_id` = hash(CPU serial + MAC address)

**Feature Gating:** Code checks capabilities before executing licensed features.

> See [Licensing](../05_deployment/licensing.md) for details.

---

## Software Version Control

**Version File:** `VERSION.txt`  
**Deployment Tracking:** `runtime/deployed_commit.txt` (git commit hash)  
**Update Manifests:** `packaging/update_manifest.json` (SHA256 checksum)

---

## ERP Integration

**File:** `customers/castco/configs/parameters.yaml`

```yaml
erp_schema:
  casting_id: "Casting_ID"
  heat_number: "HeatNo"
  mold_id: "Mould_ID"
  shift: "Shift"
  operator: "Emp_No"
  part_type: "Part_No"
  production_date: "Date"
```

**Purpose:** Map internal canonical names → customer ERP column names

**Manufacturing Context:** Every inspection linked to heat batch, mold ID, shift, operator, part type, production date.

---

## Data Retention

| Record Type | Location | Retention | Disposition |
|-------------|----------|-----------|-------------|
| alerts_log.jsonl | logs/ | Min 3 years | Archive quarterly |
| AI_Inspections | SQL | Production lifecycle + audit window | DB archival |
| PDF Reports | runtime/outputs | Min 3 years | Archive |
| Review Logs | runtime/ | Min 2 years | Archive |
| Feedback Logs | runtime/logs | Min 2 years | Archive |

**Note:** All records are append-only and protected from modification during normal operation.

---

## Compliance Checklist

**Note:** This system does not independently fulfill laboratory accreditation under ISO/IEC 17025 (calibration traceability, environmental controls, measurement uncertainty). These are expected via external laboratory and plant procedures.

| ISO Requirement | Implementation | Evidence |
|-----------------|----------------|----------|
| **ISO 9001 §7.5.3.2** — Documented information retention | JSONL audit logs, SQL records, PDF reports | `logs/alerts_log.jsonl`, `AI_Inspections` table |
| **ISO 9001 §8.5.1** — Control of production | Partially supports via parameter version control and system-enforced logic. Full compliance requires plant-level work instructions, operator control, equipment validation. | `license.json`, git history, `parameters.yaml` |
| **ISO/IEC 17025 §6.6** — Metrological traceability | Supports reproducibility of data processing via versioned algorithms. Physical measurement traceability handled by plant-level calibration. | `SIGNAL_ENGINE_VERSION`, audit log inputs |
| **ISO/IEC 17025 §7.5** — Technical records | Inspection records with timestamps, IDs | `AI_Inspections`, PDF reports, JSONL logs |
| **ISO 9001 §10.2.1** — Nonconformity determination | Alert generation, severity classification | Alerts system, `logs/alerts_log.jsonl` |
| **ISO 9001 §9.1.1** — Monitoring and measurement | KPI tracking, rejection rate monitoring | Analytics module, PI dashboard |
| **ISO/IEC 17025 §7.11.3** — Control of data | Configuration control, version control | Git, `parameters.yaml` |

---

## Audit Procedures

**Daily:** Verify `logs/alerts_log.jsonl` append-only, check SQL backup  
**Weekly:** Review alert log patterns, verify git commits, check MOS tuning history  
**Monthly:** Archive alert logs, generate compliance report, review validation accuracy  
**Annually:** Audit license expiry, review version control access, validate backup/restore, update documentation

---

## References

- **ISO 9001:2015** — Quality Management Systems
- **ISO/IEC 17025:2017** — General Requirements for Testing and Calibration Laboratories
- **NIST SP 800-53** — Security and Privacy Controls (traceability controls)

---

**Version:** 1.1  
**Last Updated:** 2026-04-07
