# Data Structures & Schemas

> **Purpose:** Reference for all data structures, API contracts, and export schemas  
> **Where Used:** API integration, database design, ERP integration

---

## Pipeline Result Structure

### PipelineResult

**Primary output** of the inspection pipeline returned to all callers.

```python
{
    "casting_id": str,                    # Unique casting identifier
    "inspection_time": str,               # ISO 8601 timestamp
    "decision": str,                      # "ACCEPT" | "REJECT" | "MANUAL_REVIEW"
    "confidence": str,                    # "high" | "medium" | "low"
    "casting_score": float,               # 0.0-1.0 (patch classifier score)
    "defect_count": int,                  # Number of detected defects
    "primary_defect": str | None,         # Most severe defect type
    "defects": List[Defect],              # Detected defects list
    "root_cause": RootCauseAnalysis | None,
    "review_required": bool,              # True if MANUAL_REVIEW
    "processing_time_ms": int,            # Pipeline execution time
    "output_folder": str,                 # Path to results
    "pipeline_health": str,               # "OK" | "DEGRADED" | "FAILED"
    "llm_status": str,                    # "used" | "skipped" | "failed"
    "classification_source": str,         # "yolo_only" | "fused" | "fast_path" | "geometry"
    "model_versions": dict,               # Model version metadata
    "context": InspectionContext | None   # Manufacturing context
}
```

---

## Core Data Types

### Defect

```python
{
    "defect_id": str,                     # Unique defect identifier
    "defect_type": str,                   # "porosity" | "sand_inclusion" | ...
    "confidence": float,                  # 0.0-1.0 (YOLO confidence)
    "bbox": [int, int, int, int],         # [x, y, width, height]
    "severity": str,                      # "HIGH" | "MEDIUM" | "LOW"
    "zone": str,                          # "TL" | "TC" | "TR" | "ML" | "MC" | "MR" | "BL" | "BC" | "BR"
    "secondary_zone": str | None,         # If defect spans multiple zones
    "zone_confidence": float,             # 0.0-1.0
    "grid_cell": str | None,              # "A1"-"F4" | "G5"-"L8" (defectograph)
    "surface": str,                       # "top" | "bottom" | "unknown"
    "root_cause": str | None              # Diagnosed root cause
}
```

---

### RootCauseAnalysis

```python
{
    "responsible_section": str,           # "Melting" | "Molding" | "Pouring" | "Finishing"
    "primary_cause": str,                 # Root cause description
    "contributing_factors": List[str],    # Additional factors
    "recommended_actions": List[str],     # Corrective actions
    "confidence": str,                    # "high" | "medium" | "low"
    "reasoning_mode": str,                # "fast_path" | "geometry" | "llm" | "rule_based"
    "llm_response": dict | None           # Full LLM response if used
}
```

---

### InspectionContext

Manufacturing context loaded from ERP or provided by user.

```python
{
    "casting_id": str,
    "part_type": str | None,              # Part number (e.g., "201044")
    "heat_number": str | None,            # Metal batch ID (e.g., "CC388")
    "resolved_heat_id": str | None,       # Reconciled heat after resolution
    "mold_id": str | None,                # Mold identifier
    "gate_id": str | None,                # Production gate (passive context)
    "furnace_id": str | None,             # Furnace identifier
    "shift": str | None,                  # "Shift1" | "Shift2" | "Shift3"
    "operator": str | None,               # Operator employee number
    "production_date": str | None,        # YYYY-MM-DD
    "total_quantity_pcs": int | None      # Batch size
}
```

---

## State Management

### CastingState

**Internal state** passed through pipeline stages.

