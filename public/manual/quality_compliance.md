# Quality & Compliance

> **Technical Reference: ISO Alignment and Traceability Support**

---

## Overview

TvastrRAS provides traceability and documentation features that support quality management system requirements, particularly ISO 9001 and ISO/IEC 17025 standards. This document outlines how the system's technical capabilities align with these standards.

**Note:** TvastrRAS is an inspection tool that supports compliance workflows. It is not itself a certified system, but provides the data management and traceability features required by organizations maintaining ISO certifications.

---

## ISO 9001:2015 Alignment

### Quality Management System Support

TvastrRAS technical capabilities that support ISO 9001 requirements:

**Document Control (Clause 7.5):**
- All inspection records timestamped with ISO 8601 format
- Immutable audit trail: cannot modify past inspection records
- Version tracking: Model versions (YOLO, Signal, LLM) recorded per inspection
- Configuration history: Threshold and weight changes logged with timestamp

**Traceability (Clause 8.5.2):**
- Casting ID → Heat ID → Mold ID → Operator → Timestamp linkage
- Heat number resolution system (see [Manufacturing Intelligence](manufacturing_intelligence.md))
- Full inspection chain: image → scores → decision → validation
- Database queries support traceability by casting, heat, mold, date range

**Non-Conformance Management (Clause 10.2):**
- REJECT decisions stored with:
  - Primary defect classification (6 classes)
  - Confidence scores and signal breakdown
  - Annotated images showing defect locations
  - Timestamp and operator identification
- Searchable rejection history for root cause analysis

**Monitoring and Measurement (Clause 9.1):**
- Continuous accuracy tracking: TP, TN, FP, FN counts
- Confusion matrix by defect class
- Operator agreement rate (AI vs. human validation)
- Performance metrics available via REST API

**Continuous Improvement (Clause 10.3):**
- Auto-calibration system (see [Manufacturing Intelligence](manufacturing_intelligence.md))
- Statistical tracking: rejection rate trends, defect frequency analysis
- Feedback loop: operator validations improve fusion weights

---

## ISO/IEC 17025:2017 Alignment

### Testing and Calibration Laboratory Support

For organizations with ISO/IEC 17025 accredited inspection processes, TvastrRAS provides:

**Method Validation (Clause 7.2):**
- Documented inspection methodology:
  - Pipeline stages 0-7 (see [Inspection Pipeline](inspection_pipeline.md))
  - Fusion formula: Signal×0.40 + YOLO×0.20 + LLM×0.20 + Agreement×0.20
  - Thresholds: ACCEPT ≤0.30, REJECT ≥0.70
- Reproducibility: Same input image → same scores (deterministic pipeline)
- Model versioning: YOLO v8.2, Signal v3.1, LLM v1.5 recorded per inspection

**Equipment Records (Clause 6.4):**
- System configuration logged:
  - Fusion weights [w1, w2, w3, w4]
  - Accept/reject thresholds
  - Calibration state (last calibration date, disagreement rate)
- Equipment identification: Model versions serve as "equipment ID"

**Measurement Uncertainty (Clause 7.6):**
- Confidence scores (0.0-1.0) indicate measurement certainty
- Signal agreement range shows consensus level
- MANUAL_REVIEW cases (0.30-0.70 range) indicate borderline uncertainty

**Traceability of Measurement (Clause 6.5):**
- All decisions traceable to:
  - Specific model versions (calibrated "instruments")
  - Specific configuration (weights, thresholds)
  - Specific timestamp and operator
- Calibration history: Weight adjustments logged with date and validation metrics

**Test Reports (Clause 7.8):**
- Inspection records contain:
  - Unique identification (Casting ID, Timestamp)
  - Test method: TvastrRAS Pipeline v[version]
  - Test results: ACCEPT / REJECT / MANUAL_REVIEW with confidence
  - Measurement uncertainty: Confidence score 0.0-1.0
  - Date and authorized personnel (operator name)
  - Conditions: Model versions, thresholds
- Exportable as JSON or CSV for report generation

---

## Traceability System

### Heat Number Resolution

(See [Manufacturing Intelligence](manufacturing_intelligence.md) for full details)

**Resolution Priority:**
1. User input (manual entry)
2. ERP lookup (connected system query)
3. Database lookup (previous casting records)
4. Fallback: `FH_YYYYMMDD_HHMMSS` format

