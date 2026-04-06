# Runtime Environment

> **Purpose:** Runtime directories, batch processing modes, logging, and data storage  
> **Where Used:** Production deployment, system operations, troubleshooting

---

## Runtime Directory Structure

All runtime data is stored under `runtime/` (auto-created at startup):

```
runtime/
├── batch_input/              # Batch processing source folders
│   ├── incoming/             # Folder watch mode input
│   └── processed/            # Completed images archive
├── outputs/                  # Inspection results
│   ├── reports/              # PDF reports by casting_id
│   └── exports/              # JSON exports for ERP
├── logs/                     # Application logs
│   ├── ras.log               # Main application log (rotating)
│   ├── signal_traces/        # Signal decision logs (JSONL)
│   └── reconciliation.log    # Heat reconciliation audit
├── process_logs/             # ERP context (CSV fallback)
│   ├── inspections_YYYYMMDD.csv
│   └── defects_YYYYMMDD.csv
├── fingerprint_index/        # Pattern index
│   ├── fingerprints.db       # SQLite index
│   └── vectors/              # Serialized fingerprint vectors
├── calibration/              # Auto-calibration data
│   ├── weights_history.json
│   └── confidence_maps.pkl
└── updates/                  # Downloaded software updates
    └── pending/
```

**Disk space requirements:**
- **Minimal:** ~500MB (logs + small batch queue)
- **Typical:** 2-5GB (1 month of inspections with images)
- **Heavy:** 10-50GB (high volume, long retention, full image archive)

---

## Batch Processing Modes

### Mode 1: SQL Queue Polling

**Configuration:** `configs/system.yaml`

```yaml
batch:
  source: "sql"
  sql_poll_interval: 5        # seconds
  sql_batch_size: 20          # max images per poll
  sql_table: "AI_Inspection_Queue"
```

**Queue Table Structure:**

```sql
CREATE TABLE AI_Inspection_Queue (
    queue_id         VARCHAR(50) PRIMARY KEY,
    image_path       VARCHAR(500),
    part_type        VARCHAR(50),
    heat_number      VARCHAR(50),
    shift            VARCHAR(20),
    production_date  DATETIME,
    status           VARCHAR(20),  -- PENDING, PROCESSING, COMPLETED, FAILED
    priority         INTEGER DEFAULT 0,
    created_at       DATETIME,
    processed_at     DATETIME NULL
)
```

**Polling Logic:**
1. Every 5 seconds, query for `status = 'PENDING'`
2. Select top 20 by priority DESC, created_at ASC
3. Update `status = 'PROCESSING'`
4. Run inspection
5. Update `status = 'COMPLETED'` or `'FAILED'`
6. Write `processed_at` timestamp

**SQL Query:**
```sql
SELECT TOP 20 * FROM AI_Inspection_Queue 
WHERE status = 'PENDING' 
ORDER BY priority DESC, created_at ASC
```

---

### Mode 2: Folder Watch

**Configuration:**

```yaml
batch:
  source: "folder"
  folder_path: "runtime/batch_input/incoming/"
  poll_interval: 2            # seconds
  recursive: false
  archive_processed: true     # Move to processed/ after completion
```

**Process:**
1. Monitor `runtime/batch_input/incoming/` every 2 seconds
2. Detect new image files (`.jpg`, `.jpeg`, `.png`)
3. Extract metadata from filename or companion CSV
4. Run inspection
5. Move image to `runtime/batch_input/processed/YYYYMMDD/`
6. Generate report in `runtime/outputs/`

**Filename Conventions:**

**Option A: Metadata in filename**
```
{part_type}_{heat_number}_{timestamp}.jpg
201044_CC388_20260406_120530.jpg
```

**Option B: Casting ID only**
```
CAST-20260406-120530-0001.jpg
```

**Option C: Companion CSV**
```
runtime/batch_input/incoming/
├── image001.jpg
├── image002.jpg
└── batch_manifest.csv
```

`batch_manifest.csv`:
```csv
filename,casting_id,part_type,heat_number,shift,production_date
image001.jpg,CAST-001,201044,CC388,Shift1,2026-04-06
image002.jpg,CAST-002,201044,CC388,Shift1,2026-04-06
```

---

### Mode 3: Upload (Interactive)

**UI-based:** User uploads images via Streamlit dashboard (Tab 1)

**No configuration required** — always available in all tiers.

---

## SQL Storage Schema

### AI_Inspections Table

Primary inspection records (immutable after insert):

