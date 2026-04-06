# System Configuration

## Purpose

Core system configuration for database connections, file paths, logging, and runtime behavior.

## Where Configured

- **System Config:** `configs/system.yaml`
- **Customer Config:** `customers/castco/configs/parameters.yaml`
- **License:** `license/license.key`

---

## Database Configuration

**File:** `configs/system.yaml`

### SQL Server (Production)

```yaml
database:
  type: "mssql"
  server: "192.168.1.100"
  port: 1433
  database: "CastCo_Production"
  username: "ras_user"
  password: "secure_password"
  driver: "ODBC Driver 17 for SQL Server"
  
  # Connection pool settings
  pool_size: 5
  max_overflow: 10
  pool_timeout: 30
  pool_recycle: 3600
```

### SQLite (Development/Fallback)

```yaml
database:
  type: "sqlite"
  path: "runtime/inspection_history.db"
```

**Connection String:**
- MSSQL: `mssql+pyodbc://user:pass@server:port/database?driver=ODBC+Driver+17+for+SQL+Server`
- SQLite: `sqlite:///runtime/inspection_history.db`

---

## File Paths

**File:** `configs/system.yaml`

```yaml
paths:
  # Input directories
  batch_input: "runtime/batch_input"
  batch_output: "runtime/outputs"
  
  # Model directories
  models: "customers/castco/models"
  reference_parts: "customers/castco/reference_parts"
  reference_visuals: "customers/castco/reference_visuals"
  
  # Runtime directories
  runtime: "runtime"
  logs: "runtime/logs"
  process_logs: "runtime/process_logs"
  signal_traces: "runtime/logs/signal_traces"
  fingerprint_index: "runtime/fingerprint_index"
  calibration: "runtime/calibration"
  
  # Report output
  reports: "runtime/outputs/reports"
  exports: "runtime/outputs/exports"
```

**Auto-Creation:** All directories created on startup if missing.

---

## Logging Configuration

**File:** `configs/system.yaml`

```yaml
logging:
  level: "INFO"              # DEBUG | INFO | WARNING | ERROR | CRITICAL
  format: "detailed"         # simple | detailed | json
  
  # File logging
  file_enabled: true
  file_path: "runtime/logs/ras.log"
  file_max_bytes: 10485760   # 10 MB
  file_backup_count: 5       # Keep 5 rotated logs
  
  # Console logging
  console_enabled: true
  console_level: "INFO"
  
  # Module-specific levels
  modules:
    core.vision: "DEBUG"
    core.reasoning: "INFO"
    core.persistence: "WARNING"
```

**Log Rotation:** Automatic when file exceeds `file_max_bytes`.

**Log Files:**
- `runtime/logs/ras.log` — Main application log
- `runtime/logs/signal_traces/YYYY-MM-DD.jsonl` — Signal traces (JSONL)
- `runtime/logs/reconciliation.log` — Heat reconciliation audit
- `runtime/process_logs/*.log` — Batch processing logs

---

## License Configuration

**File:** `license/license.key`

```yaml
customer: "CastCo Industries"
tier: "TIER_3"
expires: "2027-12-31"
capabilities:
  - defect_detection
  - multimodal_reasoning
  - plant_intelligence
  - process_intelligence
max_inspections_per_day: -1  # -1 = unlimited
```

**Tier Capabilities:**
- **TIER_1:** Basic defect detection (YOLO only)
- **TIER_2:** + Signal scoring + LLM reasoning
- **TIER_3:** + Plant Intelligence + Process Intelligence

**License Validation:** On startup, validates expiry and capabilities.

**License Check:**
```python
from license.validator import validate_license
license_info = validate_license()
if not license_info["valid"]:
    print(f"License error: {license_info['error']}")
```

---

## Runtime Behavior

**File:** `configs/system.yaml`

```yaml
runtime:
  # Startup behavior
  auto_migrate_db: true          # Run DB migrations on startup
  auto_backfill: true            # Backfill resolved_heat_id on startup
  auto_reconciliation: true      # Background heat reconciliation
  integrity_checks: true         # Validate data integrity on startup
  
  # Performance
  max_parallel_inspections: 4    # Batch processing parallelism
  image_cache_size_mb: 512       # Image cache limit
  
  # Safety
  dry_run: false                 # If true, log only (no DB writes)
  debug_mode: false              # Enable debug features
```

