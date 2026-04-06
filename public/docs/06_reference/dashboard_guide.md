# Dashboard Guide

> **Purpose:** Operator guide for RAS (Rejection Analysis System) dashboard  
> **Access:** http://localhost:8501/ (auto-launched by `python launcher/launcher.py`)

---

## Startup

Launcher validates license, checks for updates (if enabled), and launches Streamlit dashboard.

**License info logged at startup:**
```
LICENSE INFO:
  Tier        : TIER_2
  Enabled     : inspection, batch_processing, analytics, erp_integration, learning
  Restricted  : plant_intelligence
```

---

## Header Bar

| Element | Description |
|---------|-------------|
| **Tvastr Logo** | Company branding |
| **"Rejection Analysis System"** | Application title |
| **Batch Mode Toggle** | Switch single/batch mode (TIER_2+) |

---

## Tab 1: Run Inspection

### Single Mode

**Inputs:**
1. **ERP CSV Uploader** (if SQL unavailable) — Manufacturing context
2. **Casting ID** — Text input or auto-generate `CAST-YYYYMMDD-HHMMSS-XXXX`
3. **Surface Image** — JPG/JPEG/PNG upload, 400px preview

**Actions:**
- **"Run Inspection"** — Starts pipeline
- **"Reset"** — Clears session + temp files

**Progress Display:**
- Progress bar (0-100%)
- Stage checklist: Surface Detection → Review Triggers → Diagnosis → Saving Outputs → Casting Score → Visualizations → Report → Feedback

**Result Summary:**
- **Decision Banner** (full-width, colored):
  - 🔴 REJECT CASTING (red)
  - 🟡 CHECK REQUIRED (orange)
  - 🟢 ACCEPT CASTING (green)
- **4 Metric Cards:** Defects Found, Primary Defect, Confidence (%), Review Required
- **Primary Defect Name** (large bold)
- **Output Folder Path** (clickable)

### Batch Mode

**Sources:**
- **SQL Queue** — Reads from `AI_Inspection_Queue` table
- **Folder** — Processes all images in directory (naming: `{casting_id}_surface.jpg`)
- **Upload** — Upload ZIP file

**Controls:**
- **"Start Batch"** — Begins processing
- **"Stop"** — Interrupts gracefully
- **"Clear Queue"** — Empties batch queue

**Live Progress:**
- Batch progress bar (X of Y)
- Current casting ID
- Success/Error counts
- ETA

**Results Table:** Casting ID | Decision | Defect Type | Runtime | Status

---

## Tab 2: Results & Report

### Single Mode (Live Result)

1. **Decision Banner** (colored full-width)
2. **Summary:** Primary defect name (large)
3. **Annotated Image:** Red bboxes on defects (600px)
4. **Likely Responsible Section:** Section name + Top 5 Recommended Checks
5. **Downloads:** 📊 Report (CSV), 🖼️ Annotated Image, 📄 PDF Report
6. **🧠 Diagnostic Summary** (from LLM):
   - **Left:** Visual Observation, Root Cause, Severity, Confidence
   - **Right:** Recommended Action, Responsible Section, Analysis time (ms)
7. **Output Folder:** Relative path

### Batch Mode / History View

1. **4 Summary Metrics:** Total | ✅ Accept | 🔴 Reject | 🟡 Manual Review
2. **Download All as ZIP**
3. **Results Table:** Casting ID | Decision | Defect Type | Runtime | 📄 PDF button

---

## Tab 3: Human Validation

**Purpose:** Review and validate system findings for learning.

**Elements:**
1. **Pending Count Banner:** "🔖 Pending Reviews: X castings"
2. **Current Review Item:** Casting ID, System Decision (colored icon)
3. **Two-Column Layout:**
   - **Left:** 🤖 System Finding (predicted defect, detected defects list)
   - **Right:** Annotated image
