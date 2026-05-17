export const processIntelligenceContent = {
  id: "process-intelligence",
  type: "process-intelligence",
  title: "Process Intelligence",
  subtitle: "Manufacturing analytics that transform inspection data into operational insights, early warnings, and continuous improvement intelligence.",
  body: "Tvastr PI aggregates individual inspection decisions into plant-wide manufacturing intelligence. SPC monitoring detects process drift. Pareto analysis prioritizes defect types. Root cause analysis connects patterns to process parameters. Risk scoring identifies high-risk heats and molds before they produce scrap.",
  capabilities: [
    {
      name: "Statistical Process Control",
      description: "Real-time control charts with Western Electric rules for process stability monitoring and drift detection.",
      features: [
        "X-bar control charts with UCL/LCL tracking",
        "CUSUM charts for detecting gradual shifts",
        "Western Electric pattern detection rules",
        "Process capability indices (Cpk, Ppk)",
        "Sigma level calculation and trending"
      ]
    },
    {
      name: "Pareto & Defect Prioritization",
      description: "80/20 analysis identifying the vital few defect types responsible for the majority of quality issues.",
      features: [
        "Defect frequency ranking and cumulative analysis",
        "Critical vs trivial identification",
        "Historical trend comparison",
        "Spatial defect concentration mapping"
      ]
    },
    {
      name: "Root Cause Analysis",
      description: "Ishikawa framework connecting defect patterns to manufacturing factors across 6M categories.",
      features: [
        "Fishbone diagram generation (Materials, Methods, Machines, Manpower, Measurements, Environment)",
        "Factor correlation with heat/mold/shift data",
        "FMEA risk scoring (Severity × Occurrence × Detection)",
        "Corrective action recommendations"
      ]
    },
    {
      name: "Risk Scoring",
      description: "Entity-level risk assessment for heats, molds, and shifts based on historical defect patterns and process behavior.",
      features: [
        "Heat risk scoring from defect history",
        "Mold degradation risk from wear patterns",
        "Shift consistency analysis",
        "Process parameter correlation"
      ]
    },
    {
      name: "Real-Time Alerting",
      description: "WebSocket-based manufacturing alerts for process drift, rejection spikes, and risk threshold breaches.",
      features: [
        "KPI snapshots every 30 seconds",
        "Rejection rate spike alerts",
        "Process drift notifications",
        "Risk score threshold warnings"
      ]
    }
  ],
  architecture: {
    modules: "50+ Python modules in core/plant_intelligence/",
    endpoints: "25 REST API endpoints via FastAPI",
    realtime: "WebSocket endpoint for live manufacturing updates",
    dashboard: "Multi-tab analytics interface with 8 views"
  },
  keyMessage: "Process intelligence transforms individual inspection decisions into plant-level operational insights. From single-casting analysis to production-wide trend intelligence."
}
