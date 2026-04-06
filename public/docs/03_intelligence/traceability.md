# Traceability System

## Purpose

Ensures every inspection record is reliably traced through a heat number with robust fallback mechanism when heat data is missing from ERP, enabling heat-based analytics and quality tracking.

## Where Used

- **Pipeline Stage**: Stage 7 (Traceability)
- **Entry Point**: `core/traceability/context_loader.py::load_casting_context()`
- **Field**: `resolved_heat_id` (canonical heat identifier)

---

## System Architecture

```
Image Inspection
    ↓
Context Loader (ERP query with temporal matching)
    ↓
Heat Resolver (real heat OR FH_ fallback)
    ↓
Inspection Repository (persist resolved_heat_id)
    ↓
Reconciliation Engine (FH_ → real heat when ERP available)
    ↓
Analytics & Alerts (group by resolved_heat_id)
```

---

## Core Components

### 1. Heat Resolver

**File:** `core/traceability/heat_resolver.py`

**Logic:**
- If `heat_number` exists → use it
- Else → generate `FH_{YYYYMMDD}_{mould}_{sha1hash}`

**Functions:**
- `resolve_heat_id()` — Main resolution logic
- `is_fallback_heat()` — Check if ID is provisional
- `extract_date_from_fallback()` — Parse fallback components

**Fallback Format:** `FH_{YYYYMMDD}_{identifier}_{hash}`

**Example:**
```python
# Real heat
resolve_heat_id("H-2345", datetime.now(), "M123", "P456", "/img.jpg")
# → "H-2345"

# Fallback
resolve_heat_id("", datetime.now(), "M123", "P456", "/img.jpg")
# → "FH_20260405_M123_a1b2c3"
```

### 2. Context Loader with Temporal Matching

**File:** `core/traceability/context_loader.py`

**Enhancement:** Improved ERP matching — picks row with **closest date** to `inspection_time` (handles 3-4 day manufacturing lag).

**Before:** Most recent Production_Daywise row by mould/part

**After:** Picks row where `abs(Date - inspection_time)` is minimum

**SQL Logic:**
```sql
SELECT TOP 10 ... 
FROM Production_Daywise
WHERE mould_no LIKE '%{casting_id}%' OR Part_No = '{casting_id}'
ORDER BY Date DESC
```

Then picks row with minimum temporal distance.

**Context Dict:**
```python
{
    "casting_id": "...",
    "heat_number": "H-2345",        # From ERP
    "resolved_heat_id": "H-2345",   # Resolved by heat_resolver
    "mold_id": "M123",
    ...
}
```

### 3. Reconciliation Engine

**File:** `core/traceability/heat_reconciliation.py`

**Purpose:** Reconcile provisional FH_ IDs to real heat numbers when ERP data becomes available.

**Rules:**
1. **One-way only:** FH_ → real heat (never revert)
2. **Group reconciliation:** All rows sharing same FH_ updated together
3. **Audit logging:** Every change logged to `runtime/logs/reconciliation.log`
4. **Non-blocking:** Runs in background thread

**Functions:**
- `reconcile_provisional_heats(max_rows, dry_run)` — Scan and reconcile
- `reconcile_by_group(fallback_id, new_heat_number)` — Bulk update
- `run_reconciliation_background(delay_seconds)` — Startup scheduler

**Process:**
1. Find rows with `resolved_heat_id LIKE 'FH_%'`
2. Re-run context matching with temporal proximity
3. If real `heat_no` found → update `resolved_heat_id`
4. Log reconciliation

**Audit Log:**
```
2026-04-05T12:00:00 | RECONCILE | insp_id_123 | FH_20260401_M123_abc123 → H-2345 | mould=M123
```

### 4. Backfill Script

**File:** `core/persistence/backfill_resolved_heat.py`

**Purpose:** Populate `resolved_heat_id` for existing data.

**Strategy:**
1. Rows with `heat IS NOT NULL` → `resolved_heat_id = heat`
2. Rows with `heat IS NULL` → generate FH_ fallback using SQL

**Functions:**
- `backfill_resolved_heat_ids(dry_run, batch_size)` — Main backfill
- `run_backfill_on_startup()` — Startup hook

**Statistics:**
```python
{
    "status": "completed",
    "total_processed": 1234,
    "real_heats": 987,
    "fallback_heats": 247,
    "errors": 0
}
```

### 5. Integrity Checks

**File:** `core/persistence/integrity_checks.py`

**Checks:**
1. **No Orphans:** `resolved_heat_id IS NOT NULL` for all rows
2. **Image Linkage:** No `image_path` without `resolved_heat_id`
3. **No Reversals:** No real heat replaced with FH_ (corruption check)
4. **Consistency:** `heat` and `resolved_heat_id` match when both exist
5. **Fallback Stats:** % real vs fallback (informational)

**Functions:**
- `validate_heat_integrity()` — Run all checks
- `run_integrity_checks_on_startup()` — Startup hook

---

## Database Schema

### AI_Inspections Table

**New Column:**
```sql
resolved_heat_id NVARCHAR(100) NULL
```