4. **Validation Form:**
   - **Section 1: Defect Classification**
     - Radio: ✅ Correct / ❌ Incorrect / ⚠️ False positive
     - Radio: **Actual defect type** (6 classes: Porosity, Sand Inclusion, Sand Drop, Slag Inclusion, Moulding Error, Pouring Temp/Delay)
   - **Section 2: Casting Disposition**
     - Radio: ✅ Accept / 🔧 Rework / ❌ Reject / 🔍 Further Inspection
   - **"💾 Submit Review"**

**After Submission:**
- ✅ "Review recorded. X casting(s) remaining."
- Advances to next item
- Saves `review.json` to output folder
- Logs to feedback telemetry

**Data Source:** `runtime/review_queue.json`

---

## Tab 4: Analytics (TIER_1+)

**Modules:**
1. **Monthly KPI Summary:** Total inspections, rejection rate (%), top defects bar chart, rejection trend line chart
2. **Defectograph:** 2D spatial heatmap of defect locations (grid-based, color intensity = defect density)
3. **Defectograph Grid:** Configurable grid resolution, per-zone counts, export to Excel

**Data Source:** `core/analytics/discovery.py`, `core/analytics/defectograph.py`

---

## Tab 5: Learning (TIER_2+ — `process_intelligence` capability)

**6 Modules:**

#### 1. 🔥 Heat Intelligence
- Defect rate per heat batch
- Flagged heats (>20% defect rate)
- Problem heat cards (top 3)
- Bar chart: all heats (red=flagged, blue=normal)
- Alert threshold line
- Expandable: Full Heat Summary table

#### 2. 📈 Drift Alerts
- Rejection rate drift (current vs. baseline)
- Defect type shift alerts
- Mold degradation alerts
- Recommendations (expandable)

#### 3. 🔍 Root Cause Analysis
- 3 metrics: Inspections | Process Failure Map | Failure Chains
- Moulds with repeated defects (warning cards)
- Recurring Process Failures table (co-occurring defects)
- Horizontal bar chart: defect frequency

#### 4. 🗺 Zone Insights
- Zone summary cards (up to 4)
- Zone-wise defect distribution
- Dominant defect per zone
- Bar chart: defect count per zone
- Expandable: Zone-by-Zone Breakdown

#### 5. 🛡 Risk Monitoring
- 3 metrics: Current Reject Rate | 7-Day Baseline | Shift Date
- Risk status (ELEVATED / NORMAL)
- 30-day trend line chart
- Trend insight (worsening/improving)
- Expandable: Daily Inspection Volume

#### 6. 🔬 Process Failure Analysis
- Top 3 contributing process stages
- Bar chart: failures per stage (red if >30%, blue otherwise)
- Key insight (error/warning/info based on concentration)
- Expandable: Process Stage Breakdown table

**Data Refresh:** Every 5 minutes (cached)  
**Data Source:** `core/learning/` modules

---

## Tab 6: Plant Intelligence (TIER_3 — `plant_intelligence` capability)

**Purpose:** Gateway to PI dashboard.

**Elements:**
1. **Header:** 🌱 Plant Intelligence
2. **Availability Check:** Warning if unavailable (requires TIER_3 license + PI build in `web/pi/`)
3. **Feature Description:** Cross-part defect graph, temporal drift, heat-batch anomaly, process intelligence
4. **Launch Button:** "🚀 Open Plant Intelligence" → Opens `http://localhost:8501/pi`
5. **Note:** "Requires FastAPI server: `python services/api/run_server.py`"

---

## Features by Tier

| Feature | TIER_1 | TIER_2 | TIER_3 |
|---------|--------|--------|--------|
| Run Inspection | ✅ | ✅ | ✅ |
| Results & Report | ✅ | ✅ | ✅ |
| Human Validation | ✅ | ✅ | ✅ |
| Batch Processing | ✅ | ✅ | ✅ |
| Analytics Tab | ✅ | ✅ | ✅ |
| ERP Integration (SQL) | ❌ | ✅ | ✅ |
| Learning Tab | ❌ | ✅ | ✅ |
| Plant Intelligence | ❌ | ❌ | ✅ |

> See [Licensing](../05_deployment/licensing.md) for tier details.

---

## Output Locations

All outputs saved to: `runtime/outputs/{MODE}/{CASTING_ID}/`

