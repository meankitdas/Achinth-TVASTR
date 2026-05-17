export const traceabilityContent = {
  id: "traceability",
  type: "traceability",
  title: "Traceability & Reporting",
  subtitle: "Comprehensive inspection record management with SQL storage, PDF reports, and ERP integration.",
  body: "Traceability infrastructure provides complete inspection record persistence, linking defect data to heat numbers, mold IDs, shifts, and production dates. Automated reporting and ERP export enable seamless integration with existing manufacturing systems.",
  sqlStorage: {
    title: "SQL Database Architecture",
    description: "Structured storage of all inspection records with relational linkage to manufacturing context.",
    tables: [
      {
        name: "AI_Inspections",
        description: "Master inspection records",
        keyFields: [
          "inspection_id (primary key)",
          "heat_number",
          "mold_id",
          "shift",
          "operator",
          "production_date",
          "final_decision (ACCEPT/REVIEW/REJECT)",
          "confidence_score",
          "pipeline_health"
        ]
      },
      {
        name: "AI_Defects",
        description: "Individual defect records with spatial data",
        keyFields: [
          "defect_id (primary key)",
          "inspection_id (foreign key)",
          "defect_type",
          "confidence",
          "bbox coordinates",
          "zone",
          "signal_score",
          "cluster_id (fingerprint linkage)"
        ]
      },
      {
        name: "AI_Defect_Clusters",
        description: "Recurring defect pattern clusters",
        keyFields: [
          "cluster_id (primary key)",
          "defect_type",
          "zone",
          "centroid coordinates",
          "member_count",
          "average_severity",
          "first_seen",
          "last_seen"
        ]
      }
    ]
  },
  pdfReports: {
    title: "Automated PDF Reports",
    description: "Comprehensive inspection reports with annotated images, heatmaps, and defect tables.",
    components: [
      "Annotated image with bounding boxes and labels",
      "Defect heatmap overlay",
      "Defect summary table (type, count, confidence)",
      "Decision summary (Accept/Review/Reject)",
      "Manufacturing context (heat, mold, shift, date)",
      "Pipeline health status",
      "Signal analysis summary",
      "Operator signature field"
    ],
    format: "PDF/A (archival-quality, ISO 19005-1 compliant)"
  },
  erpExport: {
    title: "ERP Integration",
    description: "Automated export of inspection results for ERP system integration.",
    format: "CSV export with configurable field mapping",
    fields: [
      "Heat number",
      "Mold ID",
      "Inspection timestamp",
      "Decision (Accept/Review/Reject)",
      "Defect count by type",
      "Confidence score",
      "Inspector ID"
    ],
    schedule: "Configurable (real-time, hourly, daily batch)"
  },
  telemetry: {
    title: "Telemetry & Logging",
    description: "Comprehensive run logging for debugging, audit, and feedback tracking.",
    logs: [
      {
        name: "Run Logs",
        file: "runtime/logs/runs_YYYYMM.jsonl",
        description: "Complete pipeline execution trace (JSONL format, monthly rotation)",
        retention: "12 months"
      },
      {
        name: "Signal Traces",
        file: "runtime/logs/signal_traces_YYYYMMDD.jsonl",
        description: "Detailed signal feature extraction logs (daily rotation)",
        retention: "30 days"
      },
      {
        name: "Feedback Logs",
        file: "runtime/logs/feedback_YYYYMM.jsonl",
        description: "Operator corrections and feedback (monthly rotation)",
        retention: "Permanent (used for retraining)"
      }
    ]
  },
  auditSupport: {
    title: "Audit Trail Support",
    description: "Complete traceability for quality audits and regulatory compliance.",
    features: [
      "Immutable inspection records",
      "Timestamp validation",
      "Operator attribution",
      "Decision change tracking",
      "Feedback history",
      "System version tagging"
    ]
  }
}