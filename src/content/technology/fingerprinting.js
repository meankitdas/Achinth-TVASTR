export const fingerprintingContent = {
  id: "fingerprinting",
  type: "fingerprinting",
  title: "Defect Fingerprinting & Pattern Tracking",
  subtitle: "Spatial vectorization and clustering system for recurring defect pattern identification.",
  body: "The fingerprinting system converts defect detections into normalized spatial vectors, clusters them using DBSCAN, and tracks their recurrence across inspections. This enables root cause tracing, process diagnostics, and identification of systematic quality issues.",
  alignmentPipeline: {
    title: "3-Stage Alignment Cascade",
    description: "Transforms defect coordinates from inspection image space to normalized template space for consistent comparison.",
    methods: [
      {
        name: "Method 1: Contour Alignment",
        priority: "PRIMARY",
        description: "Geometry-based alignment using casting body contours.",
        process: [
          "Extract casting body contour from inspection image",
          "Load reference contour from template",
          "Compute affine transform (M) mapping inspection to template space",
          "Apply M to all defect bbox centers"
        ],
        advantages: ["Fast (50-100ms)", "Geometry-based (works on any casting)", "Robust to lighting variations"],
        performance: "~50-100ms"
      },
      {
        name: "Method 2: ORB Template Alignment",
        priority: "FALLBACK 1",
        description: "Feature-based alignment using ORB keypoints.",
        process: [
          "Extract ORB keypoints from inspection image",
          "Match against reference template keypoints",
          "Estimate homography (H) using RANSAC",
          "Requires ≥8 inliers"
        ],
        disadvantages: ["Fails on featureless castings", "Slower (~500ms)"],
        performance: "~500ms"
      },
      {
        name: "Method 3: PCA Fallback",
        priority: "FALLBACK 2",
        description: "Orientation-based alignment using Principal Component Analysis.",
        process: [
          "Compute PCA on defect bbox centers",
          "Align principal axis to vertical",
          "Apply rotation transform"
        ],
        limitations: "No spatial normalization (coordinates remain image-relative)",
        performance: "~10ms"
      }
    ]
  },
  vectorFormat: {
    title: "12-Field Normalized Vector (v4)",
    description: "Each defect is represented as a 12-dimensional vector in template space.",
    fields: [
      { name: "type", description: "Defect class (porosity, shrinkage, crack, etc.)" },
      { name: "x", description: "Normalized center x (template-space, 0-1)" },
      { name: "y", description: "Normalized center y (template-space, 0-1)" },
      { name: "zone", description: "Engineering zone (polygon-based assignment)" },
      { name: "secondary_zone", description: "Fallback zone if near boundary" },
      { name: "zone_confidence", description: "Confidence of zone assignment (0-1)" },
      { name: "surface", description: "top | bottom | unknown" },
      { name: "width", description: "Normalized width (0-1)" },
      { name: "height", description: "Normalized height (0-1)" },
      { name: "severity", description: "Confidence score (0-1)" },
      { name: "region", description: "Spatial label (top/bottom/left/right/center)" },
      { name: "orientation_angle", description: "PCA angle in degrees (0.0 for aligned)" }
    ],
    note: "Coordinates are crop-relative (normalized against casting body bbox), not full image."
  },
  clustering: {
    title: "DBSCAN Clustering",
    description: "Groups defects by type and zone to identify recurring patterns.",
    parameters: [
      "Epsilon: Distance threshold for cluster membership",
      "Min samples: Minimum defects required to form cluster",
      "Metric: Euclidean distance on normalized coordinates"
    ],
    process: [
      "Group all defects by defect_type + zone",
      "Apply DBSCAN within each group",
      "Filter noise clusters",
      "Calculate cluster centroid and variance"
    ],
    output: "Cluster ID, centroid coordinates, member count, average severity"
  },
  similarityMatching: {
    title: "Recurring Pattern Detection",
    description: "Identifies when new defects match previously observed patterns.",
    process: [
      "Compute Euclidean distance between new defect and all cluster centroids",
      "Filter by region (only compare within same spatial region)",
      "Match if distance < threshold",
      "Return cluster ID, similarity score, historical frequency"
    ],
    applications: [
      "Root cause tracing (defects recurring from same mold/heat)",
      "Process diagnostics (systematic defect patterns)",
      "Predictive quality (high-risk zones identification)"
    ]
  },
  storage: {
    title: "Storage Architecture",
    description: "SQL primary storage with JSON fallback.",
    tables: [
      "AI_Defect_Clusters: Cluster metadata and centroids",
      "AI_Defects: Individual defect vectors with cluster_id linkage"
    ],
    fallback: "JSON files in runtime/fingerprints/ if SQL unavailable"
  }
}