---

## Customer-Specific Overrides

**File:** `customers/castco/configs/parameters.yaml`

Customer-specific overrides for models, thresholds, and pipeline parameters.

**Key Sections:**
- `models.*` — Model paths and inference settings
- `thresholds.*` — Detection confidence thresholds
- `reasoning.*` — LLM reasoning configuration
- `erp_schema.*` — ERP column mappings

See `docs/04_configuration/tuning_guide.md` for comprehensive parameter reference.

---

## Environment Variables

**Priority:** Environment variables override config files.

**Key Variables:**
```bash
# Database
export DB_TYPE="mssql"
export DB_SERVER="192.168.1.100"
export DB_NAME="CastCo_Production"
export DB_USER="ras_user"
export DB_PASSWORD="secure_password"

# LLM API Keys
export MISTRAL_API_KEY="your_api_key_here"
export OPENAI_API_KEY="your_api_key_here"

# Runtime
export RAS_DEBUG="false"
export RAS_DRY_RUN="false"
export RAS_LOG_LEVEL="INFO"

# Paths
export RAS_RUNTIME_DIR="runtime"
export RAS_MODELS_DIR="customers/castco/models"
```

---

## Configuration Loading Order

1. **System defaults** (hardcoded in `core/config/defaults.py`)
2. **configs/system.yaml** (global system config)
3. **customers/{customer}/configs/parameters.yaml** (customer overrides)
4. **Environment variables** (highest priority)

**Example:**
```python
from customers.castco.configs.loader import load_config

config = load_config()
# Returns merged config with all overrides applied
```

---

## Hot Reload

**Parameters:** `customers/castco/configs/parameters.yaml` changes take effect **immediately** on next inspection (no restart).

**System Config:** `configs/system.yaml` changes require **application restart**.

**License:** `license/license.key` changes require **application restart**.

---

## Configuration Validation

**Startup Validation:**
- Database connection test
- License validation
- Model file existence check
- Required directories created
- Config schema validation

**Runtime Validation:**
- Parameter range checks (e.g., thresholds 0.0-1.0)
- Missing keys filled with defaults
- Invalid values logged as warnings

---

## Troubleshooting

### Database Connection Failed

**Check:**
1. `configs/system.yaml` database settings correct?
2. Network connectivity to SQL Server?
3. ODBC driver installed? (`ODBC Driver 17 for SQL Server`)
4. Credentials valid?

**Test Connection:**
```python
from core.persistence.db import get_engine
engine = get_engine()
with engine.connect() as conn:
    result = conn.execute("SELECT 1")
    print("Connection OK")
```

### License Validation Failed

**Check:**
1. `license/license.key` exists?
2. License not expired?
3. Tier and capabilities correct?

**Validate:**
```python
from license.validator import validate_license
info = validate_license()
print(info)
```

### Config File Not Found

**Check:**
1. File path relative to project root
2. YAML syntax valid (no tabs, proper indentation)
3. File permissions (readable)

**Validate YAML:**
```bash
python -c "import yaml; yaml.safe_load(open('configs/system.yaml'))"
```

---

## Security Best Practices

### 1. Never Commit Secrets

Add to `.gitignore`:
```
configs/system.yaml
license/license.key
.env
*.key
*.pem
```

### 2. Use Environment Variables for Credentials

```yaml
# configs/system.yaml (template)
database:
  username: "${DB_USER}"
  password: "${DB_PASSWORD}"
```

### 3. Restrict File Permissions

```bash
chmod 600 configs/system.yaml
chmod 600 license/license.key
```

### 4. Use Encrypted Connections

```yaml
database:
  encrypt: true
  trust_server_certificate: false
```

---

## Related Docs

- **Tuning Guide:** `docs/04_configuration/tuning_guide.md`
- **ERP Integration:** `docs/04_configuration/erp_integration.md`
- **Model Configuration:** `docs/04_configuration/model_configuration.md`
- **Licensing:** `docs/licensing.md`
- **Architecture:** `docs/01_overview/architecture.md`
