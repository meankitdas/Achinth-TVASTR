export const processIntelligenceContent = {
  id: "process-intelligence",
  type: "process-intelligence",
  title: "Process Intelligence & Analytics",
  subtitle: "Plant-wide manufacturing intelligence through analytics, quality frameworks, and decision support.",
  body: "Tvastr PI (Plant Intelligence) provides comprehensive manufacturing analytics through REST API and real-time WebSocket updates. Available in TIER_3 license, PI aggregates inspection data into actionable insights for quality improvement and process optimization.",
  analyticsCapabilities: [
    {
      name: "Plant Overview Dashboard",
      endpoint: "/analytics/plant_overview",
      description: "Multi-metric dashboard with rejection rate, trend analysis, and active alerts."
    },
    {
      name: "Rejection Rate Analysis",
      endpoint: "/analytics/rejection_rate",
      description: "Rejection rate breakdown by shift, heat, and day with historical trending."
    },
    {
      name: "Pareto Analysis",
      endpoint: "/analytics/pareto",
      description: "80/20 defect concentration analysis identifying high-impact defect types."
    },
    {
      name: "Defect Trend Tracking",
      endpoint: "/analytics/defect_trends",
      description: "Time-series defect frequency with rolling average and anomaly detection."
    },
    {
      name: "Cluster Analysis",
      endpoint: "/analytics/cluster_analysis",
      description: "Fingerprint-based recurring defect pattern identification and frequency tracking."
    },
    {
      name: "Spatial Defect Maps",
      endpoint: "/analytics/spatial_map",
      description: "Heatmap visualization of defect concentration across casting zones."
    }
  ],
  qualityFrameworks: [
    {
      name: "FMEA",
      fullName: "Failure Mode & Effects Analysis",
      endpoint: "/quality/fmea",
      description: "Systematic failure mode identification with risk prioritization."
    },
    {
      name: "Fishbone Diagrams",
      fullName: "Ishikawa Root Cause Analysis",
      endpoint: "/quality/fishbone",
      description: "Root cause investigation with manufacturing factor correlation."
    },
    {
      name: "Quality Gate Compliance",
      endpoint: "/quality/quality_gates",
      description: "Multi-gate quality compliance tracking and bottleneck identification."
    },
    {
      name: "TPM",
      fullName: "Total Productive Maintenance",
      endpoint: "/quality/tpm",
      description: "Equipment effectiveness tracking and maintenance correlation."
    },
    {
      name: "Cost of Quality",
      endpoint: "/quality/cost_of_quality",
      description: "COPQ analysis (prevention, appraisal, internal failure, external failure costs)."
    }
  ],
  processIntelligence: [
    {
      name: "Risk Scoring",
      endpoint: "/process/risk_scores",
      description: "Entity-level risk scores for heats, molds, and shifts based on historical defect patterns.",
      entities: ["Heat", "Mold", "Shift"]
    },
    {
      name: "Heat-Specific Analysis",
      endpoint: "/process/heat_analysis",
      description: "Heat number intelligence with defect history, risk trends, and process correlation."
    },
    {
      name: "Mold Risk Scoring",
      endpoint: "/process/mold_risk",
      description: "Mold degradation risk based on defect recurrence and wear patterns."
    },
    {
      name: "Defect Flow Analysis",
      endpoint: "/process/defect_flow",
      description: "Sankey diagram data showing defect propagation across process stages."
    }
  ],
  architecture: {
    title: "System Architecture",
    components: [
      "50+ Python modules in core/plant_intelligence/",
      "25 REST API endpoints via FastAPI",
      "1 WebSocket endpoint for real-time updates",
      "Shared SQL database connection with RAS",
      "Next.js static dashboard (8 tabs, 48 files)"
    ],
    deployment: "Served via API server at http://localhost:8000/pi/"
  },
  realTimeUpdates: {
    title: "WebSocket Real-Time Updates",
    endpoint: "ws://localhost:8000/ws/plant_updates",
    frequency: "Polls every 30 seconds",
    eventTypes: [
      "kpi_update: Rejection rate snapshots",
      "alert: Manufacturing alerts (spikes, drift, anomalies)",
      "risk_update: Updated entity risk scores"
    ]
  }
}