export const coreArchitectureContent = {
  id: "core-architecture",
  type: "core-architecture",
  title: "Layered Intelligence Architecture",
  subtitle: "Five architectural layers from signal capture to plant-wide process intelligence.",
  body: "The Tvastr architecture separates concerns into distinct layers — each independently testable, each producing traceable outputs, and each contributing to the manufacturing intelligence that flows upward through the system.",
  layers: [
    {
      id: "perception",
      name: "Perception Layer",
      description: "Captures and processes raw manufacturing signals — visual inspection, surface texture, thermal data, and sensor inputs. Produces structured feature vectors for downstream reasoning.",
      responsibilities: [
        "Image capture and quality validation",
        "YOLO-assisted object localization",
        "Patch-level dense analysis",
        "Signal feature extraction (texture, edge, geometry, blob, intensity)",
        "Anomaly detection and topology scoring"
      ]
    },
    {
      id: "reasoning",
      name: "Reasoning Layer",
      description: "Applies multi-signal classification using physics-grounded thresholds and agreement systems. Produces explainable defect decisions backed by traceable signal evidence.",
      responsibilities: [
        "Signal-first classification with hard threshold rules",
        "Multi-signal fusion and weighted agreement",
        "Energy-based reasoning with stability validation",
        "Topology and spatial analysis",
        "Explainable decision generation"
      ]
    },
    {
      id: "memory",
      name: "Memory Layer",
      description: "Persists every inspection, defect, and process observation into a structured manufacturing record. Enables pattern matching, historical reasoning, and traceability.",
      responsibilities: [
        "Defect fingerprinting and spatial vectorization",
        "DBSCAN clustering for recurring patterns",
        "Heat-level and mold-level intelligence accumulation",
        "Complete inspection-to-production traceability",
        "Historical defect matching"
      ]
    },
    {
      id: "process-intelligence",
      name: "Process Intelligence Layer",
      description: "Aggregates inspection data into manufacturing analytics — SPC, Pareto, root cause analysis, and risk scoring. Transforms individual decisions into operational intelligence.",
      responsibilities: [
        "Statistical Process Control and drift detection",
        "Pareto analysis and defect prioritization",
        "Root cause analysis with Fishbone framework",
        "Entity-level risk scoring (heat, mold, shift)",
        "Manufacturing KPI generation and alerting"
      ]
    },
    {
      id: "runtime",
      name: "Runtime Layer",
      description: "Orchestrates inspection execution with deterministic latency, pipeline health monitoring, and telemetry. Manages the edge-native deployment lifecycle.",
      responsibilities: [
        "Pipeline orchestration and execution flow",
        "Health monitoring (OK / DEGRADED / FAILED)",
        "Telemetry and structured logging",
        "API server and WebSocket management",
        "Edge deployment and offline operation"
      ]
    }
  ],
  keyMessage: "Each layer produces independently verifiable outputs. Intelligence flows upward — from raw signals through reasoning, into persistent memory, and onward to process-level insights."
}
