export const perceptionEngineContent = {
  id: "perception-engine",
  type: "perception-engine",
  title: "Perception Engine",
  subtitle: "Multi-stage signal capture and feature extraction. Vision is one component of a broader reasoning architecture.",
  body: "The perception engine processes casting images through quality validation, object detection, dense patch analysis, and signal extraction. It does not produce final decisions — it produces structured feature vectors that flow into the reasoning layer for explainable classification.",
  stages: [
    {
      name: "Quality Validation",
      description: "Pre-processing verification for image quality — blur detection, brightness range, contrast adequacy. Flags degradation without blocking production.",
      output: "Image quality score and degradation flags"
    },
    {
      name: "Object Localization",
      description: "YOLO-assisted detection for casting localization and defect region proposals. Serves as proposal generator — not final classifier.",
      output: "Bounding box proposals with confidence scores"
    },
    {
      name: "Dense Patch Analysis",
      description: "Sliding window analysis at 256x256 resolution with 50% overlap. Produces patch-level confidence across the full casting surface.",
      output: "36 patch confidence scores per casting image"
    },
    {
      name: "Signal Feature Extraction",
      description: "OpenCV-based extraction of 15-dimensional feature vectors from each patch — texture (LBP, GLCM), geometry (contours), edge (Canny), blob density, and intensity statistics.",
      output: "15-dimensional signal feature vector per patch"
    },
    {
      name: "Topology & Anomaly Scoring",
      description: "Spatial distribution analysis of defect proposals across casting zones. Identifies cluster density, spread patterns, and anomalous concentrations.",
      output: "Topology scores, cluster maps, and anomaly flags"
    }
  ],
  designPrinciple: "The perception engine extracts — it does not decide. Decisions are made by the reasoning layer, which has access to all signal evidence and can explain every classification.",
  keyMessage: "Vision detection is a signal source. Not the final authority. Multiple independent signals must converge before classification occurs."
}
