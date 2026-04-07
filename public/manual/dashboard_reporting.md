# Dashboard & Reporting

> **Visualizing Intelligence for Decision-Making**

---

## Overview

TvastrRAS dashboards transform raw inspection data into **actionable insights** for operators, supervisors, quality engineers, and plant management. From real-time inspection queues to monthly trend analysis, every role gets the visibility they need.

---

## Key Dashboards

### 1. Inspection View (Real-Time Operations)

**Who uses it:** Shop floor operators, quality inspectors

**What it shows:**
- **Live inspection queue** — castings awaiting decision
- **Current line status** — inspections in progress
- **Part images** — original and annotated with defect bounding boxes
- **Decision banner** — ACCEPT (green) / REJECT (red) / MANUAL_REVIEW (orange)
- **Confidence score** — how certain the AI is (0-100%)
- **Quick actions** — validate, override, add notes

### Example Screen

```
┌────────────────────────────────────────────────────────┐
│  INSPECTION RESULT                                     │
│  ┌──────────────────────────────────────────────────┐ │
│  │  ❌ REJECT CASTING                                │ │
│  │  Confidence: 92%                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  Casting ID: XYZ-1234          Heat: H-5601           │
│  Primary Defect: Porosity      Count: 3 defects       │
│                                                        │
│  [View Annotated Image] [View Full Report] [Override] │
└────────────────────────────────────────────────────────┘
```

**Key features:**
- Touch-friendly for tablet use on shop floor
- Color-coded for quick visual scanning
- One-click access to detailed reports
- Audit trail for all operator actions

---

### 2. Defect View (Quality Analysis)

**Who uses it:** Quality engineers, supervisors

**What it shows:**
- **Top defects** by frequency and severity
- **Defect trends** over time (daily, weekly, monthly)
- **Filters** — by heat, mold, shift, tool, date range, defect type
- **Drill-down capability** — click a defect to see all affected parts

### Example Use Case: Weekly Quality Review

A quality engineer opens the Defect View and sees:

```
Top Defects (Last 7 Days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Porosity (Gate)         ████████████ 45 cases
2. Shrinkage (Riser)       ███████░░░░░ 28 cases
3. Sand Inclusion (Body)   █████░░░░░░░ 19 cases
4. Surface Roughness       ███░░░░░░░░░ 12 cases
```

**Action:** Click "Porosity (Gate)" → drill down to see:
- Which heats were affected?
- Which molds contributed most?
- What was the time distribution?
- Were there common process flags?

---

### 3. Drift & Alerts View (Early Warning System)

**Who uses it:** Shift supervisors, production managers

**What it shows:**
- **Active alerts** — quality thresholds exceeded
- **Drift warnings** — gradual quality degradation detected
- **Threshold monitoring** — rejection rate vs. target
- **Alert history** — when alerts fired and how they were resolved

### Alert Types

| Alert Level | Trigger | Response Time |
|-------------|---------|---------------|
| 🔴 **HIGH** | Critical threshold exceeded (e.g., rejection rate > 20%) | Act within 1 hour |
| 🟠 **MEDIUM** | Quality trending wrong direction | Act within 4 hours |
| 🟡 **LOW** | Minor variation detected | Monitor and act within 24 hours |

### Example Alert

```
┌─────────────────────────────────────────────────────┐
│ 🔴 HIGH PRIORITY ALERT                              │
│                                                     │
│ Shift 2 Rejection Rate: 18.5% (Threshold: 15%)     │
│ Primary Defect: Porosity                            │
│ Affected Heat: H-5601                               │
│                                                     │
│ Recommended Action:                                 │
│ • Check furnace temperature (Zone 2)                │
│ • Verify sand moisture and compaction               │
│ • Review last heat quality report                   │
│                                                     │
│ [View Details] [Acknowledge] [Log Corrective Action]│
└─────────────────────────────────────────────────────┘
```

**Integration:** Alerts can trigger:
- Dashboard notifications
- Email to supervisors
- SMS for critical alerts (optional)
- ERP/MES system flags

---

### 4. Plant Overview (Strategic KPIs)

**Who uses it:** Plant managers, quality directors, continuous improvement teams

**What it shows:**
- **Aggregated KPIs** — rejection %, rework cost, FP/FN rates
- **Multi-shift comparison** — performance by shift
- **Heat performance** — best/worst heats this month
- **Mold health summary** — which molds need attention
- **Trend analysis** — is quality improving or degrading?

### Key Metrics

| KPI | Description | Target |
|-----|-------------|--------|
| **Rejection Rate** | % of inspected parts rejected | < 12% |
| **False Positive Rate** | AI rejected, human accepted | < 5% |
| **False Negative Rate** | AI accepted, human found defect | < 2% |
| **Manual Review Rate** | % requiring human validation | 10-15% |
| **Cost of Quality** | Estimated scrap + rework cost | Tracked monthly |

### Plant Overview Dashboard (Example)

