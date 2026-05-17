export const deploymentArchitectureContent = {
  id: "deployment-architecture",
  type: "deployment-architecture",
  title: "Deployment Architecture",
  subtitle: "Edge-native, on-premise deployment with offline capability and deterministic performance for industrial environments.",
  body: "Tvastr is deployed inside the plant network on dedicated hardware. All inference, reasoning, and persistence operates locally. The system requires no internet connectivity, provides deterministic latency, and scales from single inspection stations to plant-wide multi-gate deployments.",
  deploymentModels: [
    {
      name: "Single Station",
      description: "Self-contained inspection point with local GPU processing and SQL storage.",
      components: ["Workstation PC with GPU", "Industrial camera", "Local SQL database", "Tvastr RAS runtime"],
      useCase: "Pilot deployment, single quality gate, targeted inspection"
    },
    {
      name: "Multi-Gate",
      description: "Multiple inspection stations with centralized database and cross-gate intelligence.",
      components: ["Multiple edge workstations", "Centralized SQL server", "Network-attached image storage", "RAS + PI stack"],
      useCase: "Pattern, mold, knockout, fettling, and final inspection gates"
    },
    {
      name: "Plant-Wide",
      description: "Full deployment with process intelligence, analytics dashboards, and ERP integration.",
      components: ["Multi-station inspection network", "Central database server", "API server for PI dashboards", "ERP integration layer", "Backup and archival systems"],
      useCase: "Complete manufacturing intelligence infrastructure"
    }
  ],
  infrastructure: {
    database: {
      title: "SQL Integration",
      description: "Native SQL Server integration with connection pooling, automatic schema migration, and JSON fallback for offline operation."
    },
    api: {
      title: "API Architecture",
      description: "FastAPI REST server with 25 endpoints, WebSocket real-time updates, OpenAPI documentation, and license-based feature gating."
    },
    network: {
      title: "Network Requirements",
      description: "Gigabit Ethernet for multi-station deployments. Local network only — no internet required. Optional VPN for remote support."
    }
  },
  coreProperties: [
    "Edge-native: all processing inside the plant firewall",
    "Offline-capable: full functionality without internet",
    "Deterministic: sub-200ms inspection latency",
    "Industrial-grade: designed for 24/7 continuous operation",
    "Data sovereignty: no data leaves the facility",
    "API-first: standard integration protocols"
  ],
  keyMessage: "Industrial deployment architecture. Not cloud software adapted for factory use. All intelligence runs locally, deterministically, and offline."
}
