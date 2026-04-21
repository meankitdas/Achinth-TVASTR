# Dashboard & Reporting

> **Technical Reference: RAS Dashboard Tabs and Data Visualization**

---

## Overview

TvastrRAS provides a web-based dashboard for visualizing inspection results, defect analytics, and plant-level intelligence. Dashboard features scale with license tier:

- **TIER_1:** No dashboard (inspection API only)
- **TIER_2:** 4 dashboard tabs (Process Intelligence)
- **TIER_3:** 8 dashboard tabs (Plant Intelligence)

The dashboard is built with React, Recharts (visualization library), and Supabase (real-time data).

---

## Dashboard Architecture (TIER_3)

### 8 Dashboard Tabs

Plant Intelligence (TIER_3) provides 8 tabs:

**1. Overview Tab**
- Key performance indicators (KPIs)
- Rejection rate, acceptance rate, manual review rate
- Total inspections count (today, this week, this month)
- Real-time statistics

**2. Inspection History Tab**
- Table of all inspection records
- Columns: Casting ID, Timestamp, Decision, Confidence, Primary Defect
- Filters: Date range, decision type (ACCEPT/REJECT/MANUAL_REVIEW), defect class
- Sorting: By timestamp, confidence, decision
- Pagination: 50 records per page

**3. Heat Analytics Tab**
- Heat-level quality aggregation
- Per-heat metrics: rejection rate, defect distribution, casting count
- Heat comparison: side-by-side quality metrics
- Heat fingerprint visualization (12-dim vector representation)
- Time-series view: heat quality over time

**4. Mold Analytics Tab**
- Mold-level quality tracking
- Per-mold metrics: rejection rate, cycle count, degradation trend
- Mold health indicators: green (healthy), yellow (monitor), red (maintenance needed)
- Degradation curves: quality vs. cycle count
- Mold fingerprint visualization

**5. Defect Distribution Tab**
- Defect class frequency (6 classes: porosity, shrinkage, crack, sand inclusion, surface roughness, blow hole)
- Bar chart: defect count by class
- Pie chart: defect percentage breakdown
- Time-series: defect trends over time
- Filterable by: date range, heat, mold, shift

**6. Calibration Status Tab**
- Current fusion weights: [Signal, YOLO, LLM, Agreement]
- Current thresholds: Accept (≤0.30), Reject (≥0.70)
- Calibration history: timestamp, weights, disagreement rate
- Trigger button: "Run Auto-Calibration" (requires ≥50 validations)
- Validation queue: Pending MANUAL_REVIEW cases

**7. Fingerprint Analysis Tab**
- Fingerprint similarity matrix: castings with similar patterns
- DBSCAN cluster visualization: spatial defect clustering
- Pattern matching: Search for castings similar to selected fingerprint
- Drift detection: Fingerprint distance from baseline over time
- Heatmap: 12-field fingerprint vector visualization

**8. Reasoning Trace Tab**
- Per-inspection reasoning breakdown
- Gate exit statistics: % exiting at Gate 0/1/2/3
- Signal breakdown: Individual scores for Signal, YOLO, LLM, Agreement
- Agreement visualization: Range chart showing signal consensus
- LLM explanation: Natural language reasoning (if Gate 3 used)
- Processing timeline: Latency per pipeline stage

---

## Dashboard Data Sources

### Real-Time Updates (Supabase Realtime)

The dashboard subscribes to Supabase real-time channels:
- `inspections` table: New inspection records trigger UI updates
- `validations` table: Operator validations update statistics
- `calibrations` table: Auto-calibration runs update weights display

**Subscription Example:**
```javascript
supabase
  .channel('inspections')
  .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'inspections' },
      (payload) => updateDashboard(payload.new))
  .subscribe()
```

### REST API Data Endpoints

Dashboard tabs fetch data via REST API (see [Manufacturing Intelligence](manufacturing_intelligence.md)):

**Overview Tab:**
- `GET /api/statistics?period=today|week|month` - KPI aggregation
- `GET /api/statistics/realtime` - Live counts

**Inspection History Tab:**
- `GET /api/history?limit=50&offset=0&filter=...` - Paginated history
- `GET /api/inspect/{id}` - Individual inspection details

**Heat Analytics Tab:**
- `GET /api/heat/{heat_id}/quality` - Heat quality summary
- `GET /api/heat/{heat_id}/castings` - All castings from heat
- `GET /api/heat/{heat_id}/fingerprint` - Heat-level fingerprint
- `GET /api/heat/compare?heat_ids=...` - Multi-heat comparison

**Mold Analytics Tab:**
- `GET /api/mold/{mold_id}/history` - Mold quality history
- `GET /api/mold/{mold_id}/degradation` - Degradation curve data
- `GET /api/mold/{mold_id}/fingerprint` - Mold-level fingerprint
- `GET /api/mold/comparison?mold_ids=...` - Multi-mold comparison

