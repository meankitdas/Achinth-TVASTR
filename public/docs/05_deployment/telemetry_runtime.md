# Telemetry Runtime

> **Purpose:** Document telemetry collection, storage, and analysis  
> **Related:** [Operational Runtime](operational_runtime.md), [API Runtime](api_runtime.md), [Energy-Based Reasoning](../03_intelligence/energy_reasoning.md)  
> **Version:** 1.0  
> **Last Updated:** 2026-05-16

---

## Overview

The telemetry system is the **central nervous system** of quality monitoring in TvastrRAS. It collects, stores, and exposes granular, time-stamped data from every inspection to enable:

- Operational insight
- Predictive maintenance
- Regulatory compliance
- Continuous improvement

All telemetry is **self-contained**, **immutable**, and **audit-ready** — designed for forensic analysis and long-term retention.

---

## Data Collection Points

Telemetry is generated at three levels:

### 1. Per-Inspection Telemetry (`telemetry.jsonl`)

Every inspection produces one line of JSON, appended to `runtime/logs/telemetry.jsonl`.  
**Format**:
```json
{
  "inspection_id": "insp_abc123",
  "request_id": "req_def456",
  "timestamp": "2026-05-16T12:34:56Z",
  "source": "api",
  "decision": "REJECT",
  "confidence": 0.92,
  "processing_time_ms": 545,
  "reasoning_path": "energy-based",
  "energy_base": 1.56,
  "energy_final": 1.20,
  "energy_delta": -0.36,
  "energy_stable": true,
  "drift_alert": false,
  "signals": {
    "topology": 0.82,
    "scrata": 0.68,
    "anomaly": 0.61,
    "llm": 0.75,
    "agreement": 0.78
  },
  "defects": [
    {
      "type": "porosity",
      "confidence": 0.88,
      "location": [120, 180, 220, 260],
      "topology_score": 0.72,
      "anomaly_strength": 0.61,
      "scrata_confidence": 0.68
    }
  ],
  "diagnosis": {
    "causes": ["incomplete melting"],
    "responsible_section": "melting",
    "confidence": 0.85
  },
  "metadata": {
    "version": "2.0",
    "model_used": "casting_model.pt",
    "pipeline_state": "OK",
    "casting_id": "C00123",
    "heat_number": "H456",
    "shift_id": "night"
  }
}
```

> **Fields**:
> - All core decision logic is captured — **no loss of traceability**
> - Includes full signal values — enables root cause analysis
> - Links to inspection artifact files via `inspection_id`

### 2. System Health Telemetry (`summary.json`)

Daily aggregation of all inspections, stored in `runtime/telemetry/summary.json`.

```json
{
  "date": "2026-05-16",
  "total_inspections": 1428,
  "reject_rate": 0.12,
  "manual_review_rate": 0.03,
  "energy_stable_count": 1425,
  "drift_alerts": 1,
  "avg_processing_latency_ms": 545,
  "best_defect": "porosity",
  "best_defect_count": 156,
  "by_shift": {
    "day": { "total": 842, "rejects": 102 },
    "night": { "total": 586, "rejects": 54 }
  },
  "by_area": {
    "casting_mouth": { "rejects": 67 },
    "body": { "rejects": 71 },
    "base": { "rejects": 18 }
  },
  "baseline_stats": {
    "topology": { "mean": 0.32, "std": 0.15 },
    "scrata": { "mean": 0.51, "std": 0.18 },
    "anomaly": { "mean": 0.41, "std": 0.13 }
  }
}
```

> Generates dashboard metrics for QA and production managers.

### 3. Drift Alerts (`drift_alerts.jsonl`)

Log of every signal exceeding 3.0 z-score threshold. Stored in `runtime/logs/drift_alerts.jsonl`.

```json
{
  "timestamp": "2026-05-16T08:22:30Z",
  "signal": "anomaly_strength",
  "current_value": 0.72,
  "baseline_mean": 0.35,
  "baseline_std": 0.08,
  "z_score": 4.63,
  "inspections_since_update": 17,
  "triggered_by": "insp_abc123"
}
```

> Triggers QA review and potential calibration action.

---

## Storage and Retention

| File | Location | Format | Retention | Purpose |
|------|----------|--------|-----------|---------|
| `telemetry.jsonl` | `runtime/logs/` | JSONL (line-delimited) | 7+ years | Full audit trail — regulatory |
| `drift_alerts.jsonl` | `runtime/logs/` | JSONL | 2 years | Trend analysis, failure prediction |
| `summary.json` | `runtime/telemetry/` | JSON | 1 year | Operational reporting |
| `semantic_audit.jsonl` | `runtime/logs/` | JSONL | 7+ years | Ensure semantic integrity |

> **Storage Sizing**:  
> - 1,000 inspections/day → ~150 MB telemetry/year  
> - 100,000 inspections/year → 15 GB/year — accommodates standard 500GB SSD

> **Purge**: Managed by Batch Worker — **never deletes** `telemetry.jsonl` or `semantic_audit.jsonl`

---

## Analysis and Consumption

### Internal Consumption
- **QA Team**: Uses `telemetry.jsonl` to validate new model versions
- **Operations**: Uses `summary.json` for daily KPI dashboards
- **Engineering**: Uses `drift_alerts.jsonl` to identify calibration needs

### Export
- **Manual**: Copy to USB drive — `telemetry.jsonl`, `summary.json`
- **Automated**: Scheduled script exports to shared network drive:
  ```bash
  copy /Y runtime\logs\telemetry.jsonl \\networkshare\qa\telemetry\2026-05-16.jsonl
  ```

> Export files are **signed** with `.sig` for integrity verification.

### Integration with External Systems
- **ERP/MES**: Pulls `summary.json` daily for production KPIs
- **PLC**: No direct integration — all data via ERP
- **LIMS**: Pulls inspection results via API or export CSV

---

## Security and Integrity

### File Signing
- All exported telemetry files (`*.json`, `*.jsonl`) are signed:
  ```text
  telemetry_20260516.jsonl.sig
  └── SHA256: abc123...
      Timestamp: 2026-05-16T18:42:01Z
      Certificate: CN=TvastrRAS Telemetry v2.0
  ```

### Checksum Validation
- Every `telemetry.jsonl` line is validated for corruption:
  ```python
  if hashlib.sha256(line.encode()).hexdigest() != signature:
      logger.critical("Telemetry line corrupted!")
      trigger_audit_flag()
  ```

> Ensures data cannot be altered post-collection — **forensic-grade integrity**.

---

## Cross-References

- **Operational Runtime**: [Operational Runtime](operational_runtime.md)
- **API Runtime**: [API Runtime](api_runtime.md)
- **Energy-Based Reasoning**: [Energy Reasoning](../03_intelligence/energy_reasoning.md)
- **Audit Trail**: [Audit Consolidation](../04_configuration/config_guide.md)

**Version:** 1.0  
**Last Updated:** 2026-05-16