```sql
CREATE TABLE AI_Inspections (
    inspection_id         VARCHAR(50) PRIMARY KEY,
    casting_id            VARCHAR(50) NOT NULL,
    part_type             VARCHAR(50),
    heat_number           VARCHAR(50),
    resolved_heat_id      VARCHAR(50),      -- Reconciled heat
    mould_serial_no       VARCHAR(50),
    gate_id               VARCHAR(50),      -- Production gate (passive context)
    inspection_date       DATETIME NOT NULL,
    decision              VARCHAR(20) NOT NULL,  -- ACCEPT, REJECT, MANUAL_REVIEW
    casting_score         FLOAT,
    defect_count          INTEGER,
    primary_defect        VARCHAR(50),
    confidence_level      VARCHAR(20),      -- high, medium, low
    processing_time_ms    INTEGER,
    operator_id           VARCHAR(50),
    shift                 VARCHAR(20),
    image_path            VARCHAR(500),
    output_folder         VARCHAR(500),
    pipeline_health       VARCHAR(20),      -- OK, DEGRADED, FAILED
    llm_status            VARCHAR(20),      -- used, skipped, failed
    classification_source VARCHAR(50),      -- yolo_only, fused, fast_path, geometry
    created_at            DATETIME DEFAULT GETDATE()
)
```

**Indexes:**
```sql
CREATE INDEX idx_inspection_date ON AI_Inspections(inspection_date DESC);
CREATE INDEX idx_heat_number ON AI_Inspections(heat_number);
CREATE INDEX idx_decision ON AI_Inspections(decision);
CREATE INDEX idx_part_type ON AI_Inspections(part_type);
```

---

### AI_Defects Table

Detected defects per inspection:

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
    severity        VARCHAR(20),      -- HIGH, MEDIUM, LOW
    root_cause      VARCHAR(100),
    zone            VARCHAR(50),      -- TL, TC, TR, ML, MC, MR, BL, BC, BR
    secondary_zone  VARCHAR(50),
    zone_confidence FLOAT,
    grid_cell       VARCHAR(10),      -- A1-F4, G5-L8 (defectograph)
    surface         VARCHAR(20),      -- top, bottom, unknown
    FOREIGN KEY (inspection_id) REFERENCES AI_Inspections(inspection_id)
)
```

---

### AI_Defect_Clusters Table

Fingerprint patterns (Process Intelligence):

```sql
CREATE TABLE AI_Defect_Clusters (
    cluster_id      VARCHAR(50) PRIMARY KEY,
    part_type       VARCHAR(50),
    defect_type     VARCHAR(50),
    centroid_x      FLOAT,            -- Normalized 0-1
    centroid_y      FLOAT,            -- Normalized 0-1
    mean_size       FLOAT,
    occurrence_count INTEGER,
    first_seen      DATETIME,
    last_seen       DATETIME,
    updated_at      DATETIME
)
```

---

### AI_Heat_Analysis Table

Heat batch intelligence:

```sql
CREATE TABLE AI_Heat_Analysis (
    heat_number         VARCHAR(50) PRIMARY KEY,
    total_castings      INTEGER,
    defective_castings  INTEGER,
    defect_rate         FLOAT,
    anomaly_flag        BIT,          -- 1 if >20% defect rate
    dominant_defect     VARCHAR(50),
    analysis_date       DATETIME
)
```

---

## CSV Fallback Storage

If SQL database unavailable, system writes to CSV files in `runtime/process_logs/`.

### Inspections CSV

**File:** `runtime/process_logs/inspections_YYYYMMDD.csv`

```csv
inspection_id,casting_id,part_type,heat_number,decision,confidence_score,defect_count,processing_time_ms,inspection_date
INSP-001,CAST-001,201044,CC388,REJECT,0.85,3,1250,2026-04-06T12:34:56
INSP-002,CAST-002,201044,CC388,ACCEPT,0.15,0,980,2026-04-06T12:35:42
```

### Defects CSV

**File:** `runtime/process_logs/defects_YYYYMMDD.csv`

```csv
defect_id,inspection_id,defect_type,confidence,bbox_x,bbox_y,bbox_w,bbox_h,severity,zone
DEF-001,INSP-001,porosity,0.87,120,450,80,65,HIGH,MC
DEF-002,INSP-001,porosity,0.72,240,380,60,55,MEDIUM,MR
```

**CSV files can be bulk-imported to SQL later** using standard SQL `BULK INSERT` or ETL tools.

---

## Logging System

### Main Application Log

**File:** `runtime/logs/ras.log`

**Configuration:** `configs/system.yaml`

```yaml
logging:
  level: "INFO"              # DEBUG | INFO | WARNING | ERROR | CRITICAL
  file_enabled: true
  file_path: "runtime/logs/ras.log"
  file_max_bytes: 10485760   # 10 MB
  file_backup_count: 5       # Keep 5 rotated logs
