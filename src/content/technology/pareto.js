export const paretoContent = {
  id: "pareto",
  type: "pareto",
  title: "Pareto & Defect Prioritization",
  subtitle: "80/20 analysis for identifying high-impact defect types and process improvements.",
  body: "Pareto analysis applies the 80/20 principle to defect data, identifying the vital few defect types that account for the majority of quality issues. Combined with spatial concentration mapping, Pareto analysis guides targeted process improvement efforts.",
  paretoAnalysis: {
    title: "Pareto Chart Analysis",
    endpoint: "/analytics/pareto",
    description: "Ranked defect frequency analysis identifying high-impact defect types.",
    principle: "Typically, 20% of defect types account for 80% of total rejections.",
    outputs: [
      "Defect type ranking by frequency",
      "Cumulative percentage curve",
      "Critical few vs trivial many identification",
      "Historical trend comparison"
    ]
  },
  spatialConcentration: {
    title: "Spatial Defect Concentration",
    endpoint: "/analytics/spatial_map",
    description: "Heatmap visualization of defect density across casting zones.",
    features: [
      "Zone-level defect aggregation",
      "Normalized density scoring",
      "Hot zone identification",
      "Recurring pattern highlighting"
    ],
    applications: [
      "High-risk zone identification",
      "Mold design optimization",
      "Cooling pattern analysis",
      "Gate and riser placement evaluation"
    ]
  },
  prioritizationWorkflow: {
    title: "Defect Prioritization Workflow",
    steps: [
      {
        step: 1,
        name: "Data Aggregation",
        description: "Collect defect data across all inspections within time window"
      },
      {
        step: 2,
        name: "Frequency Ranking",
        description: "Rank defect types by occurrence count"
      },
      {
        step: 3,
        name: "Cumulative Analysis",
        description: "Calculate cumulative percentage contribution"
      },
      {
        step: 4,
        name: "Critical Identification",
        description: "Identify defect types contributing to 80% of issues"
      },
      {
        step: 5,
        name: "Root Cause Linking",
        description: "Link critical defects to fishbone analysis and FMEA"
      },
      {
        step: 6,
        name: "Action Planning",
        description: "Generate prioritized corrective action recommendations"
      }
    ]
  },
  integrations: [
    "FMEA risk scoring (prioritize high RPN defects)",
    "Fishbone root cause mapping (focus on vital few)",
    "SPC monitoring (track improvement over time)",
    "Spatial analysis (zone-level targeting)",
    "Cost of quality (quantify financial impact)"
  ],
  benefits: [
    "Focus improvement efforts on high-impact defects",
    "Quantify improvement potential",
    "Data-driven resource allocation",
    "Track effectiveness of corrective actions",
    "Communicate priorities to plant teams"
  ]
}