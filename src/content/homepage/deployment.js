export const deploymentContent = {
  id: "deployment",
  type: "deployment",
  title: "Deployment and Integration",
  subtitle: "On-premise deployment designed for industrial environments and existing factory infrastructure.",
  body: "Tvastr is built for real-world factory deployment. The platform operates on-premise with offline capability, integrates with existing SQL databases and ERP systems, and requires minimal infrastructure changes. Deployment is designed to fit within current production workflows with operator-friendly interfaces and practical integration options.",
  features: [
    {
      name: "On-Premise Deployment",
      description: "Full system deployment within your factory infrastructure with no cloud dependency. All data remains on-site for complete data sovereignty and security.",
      benefits: ["Complete data control", "No internet dependency", "Factory-floor compatible"]
    },
    {
      name: "Offline-Capable Operation",
      description: "System operates fully offline without requiring internet connectivity. All inspection, analysis, and reporting functions work independently of external networks.",
      benefits: ["Production continuity", "Network-independent", "Reliable operation"]
    },
    {
      name: "SQL Database Integration",
      description: "Direct integration with your existing SQL databases for storing inspection records, defect data, and traceability information. Standard SQL compatibility ensures seamless data access.",
      benefits: ["Existing database compatibility", "Structured data storage", "Query-ready records"]
    },
    {
      name: "ERP System Compatibility",
      description: "Export inspection data in CSV format for integration with manufacturing execution and ERP systems. Automated data transfer ensures production data flows to existing systems.",
      benefits: ["ERP integration", "Automated exports", "Data continuity"]
    },
    {
      name: "Standard Hardware Compatibility",
      description: "Runs on standard industrial PCs and workstations without requiring specialized hardware. Compatible with existing cameras and imaging equipment at inspection stations.",
      benefits: ["No specialized hardware", "Use existing equipment", "Cost-effective deployment"]
    },
    {
      name: "Operator-Friendly Interface",
      description: "Simple, intuitive interfaces designed for factory-floor use. Minimal training required for operators to capture images and review inspection results.",
      benefits: ["Easy adoption", "Minimal training", "Production-floor usability"]
    },
    {
      name: "Audit Trail and Compliance",
      description: "Complete audit trails for all inspections with structured logging, traceability records, and automated documentation for quality compliance.",
      benefits: ["Compliance-ready", "Complete traceability", "Audit documentation"]
    },
    {
      name: "Factory-Floor Compatible",
      description: "Designed for industrial environments with consideration for production workflows, shift operations, and factory-floor realities.",
      benefits: ["Production-ready", "Shift-compatible", "Industrial-grade reliability"]
    }
  ],
  deployment_models: [
    {
      name: "Single Station Deployment",
      description: "Deploy at one or more critical inspection stations for targeted quality improvement and validation."
    },
    {
      name: "Multi-Gate Deployment",
      description: "Deploy across multiple quality gates (pattern, core, mold, knockout, fettling, final) for comprehensive inspection coverage."
    },
    {
      name: "Plant-Wide Deployment",
      description: "Full plant deployment with centralized data management, cross-gate traceability, and plant-level quality analytics."
    }
  ],
  keyMessage: "Tvastr integrates with existing factory infrastructure, operates offline, and requires minimal changes to current production workflows."
}