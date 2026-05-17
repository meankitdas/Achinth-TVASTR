export const industrialMemoryContent = {
  id: "industrial-memory",
  type: "industrial-memory",
  title: "Industrial Memory System",
  subtitle: "Persistent manufacturing intelligence that accumulates knowledge across inspections, heats, and production cycles.",
  body: "Tvastr does not treat inspections as isolated events. Every defect is fingerprinted, spatially vectorized, and stored in a persistent manufacturing record. Over time, the system builds intelligence about recurring patterns, mold degradation, heat-correlated defects, and process-linked quality behavior.",
  subsystems: [
    {
      name: "Defect Fingerprinting",
      description: "Every detected defect is converted into a 12-dimensional normalized vector capturing type, position, zone, surface, dimensions, severity, and spatial orientation. Vectors enable pattern matching across inspections.",
      process: [
        "Defect coordinates normalized to template space",
        "3-stage alignment cascade (contour → ORB → PCA fallback)",
        "12-field vector generation per defect",
        "Zone assignment with polygon-based mapping"
      ]
    },
    {
      name: "Spatial Clustering",
      description: "DBSCAN clustering groups defects by type and zone to identify recurring patterns. Clusters represent systematic quality issues tied to specific process conditions.",
      process: [
        "Group defects by type and zone",
        "Apply DBSCAN with Euclidean distance metric",
        "Calculate cluster centroids and variance",
        "Track cluster growth across production cycles"
      ]
    },
    {
      name: "Recurring Pattern Detection",
      description: "New defects are matched against existing clusters to identify known patterns. High-similarity matches link new observations to historical root causes.",
      process: [
        "Compute distance to all cluster centroids",
        "Filter by spatial region",
        "Match if distance below threshold",
        "Return cluster ID, similarity score, historical frequency"
      ]
    },
    {
      name: "Production Traceability",
      description: "Complete linkage from every inspection record to manufacturing context — heat number, mold ID, shift, operator, production date, and pipeline health status.",
      storage: [
        "AI_Inspections: Master records with decisions and context",
        "AI_Defects: Individual defect vectors with cluster linkage",
        "AI_Defect_Clusters: Pattern metadata and centroids"
      ]
    },
    {
      name: "Manufacturing Context Persistence",
      description: "Intelligence accumulates at the entity level — heats develop quality profiles, molds develop degradation histories, and shifts develop consistency patterns.",
      entities: [
        "Heat intelligence: defect history and risk scoring per heat",
        "Mold intelligence: wear patterns and degradation tracking",
        "Shift intelligence: consistency and variability analysis",
        "Zone intelligence: spatial risk profiles across casting areas"
      ]
    }
  ],
  keyMessage: "The system builds manufacturing memory. Every inspection enriches the record. Patterns that would take months to identify manually are surfaced through persistent spatial intelligence."
}
