# Cognition Runtime

> **Purpose:** Formalize `RuntimeRequest`/`RuntimeResponse` contracts, orchestration boundaries, and execution semantics  
> **Related:** [Runtime Topology](runtime_topology.md), [Reasoning Pipeline](../03_intelligence/reasoning_pipeline.md), [API Contracts](../06_reference/api_contracts.md)  
> **Version:** 1.0  
> **Last Updated:** 2026-05-16

---

## Overview

The Cognition Runtime is the **execution environment** for the autonomous reasoning engine. It defines the **contractual boundaries** between external systems (API, batch) and core AI components (vision, reasoning, diagnosis). It ensures deterministic, auditable, and safe inference execution.

All requests to perform inspections—whether via `/inspect`, batch ingestion, or diagnostic queries—must be encapsulated and processed via the `RuntimeRequest` → `RuntimeResponse` contract.

---

## RuntimeRequest Contract

Used by the API server and batch worker to initiate inspections.

```json
{
  "request_id": "string",
  "timestamp": "ISO8601",
  "source": "api" | "batch" | "debug",
  "input": {
    "image": "base64 encoded PNG/JPG",
    "metadata": {
      "casting_id": "string",
      "heat_number": "string",
      "shift_id": "string",
      "operator": "string"
    }
  },
  "config_overrides": {
    "reasoning.enable_vlm": "boolean",
    "decision.threshold_low": "number",
    "decision.threshold_high": "number",
    "signal.topology.weight": "number"
  },
  "trace_id": "string"
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `request_id` | string | Unique UUID per inspection (e.g., `req_abc123`) |
| `timestamp` | ISO8601 | Unix timestamp of request receipt |
| `source` | enum | Origin: `api` (external call), `batch` (queue), `debug` (manual test) |
| `input.image` | base64 | Base64-encoded image buffer (max 10MB) |
| `input.metadata` | object | Optional contextual data (required for batch) |
| `config_overrides` | object | Dynamic tuning for this request only — **ignored if not permitted in license** |
| `trace_id` | string | Trace correlation ID for distributed logging — inherited from parent transaction |

> **Note**: `input.image` may be omitted in batch mode if file path is provided via storage backend; currently only base64 is supported.

---

## RuntimeResponse Contract

Returned by the Cognition Runtime to the API server or batch worker upon completion.

```json
{
  "request_id": "string",
  "response_id": "string",
  "timestamp": "ISO8601",
  "status": "success" | "failed" | "manual_review",
  "result": {
    "decision": "ACCEPT" | "REJECT" | "MANUAL_REVIEW",
    "confidence": 0.000,
    "defects": [
      {
        "type": "porosity" | "shrinkage" | "crack" | "sand_inclusion" | "surface_roughness" | "blow_hole",
        "confidence": 0.000,
        "location": [x, y, width, height],
        "topology_score": 0.000,
        "anomaly_strength": 0.000,
        "scrata_confidence": 0.000,
        "semantic_similarity": 0.000
      }
    ],
    "diagnosis": {
      "causes": ["string"],
      "responsible_section": "melting" | "molding" | "finishing",
      "confidence": 0.000,
      "reasoning_path": "energy-based" | "llm-driven" | "signal-only"
    },
    "scores": {
      "topology": 0.000,
      "scrata": 0.000,
      "anomaly": 0.000,
      "llm": 0.000,
      "agreement": 0.000
    },
    "energy": {
      "base": 0.000,
      "final": 0.000,
      "delta": 0.000,
      "stable": true,
      "drift_detected": false
    },
    "metadata": {
      "version": "2.0",
      "processing_time_ms": 452,
      "model_used": "casting_model.pt",
      "pipeline_state": "OK"
    }
  },
  "error": null | {
    "code": "invalid_image" | "license_expired" | "timeout" | "gpu_unavailable",
    "message": "string"
  }
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `request_id` | string | Must match input `request_id` |
| `response_id` | string | Unique UUID for this response (e.g., `resp_def456`) |
| `timestamp` | ISO8601 | Time of response generation |
| `status` | enum | Final decision outcome |
| `result.decision` | enum | Final system decision |
| `result.confidence` | number | System-wide confidence in decision |
| `result.defects` | array | List of detected defect instances |
| `result.diagnosis.causes` | array | Root cause hypotheses |
| `result.diagnosis.responsible_section` | enum | Manufacturing stage responsible |
| `result.scores` | object | Raw signal scores before fusion |
| `result.energy` | object | Physics-based reasoning state |
| `result.metadata` | object | Technical metadata for audit |
| `error` | object | If present, indicates non-recoverable failure |

### Energy Field (Critical)

The energy fields represent the **physics-based state** of the reasoning system:

- `base`: Initial energy from baseline scores (before forces)
- `final`: Final energy after all forces applied
- `delta`: `final - base` — should be ≤ 0 for stability
- `stable`: `delta <= epsilon` (Lyapunov compliance check)
- `drift_detected`: `z-score > 3.0` for any baseline

> This field ensures traceability to the **energy-based stable reasoning** logic in `reasoning_pipeline.md`.

---

## Execution Semantics

### 1. Atomic Execution
Each `RuntimeRequest` must be processed to completion with **no partial results**. If any component fails, the response must return `status: "failed"`.

### 2. Timeouts
- **Default**: 3000ms per inspection
- **Can be overridden**: Via `config_overrides.request_timeout_ms`
- **On timeout**: Response returns `status: "failed"` with `error.code: "timeout"`

### 3. Idempotency
- Repeating the same `RuntimeRequest` (same `request_id`) returns cached result
- Cache key: `hash(request_id + input.image)`

### 4. Configuration Validation
- Overrides must be defined in `config_schema.yaml` (not arbitrary fields)
- Unauthorized overrides trigger `error.code: "unauthorized_override"`

### 5. Logging
All requests and responses are written to:
- `runtime/logs/requests.jsonl`
- `runtime/logs/responses.jsonl`

> With trace_id for correlation across systems.

---

## Orchestration Boundaries

| Zone | Responsible Module | Input | Output |
|------|--------------------|-------|--------|
| **Input Boundary** | API Server / Batch Worker | `RuntimeRequest` | Passes to Cognition Runtime |
| **Cognition Runtime** | `core/reasoning/pipeline.py` | `RuntimeRequest` | Returns `RuntimeResponse` |
| **Output Boundary** | ApiServer, Batch Worker | `RuntimeResponse` | Writes to `/outputs/`, logs to `/logs/`, responds via HTTP |

> The Cognition Runtime **owns all reasoning logic** — no external system may modify it or bypass it.

---

## Cross-References

- **Runtime Topology**: [Runtime Topology](runtime_topology.md)
- **Reasoning Pipeline**: [Energy-Based Reasoning](../03_intelligence/reasoning_pipeline.md)
- **API Contracts**: [API Contracts](../06_reference/api_contracts.md)
- **Configuration**: [Config Guide](../04_configuration/config_guide.md)
- **Audit Trail**: [Runtime Storage](../05_deployment/runtime.md)

**Version:** 1.0  
**Last Updated:** 2026-05-16