# System Overview

> **TvastrRAS** — AI-Driven Rejection Analysis System for Foundries and Discrete Manufacturing

---

## What TvastrRAS Is

TvastrRAS is a **Rejection Analysis System** designed specifically for foundries and discrete manufacturing environments. It combines artificial intelligence, computer vision, and process intelligence to transform quality inspection from a reactive bottleneck into a proactive intelligence engine.

The system analyzes casting inspection images, detects defects, diagnoses root causes, and provides actionable insights that help quality engineers, production managers, and plant heads reduce rejection rates, lower rework costs, and improve overall manufacturing quality.

---

## Who It's For

| Role | How TvastrRAS Helps |
|------|---------------------|
| **Quality Engineers** | Automated defect detection, root cause analysis, and traceability for customer audits |
| **Production Managers** | Real-time quality dashboards, shift-level performance tracking, and early drift alerts |
| **Plant Heads** | Plant-wide intelligence, cost of quality metrics, and strategic improvement insights |

---

## System Architecture

TvastrRAS is built on a **three-layer architecture** that transforms raw inspection data into plant-level intelligence:

```
┌─────────────────────────────────────────────────────┐
│               LAYER 3: PLANT INTELLIGENCE            │
│  Plant dashboards • Quality KPIs • Decision tracking │
│         FMEA • Pareto • SPC • Cost of quality        │
└─────────────────────────────────────────────────────┘
                         ▲
┌─────────────────────────────────────────────────────┐
│            LAYER 2: PROCESS INTELLIGENCE             │
│    Fingerprinting • Reasoning • Auto-calibration     │
│       Heat analysis • Drift detection • Alerts       │
└─────────────────────────────────────────────────────┘
                         ▲
┌─────────────────────────────────────────────────────┐
│              LAYER 1: INSPECTION PIPELINE            │
│     Vision AI • Defect detection • Classification    │
│        Anomaly detection • Signal aggregation        │
└─────────────────────────────────────────────────────┘
```

### Layer 1: Inspection Pipeline
The foundation — ingests inspection images and metadata, applies AI vision models to detect defects, and outputs structured rejection records with confidence scores.

### Layer 2: Process Intelligence
The brain — combines multiple inspections across time and context, identifies patterns, learns from feedback, and auto-tunes system sensitivity to match your plant's reality.

### Layer 3: Plant Intelligence
The strategic layer — aggregates quality data across heats, molds, shifts, and zones to provide plant-wide visibility, cost analysis, and predictive insights.

---

## Key Capabilities

### ✓ Automated Image-Based Inspection
- AI-driven defect detection across 6+ defect classes
- Multi-region patch analysis for comprehensive coverage
- Confidence scoring for every decision
- ACCEPT / REJECT / MANUAL_REVIEW decision routing

### ✓ Multi-Signal Fusion
The system doesn't rely on a single AI model. Instead, it combines:
- **Vision signals** — defect detection and classification
- **Anomaly signals** — "this looks unusual" vs. known patterns
- **Metadata signals** — heat properties, mold history, process tags
- **Operator feedback** — human validation trains the system

### ✓ Auto-Calibration and Self-Tuning
Traditional inspection systems require constant manual adjustment. TvastrRAS learns from:
- Supervisor overrides and corrections
- Historical acceptance/rejection patterns
- Real-world outcomes vs. AI predictions

The system continuously refines its thresholds, reducing false positives while catching more real defects — **without manual knob-twiddling**.

### ✓ Plant-Level Dashboards
From a single rejected part to a plant-wide alert:
- **Heat-level quality maps** — see which melts are problematic
- **Tool health indicators** — track mold wear and drift
- **Shift patterns** — identify operator or process variations
- **Rejection contribution analysis** — by cause, zone, and process step

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        INGESTION                              │
│  • Inspection stations (cameras, X-ray, manual upload)       │
│  • ERP/MES integration (heat data, mold tracking)            │
│  • CSV imports (offline mode support)                        │
└──────────────────────────────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                       PROCESSING                              │
│  • AI Vision (defect detection, classification)              │
│  • Anomaly Detection (unusual patterns vs. norms)            │
│  • Signal Engine (multi-modal fusion, decision logic)        │
└──────────────────────────────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                      INTELLIGENCE                             │
│  • Fingerprinting (defect pattern recognition)               │
│  • Reasoning Pipeline (context-aware diagnosis)              │
│  • Plant Intelligence (aggregated analytics & insights)      │
└──────────────────────────────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                        DELIVERY                               │
│  • Web Dashboard (real-time inspection & analytics)          │
│  • Reports (PDF, Excel, audit-ready exports)                 │
│  • Alerts (email, SMS, dashboard notifications)              │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack
Built on a **modern Python/TypeScript stack** with containerized microservices architecture. Deployable on-premises or in the cloud to meet your data residency and security requirements.

---

## Non-Functional Properties

### Reliability & Monitoring
- Health checks and system monitoring at every layer
- Automated alerting for service degradation
- Graceful degradation — inspection continues even if intelligence features are temporarily unavailable
- Audit logs for all decisions, user actions, and system events

### Security & Access Control
- **Role-based access control (RBAC)** — operators, supervisors, engineers, admins
- **Encryption in transit** — HTTPS/TLS for all API communication
- **Encryption at rest** — database-level and disk-level encryption
- Secure authentication with session management
- Audit trail for compliance (ISO 9001, IATF 16949 support)

### Extensibility
- **Modular architecture** — add new inspection stations via standard connectors
- **Custom defect classes** — extend beyond the 6 default categories
- **Integration-ready** — REST APIs for ERP, MES, BI tools
- **Configurable workflows** — adapt decision logic to your quality standards

---

## Getting Started

TvastrRAS is delivered as a turnkey system with:
1. **Initial deployment** — on-site installation and configuration
2. **Validation period** — side-by-side comparison with existing inspection
3. **Training** — hands-on operator and engineer training
4. **Go-live support** — monitoring and optimization during ramp-up
5. **Continuous improvement** — periodic reviews and system tuning

For deployment details, see [Quality & Compliance](quality_compliance.md).

For inspection workflow, see [Inspection Pipeline](inspection_pipeline.md).

For analytics and intelligence features, see [Manufacturing Intelligence](manufacturing_intelligence.md) and [Dashboard & Reporting](dashboard_reporting.md).

---

**Next:** [Inspection Pipeline](inspection_pipeline.md) — Learn how raw images become trusted rejection records