**Traceability Chain:**
```
Casting ID → Part Number → Heat ID → Mold ID → Timestamp → Operator → Decision
```

### Inspection Record Structure

Every inspection produces a complete record:

**Core Identification:**
- `casting_id`: Unique casting identifier
- `part_number`: Part type
- `heat_id`: Melt batch traceability
- `mold_id`: Tool traceability
- `timestamp`: ISO 8601 format (e.g., `2026-04-21T14:30:00Z`)
- `operator_name`: Personnel identification

**Decision Data:**
- `decision`: ACCEPT / REJECT / MANUAL_REVIEW
- `confidence`: Final_Score (0.0-1.0)
- `scores`: {signal: 0.88, yolo: 0.75, llm: 0.85, agreement: 0.90}
- `thresholds`: {accept: 0.30, reject: 0.70}

**Technical Data:**
- `model_versions`: {yolo: "v8.2", signal: "v3.1", llm: "v1.5", anomaly: "v2.0"}
- `calibration_weights`: [0.40, 0.20, 0.20, 0.20]
- `processing_time_ms`: Per-stage latencies
- `gate_exit`: Which reasoning gate produced decision (0-3)

**Evidence Data:**
- `image_original_url`: Full-resolution source image
- `image_annotated_url`: Bounding boxes + heatmap overlay
- `defects`: [{class: "porosity", confidence: 0.91, bbox: [...], patch: [2,3]}, ...]
- `fingerprint`: 12-dimensional vector [0.42, 0.65, ...]

**Validation Data (if applicable):**
- `validated_by`: Operator who validated MANUAL_REVIEW case
- `validated_at`: Validation timestamp
- `validation_decision`: ACCEPT / REJECT
- `validation_notes`: Freeform text
- `disagreement`: Boolean (TRUE if validator disagrees with AI)

### Traceability Queries

**By Casting ID:**
```
Query: casting_id = "C-12345"
Returns: Full inspection record with all metadata
```

**By Heat ID:**
```
Query: heat_id = "H-9912"
Returns: All castings from Heat H-9912 (rejection rate, defect distribution, timeline)
Use Case: Product recall, heat-level root cause analysis
```

**By Mold ID:**
```
Query: mold_id = "M-450" ORDER BY timestamp
Returns: Mold quality history (degradation tracking, cycle count correlation)
Use Case: Predictive maintenance, tool life analysis
```

**By Date Range:**
```
Query: timestamp BETWEEN "2026-04-01" AND "2026-04-30" AND decision = "REJECT"
Returns: All rejections in April 2026
Use Case: Monthly quality reports, trend analysis
```

**By Fingerprint Similarity:**
```
Query: euclidean_distance(fingerprint, target) < 0.30
Returns: Castings with similar defect patterns
Use Case: Pattern-based root cause correlation
```

---

## Data Integrity

### Immutable Records

Once an inspection is completed:
- Cannot modify decision, scores, or metadata
- All changes logged in separate audit table
- Database constraints prevent record deletion (soft delete only)
- Validation creates new record, links to original inspection

### Audit Trail

System logs all user actions:
- `action_type`: INSPECT, VALIDATE, EXPORT, CALIBRATE, etc.
- `user_id` and `user_role`: Who performed action
- `timestamp`: When action occurred
- `resource_id`: Which record was affected (casting_id, heat_id, etc.)
- `details`: JSON object with action-specific data

**Audit queries:**
```sql
-- Who validated casting C-12345?
SELECT user_id, timestamp, validation_decision 
FROM audit_log 
WHERE action_type = 'VALIDATE' AND resource_id = 'C-12345'

-- All exports by user in date range
SELECT timestamp, resource_id, details 
FROM audit_log 
WHERE user_id = 'engineer@company.com' 
  AND action_type = 'EXPORT' 
  AND timestamp BETWEEN '2026-04-01' AND '2026-04-30'
```

### Version Control

**Model Versions:**
- YOLO model: `v8.2` (YOLOv8 architecture, trained 2026-03-15)
- Signal model: `v3.1` (15-dim feature extraction, updated 2026-04-01)
- LLM model: `v1.5` (reasoning engine, deployed 2026-03-20)
- Anomaly model: `v2.0` (adaptive baseline, deployed 2026-02-10)

**Configuration Versions:**
- Fusion weights: Logged with each calibration run
- Thresholds: Logged when manually adjusted
- History table maintains all past configurations with effective date ranges

---

