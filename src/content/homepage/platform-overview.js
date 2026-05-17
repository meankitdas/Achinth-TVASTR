export const platformOverviewContent = {
  id: "platform-overview",
  type: "platform-overview",
  title: "The Tvastr Platform",
  subtitle: "Two integrated systems for inspection and process intelligence.",
  body: "Tvastr consists of two complementary systems: RAS for inspection and defect analysis, and PI for process intelligence and quality analytics. Together, they provide end-to-end visibility from individual casting inspection to plant-wide quality trends.",
  systems: [
    {
      id: "ras",
      name: "Tvastr RAS",
      tagline: "Inspection and Defect Analysis System",
      description: "AI-assisted defect detection system that analyzes casting images for porosity, shrinkage, cracks, sand inclusion, surface roughness, and blow holes. Provides consistent inspection logic, automated reporting, and complete traceability.",
      capabilities: [
        "AI-assisted defect detection and classification",
        "Multi-stage inspection pipeline with signal-based reasoning",
        "Automated PDF reports with annotated images and heatmaps",
        "SQL-based traceability linking to heats, molds, shifts, and operators",
        "Three-tier decision support (Accept, Manual Review, Reject)",
        "Root-cause identification and defect pattern tracking",
        "Batch inspection support for high-volume scenarios",
        "Offline-capable on-premise operation"
      ],
      route: "/systems/rejection-analysis-system"
    },
    {
      id: "pi",
      name: "Tvastr PI",
      tagline: "Process Intelligence and Analytics",
      description: "Process monitoring and quality analytics system that tracks defect patterns, analyzes trends across heats and batches, and provides insights for continuous quality improvement.",
      capabilities: [
        "Defect pattern tracking and correlation analysis",
        "Temporal trend analysis across production batches",
        "Heat-level quality intelligence and analysis",
        "Process drift detection and early warning",
        "SPC (Statistical Process Control) analytics",
        "Defect frequency and distribution analysis",
        "Quality metrics dashboards and visualization",
        "Decision intelligence for corrective actions"
      ],
      route: "/systems/plant-intelligence"
    }
  ],
  integration: "RAS and PI work together: RAS performs inspection and captures defect data, while PI analyzes patterns and trends across inspections for plant-wide quality visibility.",
  keyMessage: "Tvastr RAS standardizes inspection. Tvastr PI provides process intelligence. Together, they deliver complete quality visibility."
}