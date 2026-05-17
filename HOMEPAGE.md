# Tvastr Platform Overview

**Industrial Inspection Intelligence for Foundries**

Standardize defect detection, centralize traceability, and reduce rejection rates across your quality gates.

---

## Table of Contents

1. [Core Thesis](#core-thesis)
2. [The Industry Problem](#the-industry-problem)
3. [What Tvastr Does](#what-tvastr-does)
4. [Traditional Inspection vs Tvastr](#traditional-inspection-vs-tvastr)
5. [The Industrial Intelligence Pipeline](#the-industrial-intelligence-pipeline)
6. [The Tvastr Platform](#the-tvastr-platform)
7. [Explainable Industrial AI](#explainable-industrial-ai)
8. [Operational Benefits](#operational-benefits)
9. [Quality Gates Coverage](#quality-gates-coverage)
10. [Workflow Integration](#workflow-integration)
11. [Deployment and Integration](#deployment-and-integration)
12. [System Architecture](#system-architecture)
13. [Edge-Native Deployment](#edge-native-deployment)
14. [Research & Technology Direction](#research--technology-direction)

---

## Core Thesis

### Factories Already Generate the Signals. Tvastr Makes Them Intelligent.

**Conversion of raw process data into persistent, reusable manufacturing intelligence.**

Every casting, every weld, every heat cycle, and every inspection creates a rich stream of data — texture signatures, temperature trajectories, dimensional deviations, ERP timestamps, and operator inputs. Today, these signals are ignored, siloed, or reduced to binary pass/fail outcomes. 

Tvastr captures these signals in their raw, contextual form and fuses them into a living intelligence layer that evolves with the plant. This is not AI-driven inspection — it is industrial cognition built on persistent memory, explainable reasoning, and signal-first architecture.

### Manufacturing Signals Captured by Tvastr:

- **Inspection signals**: high-resolution surface data captured at speed
- **Process signals**: heat trace, pressure, flow rate, cycle time, tool wear
- **ERP context**: heat number, batch ID, shift, operator, machine, material grade
- **Heat traceability**: full temperature history linked to every casting
- **Operator patterns**: interaction timing, decision latency, correction behavior
- **Quality gate data**: defect outcomes across mold, knockout, fettling, final
- **Production context**: throughput, downtime, scrap rates, energy usage

---

## The Industry Problem

### Inconsistent Inspection, Fragmented Quality Records, Reactive Defect Control

**Manufacturing quality suffers from manual inspection variability, disconnected data, and delayed root-cause analysis.**

Foundries generate substantial inspection data across multiple quality gates, yet this data remains fragmented. Inspection outcomes vary by shift and operator. Quality records exist in isolated reports. Defect patterns recur without visibility. Root causes remain buried in tribal knowledge. Traceability across heats and batches is manual and incomplete. 

Without centralized inspection intelligence, foundries remain reactive, addressing defects after they occur rather than preventing them through early detection and process visibility.

### Key Problems in Traditional Manufacturing Quality:

- Inconsistent inspection outcomes across shifts and operators
- Missed defects escaping to downstream gates or customers
- Fragmented quality records across inspection stations
- Manual inspection dependency with limited standardization
- Reactive quality control: corrections after scrap is produced
- Delayed root-cause identification and analysis
- Lack of heat-level and batch-level traceability
- Disconnected process and quality data

---

## What Tvastr Does

### Industrial inspection intelligence that standardizes detection, centralizes traceability, and provides process visibility.

Tvastr provides AI-assisted defect detection and process intelligence for foundries. The platform standardizes inspection across quality gates, centralizes defect records with complete traceability, and provides visibility into recurring defect patterns and process trends.

### Core Capabilities

#### 1. Defect Detection Assistance
AI-assisted inspection system that analyzes castings for porosity, shrinkage, cracks, sand inclusion, surface roughness, and blow holes across multiple quality gates.

#### 2. Inspection Standardization
Consistent inspection logic across shifts, operators, and stations, reducing variability and ensuring uniform quality standards.

#### 3. Centralized Traceability
Complete heat-level and batch-level traceability with SQL-based storage linking inspections to heats, molds, shifts, operators, and production context.

#### 4. Defect Pattern Analysis
Track recurring defect patterns across heats, identify correlations between defects and process parameters, and analyze defect trends over time.

#### 5. Process Visibility
Monitor defect rates, rejection trends, and quality metrics across production batches, providing visibility for continuous improvement initiatives.

#### 6. Inspection Reporting
Automated PDF reports, annotated images, defect heatmaps, and ERP-compatible exports for quality documentation and audit trails.

---

## Traditional Inspection vs Tvastr

### How Tvastr differs from conventional manual and legacy inspection approaches.

Traditional inspection methods rely on manual assessment, disconnected records, and reactive quality control. Tvastr provides AI-assisted standardization, centralized traceability, and process visibility.

| Aspect | Traditional Inspection | Tvastr |
|--------|----------------------|---------|
| **Inspection Consistency** | Varies by shift, operator experience, and fatigue levels | Standardized AI-assisted detection logic across all shifts and operators |
| **Defect Detection** | Manual visual inspection with subjective assessment | AI-assisted analysis with consistent defect classification and confidence scoring |
| **Quality Records** | Paper logs or disconnected spreadsheets across stations | Centralized SQL database with structured inspection records |
| **Traceability** | Manual tracking with incomplete heat and batch linkage | Automated traceability linking inspections to heats, molds, shifts, and operators |
| **Defect Pattern Visibility** | Recurring defects not tracked or correlated systematically | Defect pattern tracking, trend analysis, and correlation with process parameters |
| **Root-Cause Analysis** | Relies on tribal knowledge and manual investigation | Automated defect classification with root-cause identification and process linkage |
| **Reporting** | Manual report generation with delayed documentation | Automated PDF reports with annotated images, heatmaps, and traceability data |
| **Audit Readiness** | Manual compilation of records with incomplete documentation | Complete audit trails with structured data and automated report generation |
| **Process Improvement** | Reactive corrections after defects occur | Data-driven insights for proactive process improvements and early intervention |

**Key Message:** Tvastr enhances traditional inspection with AI assistance, standardization, and centralized data management while maintaining operator decision authority.

---

## The Industrial Intelligence Pipeline

### From raw image to actionable manufacturing insight.

The system does not stop at defect detection. It continuously enriches each output with context, correlation, and memory — transforming isolated events into a living intelligence layer that improves with every casting.

### Pipeline Stages:

1. **Image/Input** → Raw sensor data capture
2. **Signal Extraction** → Feature and texture analysis
3. **Feature Reasoning** → Physics-based classification
4. **Multi-Signal Fusion** → Weighted consensus building
5. **Defect Cognition** → Pattern recognition and classification
6. **Root Cause Analysis** → Process correlation and attribution
7. **Traceability Linking** → Heat, mold, shift, operator linkage
8. **Process Intelligence** → Trend analysis and SPC monitoring
9. **Manufacturing Memory** → Persistent knowledge accumulation
10. **Decision Support** → Actionable recommendations

---

## The Tvastr Platform

### Two integrated systems for inspection and process intelligence.

Tvastr consists of two complementary systems: RAS for inspection and defect analysis, and PI for process intelligence and quality analytics. Together, they provide end-to-end visibility from individual casting inspection to plant-wide quality trends.

### Tvastr RAS - Inspection and Defect Analysis System

**AI-assisted defect detection system that analyzes casting images for porosity, shrinkage, cracks, sand inclusion, surface roughness, and blow holes.**

Provides consistent inspection logic, automated reporting, and complete traceability.

**Key Capabilities:**
- AI-assisted defect detection and classification
- Multi-stage inspection pipeline with signal-based reasoning
- Automated PDF reports with annotated images and heatmaps
- SQL-based traceability linking to heats, molds, shifts, and operators
- Three-tier decision support (Accept, Manual Review, Reject)
- Root-cause identification and defect pattern tracking
- Batch inspection support for high-volume scenarios
- Offline-capable on-premise operation

**Learn More:** [Tvastr RAS System Details](/systems/rejection-analysis-system)

### Tvastr PI - Process Intelligence and Analytics

**Process monitoring and quality analytics system that tracks defect patterns, analyzes trends across heats and batches, and provides insights for continuous quality improvement.**

**Key Capabilities:**
- Defect pattern tracking and correlation analysis
- Temporal trend analysis across production batches
- Heat-level quality intelligence and analysis
- Process drift detection and early warning
- SPC (Statistical Process Control) analytics
- Defect frequency and distribution analysis
- Quality metrics dashboards and visualization
- Decision intelligence for corrective actions

**Learn More:** [Tvastr PI System Details](/systems/plant-intelligence)

### System Integration

**RAS and PI work together:** RAS performs inspection and captures defect data, while PI analyzes patterns and trends across inspections for plant-wide quality visibility.

**Key Message:** Tvastr RAS standardizes inspection. Tvastr PI provides process intelligence. Together, they deliver complete quality visibility.

---

## Explainable Industrial AI

### Why Traceability Matters in Manufacturing

**Traditional systems are black boxes. Tvastr makes every decision auditable.**

In traditional computer vision systems, defects are detected but not understood. The AI doesn't show how or why — it simply outputs 'reject'. This opacity is unacceptable in industrial environments where regulatory compliance, root-cause accountability, and process improvement require full traceability. 

Tvastr reverses this paradigm: every decision is backed by a pathway of reasoning grounded in physical signals — not statistical probability.

### Traditional AI Systems

**Opaque, uninterpretable, and difficult to audit.**

Decisions are based on hidden weights and probabilistic patterns. If a defect is missed or misclassified, engineers have no way to learn why. No traceability. No trust.

**Limitations:**
- Black-box model with no output rationale
- No link between input signal and final decision
- Cannot be audited by quality engineers or regulators
- Requires constant expert supervision to validate

### Tvastr Explainable Reasoning

**Every decision is explained using industrial signals.**

Textures, geometry, thermal gradients, and process context. Engineers can follow the logic — and improve it.

**Explainability Features:**
- **Texture signal analysis**: micro-defects identified by surface reflection patterns
- **Geometry reasoning**: edge deviations measured against CAD tolerances
- **Cavity analysis**: internal porosity inferred from surface heat retention
- **Agreement systems**: multiple signal modalities must align for high-confidence decisions
- **Signal validation**: outlier detection before and after inference
- **Traceable reasoning paths**: full audit trail from image to defect classification

---

## Operational Benefits

### Measurable improvements in inspection consistency, quality visibility, and defect management.

Tvastr delivers operational value through standardized inspection, centralized traceability, and process visibility. The platform reduces inspection variability, provides complete defect tracking, and enables data-driven quality improvements.

### Key Benefits

#### Reduced Rejection Rates
Early defect detection across quality gates enables corrective action before final inspection, reducing scrap and rework costs.
- **Metric:** Lower rejection rates through consistent detection

#### Inspection Consistency
Standardized inspection logic across shifts, operators, and stations eliminates variability in defect assessment.
- **Metric:** Uniform quality standards across production

#### Reduced Cost of Poor Quality (COPQ)
Early identification and prevention of defects reduces scrap material costs, rework expenses, and customer returns.
- **Metric:** Lower overall quality-related costs

#### Centralized Inspection Records
All inspection data stored in SQL databases with complete traceability, eliminating manual record-keeping and enabling data access.
- **Metric:** Single source of truth for quality data

#### Complete Heat-Level Traceability
Link every inspection to heat numbers, mold IDs, shifts, operators, and production dates for full audit trails.
- **Metric:** End-to-end traceability across batches

#### Faster Defect Diagnosis
AI-assisted defect classification and root-cause analysis accelerates quality issue identification and resolution.
- **Metric:** Reduced time to identify quality issues

#### Reduced Manual Inspection Dependency
AI assistance reduces manual inspection workload while maintaining quality standards, allowing reallocation of resources.
- **Metric:** More efficient inspection resource utilization

#### Process Visibility
Track defect patterns, rejection trends, and quality metrics across heats and production batches for continuous improvement.
- **Metric:** Data-driven quality improvement insights

#### Defect Pattern Tracking
Identify recurring defect types, correlate defects with process parameters, and track defect frequency over time.
- **Metric:** Visibility into systemic quality issues

#### Audit Readiness
Automated reports, complete traceability, and structured data storage ensure compliance with quality standards and audit requirements.
- **Metric:** Simplified audit and compliance workflows

---

## Quality Gates Coverage

### Inspection and Traceability Across Quality Gates

**Defect detection and traceability from pattern to final inspection.**

Quality control spans multiple inspection points across the production sequence. Defects originate at different stages: pattern preparation, core placement, mold condition, knockout, fettling, and final inspection. 

Tvastr provides consistent defect detection and centralized traceability across these gates, linking inspection outcomes to heats, molds, shifts, and operators for complete visibility.

### Quality Gates

#### 1. Pattern Inspection
Initial mold and pattern verification before casting begins.

**Signals:**
- Dimensional deviation
- Surface finish consistency
- Core alignment accuracy

#### 2. Core Inspection
Core integrity and placement assessment before pouring.

**Signals:**
- Core shift detection
- Vent blockage
- Core strength variation

#### 3. Mold Inspection
Mold condition monitoring and wear tracking during production cycles.

**Signals:**
- Coating condition
- Surface defects
- Crack detection

#### 4. Knockout Inspection
Casting evaluation at ejection to identify early-stage defects.

**Signals:**
- Ejection stress cracks
- Incomplete fill
- Surface contamination

#### 5. Fettling Inspection
Post-gating inspection for surface quality and exposed internal defects.

**Signals:**
- Grind line consistency
- Internal porosity exposure
- Surface roughness

#### 6. Final Inspection
Final pass/fail decision with traceability to prior gate inspection data.

**Signals:**
- Overall defect assessment
- Rejection decision
- Root-cause identification

#### 7. Built-In Quality (BIQ)
Process monitoring and defect tracking across production batches.

**Signals:**
- Defect rate tracking
- Process drift detection
- Recurring pattern identification

**Key Message:** Tvastr provides consistent inspection logic and centralized traceability across quality gates, linking defect outcomes to production context for complete visibility.

---

## Workflow Integration

### Integration with Existing Factory Workflows

**Tvastr fits into your current inspection stations and production workflows with minimal disruption.**

Industrial software must work within existing factory operations. Tvastr integrates at inspection stations across quality gates, operates on standard hardware, and exports data to your existing SQL databases and ERP systems. The platform is designed for operator usability and production-floor compatibility.

### Integration Points

#### Inspection Station Integration
Deploy at existing inspection stations across pattern, core, mold, knockout, fettling, and final quality gates.
- On-premise deployment
- Standard hardware compatibility
- Offline-capable operation

#### Operator Workflow
Operators capture images at inspection points, receive AI-assisted defect analysis, and make final pass/fail decisions.
- Simple capture workflow
- Immediate defect analysis
- Operator override capability

#### Inspection Reporting
Automated PDF reports with annotated images, defect heatmaps, and root-cause analysis for quality documentation.
- PDF generation
- Annotated images
- Defect visualization

#### SQL Database Storage
All inspection records, defect data, and traceability information stored in SQL databases for centralized access.
- SQL integration
- Structured storage
- Query-ready data

#### Batch Inspection Support
Process multiple castings in batch mode for high-volume inspection scenarios with centralized results.
- Batch processing
- Multiple casting analysis
- Consolidated reporting

#### ERP Export Compatibility
Export inspection data to ERP systems in CSV format for integration with existing manufacturing execution systems.
- CSV export
- ERP-compatible format
- Automated data transfer

#### Traceability Flow
Link inspections to heat numbers, mold IDs, shifts, operators, and production dates for complete audit trails.
- Heat-level traceability
- Mold tracking
- Shift and operator linkage

**Key Message:** Tvastr integrates with your existing workflows, databases, and ERP systems without requiring infrastructure replacement.

---

## Deployment and Integration

### On-premise deployment designed for industrial environments and existing factory infrastructure.

Tvastr is built for real-world factory deployment. The platform operates on-premise with offline capability, integrates with existing SQL databases and ERP systems, and requires minimal infrastructure changes. Deployment is designed to fit within current production workflows with operator-friendly interfaces and practical integration options.

### Deployment Features

#### On-Premise Deployment
Full system deployment within your factory infrastructure with no cloud dependency. All data remains on-site for complete data sovereignty and security.

**Benefits:**
- Complete data control
- No internet dependency
- Factory-floor compatible

#### Offline-Capable Operation
System operates fully offline without requiring internet connectivity. All inspection, analysis, and reporting functions work independently of external networks.

**Benefits:**
- Production continuity
- Network-independent
- Reliable operation

#### SQL Database Integration
Direct integration with your existing SQL databases for storing inspection records, defect data, and traceability information. Standard SQL compatibility ensures seamless data access.

**Benefits:**
- Existing database compatibility
- Structured data storage
- Query-ready records

#### ERP System Compatibility
Export inspection data in CSV format for integration with manufacturing execution and ERP systems. Automated data transfer ensures production data flows to existing systems.

**Benefits:**
- ERP integration
- Automated exports
- Data continuity

#### Standard Hardware Compatibility
Runs on standard industrial PCs and workstations without requiring specialized hardware. Compatible with existing cameras and imaging equipment at inspection stations.

**Benefits:**
- No specialized hardware
- Use existing equipment
- Cost-effective deployment

#### Operator-Friendly Interface
Simple, intuitive interfaces designed for factory-floor use. Minimal training required for operators to capture images and review inspection results.

**Benefits:**
- Easy adoption
- Minimal training
- Production-floor usability

#### Audit Trail and Compliance
Complete audit trails for all inspections with structured logging, traceability records, and automated documentation for quality compliance.

**Benefits:**
- Compliance-ready
- Complete traceability
- Audit documentation

#### Factory-Floor Compatible
Designed for industrial environments with consideration for production workflows, shift operations, and factory-floor realities.

**Benefits:**
- Production-ready
- Shift-compatible
- Industrial-grade reliability

### Deployment Models

#### Single Station Deployment
Deploy at one or more critical inspection stations for targeted quality improvement and validation.

#### Multi-Gate Deployment
Deploy across multiple quality gates (pattern, core, mold, knockout, fettling, final) for comprehensive inspection coverage.

#### Plant-Wide Deployment
Full plant deployment with centralized data management, cross-gate traceability, and plant-level quality analytics.

**Key Message:** Tvastr integrates with existing factory infrastructure, operates offline, and requires minimal changes to current production workflows.

---

## System Architecture

### Industrial Intelligence Layer: Seven Architectural Stages

**From raw signal to plant-wide cognition — a layered, persistent system.**

### Architectural Layers

#### 1. Perception Layer
Ingests raw signals: inspection images, thermal cameras, vibration sensors, ERP logs.

#### 2. Signal Layer
Normalizes, timestamps, and embeds context — aligning heterogeneous data streams.

#### 3. Fusion Layer
Correlates defects with heat history, mold conditions, and operator inputs.

#### 4. Reasoning Layer
Applies explainable, physics-aware inference to identify root causes.

#### 5. Memory Layer
Stores every decision, defect, and process variation as persistent knowledge.

#### 6. Process Intelligence Layer
Generates SPC charts, FMEA reports, drift alerts, and cost-of-quality dashboards.

#### 7. Plant Intelligence Layer
Orchestrates decisions across the enterprise — predictive quality, autonomous adjustments.

---

## Edge-Native Deployment

### Industrial Ownership, Zero Cloud Dependence

**On-prem, deterministic, and secure — by design.**

Tvastr's architecture is built for factories, not cloud data centers. All processing — from image analysis to reasoning — occurs on dedicated industrial workstations inside the plant network. No sensitive data leaves the facility. Latency is deterministic. Systems operate offline. 

This is not an option — it is the foundation of trustworthy industrial intelligence.

### Key Principles

#### On-Prem Operation
Hardware installed within the plant firewall. No external connectivity required.

#### Offline Capability
Full functionality without internet. No SaaS dependency. Survives network outages.

#### Local Inference
AI models run on embedded NVIDIA Jetson or industrial PC — no cloud API calls.

#### Deterministic Latency
Inference completed in under 200ms. Critical for high-speed inspection lines.

#### Industrial Ownership of Data
All records, defect logs, and process models remain within plant control.

#### No Hyperscaler Dependency
No AWS, Azure, or GCP APIs. No vendor lock-in. Zero subscription fees for compute.

**Security Note:** Data sovereignty is non-negotiable in manufacturing. Tvastr ensures full control — not just compliance.

---

## Research & Technology Direction

### Architectural pillars driving the next evolution of industrial intelligence.

This is not applied machine learning — it is systems engineering for manufacturing cognition. Tvastr's direction is shaped by five core engineering principles: signal-first architecture, persistent memory, explainable inference, edge-native runtime, and multi-modal fusion. 

These are not features. They are fundamental design choices enabling true industrial autonomy.

### Technology Pillars

#### Signal-First AI
Raw sensor data — not images — is the primary input. Textures, thermal gradients, pressure waves, and vibrations are fused at the signal level, not post-process.

**Relevance:** Enables detection of micro-defects invisible to cameras.

#### Industrial Reasoning Systems
Rule-based logic and physical constraints guide AI — not pure statistical learning. Physics-aware models prevent implausible inferences.

**Relevance:** Ensures decisions are manufacturable, not just probable.

#### Explainable Inference
Every decision is backed by a traceable path: which signal, which threshold, which correlation triggered the output.

**Relevance:** Enables compliance, audit, and engineer trust.

#### Industrial Memory Systems
Every defect, decision, and parameter is stored in a persistent, evolving knowledge graph — not a database. The system learns from every casting.

**Relevance:** Eliminates tribal knowledge — intelligence scales with production.

#### Edge-Native Industrial Cognition
All inference runs on-prem, with deterministic latency under 200ms. No cloud dependency. Full data sovereignty.

**Relevance:** Critical for plant continuity, security, and reliability.

#### Multi-Modal Manufacturing Intelligence
Fuses data from visual sensors, thermal cameras, ERP, PLCs, and operator logs — not in isolation, but in contextual alignment.

**Relevance:** Creates a holistic view of quality, not fragmented snapshots.

---

## Getting Started

Ready to transform your quality inspection process?

- **Request Demo:** Contact us for a live demonstration
- **View Platform Details:** Learn more about [Tvastr RAS](/systems/rejection-analysis-system) and [Tvastr PI](/systems/plant-intelligence)
- **See Technology:** Explore our [technology documentation](/technology)

---

*Last Updated: 2026-05-18*  
*Platform Version: 2.0 (Phase-K)*