## Authentication & Authorization

### Supabase Auth

TvastrRAS uses Supabase Authentication:
- **JWT-based:** JSON Web Tokens for API authentication
- **Session management:** Token expiry and refresh
- **Password requirements:** Configurable (minimum length, complexity)

**Authentication Flow:**
1. User enters credentials → Supabase Auth validates
2. Auth service issues JWT (access token + refresh token)
3. Frontend stores JWT in localStorage
4. API requests include `Authorization: Bearer <JWT>` header
5. Backend validates JWT signature and expiry
6. Extract user_id and role from JWT claims
7. Authorize based on role permissions

### Role-Based Access Control (RBAC)

**Database-Level Roles:**
- `operator`: Submit inspections, view own results
- `supervisor`: All operator permissions + validate MANUAL_REVIEW cases
- `engineer`: All supervisor permissions + access analytics, trigger calibration, export data
- `admin`: All engineer permissions + user management, system configuration

**Permission Enforcement:**
- Row-Level Security (RLS) in Supabase PostgreSQL
- User can only read/write records based on role
- API endpoints check JWT claims before executing

**Example RLS Policy:**
```sql
-- Operators can only see their own inspections
CREATE POLICY operator_read ON inspections
  FOR SELECT
  USING (auth.uid() = operator_id OR auth.jwt() ->> 'role' IN ('supervisor', 'engineer', 'admin'));
```

---

## Data Security

### Encryption

