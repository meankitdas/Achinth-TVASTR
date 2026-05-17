# Tvastr Technology Documentation

**Signal-based inspection system with explainable reasoning and process intelligence.**

Tvastr combines traditional computer vision with signal-based analysis to provide consistent, explainable defect detection. The system operates on-premise with offline capability, processing inspections through a 10-stage pipeline that delivers decisions in under 200ms.

---

## Table of Contents

1. [Inspection Pipeline](#inspection-pipeline)
2. [Signal Analysis System](#signal-analysis-system)
3. [Defect Fingerprinting & Pattern Tracking](#defect-fingerprinting--pattern-tracking)
4. [Process Intelligence & Analytics](#process-intelligence--analytics)
5. [Statistical Process Control (SPC)](#statistical-process-control-spc)
6. [Fishbone & Root Cause Analysis](#fishbone--root-cause-analysis)
7. [Pareto & Defect Prioritization](#pareto--defect-prioritization)
8. [Traceability & Reporting](#traceability--reporting)
9. [Deployment Architecture](#deployment-architecture)

---

## Inspection Pipeline

**10-stage inspection flow from image input to decision output.**

The Tvastr inspection pipeline processes casting images through 10 sequential stages, each with health tracking and validation. The system is edge-native, offline-capable, and designed for deterministic execution in manufacturing environments.

### Pipeline Stages

#### Stage 0: Quality Gate

Pre-pipeline validation for image quality (blur, brightness, contrast, resolution).

- Laplacian variance blur detection
- Brightness range validation [30-225]
- Contrast check (std ≥ 20)
- Non-blocking, flags degradation

#### Stage 1: YOLO Detection

Casting localization and defect region proposals (0% weight in final decision).

- Detects 6 defect classes
- Confidence thresholds: 0.15-0.30
- NMS with IoU 0.45
- Proposal generator only

#### Stage 2: Patch Classification

Dense 256×256 sliding window analysis with 50% overlap.

- 36 patches per 960px image
- DBSCAN cluster filtering
- Hybrid scoring (max 70%, mean 30%)
- Temperature-calibrated probabilities

#### Stage 2b: Signal Feature Extraction

OpenCV-based feature extraction (LBP, GLCM, edge, blob, geometry).

- 15-dimensional feature vector
- Texture, edge, blob, intensity, geometry
- Gated by YOLO prob ≥ 0.20
- Pure signal processing

#### Stage 2c: Signal Classification

PRIMARY classifier (45% weight) using hard threshold rules on signal features.

- Signal-first reasoning
- Requires 2 strong + 1 supporting signal
- Explainable classifications
- Physics-grounded thresholds

#### Stage 3: Consolidation + Diagnosis

Merge detections, zone mapping, knowledge base matching, topology scoring.

- 5×5 or 7×7 zone grid
- Widespread defect merging
- Root-cause attribution
- Manufacturing section identification

#### Stage 4: Multi-Signal Fusion

Weighted fusion: Signal 45%, LLM 35%, Agreement 20%.

- Signal is PRIMARY classifier
- Proportional weight redistribution
- Agreement boosting/penalty
- Calibrated fusion formula

#### Stage 5: Topology & Anomaly Integration

Continuous topology scoring and anomaly distribution analysis.

- Cluster density and coverage
- Spread ratio calculation
- Peak anomaly detection
- Process vs structural distinction

#### Stage 6: Energy-Based Reasoning

Phase-K energy model with Lyapunov stability checking.

- Additive energy forces
- Topology, SCRATA, anomaly, LLM forces
- Stability tolerance: 0.01
- Rollback on instability

#### Stage 7: Final Decision

3-tier decision thresholds with review triggers.

- Accept (≤0.30), Review (0.30-0.70), Reject (≥0.70)
- Multiple review triggers
- Quality gate override
- Confidence scoring

### Post-Decision Stages

#### Stage 8: Visualization + Reports

Automated PDF reports, annotated images, defect heatmaps.

#### Stage 9: Telemetry

JSONL logging for runs, signal traces, and operator feedback.

#### Stage 10: Traceability + Persistence

SQL storage, ERP export, fingerprinting, and process intelligence.

### Key Pipeline Features

- Edge-native, on-premise deployment
- Offline-capable (no cloud dependency)
- Deterministic <200ms latency
- Pipeline health tracking (OK/DEGRADED/FAILED)
- Explainable at every stage

---

## Signal Analysis System

**PRIMARY classifier (45% weight) using OpenCV signal processing and physics-grounded thresholds.**

The signal analysis system is the primary defect classifier in Tvastr. Using pure OpenCV signal processing, it extracts 15-dimensional feature vectors from casting patches and applies hard threshold rules to classify defects. Signal-based classification provides explainable, physics-grounded decisions that complement deep learning approaches.

### Feature Categories

#### 1. Texture Features (25% weight)

Local Binary Patterns (LBP) and Gray Level Co-occurrence Matrix (GLCM) for surface texture analysis.

**Components:**

- LBP uniformity (manual implementation, radius 1, 8 points)
- GLCM contrast, homogeneity, energy, correlation
- Quantized to 32 gray levels
- CLAHE preprocessing with Gaussian blur

**Interpretation:** High LBP std + high GLCM contrast + low homogeneity indicate irregular texture patterns typical of defects.

#### 2. Geometry Features (25% weight)

Contour-based shape analysis for crack and moulding error detection.

**Components:**

- Circularity (4π × area / perimeter²)
- Solidity (contour area / convex hull area)
- Aspect ratio (width / height)
- Extent (contour area / bounding box area)

**Interpretation:** Low circularity + elongated aspect ratio indicate linear defects like cracks.

#### 3. Edge Features (20% weight)

Canny edge detection for boundary and crack identification.

**Components:**

- Edge density (percentage of edge pixels)
- Edge mean intensity
- Canny algorithm with adaptive thresholding

**Interpretation:** High edge density indicates defect boundaries, cracks, or inclusions.

#### 4. Blob Features (15% weight)

SimpleBlobDetector for porosity and inclusion analysis.

**Components:**

- Blob count (number of detected blobs)
- Mean blob size
- Blob density within patch

**Interpretation:** High blob count indicates porosity or multiple small inclusions.

#### 5. Intensity Features (15% weight)

Grayscale intensity statistics for dark cavity detection.

**Components:**

- Mean intensity
- Standard deviation
- Intensity range

**Interpretation:** Low mean intensity + high std deviation indicate dark cavities or voids.

### Signal Scoring Formula

```
signal_score = 0.25×texture + 0.25×geometry + 0.20×edge + 0.15×blob + 0.15×intensity
```

Weighted aggregation of five feature categories produces final signal score.

### Classification Rules

**All defect types require: 2 strong + 1 supporting signal**

- **Porosity**: High circularity + low solidity + high blob count
- **Shrinkage**: High irregularity + low energy + high edge density
- **Crack**: Very high edge density + low circularity + elongated aspect ratio
- **Sand Inclusion**: High texture variation + moderate blob count + irregular shape
- **Surface Roughness**: High LBP variance + high dissimilarity + moderate edge density
- **Blow Hole**: Circular + dark intensity + isolated blob

### Why Signal-First Classification?

- YOLO has ~15% error rate on subtle defects
- Signal features are physics-grounded and explainable
- Texture, edge, geometry capture material properties YOLO misses
- Hard threshold rules provide traceable decision paths

---

## Defect Fingerprinting & Pattern Tracking

**Spatial vectorization and clustering system for recurring defect pattern identification.**

The fingerprinting system converts defect detections into normalized spatial vectors, clusters them using DBSCAN, and tracks their recurrence across inspections. This enables root cause tracing, process diagnostics, and identification of systematic quality issues.

### 3-Stage Alignment Cascade

Transforms defect coordinates from inspection image space to normalized template space for consistent comparison.

#### Method 1: Contour Alignment (PRIMARY)

Geometry-based alignment using casting body contours.

**Process:**

1. Extract casting body contour from inspection image
2. Load reference contour from template
3. Compute affine transform (M) mapping inspection to template space
4. Apply M to all defect bbox centers

**Advantages:**

- Fast (50-100ms)
- Geometry-based (works on any casting)
- Robust to lighting variations

**Performance:** ~50-100ms

#### Method 2: ORB Template Alignment (FALLBACK 1)

Feature-based alignment using ORB keypoints.

**Process:**

1. Extract ORB keypoints from inspection image
2. Match against reference template keypoints
3. Estimate homography (H) using RANSAC
4. Requires ≥8 inliers

**Disadvantages:**

- Fails on featureless castings
- Slower (~500ms)

**Performance:** ~500ms

#### Method 3: PCA Fallback (FALLBACK 2)

Orientation-based alignment using Principal Component Analysis.

**Process:**

1. Compute PCA on defect bbox centers
2. Align principal axis to vertical
3. Apply rotation transform

**Limitations:** No spatial normalization (coordinates remain image-relative)

**Performance:** ~10ms

### 12-Field Normalized Vector (v4)

Each defect is represented as a 12-dimensional vector in template space:

| Field | Description |
|-------|-------------|
| type | Defect class (porosity, shrinkage, crack, etc.) |
| x | Normalized center x (template-space, 0-1) |
| y | Normalized center y (template-space, 0-1) |
| zone | Engineering zone (polygon-based assignment) |
| secondary_zone | Fallback zone if near boundary |
| zone_confidence | Confidence of zone assignment (0-1) |
| surface | top \| bottom \| unknown |
| width | Normalized width (0-1) |
| height | Normalized height (0-1) |
| severity | Confidence score (0-1) |
| region | Spatial label (top/bottom/left/right/center) |
| orientation_angle | PCA angle in degrees (0.0 for aligned) |

**Note:** Coordinates are crop-relative (normalized against casting body bbox), not full image.

### DBSCAN Clustering

Groups defects by type and zone to identify recurring patterns.

**Parameters:**

- Epsilon: Distance threshold for cluster membership
- Min samples: Minimum defects required to form cluster
- Metric: Euclidean distance on normalized coordinates

**Process:**

1. Group all defects by defect_type + zone
2. Apply DBSCAN within each group
3. Filter noise clusters
4. Calculate cluster centroid and variance

**Output:** Cluster ID, centroid coordinates, member count, average severity

### Recurring Pattern Detection

Identifies when new defects match previously observed patterns.

**Process:**

1. Compute Euclidean distance between new defect and all cluster centroids
2. Filter by region (only compare within same spatial region)
3. Match if distance < threshold
4. Return cluster ID, similarity score, historical frequency

**Applications:**

- Root cause tracing (defects recurring from same mold/heat)
- Process diagnostics (systematic defect patterns)
- Predictive quality (high-risk zones identification)

### Storage Architecture

**SQL Primary Storage:**

- AI_Defect_Clusters: Cluster metadata and centroids
- AI_Defects: Individual defect vectors with cluster_id linkage

**Fallback:** JSON files in runtime/fingerprints/ if SQL unavailable

---

## Process Intelligence & Analytics

**Plant-wide manufacturing intelligence through analytics, quality frameworks, and decision support.**

Tvastr PI (Plant Intelligence) provides comprehensive manufacturing analytics through REST API and real-time WebSocket updates. Available in TIER_3 license, PI aggregates inspection data into actionable insights for quality improvement and process optimization.

### Analytics Capabilities

| Capability | Endpoint | Description |
|------------|----------|-------------|
| Plant Overview Dashboard | `/analytics/plant_overview` | Multi-metric dashboard with rejection rate, trend analysis, and active alerts |
| Rejection Rate Analysis | `/analytics/rejection_rate` | Rejection rate breakdown by shift, heat, and day with historical trending |
| Pareto Analysis | `/analytics/pareto` | 80/20 defect concentration analysis identifying high-impact defect types |
| Defect Trend Tracking | `/analytics/defect_trends` | Time-series defect frequency with rolling average and anomaly detection |
| Cluster Analysis | `/analytics/cluster_analysis` | Fingerprint-based recurring defect pattern identification and frequency tracking |
| Spatial Defect Maps | `/analytics/spatial_map` | Heatmap visualization of defect concentration across casting zones |

### Quality Frameworks

| Framework | Full Name | Endpoint | Description |
|-----------|-----------|----------|-------------|
| FMEA | Failure Mode & Effects Analysis | `/quality/fmea` | Systematic failure mode identification with risk prioritization |
| Fishbone Diagrams | Ishikawa Root Cause Analysis | `/quality/fishbone` | Root cause investigation with manufacturing factor correlation |
| Quality Gate Compliance | - | `/quality/quality_gates` | Multi-gate quality compliance tracking and bottleneck identification |
| TPM | Total Productive Maintenance | `/quality/tpm` | Equipment effectiveness tracking and maintenance correlation |
| Cost of Quality | - | `/quality/cost_of_quality` | COPQ analysis (prevention, appraisal, internal failure, external failure costs) |

### Process Intelligence

| Feature | Endpoint | Description |
|---------|----------|-------------|
| Risk Scoring | `/process/risk_scores` | Entity-level risk scores for heats, molds, and shifts based on historical defect patterns |
| Heat-Specific Analysis | `/process/heat_analysis` | Heat number intelligence with defect history, risk trends, and process correlation |
| Mold Risk Scoring | `/process/mold_risk` | Mold degradation risk based on defect recurrence and wear patterns |
| Defect Flow Analysis | `/process/defect_flow` | Sankey diagram data showing defect propagation across process stages |

### System Architecture

**Components:**

- 50+ Python modules in core/plant_intelligence/
- 25 REST API endpoints via FastAPI
- 1 WebSocket endpoint for real-time updates
- Shared SQL database connection with RAS
- Next.js static dashboard (8 tabs, 48 files)

**Deployment:** Served via API server at <http://localhost:8000/pi/>

### WebSocket Real-Time Updates

**Endpoint:** `ws://localhost:8000/ws/plant_updates`  
**Frequency:** Polls every 30 seconds

**Event Types:**

- `kpi_update`: Rejection rate snapshots
- `alert`: Manufacturing alerts (spikes, drift, anomalies)
- `risk_update`: Updated entity risk scores

---

## Statistical Process Control (SPC)

**Real-time process stability monitoring with control charts and capability analysis.**

SPC monitoring provides real-time statistical tracking of manufacturing process stability. Control charts detect shifts, trends, and anomalies in defect rates, while process capability indices quantify manufacturing precision.

### Control Chart Analysis

**Endpoint:** `/spc/control_chart`

#### X̄ Control Chart

Mean rejection rate tracking with upper and lower control limits (UCL/LCL).

**Calculation:** UCL = μ + 3σ, LCL = μ - 3σ

#### CUSUM

Cumulative Sum control chart for detecting small sustained shifts in process mean.

**Sensitivity:** More sensitive to gradual process drift than standard control charts

#### Western Electric Rules

Statistical process control rules for pattern detection:

- **Rule 1:** One point beyond 3σ
- **Rule 2:** Two of three consecutive points beyond 2σ
- **Rule 3:** Four of five consecutive points beyond 1σ
- **Rule 4:** Eight consecutive points on one side of center line

### Process Capability Analysis

**Endpoint:** `/spc/process_capability`

#### Cpk (Process Capability Index)

Measures how well the process fits within specification limits, accounting for centering.

**Formula:** `Cpk = min[(USL - μ) / 3σ, (μ - LSL) / 3σ]`

**Interpretation:**

- Cpk ≥ 1.33: Process capable
- 1.00 ≤ Cpk < 1.33: Process acceptable but improvement needed
- Cpk < 1.00: Process not capable

#### Ppk (Process Performance Index)

Measures actual process performance over time, including both common and special cause variation.

**Formula:** `Ppk = min[(USL - μ) / 3σ_total, (μ - LSL) / 3σ_total]`

**Difference:** Uses total variation (σ_total) vs within-subgroup variation (σ) in Cpk

#### Sigma Level

Defects per million opportunities (DPMO) expressed as sigma level.

- 6σ: 3.4 DPMO (world-class)
- 5σ: 233 DPMO
- 4σ: 6,210 DPMO
- 3σ: 66,807 DPMO

### Applications

- Real-time process stability monitoring
- Shift-to-shift consistency tracking
- Heat quality variation analysis
- Early detection of process drift
- Quantitative capability assessment

---

## Fishbone & Root Cause Analysis

**Systematic root cause investigation using Ishikawa diagrams and FMEA.**

Root cause analysis tools connect defect patterns to manufacturing factors, enabling systematic investigation and corrective action. Fishbone diagrams and FMEA frameworks provide structured approaches to identifying and prioritizing quality issues.

### Ishikawa Root Cause Diagrams

**Endpoint:** `/quality/fishbone`

Visual root cause analysis tool correlating defects with manufacturing factors.

#### 6M Categories

**Materials:**

- Alloy composition
- Metal quality
- Impurity levels
- Feedstock variation

**Methods:**

- Pouring technique
- Mold preparation
- Cooling rate
- Process parameters

**Machines:**

- Furnace condition
- Mold condition
- Equipment calibration
- Tooling wear

**Manpower:**

- Operator skill
- Shift variation
- Training gaps
- Inspection consistency

**Measurements:**

- Temperature accuracy
- Time tracking
- Quality gate variance
- Inspection standards

**Environment:**

- Ambient conditions
- Foundry temperature
- Humidity
- Contamination

#### Process

1. Identify primary defect type (effect)
2. Map defects to 6M categories
3. Correlate with heat/mold/shift data
4. Prioritize high-frequency factors
5. Generate corrective action recommendations

### Failure Mode & Effects Analysis (FMEA)

**Endpoint:** `/quality/fmea`

Systematic identification and prioritization of failure modes.

#### Components

| Component | Description | Scale |
|-----------|-------------|-------|
| Failure Mode | How the process can fail (porosity, shrinkage, crack formation) | - |
| Effect | Impact of failure (rejection, rework, customer complaint) | - |
| Severity | Severity rating | 1-10 (10 = Critical safety/customer impact) |
| Occurrence | Frequency of failure | 1-10 (10 = Very high frequency) |
| Detection | Likelihood of detecting failure before customer | 1-10 (10 = Almost certain not to detect) |
| RPN | Risk Priority Number | RPN = Severity × Occurrence × Detection |

**Threshold:** RPN > 100 requires corrective action

### Root Cause Investigation Workflow

1. Defect pattern identification (fingerprinting + clustering)
2. Factor correlation (heat, mold, shift, operator, time)
3. Fishbone diagram generation (6M mapping)
4. FMEA risk scoring
5. Pareto prioritization (80/20 focus)
6. Corrective action recommendations

### Applications

- Recurring defect investigation
- Process optimization prioritization
- Equipment maintenance correlation
- Operator training needs identification
- Supplier quality tracking

---

## Pareto & Defect Prioritization

**80/20 analysis for identifying high-impact defect types and process improvements.**

Pareto analysis applies the 80/20 principle to defect data, identifying the vital few defect types that account for the majority of quality issues. Combined with spatial concentration mapping, Pareto analysis guides targeted process improvement efforts.

### Pareto Chart Analysis

**Endpoint:** `/analytics/pareto`

Ranked defect frequency analysis identifying high-impact defect types.

**Principle:** Typically, 20% of defect types account for 80% of total rejections.

**Outputs:**

- Defect type ranking by frequency
- Cumulative percentage curve
- Critical few vs trivial many identification
- Historical trend comparison

### Spatial Defect Concentration

**Endpoint:** `/analytics/spatial_map`

Heatmap visualization of defect density across casting zones.

**Features:**

- Zone-level defect aggregation
- Normalized density scoring
- Hot zone identification
- Recurring pattern highlighting

**Applications:**

- High-risk zone identification
- Mold design optimization
- Cooling pattern analysis
- Gate and riser placement evaluation

### Defect Prioritization Workflow

1. **Data Aggregation:** Collect defect data across all inspections within time window
2. **Frequency Ranking:** Rank defect types by occurrence count
3. **Cumulative Analysis:** Calculate cumulative percentage contribution
4. **Critical Identification:** Identify defect types contributing to 80% of issues
5. **Root Cause Linking:** Link critical defects to fishbone analysis and FMEA
6. **Action Planning:** Generate prioritized corrective action recommendations

### Integrations

- FMEA risk scoring (prioritize high RPN defects)
- Fishbone root cause mapping (focus on vital few)
- SPC monitoring (track improvement over time)
- Spatial analysis (zone-level targeting)
- Cost of quality (quantify financial impact)

### Benefits

- Focus improvement efforts on high-impact defects
- Quantify improvement potential
- Data-driven resource allocation
- Track effectiveness of corrective actions
- Communicate priorities to plant teams

---

## Traceability & Reporting

**Comprehensive inspection record management with SQL storage, PDF reports, and ERP integration.**

Traceability infrastructure provides complete inspection record persistence, linking defect data to heat numbers, mold IDs, shifts, and production dates. Automated reporting and ERP export enable seamless integration with existing manufacturing systems.

### SQL Database Architecture

Structured storage of all inspection records with relational linkage to manufacturing context.

#### AI_Inspections Table

Master inspection records

**Key Fields:**

- inspection_id (primary key)
- heat_number
- mold_id
- shift
- operator
- production_date
- final_decision (ACCEPT/REVIEW/REJECT)
- confidence_score
- pipeline_health

#### AI_Defects Table

Individual defect records with spatial data

**Key Fields:**

- defect_id (primary key)
- inspection_id (foreign key)
- defect_type
- confidence
- bbox coordinates
- zone
- signal_score
- cluster_id (fingerprint linkage)

#### AI_Defect_Clusters Table

Recurring defect pattern clusters

**Key Fields:**

- cluster_id (primary key)
- defect_type
- zone
- centroid coordinates
- member_count
- average_severity
- first_seen
- last_seen

### Automated PDF Reports

Comprehensive inspection reports with annotated images, heatmaps, and defect tables.

**Components:**

- Annotated image with bounding boxes and labels
- Defect heatmap overlay
- Defect summary table (type, count, confidence)
- Decision summary (Accept/Review/Reject)
- Manufacturing context (heat, mold, shift, date)
- Pipeline health status
- Signal analysis summary
- Operator signature field

**Format:** PDF/A (archival-quality, ISO 19005-1 compliant)

### ERP Integration

Automated export of inspection results for ERP system integration.

**Format:** CSV export with configurable field mapping

**Fields:**

- Heat number
- Mold ID
- Inspection timestamp
- Decision (Accept/Review/Reject)
- Defect count by type
- Confidence score
- Inspector ID

**Schedule:** Configurable (real-time, hourly, daily batch)

### Telemetry & Logging

Comprehensive run logging for debugging, audit, and feedback tracking.

#### Run Logs

- **File:** `runtime/logs/runs_YYYYMM.jsonl`
- **Description:** Complete pipeline execution trace (JSONL format, monthly rotation)
- **Retention:** 12 months

#### Signal Traces

- **File:** `runtime/logs/signal_traces_YYYYMMDD.jsonl`
- **Description:** Detailed signal feature extraction logs (daily rotation)
- **Retention:** 30 days

#### Feedback Logs

- **File:** `runtime/logs/feedback_YYYYMM.jsonl`
- **Description:** Operator corrections and feedback (monthly rotation)
- **Retention:** Permanent (used for retraining)

### Audit Trail Support

Complete traceability for quality audits and regulatory compliance.

**Features:**

- Immutable inspection records
- Timestamp validation
- Operator attribution
- Decision change tracking
- Feedback history
- System version tagging

---

## Deployment Architecture

**On-premise, edge-native deployment with offline capability and deterministic performance.**

Tvastr is designed for industrial edge deployment with complete offline capability. The system operates independently of cloud services, providing deterministic sub-200ms inspection latency in manufacturing environments.

### Core Properties

- Edge-native: Runs on-premise without cloud dependency
- Offline-capable: Full functionality without internet access
- Deterministic latency: <200ms per inspection
- Industrial-grade reliability: Designed for 24/7 operation

### Deployment Models

#### Single Station

Self-contained inspection station with local storage.

**Components:**

- Workstation PC (GPU-equipped)
- Industrial camera system
- Local SQL database
- Tvastr RAS runtime

**Use Case:** Single quality gate deployment, pilot programs

#### Multi-Gate

Multiple inspection stations with centralized data aggregation.

**Components:**

- Multiple workstation PCs (edge nodes)
- Centralized SQL database server
- Network-attached storage for images
- Tvastr RAS + PI stack

**Use Case:** Pattern, core, mold condition, final inspection gates

#### Plant-Wide

Foundry-wide deployment with process intelligence and analytics.

**Components:**

- Multiple inspection stations across gates
- Central database server (SQL Server)
- API server for PI dashboard
- ERP integration layer
- Backup and archival systems

**Use Case:** Complete foundry quality infrastructure with analytics

### SQL Database Integration

Native SQL Server integration for structured data storage and query capability.

**Features:**

- SQL Server 2019+ compatibility
- SQLAlchemy ORM for Python integration
- Connection pooling and retry logic
- Automatic schema migration
- JSON fallback for offline operation

**Tables:** 3 primary tables (AI_Inspections, AI_Defects, AI_Defect_Clusters)

### REST API Architecture

FastAPI-based REST API for plant intelligence and integration.

**Features:**

- 25 REST endpoints (analytics, quality, process, SPC, decision)
- WebSocket support for real-time updates
- OpenAPI/Swagger documentation
- CORS configuration for dashboard access
- License-based feature gating

**Access:** <http://localhost:8000> (configurable port)

### Hardware Requirements

#### Minimum

- CPU: Intel i5 (8th gen) or equivalent
- RAM: 16GB
- GPU: NVIDIA GTX 1650 (4GB VRAM) or better
- Storage: 256GB SSD
- OS: Windows 10/11, Ubuntu 20.04+

#### Recommended

- CPU: Intel i7 (10th gen) or equivalent
- RAM: 32GB
- GPU: NVIDIA RTX 3060 (12GB VRAM)
- Storage: 512GB NVMe SSD
- OS: Windows 11, Ubuntu 22.04

### Network Requirements

Minimal network requirements for multi-station deployments.

**Requirements:**

- Gigabit Ethernet for multi-gate deployments
- Local network only (no internet required)
- Optional: VPN for remote support access
- SQL Server port (1433) for database access
- API port (8000) for PI dashboard access

### Data Retention & Archival

**Policies:**

- Images: 90 days local, then archive to NAS/tape
- SQL records: Permanent (with backup)
- Run logs: 12 months
- Signal traces: 30 days
- Feedback logs: Permanent

---

## Contact & Support

For technical consultation, detailed system documentation, and deployment planning:

- **Request Technical Consultation:** Contact our technical team
- **View Documentation:** Visit /system for detailed system docs
- **Schedule Demo:** Get in touch for a live demonstration

---

*Last Updated: 2026-05-18*
