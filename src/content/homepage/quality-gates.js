export const qualityGatesContent = {
  id: "quality-gates",
  type: "quality-gates",
  title: "Inspection and Traceability Across Quality Gates",
  subtitle: "Defect detection and traceability from pattern to final inspection.",
  body: "Quality control spans multiple inspection points across the production sequence. Defects originate at different stages: pattern preparation, core placement, mold condition, knockout, fettling, and final inspection. Tvastr provides consistent defect detection and centralized traceability across these gates, linking inspection outcomes to heats, molds, shifts, and operators for complete visibility.",
  gates: [
    {
      name: "Pattern Inspection",
      description: "Initial mold and pattern verification before casting begins.",
      signals: ["Dimensional deviation", "Surface finish consistency", "Core alignment accuracy"]
    },
    {
      name: "Core Inspection",
      description: "Core integrity and placement assessment before pouring.",
      signals: ["Core shift detection", "Vent blockage", "Core strength variation"]
    },
    {
      name: "Mold Inspection",
      description: "Mold condition monitoring and wear tracking during production cycles.",
      signals: ["Coating condition", "Surface defects", "Crack detection"]
    },
    {
      name: "Knockout Inspection",
      description: "Casting evaluation at ejection to identify early-stage defects.",
      signals: ["Ejection stress cracks", "Incomplete fill", "Surface contamination"]
    },
    {
      name: "Fettling Inspection",
      description: "Post-gating inspection for surface quality and exposed internal defects.",
      signals: ["Grind line consistency", "Internal porosity exposure", "Surface roughness"]
    },
    {
      name: "Final Inspection",
      description: "Final pass/fail decision with traceability to prior gate inspection data.",
      signals: ["Overall defect assessment", "Rejection decision", "Root-cause identification"]
    },
    {
      name: "Built-In Quality (BIQ)",
      description: "Process monitoring and defect tracking across production batches.",
      signals: ["Defect rate tracking", "Process drift detection", "Recurring pattern identification"]
    }
  ],
  keyMessage: "Tvastr provides consistent inspection logic and centralized traceability across quality gates, linking defect outcomes to production context for complete visibility."
}
