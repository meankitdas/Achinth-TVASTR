export const deploymentArchitectureContent = {
  id: "deployment-architecture",
  type: "deployment-architecture",
  title: "Deployment Architecture",
  subtitle: "On-premise, edge-native deployment with offline capability and deterministic performance.",
  body: "Tvastr is designed for industrial edge deployment with complete offline capability. The system operates independently of cloud services, providing deterministic sub-200ms inspection latency in manufacturing environments.",
  coreProperties: [
    "Edge-native: Runs on-premise without cloud dependency",
    "Offline-capable: Full functionality without internet access",
    "Deterministic latency: <200ms per inspection",
    "Industrial-grade reliability: Designed for 24/7 operation"
  ],
  deploymentModels: [
    {
      name: "Single Station",
      description: "Self-contained inspection station with local storage.",
      components: [
        "Workstation PC (GPU-equipped)",
        "Industrial camera system",
        "Local SQL database",
        "Tvastr RAS runtime"
      ],
      useCase: "Single quality gate deployment, pilot programs"
    },
    {
      name: "Multi-Gate",
      description: "Multiple inspection stations with centralized data aggregation.",
      components: [
        "Multiple workstation PCs (edge nodes)",
        "Centralized SQL database server",
        "Network-attached storage for images",
        "Tvastr RAS + PI stack"
      ],
      useCase: "Pattern, core, mold condition, final inspection gates"
    },
    {
      name: "Plant-Wide",
      description: "Foundry-wide deployment with process intelligence and analytics.",
      components: [
        "Multiple inspection stations across gates",
        "Central database server (SQL Server)",
        "API server for PI dashboard",
        "ERP integration layer",
        "Backup and archival systems"
      ],
      useCase: "Complete foundry quality infrastructure with analytics"
    }
  ],
  databaseIntegration: {
    title: "SQL Database Integration",
    description: "Native SQL Server integration for structured data storage and query capability.",
    features: [
      "SQL Server 2019+ compatibility",
      "SQLAlchemy ORM for Python integration",
      "Connection pooling and retry logic",
      "Automatic schema migration",
      "JSON fallback for offline operation"
    ],
    tables: "3 primary tables (AI_Inspections, AI_Defects, AI_Defect_Clusters)"
  },
  apiArchitecture: {
    title: "REST API Architecture",
    description: "FastAPI-based REST API for plant intelligence and integration.",
    features: [
      "25 REST endpoints (analytics, quality, process, SPC, decision)",
      "WebSocket support for real-time updates",
      "OpenAPI/Swagger documentation",
      "CORS configuration for dashboard access",
      "License-based feature gating"
    ],
    access: "http://localhost:8000 (configurable port)"
  },
  hardwareRequirements: {
    title: "Hardware Requirements",
    minimum: [
      "CPU: Intel i5 (8th gen) or equivalent",
      "RAM: 16GB",
      "GPU: NVIDIA GTX 1650 (4GB VRAM) or better",
      "Storage: 256GB SSD",
      "OS: Windows 10/11, Ubuntu 20.04+"
    ],
    recommended: [
      "CPU: Intel i7 (10th gen) or equivalent",
      "RAM: 32GB",
      "GPU: NVIDIA RTX 3060 (12GB VRAM)",
      "Storage: 512GB NVMe SSD",
      "OS: Windows 11, Ubuntu 22.04"
    ]
  },
  networkRequirements: {
    title: "Network Requirements",
    description: "Minimal network requirements for multi-station deployments.",
    requirements: [
      "Gigabit Ethernet for multi-gate deployments",
      "Local network only (no internet required)",
      "Optional: VPN for remote support access",
      "SQL Server port (1433) for database access",
      "API port (8000) for PI dashboard access"
    ]
  },
  dataRetention: {
    title: "Data Retention & Archival",
    policies: [
      "Images: 90 days local, then archive to NAS/tape",
      "SQL records: Permanent (with backup)",
      "Run logs: 12 months",
      "Signal traces: 30 days",
      "Feedback logs: Permanent"
    ]
  }
}