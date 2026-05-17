export const deploymentContent = {
  id: "deployment",
  type: "deployment",
  title: "Edge-Native. On-Premise. Offline-Capable.",
  subtitle: "Deployed inside your plant network. No cloud dependency. Deterministic performance.",
  body: "Tvastr is built for industrial edge deployment. All processing — from image analysis to signal reasoning — runs on dedicated hardware inside the plant. No data leaves the facility. The system operates fully offline, provides deterministic sub-200ms latency, and integrates with existing SQL databases and ERP workflows.",
  principles: [
    {
      name: "On-Premise Operation",
      description: "All hardware and processing within the plant firewall. Complete data sovereignty."
    },
    {
      name: "Offline-Capable",
      description: "Full functionality without internet. No SaaS dependency. Survives network outages."
    },
    {
      name: "Deterministic Latency",
      description: "Inspection decisions in under 200ms. Critical for production-speed operation."
    },
    {
      name: "Multi-Station Architecture",
      description: "Scale from single inspection station to multi-gate plant-wide deployment."
    },
    {
      name: "SQL & ERP Integration",
      description: "Direct integration with existing databases and ERP systems. Standard protocols."
    },
    {
      name: "API-First Design",
      description: "REST API and WebSocket interfaces for integration with existing manufacturing systems."
    }
  ],
  deploymentModels: [
    {
      name: "Single Station",
      description: "One inspection point with local storage. Pilot deployment or targeted quality gate."
    },
    {
      name: "Multi-Gate",
      description: "Multiple inspection stations with centralized database. Cross-gate intelligence."
    },
    {
      name: "Plant-Wide",
      description: "Full deployment with process intelligence, analytics dashboards, and ERP integration."
    }
  ],
  keyMessage: "Industrial deployment. Not cloud software adapted for factories."
}
