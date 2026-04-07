# Quality & Compliance

> **Standards Alignment and Audit Readiness**

---

## Overview

TvastrRAS is designed to support quality management workflows for automotive and industrial manufacturing, with built-in features that align with **ISO 9001** and **IATF 16949** requirements.

This document outlines how the system supports compliance, data governance, security, and audit readiness.

---

## Standards Alignment

### ISO 9001:2015 — Quality Management Systems

TvastrRAS supports key ISO 9001 requirements:

| ISO 9001 Requirement | How TvastrRAS Supports |
|---------------------|------------------------|
| **Document Control** | All inspection records, reports, and decisions are timestamped, versioned, and stored with full traceability |
| **Traceability** | Every casting linked to heat, mold, shift, operator, and inspection timestamp |
| **Non-Conformance Management** | REJECT decisions documented with root cause, corrective actions, and follow-up tracking |
| **Continuous Improvement** | Performance metrics, trend analysis, and improvement recommendations built into dashboards |
| **Audit Trail** | Complete history of all decisions, user actions, and system changes |

**Note:** TvastrRAS is a **tool that supports** ISO 9001 workflows. It is not itself a certified software product, but it provides the data management and traceability features required by ISO 9001 certified organizations.

---

### IATF 16949:2016 — Automotive Quality Management

For automotive foundries, TvastrRAS supports IATF 16949 requirements:

| IATF 16949 Focus Area | TvastrRAS Capability |
|----------------------|----------------------|
| **Product Safety** | Automated defect detection with confidence scoring and human validation |
| **Mistake Proofing** | Multi-signal fusion reduces false positives and false negatives |
| **Product Approval Process (PPAP)** | Export inspection reports, annotated images, and traceability data for PPAP submissions |
| **8D Problem Solving** | Full traceability back to heat, mold, process conditions for root cause analysis |
| **Statistical Process Control** | Trend tracking, control limits, and drift detection (available in PIRAS tier) |

---

## Data Governance & Security

### Role-Based Access Control (RBAC)

TvastrRAS implements a **four-tier user hierarchy**:

| Role | Access Level | Typical Permissions |
|------|-------------|---------------------|
| **Operator** | Basic | Run inspections, view results, add notes |
| **Supervisor** | Intermediate | Validate MANUAL_REVIEW cases, acknowledge alerts, view shift reports |
| **Engineer** | Advanced | Export data, configure alerts, access full analytics and traceability |
| **Admin** | Full | Manage users, configure thresholds, access system logs, deploy updates |

**Security features:**
- Password-based authentication with session management
- Role assignment by admin
- Audit log of all user actions (who, what, when)
- Automatic session timeout after inactivity

---

### Data Encryption

**Encryption in Transit:**
- All communication between client (browser/tablet) and server uses **HTTPS/TLS 1.2+**
- API calls, image uploads, and dashboard data are encrypted
- No sensitive data transmitted over unencrypted channels

**Encryption at Rest:**
- Database encryption at disk level (configurable)
- File system encryption for images and reports
- Secure key management (varies by deployment: on-prem vs. cloud)

---

### Data Residency & Privacy

- **On-premises deployment** — all data stays within your facility, no external transmission
- **Cloud deployment** — data residency configurable (e.g., EU servers for EU customers)
- **No third-party sharing** — inspection data is never shared with external parties
- **Anonymization support** — customer-specific identifiers can be masked for training/support

---

## Traceability for Compliance

### Complete Inspection Traceability

Every inspection record includes:

#### Part & Process Context
- Casting ID, part number, batch
- Heat ID, melt properties, furnace data
- Mold ID, cycle count, maintenance history
- Shift, operator, timestamp

#### Inspection Details
- Original image (raw file)
- Annotated image (with defect bounding boxes)
- All intermediate scores (vision, anomaly, metadata, fusion)
- Model versions used (for reproducibility)
- Thresholds and rules active at time of inspection

#### Decision Chain
- Final decision (ACCEPT / REJECT / MANUAL_REVIEW)
- Confidence score
- Primary defect and defect list
- Root cause hypothesis
- Corrective action recommendations

#### User Actions
- Who validated the decision?
- Was there an override? (original vs. final decision)
- Operator notes and comments
- Timestamp of each action

---

### Use Cases for Traceability

#### 1. Customer Complaint (8D Report)

**Scenario:** Customer finds defect in part XYZ-1234 after delivery

**Tvastr Response:**
1. Search for Casting ID: XYZ-1234
2. Pull full inspection record:
   - Decision was ACCEPT with 78% confidence
   - Visual inspection showed no defects
   - Heat H-5500, inspected on 2026-03-15 at 14:22
   - Operator: J. Smith, Shift 2
3. Review annotated images — defect was on hidden surface not captured
4. Root cause: Incomplete image coverage
5. Corrective action: Update inspection SOP to capture additional angles

---

#### 2. Product Recall

**Scenario:** Heat H-5500 had contaminated alloy, need to identify all parts

**Tvastr Response:**
1. Query: All castings from Heat H-5500
2. System returns: 47 parts inspected
   - 38 ACCEPT
   - 6 REJECT
   - 3 MANUAL_REVIEW
3. Export list of 38 accepted casting IDs
4. Cross-reference with shipping records
5. Initiate recall for delivered parts

**Traceability saved:** Hours/days of manual record searching

---

