export const signalAnalysisContent = {
  id: "signal-analysis",
  type: "signal-analysis",
  title: "Signal Analysis System",
  subtitle: "PRIMARY classifier (45% weight) using OpenCV signal processing and physics-grounded thresholds.",
  body: "The signal analysis system is the primary defect classifier in Tvastr. Using pure OpenCV signal processing, it extracts 15-dimensional feature vectors from casting patches and applies hard threshold rules to classify defects. Signal-based classification provides explainable, physics-grounded decisions that complement deep learning approaches.",
  featureCategories: [
    {
      name: "Texture Features",
      weight: "25%",
      description: "Local Binary Patterns (LBP) and Gray Level Co-occurrence Matrix (GLCM) for surface texture analysis.",
      components: [
        "LBP uniformity (manual implementation, radius 1, 8 points)",
        "GLCM contrast, homogeneity, energy, correlation",
        "Quantized to 32 gray levels",
        "CLAHE preprocessing with Gaussian blur"
      ],
      interpretation: "High LBP std + high GLCM contrast + low homogeneity indicate irregular texture patterns typical of defects."
    },
    {
      name: "Geometry Features",
      weight: "25%",
      description: "Contour-based shape analysis for crack and moulding error detection.",
      components: [
        "Circularity (4π × area / perimeter²)",
        "Solidity (contour area / convex hull area)",
        "Aspect ratio (width / height)",
        "Extent (contour area / bounding box area)"
      ],
      interpretation: "Low circularity + elongated aspect ratio indicate linear defects like cracks."
    },
    {
      name: "Edge Features",
      weight: "20%",
      description: "Canny edge detection for boundary and crack identification.",
      components: [
        "Edge density (percentage of edge pixels)",
        "Edge mean intensity",
        "Canny algorithm with adaptive thresholding"
      ],
      interpretation: "High edge density indicates defect boundaries, cracks, or inclusions."
    },
    {
      name: "Blob Features",
      weight: "15%",
      description: "SimpleBlobDetector for porosity and inclusion analysis.",
      components: [
        "Blob count (number of detected blobs)",
        "Mean blob size",
        "Blob density within patch"
      ],
      interpretation: "High blob count indicates porosity or multiple small inclusions."
    },
    {
      name: "Intensity Features",
      weight: "15%",
      description: "Grayscale intensity statistics for dark cavity detection.",
      components: [
        "Mean intensity",
        "Standard deviation",
        "Intensity range"
      ],
      interpretation: "Low mean intensity + high std deviation indicate dark cavities or voids."
    }
  ],
  scoringFormula: {
    title: "Signal Scoring Formula",
    formula: "signal_score = 0.25×texture + 0.25×geometry + 0.20×edge + 0.15×blob + 0.15×intensity",
    description: "Weighted aggregation of five feature categories produces final signal score."
  },
  classificationRules: [
    {
      defectType: "Porosity",
      rule: "High circularity + low solidity + high blob count",
      signals: "Requires 2 strong + 1 supporting signal"
    },
    {
      defectType: "Shrinkage",
      rule: "High irregularity + low energy + high edge density",
      signals: "Requires 2 strong + 1 supporting signal"
    },
    {
      defectType: "Crack",
      rule: "Very high edge density + low circularity + elongated aspect ratio",
      signals: "Requires 2 strong + 1 supporting signal"
    },
    {
      defectType: "Sand Inclusion",
      rule: "High texture variation + moderate blob count + irregular shape",
      signals: "Requires 2 strong + 1 supporting signal"
    },
    {
      defectType: "Surface Roughness",
      rule: "High LBP variance + high dissimilarity + moderate edge density",
      signals: "Requires 2 strong + 1 supporting signal"
    },
    {
      defectType: "Blow Hole",
      rule: "Circular + dark intensity + isolated blob",
      signals: "Requires 2 strong + 1 supporting signal"
    }
  ],
  whySignalFirst: [
    "YOLO has ~15% error rate on subtle defects",
    "Signal features are physics-grounded and explainable",
    "Texture, edge, geometry capture material properties YOLO misses",
    "Hard threshold rules provide traceable decision paths"
  ]
}