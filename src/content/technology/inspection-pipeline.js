export const inspectionPipelineContent = {
  id: "inspection-pipeline",
  type: "inspection-pipeline",
  title: "Inspection Pipeline",
  subtitle: "10-stage inspection flow from image input to decision output.",
  body: "The Tvastr inspection pipeline processes casting images through 10 sequential stages, each with health tracking and validation. The system is edge-native, offline-capable, and designed for deterministic execution in manufacturing environments.",
  stages: [
    {
      number: 0,
      name: "Quality Gate",
      description: "Pre-pipeline validation for image quality (blur, brightness, contrast, resolution).",
      details: ["Laplacian variance blur detection", "Brightness range validation [30-225]", "Contrast check (std ≥ 20)", "Non-blocking, flags degradation"]
    },
    {
      number: 1,
      name: "YOLO Detection",
      description: "Casting localization and defect region proposals (0% weight in final decision).",
      details: ["Detects 6 defect classes", "Confidence thresholds: 0.15-0.30", "NMS with IoU 0.45", "Proposal generator only"]
    },
    {
      number: 2,
      name: "Patch Classification",
      description: "Dense 256×256 sliding window analysis with 50% overlap.",
      details: ["36 patches per 960px image", "DBSCAN cluster filtering", "Hybrid scoring (max 70%, mean 30%)", "Temperature-calibrated probabilities"]
    },
    {
      number: "2b",
      name: "Signal Feature Extraction",
      description: "OpenCV-based feature extraction (LBP, GLCM, edge, blob, geometry).",
      details: ["15-dimensional feature vector", "Texture, edge, blob, intensity, geometry", "Gated by YOLO prob ≥ 0.20", "Pure signal processing"]
    },
    {
      number: "2c",
      name: "Signal Classification",
      description: "PRIMARY classifier (45% weight) using hard threshold rules on signal features.",
      details: ["Signal-first reasoning", "Requires 2 strong + 1 supporting signal", "Explainable classifications", "Physics-grounded thresholds"]
    },
    {
      number: 3,
      name: "Consolidation + Diagnosis",
      description: "Merge detections, zone mapping, knowledge base matching, topology scoring.",
      details: ["5×5 or 7×7 zone grid", "Widespread defect merging", "Root-cause attribution", "Manufacturing section identification"]
    },
    {
      number: 4,
      name: "Multi-Signal Fusion",
      description: "Weighted fusion: Signal 45%, LLM 35%, Agreement 20%.",
      details: ["Signal is PRIMARY classifier", "Proportional weight redistribution", "Agreement boosting/penalty", "Calibrated fusion formula"]
    },
    {
      number: 5,
      name: "Topology & Anomaly Integration",
      description: "Continuous topology scoring and anomaly distribution analysis.",
      details: ["Cluster density and coverage", "Spread ratio calculation", "Peak anomaly detection", "Process vs structural distinction"]
    },
    {
      number: 6,
      name: "Energy-Based Reasoning",
      description: "Phase-K energy model with Lyapunov stability checking.",
      details: ["Additive energy forces", "Topology, SCRATA, anomaly, LLM forces", "Stability tolerance: 0.01", "Rollback on instability"]
    },
    {
      number: 7,
      name: "Final Decision",
      description: "3-tier decision thresholds with review triggers.",
      details: ["Accept (≤0.30), Review (0.30-0.70), Reject (≥0.70)", "Multiple review triggers", "Quality gate override", "Confidence scoring"]
    }
  ],
  postDecisionStages: [
    {
      number: 8,
      name: "Visualization + Reports",
      description: "Automated PDF reports, annotated images, defect heatmaps."
    },
    {
      number: 9,
      name: "Telemetry",
      description: "JSONL logging for runs, signal traces, and operator feedback."
    },
    {
      number: 10,
      name: "Traceability + Persistence",
      description: "SQL storage, ERP export, fingerprinting, and process intelligence."
    }
  ],
  keyFeatures: [
    "Edge-native, on-premise deployment",
    "Offline-capable (no cloud dependency)",
    "Deterministic <200ms latency",
    "Pipeline health tracking (OK/DEGRADED/FAILED)",
    "Explainable at every stage"
  ]
}