# API Reference

## Purpose

REST API endpoints for programmatic access to TvastrRAS inspection system.

## Where Used

- Integration with external systems
- Automated batch processing
- Custom UI development
- Third-party applications

---

## Base Configuration

**Default endpoint:** `http://localhost:8000`

**Start API server:**
```bash
python services/api/api.py
```

**Configuration:**
```yaml
# configs/system.yaml
api:
  port: 8000
  host: "0.0.0.0"
  cors_enabled: true
  max_upload_size: 50  # MB
```

---

## Authentication

**Current version:** No authentication (local network deployment)

**Future:** API key authentication planned for multi-tenant deployments

---

## Core Endpoints

### POST /upload-image

Upload casting image for inspection.

**Request:**
```bash
curl -X POST http://localhost:8000/upload-image \
  -F "file=@casting.jpg" \
  -F "casting_id=CAST-001" \
  -F "part_type=201044" \
  -F "heat_number=CC388"
```

**Parameters:**
- `file` (required): Image file (JPG, PNG)
- `casting_id` (optional): Unique casting identifier
- `part_type` (optional): Part type code
- `heat_number` (optional): Heat number from furnace
- `shift` (optional): Shift identifier
- `operator` (optional): Operator ID

**Response:**
```json
{
  "inspection_id": "INSP-20260407-030000-0001",
  "casting_id": "CAST-001",
  "decision": "REJECT",
  "confidence": 0.85,
  "defects": [
    {
      "type": "porosity",
      "confidence": 0.92,
      "bbox": [120, 200, 80, 60],
      "severity": "HIGH",
      "zone": "riser_zone"
    }
  ],
  "processing_time_ms": 1250,
  "pipeline_health": "OK"
}
```

**Status Codes:**
- `200 OK`: Inspection completed successfully
- `400 Bad Request`: Invalid file or parameters
- `500 Internal Server Error`: Processing failed

---

### GET /api/inspection/{inspection_id}

Retrieve inspection results by ID.

**Request:**
```bash
curl http://localhost:8000/api/inspection/INSP-20260407-030000-0001
```

**Response:**
```json
{
  "inspection_id": "INSP-20260407-030000-0001",
  "casting_id": "CAST-001",
  "timestamp": "2026-04-07T03:00:00Z",
  "decision": "REJECT",
  "confidence": 0.85,
  "defect_count": 2,
  "defects": [...],
  "image_url": "/outputs/CAST-001/annotated.jpg",
  "report_url": "/outputs/CAST-001/report.pdf"
}
```

**Status Codes:**
- `200 OK`: Inspection found
- `404 Not Found`: Inspection ID not found

---

### GET /api/report/{casting_id}

Download PDF report for casting.

**Request:**
```bash
curl http://localhost:8000/api/report/CAST-001 -o report.pdf
```

**Response:** Binary PDF file

**Status Codes:**
- `200 OK`: Report generated
- `404 Not Found`: Casting not found
- `500 Internal Server Error`: Report generation failed

---

### GET /health

Health check endpoint.

**Request:**
```bash
curl http://localhost:8000/health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.4.0",
  "models_loaded": true,
  "database_connected": true,
  "gpu_available": true,
  "uptime_seconds": 3600
}
```

**Status Codes:**
- `200 OK`: System healthy
- `503 Service Unavailable`: System degraded

---

## License Endpoints

### GET /api/license

Get license information.

**Request:**
```bash
curl http://localhost:8000/api/license
```

**Response:**
```json
{
  "customer": "CastCo",
  "tier": "TIER_2",
  "expiry": "2027-12-31",
  "capabilities": [
    "inspection",
    "batch_processing",
    "analytics",
    "process_intelligence"
  ],
  "days_remaining": 265
}
```

**Status Codes:**
- `200 OK`: License valid
- `403 Forbidden`: License expired or invalid

---

## Batch Processing Endpoints

### POST /api/batch/submit

Submit batch of images for processing.

**Request:**
```bash
curl -X POST http://localhost:8000/api/batch/submit \
  -H "Content-Type: application/json" \
  -d '{
    "images": [
      {
        "path": "/path/to/image1.jpg",
        "casting_id": "CAST-001",
        "metadata": {"part_type": "201044"}
      },
      {
        "path": "/path/to/image2.jpg",
        "casting_id": "CAST-002"
      }
    ]
  }'
```

**Response:**
```json
{
  "batch_id": "BATCH-20260407-030000",
  "total_images": 2,
  "status": "processing"
}
```

---

### GET /api/batch/{batch_id}

Check batch processing status.

**Request:**
```bash
curl http://localhost:8000/api/batch/BATCH-20260407-030000
```

**Response:**
```json
{
  "batch_id": "BATCH-20260407-030000",
  "status": "completed",
  "total_images": 2,
  "completed": 2,
  "failed": 0,
  "results": [
    {
      "casting_id": "CAST-001",
      "decision": "ACCEPT",
      "inspection_id": "INSP-001"
    },
    {
      "casting_id": "CAST-002",
      "decision": "REJECT",
      "inspection_id": "INSP-002"
    }
  ]
}
```

---

## Analytics Endpoints

### GET /api/analytics/summary

Get inspection statistics summary.

**Request:**
```bash
curl "http://localhost:8000/api/analytics/summary?start_date=2026-04-01&end_date=2026-04-07"
```

**Response:**
```json
{
  "period": {
    "start": "2026-04-01",
    "end": "2026-04-07"
  },
  "total_inspections": 450,
  "decisions": {
    "ACCEPT": 320,
    "REJECT": 100,
    "MANUAL_REVIEW": 30
  },
  "defect_types": {
    "porosity": 45,
    "sand_inclusion": 28,
    "slag_inclusion": 15,
    "moulding_error": 12
  },
  "rejection_rate": 0.222
}
```

