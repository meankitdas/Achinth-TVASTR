export const cognitionRuntimeContent = {
  id: "cognition-runtime",
  type: "cognition-runtime",
  title: "Inspection Runtime",
  subtitle: "Deterministic pipeline orchestration with health monitoring, telemetry, and edge-native execution.",
  body: "The Tvastr runtime orchestrates the full inspection pipeline — from image capture through signal extraction, reasoning, decision generation, and persistence. Every execution is deterministic, health-monitored, and produces structured telemetry for debugging, audit, and operational analysis.",
  runtimeComponents: [
    {
      name: "Pipeline Orchestration",
      description: "Sequential execution of 10 pipeline stages with dependency management, error handling, and graceful degradation. Each stage produces independently loggable outputs.",
      characteristics: [
        "Deterministic stage execution order",
        "Stage-level health monitoring",
        "Graceful degradation on component failure",
        "Sub-200ms total pipeline latency"
      ]
    },
    {
      name: "Health Monitoring",
      description: "Three-tier health status system that tracks pipeline component availability and signal quality in real time.",
      states: [
        { state: "OK", description: "All components operational. Full reasoning capability." },
        { state: "DEGRADED", description: "Partial component failure. Reduced confidence, flagged outputs." },
        { state: "FAILED", description: "Critical component unavailable. Pipeline halted, operator notified." }
      ]
    },
    {
      name: "Telemetry & Logging",
      description: "Structured JSONL logging for every pipeline execution — complete signal traces, decisions, and timing data for debugging and audit.",
      logs: [
        "Run logs: Full pipeline execution trace (monthly rotation)",
        "Signal traces: Detailed feature extraction data (daily rotation)",
        "Feedback logs: Operator corrections and overrides (permanent)"
      ]
    },
    {
      name: "API & Integration Layer",
      description: "FastAPI-based REST API with 25 endpoints for analytics, quality frameworks, process intelligence, and system management.",
      interfaces: [
        "REST API: Analytics, quality, process, SPC, and decision endpoints",
        "WebSocket: Real-time manufacturing updates and alerts",
        "SQL Integration: Direct database read/write with connection pooling",
        "ERP Export: Configurable CSV export for manufacturing systems"
      ]
    },
    {
      name: "Edge Execution",
      description: "All processing executes on local hardware inside the plant network. No cloud dependency. Full offline capability. Deterministic latency regardless of network conditions.",
      characteristics: [
        "GPU-accelerated inference on local hardware",
        "Offline-capable with JSON fallback storage",
        "No external API calls during inspection",
        "Automatic recovery on network restoration"
      ]
    }
  ],
  executionFlow: [
    "Request received (image + manufacturing context)",
    "Quality validation and pre-processing",
    "Object detection and patch generation",
    "Signal feature extraction",
    "Multi-signal classification and fusion",
    "Energy-based reasoning and stability check",
    "Decision generation (Accept / Review / Reject)",
    "Memory persistence and cluster matching",
    "Report generation and telemetry logging",
    "Response returned with full signal evidence"
  ],
  keyMessage: "The runtime is deterministic, health-monitored, and fully self-contained. Every inspection produces the same result given the same inputs — regardless of network, cloud, or external system availability."
}
