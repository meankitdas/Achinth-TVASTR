export const platform = {
  layers: [
    {
      id: "perception-layer",
      name: "Perception Layer",
      description: "Raw sensor and signal ingestion from inspection, SCADA, and ERP systems."
    },
    {
      id: "signal-layer",
      name: "Signal Layer",
      description: "Normalization, alignment, and contextual enrichment of heterogeneous data streams."
    },
    {
      id: "fusion-layer",
      name: "Fusion Layer",
      description: "Multi-modal correlation of defect, process, and production signals."
    },
    {
      id: "reasoning-layer",
      name: "Reasoning Layer",
      description: "Explainable, physics-aware inference using rule-based and learned models."
    },
    {
      id: "memory-layer",
      name: "Memory Layer",
      description: "Persistent storage of decision trails, defect patterns, and plant behavior."
    },
    {
      id: "process-intelligence-layer",
      name: "Process Intelligence Layer",
      description: "Drift detection, SPC, FMEA, and cost-of-quality analytics."
    },
    {
      id: "plant-intelligence-layer",
      name: "Plant Intelligence Layer",
      description: "Enterprise-wide orchestration, decision support, and autonomous feedback loops."
    }
  ],
  modules: [
    {
      id: "ras",
      name: "Tvastr RAS",
      description: "Industrial inspection and defect cognition engine.",
      capabilities: ["signal-first-reasoning", "defect-fingerprinting", "explainable-inference"],
      variants: ["manufacturing", "foundry", "enterprise"]
    },
    {
      id: "pi",
      name: "Tvastr PI",
      description: "Process and plant intelligence layer.",
      capabilities: ["temporal-process-intelligence", "spc-analytics", "decision-intelligence"],
      variants: ["enterprise", "manufacturing"]
    }
  ],
  capabilities: [
    {
      id: "signal-first-reasoning",
      name: "Signal-First Reasoning",
      category: "Reasoning",
      description: "Raw sensor signals as primary input, not images alone.",
      icon: "signal-first"
    },
    {
      id: "explainable-inference",
      name: "Explainable Industrial AI",
      category: "Reasoning",
      description: "Decision pathways traced to texture, geometry, and thermal data.",
      icon: "explainable"
    },
    {
      id: "persistent-memory",
      name: "Persistent Manufacturing Memory",
      category: "Architecture",
      description: "Every decision contributes to the evolving plant model.",
      icon: "memory"
    },
    {
      id: "multi-signal-fusion",
      name: "Multi-Signal Fusion",
      category: "Architecture",
      description: "Convergence of inspection, ERP, and process data into unified context.",
      icon: "connection"
    },
    {
      id: "temporal-process-intelligence",
      name: "Temporal Process Intelligence",
      category: "Intelligence",
      description: "Longitudinal analysis of defect patterns across heat numbers and shifts.",
      icon: "trending"
    },
    {
      id: "spc-analytics",
      name: "SPC Analytics",
      category: "Intelligence",
      description: "Statistical process control charts for rejection rates and defect severity.",
      icon: "ruler"
    },
    {
      id: "decision-intelligence",
      name: "Decision Intelligence",
      category: "Intelligence",
      description: "Ranked corrective actions based on cost impact and defect frequency.",
      icon: "target"
    },
    {
      id: "edge-native-runtime",
      name: "Edge-Native Cognition Runtime",
      category: "Architecture",
      description: "All inference runs on-prem, with deterministic latency and zero cloud dependency.",
      icon: "fire"
    }
  ],
  industries: [
    {
      id: "foundry",
      name: "Foundry",
      description: "Metal casting, molding, and heat treatment environments.",
      useCases: ["casting defect detection", "heat tracing", "fettling inspection"],
      variants: ["foundry", "manufacturing"]
    },
    {
      id: "machining",
      name: "Machining",
      description: "Precision CNC and automated milling operations.",
      useCases: ["surface finish analysis", "tool wear monitoring", "dimensional deviation detection"],
      variants: ["manufacturing"]
    },
    {
      id: "aerospace",
      name: "Aerospace",
      description: "High-integrity component manufacturing for aviation and space systems.",
      useCases: ["crack detection in turbine blades", "porosity analysis in castings", "non-destructive testing integration"],
      variants: ["manufacturing"]
    }
  ]
}