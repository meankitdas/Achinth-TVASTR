# Plant Intelligence Module

## Purpose

Provides plant-wide manufacturing intelligence through analytics, quality frameworks, statistical process control (SPC), and decision intelligence via REST API and real-time WebSocket updates.

## Where Used

- **License Tier:** TIER_3 (requires `plant_intelligence` capability)
- **API Server:** `services/api/api.py`
- **Dashboard:** `web/pi/` (Next.js static SPA)

---

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│ Plant Intelligence Module                           │
│ core/plant_intelligence/ (50+ Python modules)       │
│   ├── analytics/         rejection rate, trends     │
│   ├── process_methods/   FMEA, fishbone, TPM       │
│   ├── risk/              process risk scoring       │
│   ├── spc/               control charts, Cpk        │
│   ├── decision/          alerts, recommendations    │
│   ├── reporting/         daily/weekly reports       │
│   ├── router/            query routing              │
│   ├── planner/           query executor             │
│   ├── llm/               LLM integrations           │
│   └── data_access/       SQL client (shared RAS)   │
├─────────────────────────────────────────────────────┤
│ services/api/plant_intelligence/ (8 FastAPI routes)│
│   └── 25 REST endpoints + 1 WebSocket              │
├─────────────────────────────────────────────────────┤
│ web/pi/ (Next.js static SPA)                        │
│   └── 48 files (HTML, JS, CSS) - 8 dashboard tabs  │
└─────────────────────────────────────────────────────┘
```

---

## Database Architecture

PI uses **shared database connection** from RAS persistence layer (no separate connection pool).

```
core.persistence.db.get_engine()  ← Single SQLAlchemy engine
         ↓
core.plant_intelligence.data_access.sql_client.get_engine()
         ↓
All 46 PI modules
```

---

## REST API Endpoints (25 Total)

### Analytics (6 endpoints)

- `GET /analytics/plant_overview` — Multi-metric dashboard summary
- `GET /analytics/rejection_rate` — Rejection rate by shift/heat/day
- `GET /analytics/pareto` — Pareto chart data (80/20 analysis)
- `GET /analytics/defect_trends` — Time-series with rolling average
- `GET /analytics/cluster_analysis` — Defect cluster frequency (fingerprinting)
- `GET /analytics/spatial_map` — Spatial defect concentration heatmap

### Quality Frameworks (5 endpoints)

- `GET /quality/fmea` — Failure Mode & Effects Analysis
- `GET /quality/fishbone` — Ishikawa root cause diagram
- `GET /quality/quality_gates` — Quality gate compliance tracking
- `GET /quality/tpm` — Total Productive Maintenance metrics
- `GET /quality/cost_of_quality` — Cost of quality analysis (COPQ)

### Process Intelligence (4 endpoints)

- `GET /process/risk_scores` — Entity risk scores (heat, mold, shift)
- `GET /process/heat_analysis` — Heat-specific intelligence
- `GET /process/mold_risk` — Mold degradation risk scoring
- `GET /process/defect_flow` — Sankey diagram data (defect flow analysis)

### SPC (2 endpoints)

- `GET /spc/control_chart` — X̄ control chart (CUSUM, Western Electric rules)
- `GET /spc/process_capability` — Cpk, Ppk, sigma level

### Decision Engine (4 endpoints)

- `GET /decision/actions` — Recommended corrective actions
- `GET /decision/active` — Active action tracking
- `POST /decision/action/update` — Update action status
- `GET /decision/feedback` — Action feedback history

### Alerts & Query (2 endpoints)

- `GET /alerts` — Manufacturing alerts (spikes, anomalies, drift)
- `POST /query` — Natural language query interface

### Reports (2 endpoints)

- `GET /report/daily` — Daily automated report
- `GET /report/weekly` — Weekly summary report

---

## WebSocket (Real-Time Updates)

**Endpoint:** `ws://localhost:8000/ws/plant_updates`

**Background Task:** Polls every 30 seconds and broadcasts:
- `kpi_update` — Rejection rate snapshot
- `alert` — Manufacturing alerts
- `risk_update` — Updated risk scores

**Usage (from any module):**
```python
from services.ws.event_broadcaster import broadcaster

await broadcaster.broadcast_alert(alert_dict)
await broadcaster.broadcast_kpi_update(kpi_dict)
await broadcaster.broadcast_risk_update(risk_dict)
```

**Client Example:**
```javascript
const ws = new WebSocket("ws://localhost:8000/ws/plant_updates");
ws.onmessage = (e) => {
  const event = JSON.parse(e.data);
  console.log(event.type, event.payload);
};
```

---

## Dashboard

**URL:** `http://localhost:8000/pi/`

**Technology:** Next.js static SPA (server-side rendered, exported as static HTML)