**Defect Distribution Tab:**
- `GET /api/statistics/defects?date_range=...` - Defect counts by class
- `GET /api/statistics/defects/trends?period=...` - Time-series data

**Calibration Status Tab:**
- `GET /api/calibration/status` - Current weights and thresholds
- `GET /api/calibration/history` - Past calibration runs
- `POST /api/calibration/run` - Trigger new calibration

**Fingerprint Analysis Tab:**
- `GET /api/fingerprint/{casting_id}` - Get fingerprint
- `POST /api/fingerprint/match` - Similarity search
- `GET /api/fingerprint/cluster?date_range=...` - Cluster analysis
- `GET /api/fingerprint/drift?baseline_date=...` - Drift detection

**Reasoning Trace Tab:**
- `GET /api/reasoning/{inspection_id}` - Detailed reasoning data
- `GET /api/reasoning/gates?date_range=...` - Gate statistics
- `GET /api/reasoning/validation?date_range=...` - Agreement analysis

---

## Visualization Components

### Chart Types (Recharts)

**Bar Chart:**
- Defect distribution by class
- Heat/mold comparison metrics
- Gate exit statistics

**Line Chart:**
- Rejection rate over time
- Mold degradation curves
- Fingerprint drift trends

**Pie Chart:**
- Defect percentage breakdown
- Decision distribution (ACCEPT/REJECT/MANUAL_REVIEW)

**Scatter Plot:**
- Fingerprint similarity matrix
- Signal correlation analysis

**Heatmap:**
- Patch score grid (6×6)
- Fingerprint vector visualization
- Time-of-day quality patterns

**Area Chart:**
- Cumulative defect trends
- Rolling rejection rate (7-day moving average)

### Interactive Features

**Filters:**
- Date range picker (calendar UI)
- Dropdown: Decision type, defect class, heat ID, mold ID
- Multi-select: Filter by multiple heats or molds simultaneously

**Drill-Down:**
- Click bar chart segment → filtered inspection list
- Click heat in comparison table → heat detail view
- Click fingerprint cluster → castings in that cluster

**Export:**
- CSV: Table data (inspection history, heat metrics)
- JSON: Raw API response data
- PNG: Chart images (right-click save)

---

## License Tier Comparison

| Feature | TIER_1 | TIER_2 (Process Intelligence) | TIER_3 (Plant Intelligence) |
|---------|--------|-------------------------------|----------------------------|
| **Dashboard Access** | ✗ | ✓ (4 tabs) | ✓ (8 tabs) |
| **Overview Tab** | ✗ | ✓ | ✓ |
| **Inspection History** | ✗ | ✓ | ✓ |
| **Heat Analytics** | ✗ | ✓ | ✓ |
| **Mold Analytics** | ✗ | ✓ | ✓ |
| **Defect Distribution** | ✗ | ✗ | ✓ |
| **Calibration Status** | ✗ | ✗ | ✓ |
| **Fingerprint Analysis** | ✗ | ✗ | ✓ |
| **Reasoning Trace** | ✗ | ✗ | ✓ |
| **REST API Endpoints** | ✗ | 10 | 25 |
| **Real-Time Updates** | ✗ | ✓ | ✓ |

---

## Dashboard Performance

### Response Time Targets

**Tab Load Times (TIER_3):**
- Overview Tab: <500ms (simple aggregation)
- Inspection History: <1000ms (paginated query)
- Heat Analytics: <1500ms (complex aggregation)
- Mold Analytics: <1500ms (degradation curve computation)
- Defect Distribution: <800ms (group by + count)
- Calibration Status: <300ms (read config)
- Fingerprint Analysis: <2000ms (similarity search, computationally intensive)
- Reasoning Trace: <1000ms (join multiple tables)

**Real-Time Update Latency:**
- New inspection → dashboard update: <500ms (Supabase realtime)
- WebSocket connection overhead: ~10-20ms per message

### Optimization Strategies

**Caching:**
- KPI statistics cached for 5 minutes (Redis or in-memory)
- Chart data cached per query signature
- Invalidate cache on new inspection or validation

**Pagination:**
- Inspection history: 50 records per page (configurable)
- Lazy loading: Fetch next page on scroll

**Database Indexing:**
- Index on `timestamp` (for date range queries)
- Index on `heat_id`, `mold_id` (for analytics queries)
- Index on `decision` (for filtering)
- Composite index on `(timestamp, decision)` (for filtered time-series)

**Background Jobs:**
- Pre-compute heat/mold aggregations nightly
- Update materialized views for complex analytics
- Archive old data (>90 days) to separate table

---

## Data Export Formats

### CSV Export

**Inspection History CSV:**
```csv
Casting_ID,Heat_ID,Mold_ID,Timestamp,Decision,Confidence,Primary_Defect,Defect_Count
C-12345,H-9912,M-450,2026-04-21T14:30:00Z,REJECT,0.92,porosity,3
C-12346,H-9912,M-450,2026-04-21T14:35:00Z,ACCEPT,0.85,none,0
...
```