```python
{
    "casting_id": str,
    "image": np.ndarray,                  # Original image
    "image_path": str,
    "context": InspectionContext,
    
    # Stage 1: Detection
    "yolo_detections": List[Detection],
    "casting_bbox": [int, int, int, int] | None,
    "cropped_casting": np.ndarray | None,
    
    # Stage 2: Patch Analysis
    "patch_results": List[PatchResult],
    "casting_score": float,
    "anomaly_patches": List[PatchResult],
    
    # Stage 3: Signal Scoring
    "signal_features": dict,
    "signal_score": float,
    
    # Stage 4: Multi-Signal Fusion
    "yolo_score": float,
    "llm_score": float | None,
    "agreement_score": float,
    "fused_score": float,
    "fusion_weights": dict,
    
    # Stage 5: Reasoning
    "root_cause": RootCauseAnalysis | None,
    "reasoning_path": str,
    
    # Stage 6: Consolidation
    "decision": str,
    "confidence": str,
    "defects": List[Defect],
    "primary_defect": str | None,
    
    # Stage 7: Outputs
    "output_folder": str,
    "report_path": str | None,
    "annotated_image_path": str | None,
    "heatmap_path": str | None,
    
    # Metadata
    "pipeline_health": str,
    "llm_status": str,
    "classification_source": str,
    "processing_time_ms": int,
    "stage_times": dict
}
```

---

### Detection

YOLO detection output.

```python
{
    "class_id": int,
    "class_name": str,
    "confidence": float,
    "bbox": [float, float, float, float],  # [x1, y1, x2, y2] normalized 0-1
    "bbox_pixels": [int, int, int, int]    # [x, y, width, height] in pixels
}
```

---

### PatchResult

Patch classifier output.

```python
{
    "patch_id": int,
    "x": int,                             # Top-left x coordinate
    "y": int,                             # Top-left y coordinate
    "width": int,                         # Patch width (256)
    "height": int,                        # Patch height (256)
    "probability": float,                 # Model probability (0-1)
    "anomaly_score": float,               # Combined anomaly score (0-1)
    "feature_anomaly": float,             # Feature-based anomaly (0-1)
    "yolo_hint": float,                   # YOLO entropy hint (0-1)
    "spatial_density": float,             # Local density score (0-1)
    "cluster_id": int | None,             # DBSCAN cluster assignment
    "signal_features": {                  # Signal-based features (optional)
        "texture": dict,                  # LBP, GLCM features
        "edges": dict,                    # Edge density, mean
        "blobs": dict,                    # Blob count, mean size
        "intensity": dict,                # Mean, std, range
        "geometry": dict,                 # Area, circularity, solidity, etc.
        "flow": {                         # Flow pattern features (NEW)
            "direction_consistency": float,  # 0.0-1.0, circular variance
            "line_count": int,                # Hough lines detected (minLength=40)
            "flow_score": float               # 0.0-1.0, composite flow strength
        }
    }
}
```

---

## Database Schemas

### AI_Inspections Table

```sql
CREATE TABLE AI_Inspections (
    inspection_id         VARCHAR(50) PRIMARY KEY,
    casting_id            VARCHAR(50) NOT NULL,
    part_type             VARCHAR(50),
    heat_number           VARCHAR(50),
    resolved_heat_id      VARCHAR(50),
    mould_serial_no       VARCHAR(50),
    gate_id               VARCHAR(50),
    inspection_date       DATETIME NOT NULL,
    decision              VARCHAR(20) NOT NULL,
    casting_score         FLOAT,
    defect_count          INTEGER,
    primary_defect        VARCHAR(50),
    confidence_level      VARCHAR(20),
    processing_time_ms    INTEGER,
    operator_id           VARCHAR(50),
    shift                 VARCHAR(20),
    image_path            VARCHAR(500),
    output_folder         VARCHAR(500),
    pipeline_health       VARCHAR(20),
    llm_status            VARCHAR(20),
    classification_source VARCHAR(50),
    created_at            DATETIME DEFAULT GETDATE(),
    
    INDEX idx_inspection_date (inspection_date DESC),
    INDEX idx_heat_number (heat_number),
    INDEX idx_decision (decision),
    INDEX idx_part_type (part_type)
)
```

