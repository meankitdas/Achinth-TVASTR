export const signalReasoningContent = {
  id: "signal-reasoning",
  type: "signal-reasoning",
  title: "Signal-Based Reasoning",
  subtitle:
    "Multiple independent signal channels collaborate to produce explainable defect classifications. No single model has final authority.",
  body: "The reasoning layer receives feature vectors from the perception engine and applies physics-grounded threshold rules across five signal categories. Classification requires agreement between multiple signal channels — a design that produces traceable, auditable decisions rather than opaque confidence scores.",
  signalChannels: [
    {
      name: "Texture Signals",
      weight: "25%",
      description:
        "Surface pattern analysis using Local Binary Patterns and GLCM co-occurrence matrices. Detects irregular textures associated with porosity, roughness, and inclusions.",
      interpretation:
        "High texture variance combined with low homogeneity indicates surface irregularity consistent with defects.",
    },
    {
      name: "Geometry Signals",
      weight: "25%",
      description:
        "Contour-based shape analysis measuring circularity, solidity, aspect ratio, and extent. Identifies crack morphology and structural deformation.",
      interpretation:
        "Low circularity with elongated aspect ratio indicates linear defects such as cracks.",
    },
    {
      name: "Edge Signals",
      weight: "20%",
      description:
        "Canny edge detection for boundary identification. Measures edge density and intensity to identify defect boundaries and crack paths.",
      interpretation:
        "High edge density indicates defect boundaries, crack propagation, or inclusion interfaces.",
    },
    {
      name: "Blob Signals",
      weight: "15%",
      description:
        "Blob detection for porosity and inclusion analysis. Counts, measures, and scores isolated dark regions within patches.",
      interpretation:
        "Multiple small blobs indicate porosity. Single large blobs suggest blow holes or cavities.",
    },
    {
      name: "Intensity Signals",
      weight: "15%",
      description:
        "Grayscale intensity statistics for cavity and void detection. Analyzes mean intensity, deviation, and range across each patch to identify subsurface anomalies. Compares local intensity distributions against baseline casting profiles to detect dark regions indicative of porosity or material discontinuities.",
      interpretation:
        "Low mean intensity with high deviation indicates dark cavities or subsurface voids.",
    },
  ],
  fusionArchitecture: {
    title: "Multi-Signal Fusion",
    description:
      "Final classification uses weighted fusion across all signal sources plus agreement validation.",
    weights: [
      {
        source: "Signal Classification",
        weight: "45%",
        role: "Primary classifier — physics-grounded threshold rules",
      },
      {
        source: "Neural Classification",
        weight: "35%",
        role: "Deep learning confidence from patch analysis",
      },
      {
        source: "Agreement Score",
        weight: "20%",
        role: "Bonus/penalty based on signal-neural alignment",
      },
    ],
    principle:
      "Signal is the primary classifier. Neural provides supporting evidence. Agreement validates consistency.",
  },
  classificationRequirement:
    "Every defect classification requires minimum 2 strong signals plus 1 supporting signal. Insufficient evidence triggers manual review — never forced classification.",
  explainability: [
    "Every classification produces a signal evidence summary",
    "Engineers can trace which signals triggered the decision",
    "Disagreement between channels is logged and flagged",
    "Threshold adjustments are auditable and documented",
    "No hidden weights — all rules are physics-grounded",
  ],
  keyMessage:
    "Decisions are made by signal agreement — not model confidence. Every classification is explainable, traceable, and auditable.",
};
