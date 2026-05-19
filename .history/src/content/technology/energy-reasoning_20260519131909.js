export const energyReasoningContent = {
  id: "energy-reasoning",
  type: "energy-reasoning",
  title: "Energy-Based Reasoning",
  subtitle:
    "Adaptive confidence evolution through signal force balancing and stability validation.",
  body: "Beyond static fusion, Tvastr applies an energy-based reasoning framework where multiple signal sources exert directional forces on the classification decision. The system iteratively evolves toward a stable decision state — and validates that stability before committing. If signals produce irreconcilable disagreement, the system flags instability rather than forcing a classification.",
  concepts: [
    {
      name: "Signal Forces",
      description:
        "Each signal source (topology, anomaly, SCRATA standards, neural classification) contributes an additive force that pushes the decision toward accept or reject.",
    },
    {
      name: "Confidence Evolution",
      description:
        "The decision score evolves iteratively as signal forces are applied. The system does not produce a static one-shot confidence — it reaches convergence through multi-step reasoning.",
    },
    {
      name: "Stability Validation",
      description:
        "Before committing a final decision, the system validates that the confidence has stabilized within tolerance bounds. Unstable states trigger rollback and human review.",
    },
    {
      name: "Disagreement Handling",
      description:
        "When signal forces push in opposing directions beyond stability thresholds, the system identifies the disagreement explicitly and routes to manual review with full signal evidence.",
    },
    {
      name: "Adaptive Thresholds",
      description:
        "Decision boundaries adapt based on signal quality and confidence evolution — higher-quality signals produce tighter convergence, while degraded inputs widen review bands. The system continuously recalibrates acceptance and rejection thresholds based on per-signal noise levels, sensor health status, and historical classification accuracy, ensuring that decision precision scales with the reliability of available evidence rather than applying fixed cutoffs regardless of input conditions.",
    },
  ],
  decisionTiers: [
    {
      tier: "Accept",
      threshold: "Score ≤ 0.30",
      description:
        "Strong convergence toward non-defective. Multiple signals aligned.",
    },
    {
      tier: "Review",
      threshold: "Score 0.30 – 0.70",
      description:
        "Insufficient convergence or signal disagreement. Requires human assessment.",
    },
    {
      tier: "Reject",
      threshold: "Score ≥ 0.70",
      description:
        "Strong convergence toward defective. Multiple signals aligned with high confidence.",
    },
  ],
  designPrinciple:
    "The system prefers uncertainty over false confidence. When signals disagree, the honest answer is 'review needed' — not a forced classification.",
  keyMessage:
    "Reasoning is not static inference. It is iterative signal convergence with explicit stability validation. Instability produces review flags — not incorrect decisions.",
};