**Index:**
```sql
CREATE INDEX idx_ai_insp_resolved_heat ON AI_Inspections(resolved_heat_id)
```

**Migration:** Auto-applied on startup via `core/persistence/db.py::_run_column_migrations()`

---

## Query Layer Updates

### Alerts (`core/plant_intelligence/decision/alerts.py`)

**Before:**
```sql
SELECT ai.heat, COUNT(*) ...
GROUP BY ai.heat
```

**After:**
```sql
SELECT ISNULL(ai.resolved_heat_id, ai.heat) AS heat, COUNT(*) ...
GROUP BY ISNULL(ai.resolved_heat_id, ai.heat)
```

**Backward Compatibility:** `ISNULL(resolved_heat_id, heat)` ensures queries work on old data.

---

## Fallback Heat ID Format

**Pattern:** `FH_{YYYYMMDD}_{identifier}_{hash}`

**Components:**
- `FH_` — Prefix (marks as fallback)
- `YYYYMMDD` — Inspection date
- `identifier` — Mould serial no OR item number OR "UNKNOWN"
- `hash` — 6-char SHA1 hash of `image_path|timestamp|identifier`

**Properties:**
- **Deterministic:** Same inputs → same ID (for reconciliation)
- **Collision-free:** SHA1 hash ensures uniqueness
- **Parseable:** Components extractable for filtering
- **Identifiable:** `FH_` prefix distinguishes from real heats

**Examples:**
```
FH_20260405_M12345_a1b2c3
FH_20260406_PART789_d4e5f6
FH_20260407_UNKNOWN_g7h8i9
```

---

## Startup Sequence

In `core/persistence/db.py::_run_column_migrations()`:

1. Column migration: Add `resolved_heat_id` if missing
2. Index creation: `CREATE INDEX idx_ai_insp_resolved_heat`
3. Backfill: `run_backfill_on_startup()` (batched, idempotent)
4. Reconciliation: `run_reconciliation_background(delay=60s)` (background thread)
5. Integrity checks: `run_integrity_checks_on_startup()` (non-fatal)

**All steps non-fatal** — system continues if any step fails.

---

## CLI Commands

### Reconciliation (Manual)

```bash
python -c "from core.traceability.heat_reconciliation import reconcile_provisional_heats; print(reconcile_provisional_heats(max_rows=1000, dry_run=False))"
```

### Group Reconciliation

```python
from core.traceability.heat_reconciliation import reconcile_by_group

# Update all FH_20260405_M123_abc123 to real heat H-2345
count = reconcile_by_group("FH_20260405_M123_abc123", "H-2345", dry_run=False)
```

### Integrity Validation

```python
from core.persistence.integrity_checks import validate_heat_integrity
report = validate_heat_integrity()
print(report)
```

### Backfill (Manual)

```python
from core.persistence.backfill_resolved_heat import backfill_resolved_heat_ids
stats = backfill_resolved_heat_ids(dry_run=False, batch_size=500)
```

---

## Safety Guarantees

1. **Additive Schema:** New column, nullable → no breaking changes
2. **Auto-migration:** Runs on every startup, idempotent
3. **Backward Compatibility:** `ISNULL(resolved_heat_id, heat)` in SQL
4. **One-way Updates:** FH_ → real only, never revert
5. **Audit Trail:** All reconciliations logged
6. **Non-blocking:** Background reconciliation, non-fatal checks
7. **Graceful Degradation:** System works even if DB unavailable

---

## Troubleshooting

### High % of Fallback Heats

**Check:**
```python
from core.persistence.integrity_checks import check_fallback_quality
stats = check_fallback_quality()
print(f"{stats['fallback_percentage']}% fallbacks")
```

**Causes:**
- ERP data entry lag
- Mould/Part number mismatch between RAS and ERP
- Temporal matching too strict

**Solutions:**
- Run manual reconciliation
- Check ERP schema mapping in `parameters.yaml`
- Verify Production_Daywise has recent data

### Reconciliation Not Running

**Check Logs:** `runtime/logs/reconciliation.log`

**Verify Startup:**
```
[Reconciliation] Background task scheduled (delay=60s)
[Reconciliation] Starting background reconciliation (max_rows=500)
```

**Manual Trigger:**
```python
from core.traceability.heat_reconciliation import run_reconciliation_background
run_reconciliation_background(delay_seconds=5, max_rows=1000)
```

### Integrity Check Failures

**Run Full Validation:**
```python
from core.persistence.integrity_checks import validate_heat_integrity
report = validate_heat_integrity()

if not report['overall_passed']:
    for check_name, check_result in report['checks'].items():
        if check_result.get('severity') in ['ERROR', 'CRITICAL']:
            print(f"{check_name}: {check_result['message']}")
```

---

## Related Docs

- **Architecture:** `docs/01_overview/architecture.md`
- **Configuration:** `docs/04_configuration/erp_integration.md`
- **ISO Compliance:** `docs/iso_compliance.md`
- **Export Schema:** `configs/export_schema.yaml`
