export const explainabilityContent = {
  id: "explainability",
  type: "explainability",
  title: "Explainable Industrial AI: Why Traceability Matters in Manufacturing",
  subtitle: "Traditional systems are black boxes. Tvastr makes every decision auditable.",
  body: "In traditional computer vision systems, defects are detected but not understood. The AI doesn't show how or why — it simply outputs 'reject'. This opacity is unacceptable in industrial environments where regulatory compliance, root-cause accountability, and process improvement require full traceability. Tvastr reverses this paradigm: every decision is backed by a pathway of reasoning grounded in physical signals — not statistical probability.",
  sections: [
    {
      title: "Traditional AI Systems",
      description: "Opaque, uninterpretable, and difficult to audit. Decisions are based on hidden weights and probabilistic patterns. If a defect is missed or misclassified, engineers have no way to learn why. No traceability. No trust.",
      points: [
        "Black-box model with no output rationale",
        "No link between input signal and final decision",
        "Cannot be audited by quality engineers or regulators",
        "Requires constant expert supervision to validate"
      ]
    },
    {
      title: "Tvastr Explainable Reasoning",
      description: "Every decision is explained using industrial signals: textures, geometry, thermal gradients, and process context. Engineers can follow the logic — and improve it.",
      points: [
        "Texture signal analysis: micro-defects identified by surface reflection patterns",
        "Geometry reasoning: edge deviations measured against CAD tolerances",
        "Cavity analysis: internal porosity inferred from surface heat retention",
        "Agreement systems: multiple signal modalities must align for high-confidence decisions",
        "Signal validation: outlier detection before and after inference",
        "Traceable reasoning paths: full audit trail from image to defect classification"
      ]
    }
  ]
}