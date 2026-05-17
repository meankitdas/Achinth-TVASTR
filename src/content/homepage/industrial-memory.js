export const industrialMemoryContent = {
  id: "industrial-memory",
  type: "industrial-memory",
  title: "Industrial Memory. The Plant That Learns.",
  subtitle: "Every inspection, every defect, every heat — stored, linked, and available for reasoning across production cycles.",
  body: "Traditional inspection systems produce reports. Tvastr builds persistent manufacturing memory. Defects are fingerprinted into spatial vectors, clustered by pattern similarity, and linked to heats, molds, and process parameters. Over time, the system accumulates intelligence about which process conditions produce which defect patterns — enabling proactive intervention rather than reactive correction.",
  memoryCapabilities: [
    {
      name: "Defect Fingerprinting",
      description: "Every defect is converted into a normalized spatial vector for pattern matching across inspections."
    },
    {
      name: "Recurring Pattern Detection",
      description: "DBSCAN clustering identifies recurring defects tied to specific molds, zones, or process conditions."
    },
    {
      name: "Heat-Level Intelligence",
      description: "Full defect history linked to heat numbers enables batch-level quality analysis and risk scoring."
    },
    {
      name: "Mold Degradation Tracking",
      description: "Defect frequency and spatial patterns tracked per mold to identify wear and maintenance needs."
    },
    {
      name: "Complete Traceability",
      description: "Every inspection record linked to heat, mold, shift, operator, and production date in SQL storage."
    },
    {
      name: "Historical Reasoning",
      description: "New defects are matched against historical clusters to identify known patterns and likely root causes."
    }
  ],
  keyMessage: "The plant does not forget. Every casting enriches the manufacturing record. Patterns that would take months to identify manually are surfaced automatically."
}
