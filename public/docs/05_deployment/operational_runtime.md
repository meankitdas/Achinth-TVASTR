# Operational Runtime

> **Purpose:** Define runtime data directories, maintenance, and lifecycle  
> **Related:** [Deployment Topology](deployment_topology.md), [Runtime Execution](../02_pipeline/runtime_execution.md), [Telemetry](telemetry_runtime.md)  
> **Version:** 1.0  
> **Last Updated:** 2026-05-16

---

## Overview

The operational runtime environment is the **persistent, stateful layer** of the system where data is stored, managed, and retained for compliance, audit, and operational continuity.

All runtime data is **self-contained**, **non-networked**, and **automated for lifecycle management** — designed for 24/7 industrial operation with minimal intervention.

---

## Directory Structure and Purpose

```bash
runtime/
├── logs/                   # Critical audit and system logs
│   ├── telemetry.jsonl     # Every inspection — retained 7+ years
│   ├── drift_alerts.jsonl  # Anomaly detection events
│   ├── postprocess_overrides.log
│   ├── semantic_audit.jsonl
│   └── ras.log             # Application errors and warnings
├── outputs/                # Human- and machine-readable results
│   ├── inspect_*.jpg       # Annotated images
│   ├── heatmap_*.png       # Defect intensity maps
│   ├── report_*.pdf        # Inspection summaries
│   ├── inspection_*.json   # Raw data per inspection
│   ├── batch_*.csv         # ERP-compatible exports
│   └── batch_*.jsonl       # Machine-readable batch results
├── batch_input/            # Incoming inspection queues
│   ├── incoming/           # New files from production line
│   ├── processing/         # Currently being processed
│   ├── completed/          # Finished successfully
│   └── failed/             # Corrupted or invalid files
├── fingerprint_index/      # Pattern matching database
├── process_logs/           # ERP fallback logs
├── calibration/            # Auto-calibration state
│   ├── baselines.json      # Signal mean/std per plant
│   └── weights.json        # Fusion weights
├── updates/                # Software update packages
└── telemetry/              # Aggregated analytics
    └── summary.json        # Daily summary of rejects, rates, trends
```

> **All paths are fixed** — no user-configurable changes to runtime structure allowed.

---

## Data Lifecycle Management

### Retention Policies

| Directory | File Type | Retention | Purge Trigger |
|----------|-----------|----------|---------------|
| `logs/` | `telemetry.jsonl`, `semantic_audit.jsonl` | 7+ years (regulatory) | Never |
| `logs/` | `ras.log`, `drift_alerts.jsonl` | 2 years | Auto-purge via size limit |
| `outputs/` | `inspect_*.jpg`, `report_*.pdf` | 6 months | Auto-purge by batch worker |
| `outputs/` | `batch_*.csv`, `batch_*.jsonl` | 1 year | Manual export to network share |
| `fingerprint_index/` | `index.pkl` | Permanent | Rebuilt on upgrade |
| `calibration/baselines.json` | Signal baselines | Permanent | Updated on every 10 inspections |
| `updates/` | `.exe`, `.zip` | Until applied | Auto-deleted post-update |
| `telemetry/summary.json` | Daily summary | 1 year | Auto-purge daily |

### Purge Mechanism

- **Auto-purge**: Managed by **Batch Worker** process
- **Criteria**:
  - File age > retention period
  - Directory size > 90% of allocated disk space (e.g., 200GB)
- **Safety**: Files are moved to `runtime/outputs/archive/` before deletion
- **Log**: All deletions written to `logs/audit_purge.log`

> **Example**:  
> `inspect_C00123.jpg` from 2025-11-01 → moved to `archive/2025/11/C00123.jpg` on 2026-05-01 → deleted on 2026-11-01

---

## Maintenance and Health Checks

### Daily Operational Tasks

| Task | Frequency | Tool | Output |
|------|-----------|------|--------|
| Check disk usage | Hourly | Batch Worker | Alert if >90% full |
| Verify telemetry integrity | Daily | `scripts/check_telemetry.py` | Logs corruption to `ras.log` |
| Validate calibration stability | Weekly | `scripts/validate_calibration.py` | Generates `calibration/health_report.txt` |
| Audit file permissions | Monthly | `scripts/audit_permissions.py` | Fixes incorrect ACLs |

### Emergency Actions

| Condition | Action |
|----------|--------|
| Disk full | Stop new inspections — trigger alert to operator |
| Corrupted `baselines.json` | Reset to system defaults — logs "CALIBRATION_RESET" |
| Unresponsive API | Restart `services/api/api.py` via `services/tools/restart_api.bat` |
| Critical log error | Send notification to `maintenance@castco.com` via local SMTP server |

---

## Update and Patch Lifecycle

### Software Updates
- **Source**: `updates/` directory (manual or auto-downloaded)
- **Process**:
  1. Administrator copies `TvastrRAS_Update_v2.1.exe` to `runtime/updates/`
  2. System detects and validates signature
  3. Prompts: “Update available. Apply now?”
  4. On acceptance:
     - All services stop
     - Old files backed up to `runtime/updates/backup_v2.0/`
     - New files extracted and installed
     - Services restart
- **Rollback**: If crash occurs → reverts to `backup_v2.x/`

> **No patching while running** — updates are atomic and safe.

### Configuration Updates
- Only `customers/castco/configs/parameters.yaml` can be modified
- Changes take effect on next inspection or batch — **no restart required**
- Changes are **versioned in Git** via `git` repository root

> Any other modification to `runtime/` is forbidden and triggers audit flag.

---

## Data Integrity and Assurance

### File Signing
- All output files (`*.jpg`, `*.pdf`, `*.csv`, `*.jsonl`) are signed with system certificate
- Signature stored in `.sig` file:
  ```text
  inspect_C00123.jpg.sig
  └── SHA256: abc123...
      Timestamp: 2026-05-16T12:34:56Z
      Certificate: CN=TvastrRAS Production v2.0
  ```

### Checksum Validation
- Before processing any input file: validate SHA256
- Before writing output: write checksum alongside
- During QA review: recompute checksum — must match

> Ensures **forensic integrity** — no alteration possible without detection.

---

## Cross-References

- **Deployment Topology**: [Deployment Topology](deployment_topology.md)
- **Runtime Execution**: [Runtime Execution](../02_pipeline/runtime_execution.md)
- **Telemetry**: [Telemetry](telemetry_runtime.md)
- **Security**: [Security Best Practices](../05_deployment/setup.md#security-best-practices)

**Version:** 1.0  
**Last Updated:** 2026-05-16