**In Transit:**
- HTTPS/TLS 1.3 for all API communication
- WebSocket Secure (WSS) for real-time dashboard updates
- Certificate-based authentication (Let's Encrypt or custom CA)

**At Rest:**
- PostgreSQL encryption: Transparent Data Encryption (TDE) via Supabase
- Image storage: Supabase Storage with AES-256 encryption
- Backup encryption: Encrypted backups with key rotation

### Network Security

**Cloud Deployment (Supabase):**
- Managed PostgreSQL with firewall rules
- VPC isolation (database not publicly exposed)
- DDoS protection via cloud provider
- Regular security patches (managed by Supabase)

**On-Premises Deployment:**
- Customer controls network architecture
- Can deploy behind corporate firewall
- No external internet access required (if ERP integration is local)
- VPN optional for remote support

---

## Data Retention

### Retention Policy

**Production Data:**
- Inspection records: 90 days active, then archive to cold storage
- Images: 90 days full-resolution, then compress or purge (configurable)
- Dashboard cache: 7 days

**Compliance Data:**
- Audit logs: 7 years (regulatory requirement)
- Rejected casting records: 7 years (for traceability)
- Calibration history: Indefinite (equipment records)

**Archival Process:**
- Automated job runs nightly
- Move old records to separate `inspections_archive` table
- Compress images: JPEG quality reduction or conversion to WebP
- Purge cache tables older than retention period

### Backup & Recovery

**Supabase Managed Backups:**
- Automated daily backups
- Point-in-time recovery (PITR) for last 7 days
- Off-site replication across availability zones

**On-Premises Backups:**
- `pg_dump` daily full backup
- Incremental backups every 4 hours
- Backup retention: 30 days rolling
- Disaster recovery tested quarterly

---

## Export Capabilities

### Compliance Report Formats

**CSV Export:**
- Inspection history: All fields as columns
- Heat quality summary: Aggregated metrics
- Mold degradation data: Time-series
- Audit log: User actions with timestamps

**JSON Export:**
- Full inspection record with nested objects
- REST API response format
- Suitable for programmatic access (BI tools, ERP integration)

**PDF Report Generation:**
- Not built-in (manual files provide guidance only)
- Users can implement via API: fetch JSON → generate PDF with custom template
- Third-party tools: Use Recharts PNG export + puppeteer for PDF

**Image Bundle (ZIP):**
- Original images + annotated overlays
- Metadata JSON files per casting
- Organized by batch, heat, or date range

---

## License Tier Capabilities

| Feature | TIER_1 | TIER_2 (Process Intelligence) | TIER_3 (Plant Intelligence) |
|---------|--------|-------------------------------|----------------------------|
| **Traceability** | Basic (casting-level) | ✓ Heat/mold resolution | ✓ Full audit trail |
| **Audit Logs** | ✗ | ✓ User actions logged | ✓ Complete audit history |
| **Export (CSV/JSON)** | ✗ | ✓ | ✓ |
| **Authentication** | ✓ Supabase Auth | ✓ Supabase Auth | ✓ Supabase Auth |
| **RBAC** | ✓ Basic roles | ✓ 4 roles | ✓ 4 roles |
| **Dashboard Access** | ✗ | ✓ (4 tabs) | ✓ (8 tabs) |
| **REST API** | ✗ | 10 endpoints | 25 endpoints |
| **Data Retention** | 30 days | 90 days | Configurable |

---

## Compliance Use Cases

### Use Case 1: Customer Audit (ISO 9001)

**Auditor Request:** "Show me evidence of inspection control for Q1 2026"

**Response Using TvastrRAS:**
1. Query: `GET /api/history?date_start=2026-01-01&date_end=2026-03-31`
2. Export inspection summary CSV
3. Pull sample inspection records with full traceability
4. Show dashboard: rejection rate trends, defect distribution
5. Demonstrate operator validation records (human-in-the-loop)
6. Provide calibration history (equipment maintenance log)

**Evidence Package:**
- CSV: 12,450 inspections with casting ID, decision, confidence, timestamp
- JSON: 5 sample detailed records (1 ACCEPT, 2 REJECT, 2 MANUAL_REVIEW)
- Images: Annotated images showing defect detection
- Audit log: Operator validations and override actions

---

### Use Case 2: Product Recall (Heat Traceability)

**Scenario:** Heat H-5500 suspected contamination, need to identify all affected parts

**Response Using TvastrRAS:**
1. Query: `GET /api/heat/H-5500/castings`
2. Returns: 47 castings with decisions:
   - 38 ACCEPT (need recall)
   - 6 REJECT (already scrapped)
   - 3 MANUAL_REVIEW (check validation outcome)
3. Export casting ID list for 38 accepted parts
4. Cross-reference with ERP shipping records
5. Initiate customer notification for delivered parts

**Time Saved:** Minutes vs. hours/days of manual record searching

---

### Use Case 3: Root Cause Analysis (8D Report)

**Scenario:** Customer complaint for Casting C-12345 (defect found after delivery)

**Response Using TvastrRAS:**
1. Query: `GET /api/inspect/C-12345`
2. Review inspection record:
   - Decision: ACCEPT with 0.78 confidence
   - Signal: 0.35, YOLO: 0.25, LLM: 0.30, Agreement: 0.33
   - Defect count: 0 (no defects detected)
   - Heat: H-9912, Mold: M-450, Operator: J. Smith, 2026-04-15 14:22
3. Review images: Defect on surface not captured in photo
4. Root cause: Incomplete image coverage (operator error)
5. Corrective action: Update training, require multi-angle capture

**8D Report Evidence:**
- Original inspection record (shows AI correctly processed provided image)
- Image analysis (shows defect not visible in captured angle)
- Operator training records (identify training gap)

---

## System Limitations & Disclaimers

### Technical Limitations

**Image-Based Inspection Only:**
- Cannot detect internal defects (voids, cracks not visible on surface)
- Requires clear, well-lit images of casting surfaces
- Quality depends on camera resolution, lighting, operator positioning

**AI Model Boundaries:**
- Trained on 6 defect classes: porosity, shrinkage, crack, sand inclusion, surface roughness, blow hole
- Novel defect types may not be recognized (anomaly detection helps but not perfect)
- Performance varies with casting geometry, material, surface finish

**Calibration Requirements:**
- Requires ≥50 operator validations before auto-calibration runs
- Needs ≥100 ACCEPT castings before anomaly baseline stabilizes
- Periodic retraining recommended when process changes (new material, new supplier)

### Compliance Statement

TvastrRAS provides **decision support tools** for inspection workflows. It does not replace:
- Qualified personnel making final quality judgments
- Destructive testing or metrology measurements
- Customer-specific qualification processes (PPAP, FAI)

**Responsibility:** Customer organization retains full responsibility for product quality and regulatory compliance. TvastrRAS is a tool that supports these processes with data, traceability, and analytics.

---

## Contact & Support

For compliance-related questions, deployment guidance, or technical support:
- **Email:** support@tvastr.co
- **Documentation:** See full technical reference in `public/docs/`

---

**Documentation Complete**

Return to: [System Overview](system_overview.md) | [Inspection Pipeline](inspection_pipeline.md) | [Manufacturing Intelligence](manufacturing_intelligence.md) | [Dashboard & Reporting](dashboard_reporting.md)

