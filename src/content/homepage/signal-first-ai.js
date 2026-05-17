export const signalFirstAIContent = {
  id: "signal-first-ai",
  type: "signal-first-ai",
  title: "Signal-First Reasoning. Not Detection-Only AI.",
  subtitle: "Tvastr does not rely solely on neural network confidence scores. Multiple independent signal systems must agree before decisions are made.",
  body: "Standard inspection AI uses a single deep learning model to produce confidence scores. Tvastr operates differently: raw inspection data is decomposed into independent signal channels — texture, geometry, edge patterns, topology — and each channel produces its own evidence. Final decisions emerge from weighted agreement between multiple signal systems, producing explainable, physics-grounded classifications.",
  signalSystems: [
    {
      name: "Texture Analysis",
      description: "Surface pattern analysis using Local Binary Patterns and co-occurrence matrices to detect irregular textures."
    },
    {
      name: "Geometry Reasoning",
      description: "Contour-based shape analysis for crack morphology, circularity, and dimensional deviation."
    },
    {
      name: "Edge & Boundary Detection",
      description: "Canny edge analysis for defect boundary identification and crack path detection."
    },
    {
      name: "Topology Scoring",
      description: "Spatial distribution analysis of defect clusters across casting zones."
    },
    {
      name: "Anomaly Detection",
      description: "Statistical anomaly identification in intensity, blob density, and surface uniformity."
    },
    {
      name: "Agreement & Fusion",
      description: "Weighted consensus across all signal channels. Decisions require multi-signal agreement — not single-model confidence."
    }
  ],
  differentiators: [
    "Multiple independent signals must converge for classification",
    "Every decision produces a traceable reasoning path",
    "Physics-grounded thresholds replace opaque model weights",
    "Signal disagreement triggers human review — not forced classification",
    "Root cause reasoning connects defect patterns to process behavior"
  ],
  keyMessage: "Explainable signal-first reasoning means engineers can audit, understand, and improve every decision the system makes."
}