---

### AI_Defects Table

```sql
CREATE TABLE AI_Defects (
    defect_id       VARCHAR(50) PRIMARY KEY,
    inspection_id   VARCHAR(50) NOT NULL,
    defect_type     VARCHAR(50) NOT NULL,
    confidence      FLOAT,
    bbox_x          INTEGER,
    bbox_y          INTEGER,
    bbox_w          INTEGER,
    bbox_h          INTEGER,
    severity        VARCHAR(20),
    root_cause      VARCHAR(100),
    zone            VARCHAR(50),
    secondary_zone  VARCHAR(50),
    zone_confidence FLOAT,
    grid_cell       VARCHAR(10),
    surface         VARCHAR(20),
    
    FOREIGN KEY (inspection_id) REFERENCES AI_Inspections(inspection_id),
    INDEX idx_inspection_id (inspection_id),
    INDEX idx_defect_type (defect_type)
)
```

---

## ERP Integration Schemas

### Production_Daywise (READ-ONLY)

ERP table for manufacturing context.

```sql
-- Customer's existing ERP table (not created by RAS)
CREATE TABLE Production_Daywise (
    Date              DATETIME,
    Shift             VARCHAR(20),
    Part_No           VARCHAR(50),
    heat_no           VARCHAR(50),
    mould_no          VARCHAR(50),
    furance_no        VARCHAR(50),          -- Note: typo in customer schema
    Emp_No            VARCHAR(50),
    Total_Qty_Pcs     INTEGER
)
```

**Query Pattern:**
```sql
SELECT * FROM Production_Daywise 
WHERE Date = ? AND Shift = ? AND Part_No = ?
ORDER BY Date DESC
LIMIT 1
```

---

### AI_Inspection_Queue (OPTIONAL)

Queue table for SQL-based batch processing.

```sql
CREATE TABLE AI_Inspection_Queue (
    queue_id         VARCHAR(50) PRIMARY KEY,
    image_path       VARCHAR(500) NOT NULL,
    part_type        VARCHAR(50),
    heat_number      VARCHAR(50),
    shift            VARCHAR(20),
    production_date  DATETIME,
    status           VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, PROCESSING, COMPLETED, FAILED
    priority         INTEGER DEFAULT 0,
    created_at       DATETIME DEFAULT GETDATE(),
    processed_at     DATETIME NULL,
    error_message    VARCHAR(500) NULL,
    
    INDEX idx_status_priority (status, priority DESC, created_at ASC)
)
```

---

## Export Schemas

### JSON Export Format

**File:** `runtime/outputs/exports/{casting_id}.json`

```json
{
  "version": "1.0",
  "export_date": "2026-04-06T12:34:56Z",
  "inspection": {
    "casting_id": "CAST-20260406-123456-0001",
    "inspection_date": "2026-04-06T12:34:56Z",
    "decision": "REJECT",
    "confidence": "high",
    "casting_score": 0.72,
    "defect_count": 3,
    "primary_defect": "porosity"
  },
  "defects": [
    {
      "defect_id": "DEF-001",
      "defect_type": "porosity",
      "confidence": 0.87,
      "bbox": [120, 450, 80, 65],
      "severity": "HIGH",
      "zone": "MC"
    }
  ],
  "root_cause": {
    "responsible_section": "Melting",
    "primary_cause": "Excessive moisture in mold",
    "recommended_actions": [
      "Check mold drying process",
      "Verify humidity control"
    ]
  },
  "context": {
    "part_type": "201044",
    "heat_number": "CC388",
    "shift": "Shift1",
    "production_date": "2026-04-06"
  },
  "metadata": {
    "system_version": "1.4",
    "processing_time_ms": 1250,
    "pipeline_health": "OK",
    "model_versions": {
      "casting_model": "1.4.0",
      "patch_classifier": "2.1.0"
    }
  }
}
```

---

### CSV Export Format

**File:** `runtime/outputs/exports/inspections_YYYYMMDD.csv`