#### 3. Audit (ISO/IATF/Customer)

**Scenario:** Auditor requests evidence of inspection control

**Tvastr Response:**
- Export inspection summary for audit period (e.g., Q1 2026)
- Show sample inspection reports with full traceability
- Demonstrate decision consistency (same defect → same decision)
- Prove non-conformance handling (REJECT → documented, corrective actions logged)
- Show continuous improvement (rejection rate trending down)

---

## Deployment & Validation

### Initial Deployment Process

TvastrRAS deployment follows a **structured, auditable process**:

#### Phase 1: Site Survey & Planning (1-2 weeks)
- Assess facility (network, hardware, lighting)
- Define quality standards and thresholds
- Identify integration points (ERP/MES)
- Create deployment plan

#### Phase 2: Installation & Configuration (1-2 weeks)
- Install hardware (servers, cameras, tablets)
- Deploy software stack (containerized services)
- Configure network and security
- Set up user accounts and roles

#### Phase 3: Initial Validation (2-4 weeks)
- Load reference dataset (known good/bad parts)
- Run validation tests (compare AI vs. human decisions)
- Measure initial accuracy metrics
- Tune thresholds based on plant standards

#### Phase 4: Parallel Operation (4-8 weeks)
- Run TvastrRAS alongside existing inspection
- Operators validate AI decisions
- System learns plant-specific patterns
- Auto-calibration begins

#### Phase 5: Go-Live & Handover (1 week)
- Final validation and acceptance
- Operator training (hands-on)
- Engineer training (configuration and analytics)
- Documentation handover

#### Phase 6: Continuous Support (Ongoing)
- Periodic performance reviews (monthly → quarterly)
- System tuning and optimization
- Feature updates and model improvements
- Technical support (on-call + scheduled)

---

### Validation Metrics

During deployment, TvastrRAS is validated against:

| Metric | Target | How Measured |
|--------|--------|--------------|
| **True Positive Rate** | > 95% | Correctly identified rejects |
| **False Positive Rate** | < 5% | False alarms (REJECT when should ACCEPT) |
| **False Negative Rate** | < 2% | Missed rejects (ACCEPT when should REJECT) |
| **Processing Time** | < 5 seconds | Average time per inspection |
| **System Uptime** | > 99% | Availability during production hours |

**Acceptance criteria:** All metrics must meet targets for 2 consecutive weeks before go-live.

---

## Security & Access

### Network Security

**On-Premises Deployment:**
- System operates on customer's internal network (no internet exposure required)
- Firewall rules configurable by customer IT
- VPN access for remote support (optional, customer-controlled)

**Cloud Deployment:**
- Secure HTTPS/TLS for all communication
- Firewall rules, DDoS protection
- Regular security patches and updates
- Optional: Single Sign-On (SSO) integration

---

### Physical Security

- Server/hardware access restricted to authorized personnel
- Camera/inspection stations protected from tampering
- Physical access logs (if required by facility)

---

### Data Backup & Recovery

- **Automated backups** — daily full backup, hourly incremental
- **Retention policy** — configurable (default: 90 days production data, 7 years audit records)
- **Disaster recovery** — restore capability tested quarterly
- **Off-site backup** — optional for business continuity

---

## Maintenance & Updates

### System Health Monitoring

TvastrRAS monitors itself:
- Service health checks every 60 seconds
- Database connection status
- Disk space and CPU usage
- Model inference performance
- Alert on degradation or failure

**Notification channels:**
- Dashboard alerts
- Email to admins
- Optional: SMS, Slack, PagerDuty integration

---

### Software Updates

**Update types:**
- **Security patches** — applied monthly or as needed
- **Feature updates** — quarterly releases with new capabilities
- **Model updates** — improved AI models (tested, then deployed)
- **Bug fixes** — applied as discovered

**Update process:**
1. Tvastr releases update package
2. Customer admin reviews release notes
3. Schedule maintenance window (typically 1-2 hours, off-shift)
4. Tvastr support applies update remotely (or on-site if preferred)
5. Post-update validation tests
6. Resume production

**Zero-downtime updates:** For mission-critical deployments, rolling updates minimize interruption.

---

## Regulatory & Legal

### Compliance Statement

TvastrRAS is designed to support, but not replace, qualified personnel in making quality decisions. The system provides **decision support** and **traceability**, but final responsibility for product quality remains with the customer.

### Limitations

- TvastrRAS inspects based on images provided — cannot detect internal defects not visible in images
- System accuracy depends on image quality, lighting, and initial training data
- Regular validation and calibration required to maintain performance
- Not a substitute for human expertise in borderline cases

### Liability

- Customer responsible for verifying system output meets their quality standards
- Tvastr provides training, support, and continuous improvement services
- Service Level Agreement (SLA) defines support response times and uptime guarantees

---

## Summary

TvastrRAS provides the **tools and traceability** needed to support ISO 9001, IATF 16949, and customer-specific quality requirements. With role-based access, encryption, full audit trails, and structured deployment processes, the system integrates seamlessly into regulated manufacturing environments.

For technical deployment details, contact your Tvastr account manager or email support@tvastr.co.

---

**Documentation Complete**

Return to: [System Overview](system_overview.md) | [Inspection Pipeline](inspection_pipeline.md) | [Manufacturing Intelligence](manufacturing_intelligence.md) | [Dashboard & Reporting](dashboard_reporting.md)
