# API Runtime

> **Purpose:** Specify API behavior, latency, and versioning expectations  
> **Related:** [API Contracts](../06_reference/api_contracts.md), [Deployment Topology](deployment_topology.md), [Cognition Runtime](../01_overview/cognition_runtime.md)  
> **Version:** 1.0  
> **Last Updated:** 2026-05-16

---

## Overview

The API runtime defines the **operational behavior** of the TvastrRAS REST endpoints under production conditions — including latency, reliability, concurrency, and versioning policy.

It is a **stateless, deterministic service** — every request is processed independently with no session or persistent state retained between calls.

> **Core Principle**:  
> *The API must be reliable, fast, and predictable — even under load or degraded conditions.*

---

## Performance SLAs

| Endpoint | Avg Latency | P95 Latency | Max Latency | Uptime SLA |
|----------|-------------|-------------|-------------|------------|
| `/inspect` | 545 ms | 1,220 ms | 2,500 ms | 99.99% |
| `/batch/list` | 120 ms | 300 ms | 800 ms | 99.99% |
| `/batch/{id}` | 85 ms | 220 ms | 600 ms | 99.99% |
| `/batch/{id}/download` | 200 ms | 500 ms | 1,200 ms | 99.9% |
| `/health` | 10 ms | 35 ms | 100 ms | 99.99% |

> Latency measured from TCP handshake to response completion, including internal processing.

### Baseline Conditions
- Single image (≤10MB), 640×640
- No network congestion
- CPU usage <70%
- No LLM inference (unless `llm_confidence` is enabled and triggered)

### Degraded Performance Scenarios

| Scenario | Impact | Mitigation |
|----------|--------|------------|
| High concurrent requests (>10/sec) | Latency increases to P95 | Queue requests; return 503 with retry header `Retry-After: 2` |
| LLM offline | Add 200ms delay | Use `signal-only` path — no fallback error |
| Low RAM (<4GB free) | Slower disk I/O | Auto-throttle batch worker to 1 concurrent inspection |
| Disk space <5% | Block new inspections | Return `507 Insufficient Storage` |
| GPU unresponsive | Fallback to CPU | Latency increases by 35% — logged to `ras.log` |

---

## Concurrency and Throttling

### Maximum Concurrent Requests
- **Default**: 10 simultaneous `/inspect` calls
- **Maximum**: 20 (configurable via `max_concurrent-inspections`)
- **Batch requests**: Limited to 4 parallel batch inspections

### Throttling Policy
- **Rate limit**: 10 requests per second per license key
- **Burst limit**: 20 requests within 1 second (tokens replenish at 10/sec)
- **Response on threshold**:
  ```http
  HTTP/1.1 429 Too Many Requests
  Retry-After: 5
  Content-Type: application/json
  {
    "error": "Rate limit exceeded. Please retry after 5 seconds."
  }
  ```

> Throttling is applied **per license key** — not per IP. Ensures fair usage in enterprise environments.

---

## Versioning Strategy

The API follows **semantic versioning**, with **backward compatibility** as a hard requirement.

### Versioning Rules
| Change Type | Impact | Example | Response |
|-------------|--------|---------|----------|
| **Patch** (`v1.0.x`) | Non-breaking bug fixes | Fixed JSON field typo in `/health` | No version bump — API responds `version: "1.0.1"` |
| **Minor** (`v1.x.0`) | New optional fields | Added `drift_alert` in `/inspect` | New field ignored by old clients — backward compatible |
| **Major** (`v2.0.0`) | Breaking changes | Removed `scrata_confidence` → use `semantic_similarity` | Clients receive `400 Bad Request` with message: `"API v1.5 no longer supported. Upgrade to v2.0"` |

### Version Discovery
- Every response includes `version` field:
  ```json
  {
    "status": "healthy",
    "version": "2.0",
    "uptime": "2h34m",
    ...
  }
  ```
- `/health` endpoint also returns `supported_versions`:  
  ```json
  {
    "version": "2.0",
    "supported_versions": ["v1.5", "v2.0"]
  }
  ```
> Clients must check `supported_versions` during startup and alert if outdated.

---

## Error Handling

| Code | Name | Trigger | Response |
|------|------|---------|----------|
| 400 | Invalid Request | Malformed JSON, missing fields | `{"error": "Missing required field: image"}` |
| 401 | Unauthorized | Invalid/expired license key | `{"error": "Invalid license key"}` |
| 403 | Forbidden | Incorrect tier (e.g., TIER_1 calling `/batch/list`) | `{"error": "Insufficient license tier"}` |
| 404 | Not Found | `batch_id` does not exist | `{"error": "Batch ID not found"}` |
| 413 | Payload Too Large | Image >10MB | `{"error": "Image exceeds 10MB limit"}` |
| 415 | Unsupported Media Type | Non-PNG/JPG image | `{"error": "Only PNG and JPG supported"}` |
| 429 | Too Many Requests | Rate limit exceeded | `{"error": "Rate limit exceeded...", "Retry-After": "5"}` |
| 500 | Internal Server Error | Unhandled exception | `{"error": "System failure — contact support"}` |
| 503 | Service Unavailable | System overloaded, disk full | `{"error": "System currently unavailable", "Retry-After": "30"}` |

> **Error responses are always JSON** — never HTML or empty body.

---

## Security Runtime

- **TLS**: Required for all external access — self-signed certificate accepted (internal)
- **CORS**: Disabled — all clients must be on trusted internal network
- **Headers**:
  - `Authorization: Bearer <token>` — required on all endpoints
  - `Content-Type: application/json` — required for POST
  - `Accept: application/json` — recommended
- **Input Sanitization**: All base64 images, JSON, metadata filtered for injection attacks

> No authentication tokens, OAuth, or session cookies are used.

---

## Cross-References

- **API Contracts**: [API Contracts](../06_reference/api_contracts.md)
- **Deployment Topology**: [Deployment Topology](deployment_topology.md)
- **Cognition Runtime**: [Cognition Runtime](../01_overview/cognition_runtime.md)
- **Configuration**: [Config Guide](../04_configuration/config_guide.md)

**Version:** 1.0  
**Last Updated:** 2026-05-16