```

**Log Rotation:** Automatic when file exceeds 10MB
- `ras.log` (current)
- `ras.log.1` (previous)
- `ras.log.2` (older)
- ...
- `ras.log.5` (oldest)

**Sample entries:**
```
2026-04-06 12:34:56,789 [INFO] [launcher] TvastrRAS version 1.4 starting...
2026-04-06 12:34:57,123 [INFO] [license] License validated: TIER_2, expires 2027-12-31
2026-04-06 12:34:58,456 [INFO] [database] Connected to SQL Server: CastingDB
2026-04-06 12:35:01,789 [INFO] [models] YOLO model loaded: casting_model.pt
2026-04-06 12:35:03,012 [INFO] [models] Patch classifier loaded: patch_classifier.pt
2026-04-06 12:35:03,345 [INFO] [ui] Streamlit UI launched at http://localhost:8501
```

---

### Signal Trace Logs

**File:** `runtime/logs/signal_traces/YYYY-MM-DD.jsonl`

**Format:** JSON Lines (one JSON object per line)

**Purpose:** Auto-calibration, weight optimization, debugging

**Sample entry:**
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
  "ground_truth": null
}
```

**Auto-calibration uses traces every 100 inspections** to optimize fusion weights.

---

### Heat Reconciliation Log

**File:** `runtime/logs/reconciliation.log`

**Purpose:** Track heat number resolution and fallback heat generation

**Sample entries:**
```
2026-04-06 12:34:56 [INFO] Heat CC388 resolved from ERP for CAST-001
2026-04-06 12:35:10 [WARNING] Heat missing for CAST-002, generated fallback: FH_20260406_201044_a1b2
2026-04-06 12:36:22 [INFO] Reconciliation: Matched FH_20260406_201044_a1b2 → CC389 via temporal analysis
```

---

## Output Files

### Inspection Results

**Location:** `runtime/outputs/{casting_id}/`

**Contents:**
```
runtime/outputs/CAST-20260406-123456-0001/
├── CAST-20260406-123456-0001_report.pdf        # PDF report
├── CAST-20260406-123456-0001_annotated.jpg     # Annotated image with bboxes
├── CAST-20260406-123456-0001_heatmap.jpg       # Patch heatmap overlay
├── CAST-20260406-123456-0001_result.json       # Structured result
└── metadata.json                                # Pipeline metadata
```

### Result JSON Structure

**File:** `{casting_id}_result.json`

```json
{
  "casting_id": "CAST-20260406-123456-0001",
  "inspection_date": "2026-04-06T12:34:56Z",
  "decision": "REJECT",
  "confidence": "high",
  "casting_score": 0.72,
  "defect_count": 3,
  "primary_defect": "porosity",
  "defects": [
    {
      "defect_type": "porosity",
      "confidence": 0.87,
      "bbox": [120, 450, 80, 65],
      "severity": "HIGH",
      "zone": "MC"
    }
  ],
  "root_cause": {
    "section": "Melting",
    "reason": "Excessive moisture in mold",
    "actions": ["Check mold drying process", "Verify humidity control"]
  },
  "processing_time_ms": 1250,
  "pipeline_health": "OK",
  "model_versions": {
    "casting_model": "1.4.0",
    "patch_classifier": "2.1.0"
  }
}
```

---

## Disk Space Management

### Auto-Cleanup

**Not implemented by default** — manual cleanup required.

**Recommended retention policies:**

```yaml
# Future configuration (not yet implemented)
retention:
  logs_days: 90               # Keep logs 90 days
  outputs_days: 180           # Keep inspection outputs 6 months
  csv_fallback_days: 365      # Keep CSV backups 1 year
```

### Manual Cleanup Scripts

**Clean old logs:**
```bash
# Windows
forfiles /P "runtime\logs" /S /M *.log /D -90 /C "cmd /c del @path"

# Linux
find runtime/logs -name "*.log" -mtime +90 -delete
```

**Archive outputs:**
```bash
# Zip outputs older than 6 months
7z a runtime/archives/outputs_2025.zip runtime/outputs/*2025*
```

