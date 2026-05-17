export const spcContent = {
  id: "spc",
  type: "spc",
  title: "Statistical Process Control (SPC)",
  subtitle: "Real-time process stability monitoring with control charts and capability analysis.",
  body: "SPC monitoring provides real-time statistical tracking of manufacturing process stability. Control charts detect shifts, trends, and anomalies in defect rates, while process capability indices quantify manufacturing precision.",
  controlCharts: {
    title: "Control Chart Analysis",
    endpoint: "/spc/control_chart",
    description: "X̄ control chart implementation with rule-based anomaly detection.",
    features: [
      {
        name: "X̄ Control Chart",
        description: "Mean rejection rate tracking with upper and lower control limits (UCL/LCL).",
        calculation: "UCL = μ + 3σ, LCL = μ - 3σ"
      },
      {
        name: "CUSUM",
        description: "Cumulative Sum control chart for detecting small sustained shifts in process mean.",
        sensitivity: "More sensitive to gradual process drift than standard control charts"
      },
      {
        name: "Western Electric Rules",
        description: "Statistical process control rules for pattern detection.",
        rules: [
          "Rule 1: One point beyond 3σ",
          "Rule 2: Two of three consecutive points beyond 2σ",
          "Rule 3: Four of five consecutive points beyond 1σ",
          "Rule 4: Eight consecutive points on one side of center line"
        ]
      }
    ]
  },
  processCapability: {
    title: "Process Capability Analysis",
    endpoint: "/spc/process_capability",
    description: "Quantitative measurement of manufacturing process precision and consistency.",
    indices: [
      {
        name: "Cpk",
        fullName: "Process Capability Index",
        description: "Measures how well the process fits within specification limits, accounting for centering.",
        formula: "Cpk = min[(USL - μ) / 3σ, (μ - LSL) / 3σ]",
        interpretation: [
          "Cpk ≥ 1.33: Process capable",
          "1.00 ≤ Cpk < 1.33: Process acceptable but improvement needed",
          "Cpk < 1.00: Process not capable"
        ]
      },
      {
        name: "Ppk",
        fullName: "Process Performance Index",
        description: "Measures actual process performance over time, including both common and special cause variation.",
        formula: "Ppk = min[(USL - μ) / 3σ_total, (μ - LSL) / 3σ_total]",
        difference: "Uses total variation (σ_total) vs within-subgroup variation (σ) in Cpk"
      },
      {
        name: "Sigma Level",
        description: "Defects per million opportunities (DPMO) expressed as sigma level.",
        levels: [
          "6σ: 3.4 DPMO (world-class)",
          "5σ: 233 DPMO",
          "4σ: 6,210 DPMO",
          "3σ: 66,807 DPMO"
        ]
      }
    ]
  },
  applications: [
    "Real-time process stability monitoring",
    "Shift-to-shift consistency tracking",
    "Heat quality variation analysis",
    "Early detection of process drift",
    "Quantitative capability assessment"
  ]
}