```
Month: March 2026                        Plant: Foundry A
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overall Metrics:
├─ Total Inspections: 12,450
├─ Rejection Rate: 11.2% ↓ (vs. 13.1% last month)  ✓
├─ False Positive Rate: 4.1% ↓ (vs. 5.3%)          ✓
├─ False Negative Rate: 1.8% ↔ (vs. 1.7%)          ✓
└─ Manual Review Rate: 12.5% ↓ (vs. 14.2%)         ✓

Top Contributors to Rejects:
1. Heat H-5589 → 87 rejects (porosity)
2. Mold M-450 → 64 rejects (gate erosion)
3. Shift 2 (Night) → 38% rejection rate (high)

Recommendations:
• Schedule mold M-450 for refurbishment
• Investigate Shift 2 process variations
• Heat H-5589 root cause: furnace zone 2 low temp
```

---

## Common User Journeys

### Journey 1: Operator Inspects a Part

1. **Take photo** of casting surface
2. **Upload to system** via desktop or tablet
3. **Wait 3-5 seconds** — AI processes image
4. **See decision banner** — REJECT / ACCEPT / MANUAL_REVIEW
5. **If REJECT:** Mark part, move to scrap bin, note in shift log
6. **If MANUAL_REVIEW:** Set part aside, notify supervisor
7. **If ACCEPT:** Send part to next operation

---

### Journey 2: Supervisor Investigates a Rejection Spike

**Problem:** Dashboard shows 18% rejection rate (normal: 8%)

1. **Open Defect View** → see "Porosity" is primary defect
2. **Filter by heat** → all rejects from Heat H-5601
3. **Check heat details** → furnace Zone 2 temp was low
4. **Review part images** → consistent gate region defects
5. **Take corrective action** → adjust furnace, alert maintenance
6. **Monitor next batch** → rejection rate returns to 9%
7. **Log action in system** → document fix for future reference

**Time to resolution:** 30 minutes (vs. hours or days without intelligence)

---

### Journey 3: Quality Engineer Prepares Monthly Review

**Goal:** Present quality performance to management

1. **Open Plant Overview** → export last 30 days
2. **Generate trend charts** → rejection rate, top defects, cost of quality
3. **Identify improvement areas** → e.g., Mold M-450 degradation
4. **Pull traceability data** — specific examples for PPAP/audit
5. **Export to Excel** → create summary report
6. **Schedule corrective actions** — mold refurbishment, training

---

## Reporting & Export

### Available Report Types

#### 1. Inspection Report (PDF)

**For:** Individual casting documentation, customer audit, PPAP

**Contains:**
- Casting ID, heat ID, mold ID, timestamp
- Original and annotated images
- Defect list with locations and severity
- Decision (ACCEPT/REJECT) with confidence
- Root cause analysis (if rejected)
- Corrective action recommendations
- Inspector name and signature line
- Model version and traceability data

**Export:** One-click PDF generation, email-ready

---

#### 2. Batch Summary (Excel)

**For:** Production tracking, shift handover, weekly reports

**Contains:**
- Table of all inspections in date range
- Columns: Casting ID, Heat, Mold, Decision, Primary Defect, Confidence
- Summary statistics at bottom
- Filterable and sortable

**Export:** Excel (.xlsx), CSV

---

#### 3. Quality Dashboard Report (PDF)

**For:** Management reviews, continuous improvement meetings

**Contains:**
- KPI summary (rejection rate, FP/FN, cost of quality)
- Trend charts (line graphs, bar charts)
- Top contributors (heat, mold, shift, defect type)
- Recommendations and action items
- Month-over-month comparison

**Export:** PDF with embedded charts

---

#### 4. Image Bundle (ZIP)

**For:** Engineering analysis, customer complaints, 8D reports

**Contains:**
- Original images for selected castings
- Annotated images with defect bounding boxes
- JSON metadata files with full inspection details
- Organized by heat or batch

**Export:** ZIP archive

---

### Integration with ERP/MES/BI Tools

TvastrRAS can export data to external systems via:
- **Scheduled exports** — nightly CSV/Excel to shared folder
- **REST API** — real-time data access for BI dashboards
- **Database views** — direct SQL access (read-only) for Power BI, Tableau, etc.
- **Webhook notifications** — trigger external workflows on REJECT decisions

**Common integrations:**
- Push rejection data to ERP for cost tracking
- Send inspection results to MES for production scheduling
- Feed BI tools for executive dashboards
- Alert CMMS for mold maintenance triggers

---

## Explainability & Trust

Every dashboard and report shows **why the AI made its decision**:

### Decision Breakdown

```
Casting: XYZ-1234
Decision: REJECT
Confidence: 89%

Signal Contributions:
├─ Vision Detection:   0.85  (High porosity detected)
├─ Anomaly Score:      0.72  (Unusual pattern vs. norm)
├─ Metadata Check:     0.68  (Heat H-5601 flagged)
└─ Historical Pattern: 0.81  (Prior rejects from this mold)

Weighted Fusion Score: 0.78 → REJECT
Threshold for Auto-Reject: 0.70 ✓
```

This transparency:
- Builds operator trust in AI decisions
- Helps engineers understand system behavior
- Supports audit and compliance requirements
- Enables targeted system tuning

---

## Mobile & Accessibility

All dashboards are:
- **Responsive** — work on desktop, tablet, smartphone
- **Touch-optimized** — large buttons for shop floor tablets
- **Offline-capable** — core inspection continues if network drops
- **Multi-language** — UI available in local languages (configurable)
- **Role-based** — operators see simple view, engineers see advanced analytics

---

**Next:** [Quality & Compliance](quality_compliance.md) — Standards alignment and audit readiness
