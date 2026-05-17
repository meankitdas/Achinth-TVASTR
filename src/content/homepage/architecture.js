export const architectureContent = {
  id: "architecture",
  type: "architecture",
  title: "Industrial Intelligence Layer: Seven Architectural Stages",
  subtitle: "From raw signal to plant-wide cognition — a layered, persistent system.",
  layers: [
    {
      id: "perception",
      name: "Perception Layer",
      description: "Ingests raw signals: inspection images, thermal cameras, vibration sensors, ERP logs.",
      icon: "camera"
    },
    {
      id: "signal",
      name: "Signal Layer",
      description: "Normalizes, timestamps, and embeds context — aligning heterogeneous data streams.",
      icon: "connection"
    },
    {
      id: "fusion",
      name: "Fusion Layer",
      description: "Correlates defects with heat history, mold conditions, and operator inputs.",
      icon: "link"
    },
    {
      id: "reasoning",
      name: "Reasoning Layer",
      description: "Applies explainable, physics-aware inference to identify root causes.",
      icon: "explainable"
    },
    {
      id: "memory",
      name: "Memory Layer",
      description: "Stores every decision, defect, and process variation as persistent knowledge.",
      icon: "memory"
    },
    {
      id: "process-intelligence",
      name: "Process Intelligence Layer",
      description: "Generates SPC charts, FMEA reports, drift alerts, and cost-of-quality dashboards.",
      icon: "ruler"
    },
    {
      id: "plant-intelligence",
      name: "Plant Intelligence Layer",
      description: " orchestrates decisions across the enterprise — predictive quality, autonomous adjustments.",
      icon: "target"
    }
  ]
}