---

## Backup Recommendations

### Critical Files

**Backup daily:**
- `license/license.json` (if not in git)
- `configs/system.yaml`
- `customers/castco/configs/parameters.yaml`
- `runtime/logs/` (last 7 days)
- SQL database (if self-hosted)

**Backup weekly:**
- `runtime/outputs/` (last 30 days)
- `runtime/fingerprint_index/`
- `runtime/calibration/`

**Backup monthly:**
- Full `runtime/` directory
- SQL database full backup

### Backup Locations

**Network backup:**
```batch
# Windows Task Scheduler
xcopy "C:\Program Files\TvastrRAS\runtime" "\\backup-server\tvastrras\%DATE%" /E /I /Y
```

**Cloud backup:**
- Azure Blob Storage
- AWS S3
- Google Cloud Storage

---

## Performance Tuning

### Batch Processing Throughput

**Factors:**
- SQL poll interval (lower = faster response, higher DB load)
- Batch size (higher = better throughput, higher memory)
- Model inference time (GPU vs CPU)
- LLM API latency

**Typical throughput:**
- **GPU (RTX 3060):** 200-300 inspections/hour
- **CPU (8-core):** 50-100 inspections/hour
- **With LLM reasoning:** -20% throughput

**Optimize for speed:**
```yaml
# Reduce quality for speed
models:
  patch_stride: 192           # was 128 (fewer patches)

reasoning:
  enable_vlm: false           # Skip LLM
  gate2_score_threshold: 0.70 # Skip LLM more often
```

---

### Database Connection Pooling

```yaml
database:
  pool_size: 10               # Concurrent connections
  max_overflow: 20            # Additional under load
  pool_timeout: 30            # Wait for available connection
  pool_recycle: 3600          # Recycle connections hourly
```

---

## Monitoring

### Key Metrics

**System health:**
- Disk space: `runtime/` folder size
- Log file growth rate
- Database connection status
- Model loading time

**Inspection performance:**
- Average processing time (target <2s GPU, <10s CPU)
- Batch queue depth (SQL mode)
- Throughput (inspections/hour)

**Decision quality:**
- Rejection rate (typical 5-15%)
- Manual review rate (typical 10-20%)
- Human validation accuracy

### Log Monitoring Commands

**Check recent errors:**
```bash
# Windows PowerShell
Select-String -Path "runtime\logs\ras.log" -Pattern "ERROR" | Select-Object -Last 50

# Linux
grep "ERROR" runtime/logs/ras.log | tail -n 50
```

**Count decisions by type:**
```bash
# Windows PowerShell
(Get-Content runtime\logs\ras.log | Select-String "decision.*REJECT").Count

# Linux
grep -c "decision.*REJECT" runtime/logs/ras.log
```

---

## Troubleshooting

### Batch processing not running

**Check:**
1. `configs/system.yaml` → `batch.source` set correctly?
2. SQL queue has `status = 'PENDING'` records?
3. Folder watch path exists and has images?
4. Logs show polling activity?

**Debug:**
```bash
# Check last 20 log entries
Get-Content runtime\logs\ras.log -Tail 20
```

---

### Outputs not written

**Check:**
1. `runtime/outputs/` directory exists and writable?
2. Disk space available?
3. Logs show write errors?

**Fix permissions:**
```bash
# Windows
icacls "runtime\outputs" /grant Users:(OI)(CI)F /T
```

---

### CSV fallback always used

**Cause:** Database connection failing

**Check:**
1. SQL Server accessible? `ping SERVER_IP`
2. ODBC Driver 17 installed?
3. Connection string correct in `configs/system.yaml`?
4. Test connection: `sqlcmd -S SERVER -U USER -P PASSWORD`

**Temporary solution:** CSV files work fine, import to SQL later using:
```sql
BULK INSERT AI_Inspections
FROM 'runtime\process_logs\inspections_20260406.csv'
WITH (FIELDTERMINATOR = ',', ROWTERMINATOR = '\n', FIRSTROW = 2)
```

---

## Related Documentation

- **Setup**: [setup.md](setup.md) — Installation and initial configuration
- **Configuration**: [config_guide.md](../04_configuration/config_guide.md) — Database, batch, logging config
- **Architecture**: [architecture.md](../01_overview/architecture.md) — Runtime directory structure
- **Troubleshooting**: [troubleshooting.md](../06_reference/troubleshooting.md) — Common issues

---

**Version:** 1.0  
**Last Updated:** 2026-04-07