**Modes:**
- `production/` — Batch inspections + live runs
- `test/` — Dev/test runs (if mode="test")
- Top-level — Single inspections (legacy)

**Files per inspection:**
- `report.json` — Complete inspection results
- `annotated_surface.jpg` — Marked image with bboxes
- `{casting_id}_report.pdf` — PDF report
- `heatmap.jpg` — Defect heatmap overlay
- `review.json` — Human validation record (if reviewed)
- `metadata.json` — Inference metadata

> See [Runtime](../05_deployment/runtime.md) for full directory structure.

---

## Data Flow

```
Operator Upload → [Tab 1] Run Inspection → core/pipeline/ (YOLO + Patch)
  → core/reasoning/ (LLM) → core/reports/ (PDF) → [Tab 2] Results
  → [Tab 3] Validation → core/logging_system/ (telemetry)
  → Database (AI_Inspections, AI_Defects) → [Tab 5] Learning
```

> See [Full Pipeline](../02_pipeline/full_pipeline.md) for stage details.

---

## Troubleshooting

### Models not loading
- **Symptom:** "Models missing (dev env)" error
- **Fix:** Place `casting_model.pt` and `patch_classifier.pt` in `customers/castco/models/`

### SQL connection failed
- **Symptom:** "SQL Server not connected" banner
- **Fix:** Check `configs/system.yaml` → `database` section

### LLM reasoning disabled
- **Symptom:** "Diagnostic summary not available"
- **Fix:** Set `MISTRAL_API_KEY` env var or add to `customers/castco/configs/parameters.yaml`

### Learning tab empty
- **Symptom:** All modules show "No data available"
- **Fix:** Run 10-20 inspections to populate analytics

### Annotated image not showing
- **Symptom:** "No image available" in Tab 2
- **Fix:** Check `runtime/outputs/` permissions + disk space

---

## UI Customization

**Font Sizes** (industrial shopfloor scaling):
- Headings: 2.0-3.2rem (large, bold)
- Body text: 1.3rem (readable from 1.5m)
- Tab labels: 1.5rem (bold)
- Metrics: 2.4rem (bold)

**Color Scheme:**
- Reject: `#ff4444` (red)
- Manual Review: `#ffaa00` (orange)
- Accept: `#00cc44` (green)

**Custom CSS:** Modify `core/ui/app_ui.py` for branding.

---

## Reports Format

### CSV Report
- Header: Casting Inspection Report
- Sections: Basic Info, Summary, Detected Defects, Root Cause, Preventive Actions, Review Triggers
- Download: Tab 2 → 📊 Report (CSV)

### PDF Report
- A4 layout (configurable in `parameters.yaml`)
- Company logo + branding
- Decision banner
- Annotated image + heatmap
- Root cause analysis
- Recommended actions
- Footer: Casting ID, Date, Tvastr branding

---

## Performance

**Typical Inspection Time:**
- YOLO detection: 200-500ms
- Patch inference: 800-1500ms
- LLM reasoning: 1500-3000ms
- **Total: 2.5-5 seconds per casting**

**Batch Processing:**
- ~50 castings/hour (LLM enabled)
- ~120 castings/hour (LLM disabled)

**Memory Usage:**
- Single inspection: ~500MB
- Batch processing: ~1GB (model caching)

---

## Integration Points

### RAS → PI Dashboard
- Click "🚀 Open Plant Intelligence" in Tab 6
- Opens `http://localhost:8000/pi/`
- **Requires:** FastAPI server + TIER_3 license

### RAS → Database
- Writes: `AI_Inspections`, `AI_Defects`, `AI_HeatAnalysis`
- Reads: `Production_Daywise` (ERP context)
- Queue: `AI_Inspection_Queue` (batch mode)

> See [Data Structures](data_structures.md) for schema details.

### RAS → Feedback System
- Human validation → `core/logging_system/feedback_logger.py`
- Telemetry: `AI_HumanFeedback` table
- Used for: Model retraining, accuracy tracking

---

**Version:** 1.0  
**Last Updated:** 2026-04-07