**Tabs:**
1. **Overview** — Plant-wide KPI summary (rejection rate, trends, alerts)
2. **Alerts** — Active manufacturing alerts (spikes, drift, anomalies)
3. **Quality** — FMEA, fishbone, quality gates, TPM
4. **Process** — Risk scores, heat analysis, mold risk, defect flow
5. **SPC** — Control charts, process capability (Cpk/Ppk)
6. **Decisions** — Decision engine actions + feedback tracking
7. **Query** — Natural language query interface (LLM-powered)
8. **Reports** — Daily/weekly automated reports

**Features:**
- License-gated (TIER_3 only — 403 page if not enabled)
- RAS context injection (`window.RAS` with version, tier, customer)
- Real-time WebSocket updates
- Client-side SPA routing

---

## Starting the API Server

```bash
# Method 1: Direct Python
python services/api/api.py

# Method 2: Uvicorn
python -m uvicorn services.api.api:app --host 0.0.0.0 --port 8000
```

**Access:**
- API docs: `http://localhost:8000/docs`
- PI dashboard: `http://localhost:8000/pi/`
- WebSocket: `ws://localhost:8000/ws/plant_updates`

---

## Building Dashboard from Source

**Prerequisites:** Node.js + npm

**Build Scripts:**
```bash
scripts/build_with_pi.sh    # Linux/macOS
scripts/build_with_pi.bat   # Windows
```

**Expected Structure:**
```
parent_dir/
├── plant-intelligence/
│   └── pi_dashboard/       # Next.js source
└── Rejection_model_castco/
    └── web/pi/             # Built output (48 files)
```

**Build Process:**
1. `npm install && npm run build` in `../plant-intelligence/pi_dashboard/`
2. Copies `out/` → `web/pi/`

**Packaging:** Build script auto-detects `web/pi/` during release packaging.

---

## Module Dependencies

```
core/plant_intelligence/
  ├── analytics/ → data_access (SQL queries)
  ├── process_methods/ → analytics, process_mapping (knowledge base)
  ├── risk/ → data_access (heat/mold queries)
  ├── spc/ → data_access (time-series)
  ├── decision/ → decision_engine (action generation)
  ├── decision_engine/ → data_access, process_mapping
  ├── reporting/ → analytics, spc, decision (aggregates)
  ├── router/ → planner (query parsing)
  ├── planner/ → all modules (query execution)
  └── data_access/ → core.persistence.db (shared engine)
```

---

## Configuration

**License Gating:**
```yaml
# license/license.key
tier: TIER_3
capabilities:
  - plant_intelligence  # Required for PI module
```

**Dashboard Serving:**
```python
# services/api/api.py
from core.pi.pi_server import serve_pi_dashboard

app.mount("/pi", serve_pi_dashboard())
```

**WebSocket Configuration:**
```python
# services/ws/plant_updates.py
POLL_INTERVAL = 30  # seconds
```

---

## Performance

**API Endpoints:**
- Plant overview: 50–150ms
- Control charts: 100–300ms (time-series aggregation)
- FMEA/Fishbone: 200–500ms (knowledge base queries)

**WebSocket:**
- Background polling: 30-second intervals
- Broadcast latency: <10ms per connected client

**Dashboard:**
- Initial load: 200–500ms (static assets)
- Real-time updates: <50ms (WebSocket push)

---

## Troubleshooting

### "403 Forbidden" When Accessing /pi/

**Cause:** License does not include `plant_intelligence` capability (requires TIER_3).

**Fix:** Upgrade license tier or add capability.

### WebSocket Connection Failed

**Cause:** FastAPI server not running or wrong port.

**Fix:**
```bash
python services/api/api.py
# Check: http://localhost:8000/docs
```

### "No Data Available" in Dashboard

**Cause:** Database not connected or no inspection history.

**Fix:**
1. Check `configs/system.yaml` database settings
2. Run 10+ inspections in RAS to populate data
3. Check API endpoints directly: `http://localhost:8000/analytics/plant_overview`

### PI Build Fails

**Error:**
```
ERROR: PI source not found at: ..\plant-intelligence\pi_dashboard
```

**Fix:**
```bash
cd ..
git clone https://github.com/Achintharya/plant-intelligence.git
cd Rejection_model_castco
scripts\build_with_pi.bat
```

---

## Integration with RAS

PI module integrates with core RAS systems:

1. **Fingerprinting:** Cluster analysis endpoint uses fingerprinting data
2. **Traceability:** Heat analysis uses `resolved_heat_id` for grouping
3. **Learning:** Decision engine tracks corrective actions
4. **Reasoning:** Query interface uses LLM reasoning for natural language queries

---

## Related Docs

- **PI Dashboard User Guide:** `docs/pi_dashboard_guide.md`
- **Architecture:** `docs/01_overview/architecture.md`
- **API Reference:** `docs/api_reference.md`
- **Licensing:** `docs/licensing.md`
- **Fingerprinting:** `docs/03_intelligence/fingerprinting.md`
- **Traceability:** `docs/03_intelligence/traceability.md`