---

### GET /api/analytics/defects

Get defect occurrence data.

**Request:**
```bash
curl "http://localhost:8000/api/analytics/defects?defect_type=porosity&limit=100"
```

**Response:**
```json
{
  "defect_type": "porosity",
  "total_occurrences": 45,
  "avg_confidence": 0.82,
  "defects": [
    {
      "inspection_id": "INSP-001",
      "casting_id": "CAST-001",
      "confidence": 0.92,
      "severity": "HIGH",
      "timestamp": "2026-04-07T03:00:00Z"
    }
  ]
}
```

---

## Plant Intelligence Endpoints (TIER_3)

### GET /api/pi/dashboard

Get Plant Intelligence dashboard data.

**Request:**
```bash
curl http://localhost:8000/api/pi/dashboard
```

**Response:**
```json
{
  "rejection_rate": 0.18,
  "trend": "improving",
  "alerts": [
    {
      "type": "drift_detected",
      "severity": "medium",
      "message": "Porosity rate increased 15% in last shift"
    }
  ],
  "top_defects": [...],
  "spc_status": "in_control"
}
```

---

### GET /api/pi/spc/{part_type}

Get SPC (Statistical Process Control) data for part type.

**Request:**
```bash
curl http://localhost:8000/api/pi/spc/201044
```

**Response:**
```json
{
  "part_type": "201044",
  "control_limits": {
    "ucl": 0.25,
    "centerline": 0.12,
    "lcl": 0.02
  },
  "recent_data": [
    {"timestamp": "2026-04-07T01:00:00Z", "value": 0.15},
    {"timestamp": "2026-04-07T02:00:00Z", "value": 0.13}
  ],
  "status": "in_control",
  "out_of_control_points": []
}
```

---

## WebSocket API

### WS /ws/inspection

Real-time inspection updates.

**Connect:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/inspection');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Inspection update:', data);
};
```

**Message Format:**
```json
{
  "type": "inspection_completed",
  "inspection_id": "INSP-001",
  "casting_id": "CAST-001",
  "decision": "REJECT",
  "confidence": 0.85,
  "timestamp": "2026-04-07T03:00:00Z"
}
```

**Message Types:**
- `inspection_started`
- `inspection_completed`
- `batch_progress`
- `system_alert`

---

## Error Responses

**Standard error format:**
```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "details": {
    "field": "specific_field",
    "reason": "validation_failed"
  }
}
```

**Common Error Codes:**
- `invalid_file`: File format not supported
- `file_too_large`: Exceeds max upload size
- `processing_failed`: Pipeline error
- `not_found`: Resource not found
- `license_expired`: License invalid
- `capability_missing`: Feature not enabled in license

---

## Rate Limiting

**Default limits:**
- Single image upload: 10 requests/minute
- Batch submission: 2 requests/minute
- Analytics queries: 30 requests/minute

**Response when rate limited:**
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retry_after": 30
}
```

**Status Code:** `429 Too Many Requests`

---

## CORS Configuration

**Default:** CORS enabled for all origins (development)

**Production configuration:**
```yaml
api:
  cors_enabled: true
  cors_origins:
    - "https://dashboard.castco.com"
    - "https://erp.castco.com"
```

---

## Client Examples

### Python

```python
import requests

# Upload image
with open('casting.jpg', 'rb') as f:
    response = requests.post(
        'http://localhost:8000/upload-image',
        files={'file': f},
        data={
            'casting_id': 'CAST-001',
            'part_type': '201044'
        }
    )

result = response.json()
print(f"Decision: {result['decision']}")
print(f"Confidence: {result['confidence']}")
```

---

### JavaScript

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('casting_id', 'CAST-001');

fetch('http://localhost:8000/upload-image', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Decision:', data.decision);
  console.log('Confidence:', data.confidence);
});
```

---

### cURL

```bash
# Upload and inspect
curl -X POST http://localhost:8000/upload-image \
  -F "file=@casting.jpg" \
  -F "casting_id=CAST-001"

# Get results
curl http://localhost:8000/api/inspection/INSP-001

# Download report
curl http://localhost:8000/api/report/CAST-001 -o report.pdf

# Health check
curl http://localhost:8000/health
```

---

## Performance Considerations

**Upload size limits:**
- Single image: 50MB (configurable)
- Batch: 10 images per request

**Processing times:**
- Single image: 1-3 seconds (GPU), 5-10 seconds (CPU)
- Batch processing: Parallel processing supported

**Timeout settings:**
```yaml
api:
  request_timeout: 300  # 5 minutes
  upload_timeout: 60    # 1 minute
```

---

## Security Best Practices

1. **Use HTTPS in production:**
   ```yaml
   api:
     ssl_enabled: true
     ssl_cert: "/path/to/cert.pem"
     ssl_key: "/path/to/key.pem"
   ```

2. **Restrict CORS origins:**
   ```yaml
   cors_origins: ["https://trusted-domain.com"]
   ```

3. **Enable API key authentication** (when available)

4. **Use firewall rules** to restrict API access to internal network

5. **Monitor API logs:**
   ```
   runtime/logs/api.log
   ```

---

## API Versioning

**Current version:** v1 (implicit)

**Future:** Version prefix in URL
```
http://localhost:8000/v1/upload-image
http://localhost:8000/v2/upload-image
```

---

## Related Documentation

- **Installation**: [installation.md](../05_deployment/installation.md) — Setup and configuration
- **ERP Integration**: [erp_integration.md](../04_configuration/erp_integration.md) — Database integration
- **Troubleshooting**: [troubleshooting.md](troubleshooting.md) — API error resolution
- **Plant Intelligence**: [plant_intelligence.md](../03_intelligence/plant_intelligence.md) — TIER_3 endpoints
