export const workflowIntegrationContent = {
  id: "workflow-integration",
  type: "workflow-integration",
  title: "Integration with Existing Factory Workflows",
  subtitle: "Tvastr fits into your current inspection stations and production workflows with minimal disruption.",
  body: "Industrial software must work within existing factory operations. Tvastr integrates at inspection stations across quality gates, operates on standard hardware, and exports data to your existing SQL databases and ERP systems. The platform is designed for operator usability and production-floor compatibility.",
  integrations: [
    {
      name: "Inspection Station Integration",
      description: "Deploy at existing inspection stations across pattern, core, mold, knockout, fettling, and final quality gates.",
      details: ["On-premise deployment", "Standard hardware compatibility", "Offline-capable operation"]
    },
    {
      name: "Operator Workflow",
      description: "Operators capture images at inspection points, receive AI-assisted defect analysis, and make final pass/fail decisions.",
      details: ["Simple capture workflow", "Immediate defect analysis", "Operator override capability"]
    },
    {
      name: "Inspection Reporting",
      description: "Automated PDF reports with annotated images, defect heatmaps, and root-cause analysis for quality documentation.",
      details: ["PDF generation", "Annotated images", "Defect visualization"]
    },
    {
      name: "SQL Database Storage",
      description: "All inspection records, defect data, and traceability information stored in SQL databases for centralized access.",
      details: ["SQL integration", "Structured storage", "Query-ready data"]
    },
    {
      name: "Batch Inspection Support",
      description: "Process multiple castings in batch mode for high-volume inspection scenarios with centralized results.",
      details: ["Batch processing", "Multiple casting analysis", "Consolidated reporting"]
    },
    {
      name: "ERP Export Compatibility",
      description: "Export inspection data to ERP systems in CSV format for integration with existing manufacturing execution systems.",
      details: ["CSV export", "ERP-compatible format", "Automated data transfer"]
    },
    {
      name: "Traceability Flow",
      description: "Link inspections to heat numbers, mold IDs, shifts, operators, and production dates for complete audit trails.",
      details: ["Heat-level traceability", "Mold tracking", "Shift and operator linkage"]
    }
  ],
  keyMessage: "Tvastr integrates with your existing workflows, databases, and ERP systems without requiring infrastructure replacement."
}