**Heat Quality CSV:**
```csv
Heat_ID,Total_Castings,Accepted,Rejected,Manual_Review,Rejection_Rate,Primary_Defect
H-9912,47,31,13,3,27.7%,porosity
H-9913,52,45,5,2,9.6%,surface_roughness
...
```

### JSON Export

**Inspection Detail JSON:**
```json
{
  "casting_id": "C-12345",
  "heat_id": "H-9912",
  "mold_id": "M-450",
  "timestamp": "2026-04-21T14:30:00Z",
  "decision": "REJECT",
  "confidence": 0.92,
  "scores": {
    "signal": 0.88,
    "yolo": 0.75,
    "llm": 0.85,
    "agreement": 0.90
  },
  "defects": [
    {"class": "porosity", "confidence": 0.91, "bbox": [120, 80, 180, 140], "patch": [2, 3]},
    {"class": "porosity", "confidence": 0.87, "bbox": [200, 100, 250, 150], "patch": [2, 4]}
  ],
  "fingerprint": [0.42, 0.65, 0.15, 0.15, 0.05, 0.58, 0.62, 0.22, 3.0, 0.48, 0.71, 0.83],
  "model_versions": {
    "yolo": "v8.2",
    "signal": "v3.1",
    "llm": "v1.5"
  }
}
```

### Image Export

**Annotated Image:**
- Format: PNG with transparency
- Overlays: Bounding boxes, defect labels, confidence scores
- Color coding: Red (REJECT), Green (ACCEPT), Orange (MANUAL_REVIEW)
- Resolution: Original image resolution preserved

**Batch ZIP Export:**
```
inspection_batch_20260421.zip
├── images/
│   ├── C-12345_original.jpg
│   ├── C-12345_annotated.png
│   ├── C-12346_original.jpg
│   ├── C-12346_annotated.png
│   └── ...
├── metadata/
│   ├── C-12345.json
│   ├── C-12346.json
│   └── ...
└── summary.csv
```

---

## Technical Implementation

### Frontend Stack

- **Framework:** React 18+ with Vite
- **UI Library:** Tailwind CSS for styling
- **Charts:** Recharts (React charting library)
- **State Management:** React Context API + custom hooks
- **Data Fetching:** TanStack Query (React Query) for caching and synchronization
- **Real-Time:** Supabase Realtime client

### Backend Stack

- **Database:** PostgreSQL (via Supabase)
- **API:** REST endpoints (Express.js or FastAPI)
- **Authentication:** Supabase Auth (JWT-based)
- **File Storage:** Supabase Storage (images, exports)

### Deployment

- **Frontend:** Static hosting (Vercel, Netlify, or AWS S3 + CloudFront)
- **Backend:** Containerized (Docker) on AWS ECS, GCP Cloud Run, or Kubernetes
- **Database:** Supabase cloud (managed PostgreSQL)

---

## Authentication & Authorization

### Role-Based Access

**Operator Role:**
- Submit inspections: `POST /api/inspect`
- View own inspection history
- Cannot access calibration or admin features

**Supervisor Role:**
- All operator permissions
- Access dashboard tabs: Overview, Inspection History, Heat Analytics, Mold Analytics
- Validate MANUAL_REVIEW cases: `POST /api/validate/{id}`

**Quality Engineer Role:**
- All supervisor permissions
- Access all 8 dashboard tabs (TIER_3)
- Trigger auto-calibration: `POST /api/calibration/run`
- Export data (CSV, JSON, images)

**Admin Role:**
- All quality engineer permissions
- Manage users and roles
- Configure thresholds and weights manually
- Access system logs and diagnostics

### Authentication Flow

1. User logs in → Supabase Auth issues JWT
2. Frontend stores JWT in localStorage
3. API requests include `Authorization: Bearer <JWT>` header
4. Backend validates JWT and checks role permissions
5. Return data or 403 Forbidden based on authorization

---

## Dashboard URL Structure

**Base URL:** `https://app.tvastrras.com/dashboard`

**Route Structure:**
- `/dashboard/overview` - Overview Tab
- `/dashboard/history` - Inspection History Tab
- `/dashboard/heat` - Heat Analytics Tab
- `/dashboard/mold` - Mold Analytics Tab
- `/dashboard/defects` - Defect Distribution Tab
- `/dashboard/calibration` - Calibration Status Tab
- `/dashboard/fingerprint` - Fingerprint Analysis Tab
- `/dashboard/reasoning` - Reasoning Trace Tab

**Detail Views:**
- `/dashboard/inspect/{casting_id}` - Individual inspection detail
- `/dashboard/heat/{heat_id}` - Heat detail view
- `/dashboard/mold/{mold_id}` - Mold detail view

---

**Next:** [Quality & Compliance](quality_compliance.md) — ISO alignment and audit readiness

