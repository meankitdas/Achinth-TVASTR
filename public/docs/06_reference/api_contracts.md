# API Contracts

> **Purpose:** Definitive specification of all HTTP API endpoints and data schemas  
> **Audience:** Integration engineers, external developers  
> **Version:** 2.0  
> **Last Updated:** 2026-05-16

---

## API Base Endpoint

All endpoints are accessed relative to:

```
http://<host>:<port>/api/v1/
```

Default base (in development): `http://localhost:8000/api/v1/`

> **Note:** All requests must include the `Authorization: Bearer <token>` header, where `<token>` is your license key.

---

## Endpoints

### `POST /inspect`

Submit a single image for inspection.

**Request Body (multipart/form-data):**

| Field | Type | Description |
|-------|------|-------------|
| `image` | File | PNG or JPG image (max 10MB) |
| `metadata` | JSON | Optional metadata: casting_id, heat_number, shift_id |

**Example Request:**

```bash
curl -X POST "http://localhost:8000/api/v1/inspect" \
  -F "image=@image.jpg" \
  -F "metadata={\"casting_id\":\"C00123\", \"heat_number\":\"H456\"}" \
  -H "Authorization: Bearer YOUR_LICENSE_KEY"
```

**Response:** 200 OK

```json
{
  "inspection_id": "insp_abc123",
  "decision": "REJECT",
  "confidence": 0.92,
  "detected_defects": [
    {
      "type": "porosity",
      "confidence": 0.88,
      "location": [120, 180, 220, 260],
      "topology_score": 0.72,
      "scrata_similarity": 0.68
    }
  ],
  "diagnosis": {
    "causes": ["incomplete melting", "mold contamination"],
    "responsible_section": "melting",
    "confidence": 0.85
  },
  "metadata": {
    "timestamp": "2026-05-16T12:34:56Z",
    "version": "2.0",
    "pipeline_health": "OK"
  }
}
```

---

### `POST /batch/list`

List all batch jobs.

**Request Body:**

```json
{
  "page": 1,
  "limit": 10,
  "status": "all"
}
```

**Response:**

```json
{
  "batches": [
    {
      "batch_id": "batch_xyz123",
      "status": "completed",
      "file_count": 50,
      "completed_at": "2026-05-16T10:00:00Z",
      "output": {
        "csv": "/outputs/batch_xyz123.csv",
        "json": "/outputs/batch_xyz123.jsonl"
      }
    }
  ],
  "total": 12,
  "page": 1,
  "pages": 2
}
```

---

### `POST /batch/{batch_id}`

Get details for a specific batch.

**Path Parameter:** `batch_id` (string)

**Response:**

```json
{
  "batch_id": "batch_xyz123",
  "status": "completed",
  "file_count": 50,
  "completed_at": "2026-05-16T10:00:00Z",
  "created_at": "2026-05-16T09:30:00Z",
  "inspections": [
    {
      "inspection_id": "insp_abc123",
      "input_file": "image_0001.jpg",
      "decision": "REJECT",
      "confidence": 0.92,
      "detected_defects": [ ... ]
    }
  ],
  "output": {
    "csv": "/outputs/batch_xyz123.csv",
    "json": "/outputs/batch_xyz123.jsonl"
  }
}
```

---

### `GET /batch/{batch_id}/download`

Download batch results.

**Path Parameter:** `batch_id`

**Response:**

- `application/json`: JSONL file with each inspection result as a line
- `text/csv`: CSV summary file

**Example:**

```bash
curl -H "Authorization: Bearer YOUR_LICENSE_KEY" \
    "http://localhost:8000/api/v1/batch/batch_xyz123/download?type=csv"
```

---

### `GET /health`

Check server health.

**Response:**

```json
{
  "status": "healthy",
  "version": "2.0",
  "uptime": "2h34m",
  "inspections_processed": 4872,
  "pipeline_health": "OK"
}
```

---

## Data Schema

### `InspectionResponse`

```json
{
  "inspection_id": "string",
  "decision": "REJECT" | "ACCEPT" | "MANUAL_REVIEW",
  "confidence": "number", // 0.0 - 1.0
  "detected_defects": [
    {
      "type": "porosity" | "shrinkage" | "crack" | "sand_inclusion" | "surface_roughness" | "blow_hole",
      "confidence": "number",
      "location": [number, number, number, number], // x,y,w,h
      "topology_score": "number",
      "scrata_similarity": "number"
    }
  ],
  "diagnosis": {
    "causes": ["string"],
    "responsible_section": "melting" | "molding" | "finishing",
    "confidence": "number"
  },
  "metadata": {
    "timestamp": "ISO8601",
    "version": "string",
    "pipeline_health": "OK" | "DEGRADED" | "FAILED"
  }
}
```

### `BatchResponse`

```json
{
  "batch_id": "string",
  "status": "pending" | "processing" | "completed" | "failed",
  "file_count": "integer",
  "completed_at": "ISO8601",
  "created_at": "ISO8601",
  "inspections": [
    { "inspection_id": "string", "input_file": "string", ... }
  ],
  "output": {
    "csv": "string",
    "json": "string"
  }
}
```

### `HealthResponse`

```json
{
  "status": "healthy" | "unhealthy",
  "version": "string",
  "uptime": "string",
  "inspections_processed": "integer",
  "pipeline_health": "OK" | "DEGRADED" | "FAILED"
}
```

---

## Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 400 | Invalid Request | Malformed JSON, missing required fields |
| 401 | Unauthorized | Invalid or missing Authorization header |
| 403 | Forbidden | Invalid license key or tier insufficient |
| 404 | Not Found | Batch ID not found |
| 413 | Payload Too Large | Image > 10MB |
| 415 | Unsupported Media Type | Invalid image format |
| 500 | Internal Server Error | System failure |
| 503 | Service Unavailable | System busy or over capacity |

---

## Security

- All endpoints require `Authorization: Bearer <license_key>`
- HTTPS mandatory in production
- Rate limiting: 10 requests/second per license key
- All logs and outputs are stored locally and never transmitted externally

> **Note:** This API does not support streaming, real-time feedback, or authentication tokens. It is designed for batch and stateless operation in industrial environments.

---

## Cross-References

- **Full Pipeline**: [Full Pipeline](../02_pipeline/full_pipeline.md)
- **Configuration**: [Config Guide](../04_configuration/config_guide.md)
- **Deployment**: [Setup](../05_deployment/setup.md)

**Version:** 2.0  
**Last Updated:** 2026-05-16