```csv
casting_id,inspection_date,decision,confidence,defect_count,primary_defect,part_type,heat_number,shift
CAST-001,2026-04-06T12:34:56,REJECT,high,3,porosity,201044,CC388,Shift1
CAST-002,2026-04-06T12:35:42,ACCEPT,high,0,,201044,CC388,Shift1
```

---

## Configuration Schemas

### parameters.yaml Structure

```yaml
# Detection thresholds
thresholds:
  surface_detection: float                # 0.0-1.0
  per_class_conf: dict                    # class_name: float

# Patch analysis
patch_analysis:
  radius: int                             # DBSCAN eps
  dbscan_min_samples: int
  max_cluster_patches: int
  entropy_range: [float, float]
  entropy_penalty: float                  # 0.0-1.0

# Scoring
scoring:
  T_patch: float                          # 0.0-1.0
  T_high: float                           # REJECT threshold
  T_low: float                            # MANUAL_REVIEW threshold
  K: int                                  # Top-K patches

# Fusion weights
fusion:
  yolo_weight: float                      # Sum to 1.0
  anomaly_weight: float
  density_weight: float

# Multi-signal fusion
multi_signal_fusion:
  yolo_weight: float                      # Sum to 1.0
  signal_weight: float
  llm_weight: float
  agreement_weight: float

# Reasoning
reasoning:
  enable_vlm: bool
  gate2_score_threshold: float
  yolo_override_conf: float
  max_images: int
  fast_path:
    enabled: bool
    min_cluster_size: int
    min_avg_prob: float
    min_porosity_score: float
    min_circularity: float

# LLM configuration
llm:
  provider: str                           # "mistral" | "openai"
  mistral:
    api_key_env: str
    vlm_model: str
    temperature: float
    max_tokens: int
    top_p: float
```

---

### system.yaml Structure

```yaml
# Database
database:
  type: str                               # "mssql" | "sqlite" | "postgresql"
  connection_string: str
  pool_size: int
  max_overflow: int
  pool_timeout: int
  pool_recycle: int

# Application
app:
  name: str
  port: int
  log_level: str                          # "DEBUG" | "INFO" | "WARNING" | "ERROR"

# Hardware
hardware:
  device: str                             # "cuda" | "cpu"
  gpu_id: int
  cuda_memory_fraction: float
  half_precision: bool

# Batch processing
batch:
  source: str                             # "sql" | "folder"
  sql_poll_interval: int
  sql_batch_size: int
  sql_table: str
  folder_path: str
  poll_interval: int
  recursive: bool
  archive_processed: bool

# Logging
logging:
  level: str
  format: str                             # "simple" | "detailed" | "json"
  file_enabled: bool
  file_path: str
  file_max_bytes: int
  file_backup_count: int
  console_enabled: bool
  console_level: str
  modules: dict                           # module_name: level

# Runtime
runtime:
  auto_migrate_db: bool
  auto_backfill: bool
  auto_reconciliation: bool
  integrity_checks: bool
  max_parallel_inspections: int
  image_cache_size_mb: int
  dry_run: bool
  debug_mode: bool

# Updates
update:
  check_on_startup: bool
  update_api: str
  product: str
```

---

## API Response Schemas

### POST /inspect Response

```json
{
  "success": true,
  "data": {
    "casting_id": "CAST-20260406-123456-0001",
    "decision": "REJECT",
    "confidence": "high",
    "defect_count": 3,
    "primary_defect": "porosity",
    "processing_time_ms": 1250,
    "output_folder": "runtime/outputs/CAST-20260406-123456-0001"
  },
  "message": "Inspection completed successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_IMAGE",
    "message": "Image quality too low (blur score: 42.3, threshold: 50.0)",
    "details": {
      "blur_score": 42.3,
      "threshold": 50.0
    }
  }
}
```

---

## Fingerprint Structure

### FingerprintVector (v4)

