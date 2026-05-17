export const platformOverviewContent = {
  id: "platform-overview",
  type: "platform-overview",
  title: "The Tvastr Platform",
  subtitle: "Inspection intelligence and process analytics in a unified manufacturing system.",
  body: "Tvastr operates as two integrated systems: RAS handles perception and defect analysis at inspection stations, while PI provides plant-wide process intelligence and manufacturing analytics. Together, they connect individual inspection decisions to production-level trends and traceability.",
  systems: [
    {
      id: "ras",
      name: "Tvastr RAS",
      tagline: "Rejection Analysis System",
      description: "Signal-first inspection intelligence with multi-stage reasoning, automated reporting, and complete traceability.",
      capabilities: [
        "Multi-signal defect detection and classification",
        "10-stage inspection pipeline with explainable reasoning",
        "Automated PDF reports with annotated images",
        "Three-tier decisions: Accept, Review, Reject",
        "Defect fingerprinting and pattern tracking",
        "Batch inspection for high-volume workflows",
        "Edge-native, offline-capable operation"
      ],
      route: "/systems/rejection-analysis-system"
    },
    {
      id: "pi",
      name: "Tvastr PI",
      tagline: "Plant Intelligence",
      description: "Manufacturing analytics and process intelligence that transforms inspection data into operational insights and early warnings.",
      capabilities: [
        "SPC monitoring with Western Electric rules",
        "Pareto analysis and defect prioritization",
        "Root cause analysis with Fishbone diagrams",
        "Heat and mold risk scoring",
        "Process drift detection and alerting",
        "Defect trend intelligence across production",
        "Real-time manufacturing KPI dashboards"
      ],
      route: "/systems/plant-intelligence"
    }
  ],
  integration: "RAS captures and classifies. PI reasons and analyzes. Industrial memory persists and connects. The architecture scales from single-station deployment to plant-wide intelligence.",
  keyMessage: "One system for inspection. One system for process intelligence. Unified traceability and manufacturing memory underneath."
}
