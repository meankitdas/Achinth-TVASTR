export const fishboneContent = {
  id: "fishbone",
  type: "fishbone",
  title: "Fishbone & Root Cause Analysis",
  subtitle: "Systematic root cause investigation using Ishikawa diagrams and FMEA.",
  body: "Root cause analysis tools connect defect patterns to manufacturing factors, enabling systematic investigation and corrective action. Fishbone diagrams and FMEA frameworks provide structured approaches to identifying and prioritizing quality issues.",
  fishboneDiagrams: {
    title: "Ishikawa Root Cause Diagrams",
    endpoint: "/quality/fishbone",
    description: "Visual root cause analysis tool correlating defects with manufacturing factors.",
    categories: [
      {
        name: "Materials",
        factors: ["Alloy composition", "Metal quality", "Impurity levels", "Feedstock variation"]
      },
      {
        name: "Methods",
        factors: ["Pouring technique", "Mold preparation", "Cooling rate", "Process parameters"]
      },
      {
        name: "Machines",
        factors: ["Furnace condition", "Mold condition", "Equipment calibration", "Tooling wear"]
      },
      {
        name: "Manpower",
        factors: ["Operator skill", "Shift variation", "Training gaps", "Inspection consistency"]
      },
      {
        name: "Measurements",
        factors: ["Temperature accuracy", "Time tracking", "Quality gate variance", "Inspection standards"]
      },
      {
        name: "Environment",
        factors: ["Ambient conditions", "Foundry temperature", "Humidity", "Contamination"]
      }
    ],
    process: [
      "Identify primary defect type (effect)",
      "Map defects to 6M categories",
      "Correlate with heat/mold/shift data",
      "Prioritize high-frequency factors",
      "Generate corrective action recommendations"
    ]
  },
  fmea: {
    title: "Failure Mode & Effects Analysis",
    endpoint: "/quality/fmea",
    description: "Systematic identification and prioritization of failure modes.",
    components: [
      {
        name: "Failure Mode",
        description: "How the process can fail (porosity, shrinkage, crack formation)"
      },
      {
        name: "Effect",
        description: "Impact of failure (rejection, rework, customer complaint)"
      },
      {
        name: "Severity",
        description: "Severity rating (1-10 scale)",
        scale: "10 = Critical safety/customer impact, 1 = Minor inconvenience"
      },
      {
        name: "Occurrence",
        description: "Frequency of failure (1-10 scale)",
        scale: "10 = Very high frequency, 1 = Unlikely"
      },
      {
        name: "Detection",
        description: "Likelihood of detecting failure before customer (1-10 scale)",
        scale: "10 = Almost certain not to detect, 1 = Almost certain to detect"
      },
      {
        name: "RPN",
        description: "Risk Priority Number",
        formula: "RPN = Severity × Occurrence × Detection",
        threshold: "RPN > 100 requires corrective action"
      }
    ]
  },
  rootCauseWorkflow: {
    title: "Root Cause Investigation Workflow",
    steps: [
      "Defect pattern identification (fingerprinting + clustering)",
      "Factor correlation (heat, mold, shift, operator, time)",
      "Fishbone diagram generation (6M mapping)",
      "FMEA risk scoring",
      "Pareto prioritization (80/20 focus)",
      "Corrective action recommendations"
    ]
  },
  applications: [
    "Recurring defect investigation",
    "Process optimization prioritization",
    "Equipment maintenance correlation",
    "Operator training needs identification",
    "Supplier quality tracking"
  ]
}