```python
{
    "fingerprint_id": str,
    "casting_id": str,
    "defect_id": str,
    "defect_type": str,
    "part_type": str | None,
    "timestamp": str,                     # ISO 8601
    
    # Spatial features (normalized 0-1)
    "centroid_x": float,
    "centroid_y": float,
    "size": float,
    "aspect_ratio": float,
    "circularity": float,
    "solidity": float,
    
    # Texture features
    "lbp_histogram": List[float],         # 10 bins (uniform patterns)
    "glcm_features": [float, float, float, float],  # contrast, homogeneity, energy, correlation
    
    # Context
    "zone": str,
    "surface": str,
    
    # Alignment metadata
    "alignment_method": str,              # "contour" | "orb" | "pca"
    "alignment_confidence": float,
    
    # Version
    "format_version": str                 # "v4"
}
```

---

## Signal Trace Structure

**File:** `runtime/logs/signal_traces/YYYY-MM-DD.jsonl`

```json
{
  "timestamp": "2026-04-06T12:34:56.789Z",
  "casting_id": "CAST-20260406-123456-0001",
  "yolo_score": 0.65,
  "signal_score": 0.72,
  "llm_score": 0.68,
  "agreement_score": 0.85,
  "fused_score": 0.70,
  "decision": "REJECT",
  "confidence": "high",
  "weights": {
    "yolo": 0.20,
    "signal": 0.40,
    "llm": 0.20,
    "agreement": 0.20
  },
  "signal_features": {
    "texture_score": 0.75,
    "edge_score": 0.68,
    "geometry_score": 0.82,
    "blob_score": 0.59
  },
  "ground_truth": null,
  "validated_by": null
}
```

---

## Validation Schemas

### Human Validation Record

**File:** `{output_folder}/review.json`

```json
{
  "casting_id": "CAST-20260406-123456-0001",
  "reviewed_at": "2026-04-06T14:22:10Z",
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

---

## Enumerations

### Decision Types

```python
Decision = Literal["ACCEPT", "REJECT", "MANUAL_REVIEW"]
```

### Confidence Levels

```python
Confidence = Literal["high", "medium", "low"]
```

### Defect Types

```python
DefectType = Literal[
    "porosity",
    "sand_inclusion",
    "slag_inclusion",
    "moulding_error",
    "sand_drop",
    "pouring_temperature_delay",
    "crack",
    "surface_roughness",
    "blow_hole",
    "unknown"
]
```

### Severity Levels

```python
Severity = Literal["HIGH", "MEDIUM", "LOW"]
```

### Zones

```python
Zone = Literal["TL", "TC", "TR", "ML", "MC", "MR", "BL", "BC", "BR"]
# TL=Top-Left, TC=Top-Center, TR=Top-Right
# ML=Middle-Left, MC=Middle-Center, MR=Middle-Right
# BL=Bottom-Left, BC=Bottom-Center, BR=Bottom-Right
```

### Responsible Sections

```python
ResponsibleSection = Literal["Melting", "Molding", "Pouring", "Finishing", "Material", "Unknown"]
```

### Pipeline Health

```python
PipelineHealth = Literal["OK", "DEGRADED", "FAILED"]
```

### LLM Status

```python
LLMStatus = Literal["used", "skipped", "failed"]
```

### Classification Source

```python
ClassificationSource = Literal["yolo_only", "fused", "fast_path", "geometry"]
```

---

## Related Documentation

- **API Reference**: [api_contracts.md](api_contracts.md) — REST API endpoints
- **Runtime**: [runtime.md](../05_deployment/runtime.md) — Storage locations, SQL schemas
- **Pipeline**: [full_pipeline.md](../02_pipeline/full_pipeline.md) — Data flow through pipeline
- **Configuration**: [config_guide.md](../04_configuration/config_guide.md), [parameters.md](../04_configuration/parameters.md)

---

**Version:** 1.0  
**Last Updated:** 2026-04-07
