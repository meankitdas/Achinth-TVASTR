// Technology page content

export const technologyHeroContent = {
  title: 'How Tvastr Works',
  subtitle: 'Signal-First Defect Detection & Process Intelligence',
  body: 'Tvastr uses a multi-sensor inspection pipeline combined with signal-based classification to identify casting defects and provide actionable process intelligence for continuous improvement.'
}

export const inspectionPipelineContent = {
  title: 'Inspection Pipeline',
  subtitle: 'Multi-Sensor Fusion for Comprehensive Defect Detection',
  body: 'Our inspection system combines multiple sensor modalities to capture comprehensive data about each casting.',
  sensors: [
    {
      name: 'Vision Camera',
      description: 'High-resolution RGB imaging for surface defect detection',
      specs: '5MP resolution, 60 FPS capture rate',
      outputs: 'Surface texture, color variations, visual defects'
    },
    {
      name: 'Thermal Camera',
      description: 'Infrared imaging for temperature analysis',
      specs: '320x240 thermal resolution, ±2°C accuracy',
      outputs: 'Heat distribution patterns, cooling anomalies'
    },
    {
      name: 'Eddy Current Sensor',
      description: 'Non-destructive testing for subsurface defects',
      specs: '10 kHz frequency, 2mm penetration depth',
      outputs: 'Conductivity variations, crack detection'
    },
    {
      name: 'Ultrasonic Sensor',
      description: 'Sound wave propagation for internal structure analysis',
      specs: '5 MHz frequency, 50mm range',
      outputs: 'Density variations, void detection'
    }
  ],
  pipeline: [
    'Sensor data acquisition (synchronized multi-modal capture)',
    'Pre-processing & normalization',
    'Feature extraction per sensor modality',
    'Signal fusion & correlation analysis',
    'Defect classification using signal thresholds',
    'Quality score computation',
    'Decision output (OK/Reject + defect type)'
  ]
}

export const signalAnalysisContent = {
  title: 'Signal-Based Classification',
  subtitle: 'Physics-Driven Defect Detection',
  body: 'Unlike pure ML approaches, Tvastr uses interpretable signal-based features combined with domain knowledge to classify defects reliably.',
  featureCategories: [
    {
      name: 'Surface Quality',
      weight: '30%',
      description: 'Visual and texture features from RGB camera',
      components: [
        'Surface roughness (Ra, Rz)',
        'Color uniformity score',
        'Edge sharpness',
        'Scratch/dent detection'
      ],
      interpretation: 'High roughness + color variation = surface defect'
    },
    {
      name: 'Thermal Signature',
      weight: '25%',
      description: 'Heat distribution patterns from thermal camera',
      components: [
        'Temperature gradient magnitude',
        'Hot spot density',
        'Cooling rate deviation',
        'Thermal symmetry index'
      ],
      interpretation: 'Irregular cooling = porosity or inclusion'
    },
    {
      name: 'Conductivity Profile',
      weight: '25%',
      description: 'Eddy current response analysis',
      components: [
        'Phase shift magnitude',
        'Impedance variation',
        'Lift-off compensation',
        'Crack signature score'
      ],
      interpretation: 'Phase anomalies = cracks or material discontinuity'
    },
    {
      name: 'Acoustic Response',
      weight: '20%',
      description: 'Ultrasonic wave propagation characteristics',
      components: [
        'Time-of-flight variance',
        'Echo amplitude',
        'Attenuation coefficient',
        'Reflection pattern'
      ],
      interpretation: 'Echo delays + low amplitude = internal voids'
    }
  ],
  scoringFormula: {
    title: 'Composite Quality Score',
    formula: 'Q = 0.30×Ssurf + 0.25×Stherm + 0.25×Seddy + 0.20×Ssonic',
    description: 'Each signal category contributes to a composite quality score (0-100). Parts scoring below threshold are rejected.'
  },
  classificationRules: [
    {
      defectType: 'Shrinkage Porosity',
      rule: 'IF thermal_gradient > threshold AND sonic_attenuation > threshold',
      signals: 'Thermal + Ultrasonic'
    },
    {
      defectType: 'Surface Cracks',
      rule: 'IF eddy_phase_shift > threshold AND surface_roughness > threshold',
      signals: 'Eddy Current + Vision'
    },
    {
      defectType: 'Inclusions',
      rule: 'IF eddy_impedance_var > threshold OR sonic_reflection_pattern != normal',
      signals: 'Eddy Current OR Ultrasonic'
    },
    {
      defectType: 'Cold Shut',
      rule: 'IF thermal_symmetry < threshold AND surface_edge_sharpness < threshold',
      signals: 'Thermal + Vision'
    }
  ],
  whySignalFirst: [
    'Explainable: Engineers can trace decisions back to physical measurements',
    'Generalizable: Works across different part geometries without retraining',
    'Robust: Not sensitive to lighting/environmental variations like pure vision ML',
    'Calibrated: Sensor thresholds can be tuned based on process capability studies',
    'Auditable: Meets ISO 9001 / IATF 16949 requirements for traceability'
  ]
}

export const fingerprintingContent = {
  title: 'Rejection Fingerprinting',
  subtitle: 'Mapping Defects to Root Causes',
  body: 'Each rejection creates a multi-dimensional fingerprint that encodes the defect characteristics and process context.',
  fingerprintDimensions: [
    {
      category: 'Defect Signature',
      features: [
        'Defect type (shrinkage, crack, inclusion, etc.)',
        'Severity score (0-100)',
        'Spatial location on part',
        'Signal contributions (which sensors triggered)'
      ]
    },
    {
      category: 'Process Context',
      features: [
        'Batch ID & timestamp',
        'Mold cavity number',
        'Pouring temperature',
        'Cycle time',
        'Ambient conditions'
      ]
    },
    {
      category: 'Material Metadata',
      features: [
        'Alloy composition',
        'Melt furnace ID',
        'Charge weight',
        'Modifier additions'
      ]
    }
  ],
  clusteringApproach: {
    title: 'Similarity-Based Clustering',
    description: 'Rejections with similar fingerprints are grouped to identify recurring patterns',
    algorithm: 'K-means clustering with cosine similarity',
    output: 'Clusters represent distinct failure modes with common root causes'
  },
  rootCauseMapping: [
    'Cluster 1: Porosity in top section → Likely cause: Insufficient riser volume',
    'Cluster 2: Cracks near gate → Likely cause: High thermal stress from rapid cooling',
    'Cluster 3: Inclusions randomly distributed → Likely cause: Slag entrainment during pour',
    'Cluster 4: Surface roughness on one cavity → Likely cause: Mold wear on specific tooling'
  ]
}

export const processIntelligenceContent = {
  title: 'Process Intelligence (PI)',
  subtitle: 'From Defect Data to Actionable Insights',
  body: 'Tvastr PI transforms rejection data into process improvement recommendations using advanced analytics.',
  analyticsCapabilities: [
    {
      name: 'Trend Analysis',
      endpoint: '/pi/trends',
      description: 'Time-series analysis of rejection rates, defect types, and process parameters to identify degrading trends'
    },
    {
      name: 'Correlation Engine',
      endpoint: '/pi/correlations',
      description: 'Statistical correlation between process inputs (temp, time, material) and output quality'
    },
    {
      name: 'Anomaly Detection',
      endpoint: '/pi/anomalies',
      description: 'Real-time detection of out-of-spec process conditions before they cause rejections'
    },
    {
      name: 'Predictive Alerts',
      endpoint: '/pi/predictions',
      description: 'ML-based forecasting of quality degradation based on historical patterns'
    }
  ],
  qualityFrameworks: [
    {
      name: 'SPC Charts',
      fullName: 'Statistical Process Control',
      description: 'X-bar, R-chart, p-chart for monitoring process stability and capability'
    },
    {
      name: 'Fishbone Diagrams',
      fullName: 'Cause-and-Effect Analysis',
      description: 'Interactive diagrams linking defects to potential root causes (4M: Man, Machine, Material, Method)'
    },
    {
      name: 'Pareto Analysis',
      fullName: '80-20 Defect Prioritization',
      description: 'Identify the 20% of defect types causing 80% of rejections for targeted improvement'
    }
  ],
  processIntelligence: [
    {
      name: 'Batch Analytics',
      description: 'Compare quality metrics across batches to identify best-performing process windows'
    },
    {
      name: 'Shift Comparison',
      description: 'Analyze rejection patterns by operator shift to identify training needs'
    },
    {
      name: 'Cavity Analysis',
      description: 'Track per-cavity performance to detect mold wear or design issues'
    },
    {
      name: 'Material Traceability',
      description: 'Link material lot numbers to quality outcomes for supplier scorecarding'
    }
  ],
  architecture: {
    title: 'Real-Time Intelligence Architecture',
    components: [
      'Supabase Realtime: Instant DB updates pushed to PI dashboard',
      'TimescaleDB: Optimized time-series queries for trend analysis',
      'React Query: Client-side caching & automatic refetch on data changes',
      'Recharts: Interactive visualizations (line charts, bar charts, heatmaps)'
    ],
    deployment: 'Deployed on edge servers for low-latency insights (< 100ms query response)'
  }
}

export const spcContent = {
  title: 'Statistical Process Control (SPC)',
  subtitle: 'Monitor Process Stability in Real-Time',
  body: 'SPC charts track process performance over time, detecting shifts before they cause significant scrap.',
  chartTypes: [
    {
      name: 'X-bar Chart (Average)',
      purpose: 'Monitor the central tendency of a process',
      usage: 'Track average quality score across inspection batches',
      controlLimits: 'UCL/LCL = Mean ± 3σ',
      interpretation: 'Points outside control limits indicate process shift'
    },
    {
      name: 'R Chart (Range)',
      purpose: 'Monitor process variation',
      usage: 'Track consistency of quality scores within batches',
      controlLimits: 'Based on average range (R̄) and D3/D4 constants',
      interpretation: 'Increasing range indicates loss of process control'
    },
    {
      name: 'p Chart (Proportion)',
      purpose: 'Monitor defect rate over time',
      usage: 'Track % rejections per shift or per day',
      controlLimits: 'p̄ ± 3√(p̄(1-p̄)/n)',
      interpretation: 'Upward trend signals quality degradation'
    }
  ],
  processCapabilityMetrics: [
    {
      metric: 'Cpk (Process Capability Index)',
      formula: 'Cpk = min[(USL - μ)/(3σ), (μ - LSL)/(3σ)]',
      interpretation: 'Cpk > 1.33 = capable process, < 1.0 = high scrap risk'
    },
    {
      metric: 'Defects Per Million (DPM)',
      formula: 'DPM = (Rejects / Total Inspected) × 1,000,000',
      interpretation: 'Industry benchmark: < 500 DPM for critical parts'
    }
  ],
  alertRules: [
    'Single point outside ±3σ → Immediate alert',
    'Two out of three points beyond ±2σ → Warning',
    'Seven consecutive points on one side of mean → Process shift detected',
    'Six points trending up or down → Investigate tool wear'
  ]
}

export const fishboneContent = {
  title: 'Fishbone (Ishikawa) Diagrams',
  subtitle: 'Root Cause Analysis for Defects',
  body: 'Fishbone diagrams organize potential root causes into categories, guiding systematic investigation.',
  categories: [
    {
      name: 'Man (Operator)',
      causes: [
        'Operator training level',
        'Shift fatigue',
        'Process adherence',
        'Inspection skill'
      ]
    },
    {
      name: 'Machine (Equipment)',
      causes: [
        'Furnace temperature control',
        'Mold preheating',
        'Cooling system performance',
        'Sensor calibration drift'
      ]
    },
    {
      name: 'Material (Input)',
      causes: [
        'Alloy composition variation',
        'Scrap contamination',
        'Modifier quality',
        'Moisture in sand molds'
      ]
    },
    {
      name: 'Method (Process)',
      causes: [
        'Pouring speed',
        'Gating design',
        'Riser sizing',
        'Cycle time consistency'
      ]
    },
    {
      name: 'Environment',
      causes: [
        'Ambient temperature',
        'Humidity affecting molds',
        'Floor vibration',
        'Dust contamination'
      ]
    }
  ],
  interactiveFeaturesInPI: [
    'Click a defect type to auto-populate relevant causes',
    'Add custom causes specific to your foundry',
    'Link causes to corrective actions tracked in CAPA module',
    'Export diagrams as PDF for management review'
  ]
}

export const paretoContent = {
  title: 'Pareto Analysis',
  subtitle: 'Prioritize Improvement Efforts (80-20 Rule)',
  body: 'Pareto charts identify the "vital few" defect types responsible for most rejections, focusing improvement resources.',
  exampleData: [
    { defectType: 'Shrinkage Porosity', count: 450, percentage: 45, cumulative: 45 },
    { defectType: 'Surface Cracks', count: 280, percentage: 28, cumulative: 73 },
    { defectType: 'Inclusions', count: 120, percentage: 12, cumulative: 85 },
    { defectType: 'Cold Shut', count: 80, percentage: 8, cumulative: 93 },
    { defectType: 'Misruns', count: 70, percentage: 7, cumulative: 100 }
  ],
  insights: {
    title: 'Key Insight from Example',
    finding: 'Top 2 defects (Porosity + Cracks) account for 73% of rejections',
    recommendation: 'Focus improvement projects on porosity prevention (riser design) and crack mitigation (cooling rate)'
  },
  dynamicFiltering: [
    'Filter by date range (last 7 days, month, quarter)',
    'Filter by batch, cavity, or material',
    'Drill down into specific defect subcategories',
    'Compare Pareto before/after process changes'
  ]
}

export const traceabilityContent = {
  title: 'Traceability & Reporting',
  subtitle: 'Complete Audit Trail from Melt to Shipment',
  body: 'Every casting is tracked through the entire production lifecycle with full traceability to raw materials and process conditions.',
  sqlStorage: {
    title: 'Relational Database Architecture',
    description: 'All inspection data, process parameters, and material metadata stored in Supabase PostgreSQL',
    tables: [
      {
        name: 'inspections',
        description: 'Core inspection results per part',
        keyFields: ['part_id', 'timestamp', 'quality_score', 'decision', 'defect_type', 'operator_id']
      },
      {
        name: 'batches',
        description: 'Production batch metadata',
        keyFields: ['batch_id', 'melt_id', 'pour_temp', 'cycle_time', 'mold_id']
      },
      {
        name: 'materials',
        description: 'Material traceability',
        keyFields: ['melt_id', 'alloy_composition', 'furnace_id', 'charge_weight', 'supplier_lot']
      },
      {
        name: 'rejections',
        description: 'Detailed rejection analysis',
        keyFields: ['rejection_id', 'fingerprint_vector', 'root_cause_category', 'corrective_action']
      }
    ]
  },
  pdfReports: {
    title: 'Automated PDF Reports',
    description: 'Daily/weekly/monthly reports auto-generated and emailed to stakeholders',
    components: [
      'Rejection rate trends (SPC charts)',
      'Top defects (Pareto)',
      'Process capability (Cpk)',
      'Material performance scorecard',
      'Action items from PI recommendations'
    ],
    format: 'ISO 9001 compliant format with QC manager signature block'
  },
  erpExport: {
    title: 'ERP Integration',
    description: 'Bidirectional sync with SAP/Oracle for production planning & quality records',
    format: 'CSV/XML export via scheduled jobs or REST API',
    fields: ['Part number', 'Serial number', 'Inspection timestamp', 'Pass/Fail', 'Defect code', 'Operator', 'Batch ID'],
    schedule: 'Hourly sync for real-time MES integration'
  },
  telemetry: {
    title: 'System Telemetry & Audit Logs',
    description: 'All user actions and system events logged for compliance',
    logs: [
      {
        name: 'Inspection Log',
        file: 'inspections.log',
        description: 'Timestamped record of every inspection decision',
        retention: '7 years (regulatory requirement)'
      },
      {
        name: 'Access Log',
        file: 'access.log',
        description: 'User login/logout, permission changes',
        retention: '2 years'
      },
      {
        name: 'System Health Log',
        file: 'health.log',
        description: 'Sensor status, network connectivity, DB performance',
        retention: '90 days'
      }
    ]
  },
  auditSupport: {
    title: 'Regulatory Compliance',
    description: 'Tvastr is designed to support ISO 9001, IATF 16949, and AS9100 quality audits',
    features: [
      'Complete inspection traceability (part → material → supplier)',
      'Calibration records for all sensors',
      'User access control with role-based permissions',
      'Electronic signatures for QC approvals',
      'CAPA (Corrective/Preventive Action) workflow integration',
      'Audit trail for all data changes (who, what, when)'
    ]
  }
}

export const deploymentArchitectureContent = {
  title: 'Deployment Architecture',
  subtitle: 'Scalable, Secure, Edge-Optimized',
  body: 'Tvastr deploys as a hybrid edge-cloud system for real-time inspection with centralized analytics.',
  deploymentOptions: [
    {
      name: 'Edge Inspection Station',
      description: 'On-premise hardware for real-time defect detection',
      components: [
        'Industrial PC (Intel i7, 16GB RAM, NVIDIA GPU)',
        'Multi-sensor array (vision, thermal, eddy current, ultrasonic)',
        'PLC interface for conveyor control',
        'Rejection mechanism (pneumatic gate)'
      ],
      latency: '< 200ms per part',
      connectivity: 'Ethernet to local server, optional 4G/5G for cloud sync'
    },
    {
      name: 'Local Server (Optional)',
      description: 'On-site data aggregation & PI dashboard',
      components: [
        'Supabase instance (PostgreSQL + Realtime)',
        'API server (Node.js/Express)',
        'Web dashboard (React SPA)',
        'Backup/redundancy (RAID storage)'
      ],
      capacity: 'Supports 10-50 inspection stations',
      backup: 'Daily encrypted backups to cloud storage'
    },
    {
      name: 'Cloud Analytics (Tvastr SaaS)',
      description: 'Centralized multi-plant analytics & ML model updates',
      components: [
        'Vercel hosting for PI dashboard',
        'Supabase cloud for cross-plant aggregation',
        'ML model training pipeline (GPU cluster)',
        'API gateway for ERP integration'
      ],
      scalability: 'Supports 1000s of inspection stations globally',
      security: 'SOC 2 Type II compliant, AES-256 encryption'
    }
  ],
  dataFlow: {
    title: 'Data Flow Architecture',
    steps: [
      'Edge station captures sensor data → Local inference (defect decision)',
      'Inspection result stored in local DB → Immediate process control',
      'Hourly sync to cloud → Aggregated analytics across all plants',
      'ML models retrained monthly → Pushed back to edge for improved accuracy'
    ]
  },
  securityFeatures: [
    'VPN tunnel for edge-to-cloud communication',
    'Role-based access control (RBAC) with MFA',
    'Data encryption at rest (AES-256) and in transit (TLS 1.3)',
    'API rate limiting & DDoS protection',
    'Regular penetration testing & security audits'
  ]
}

export const technologyCTAContent = {
  title: 'Ready to Transform Your Quality Process?',
  subtitle: 'Schedule a technical deep-dive with our engineering team.',
  buttons: [
    { label: 'Request Demo', href: '#contact', variant: 'primary' },
    { label: 'Download Technical Whitepaper', href: '/docs/tvastr-technical-whitepaper.pdf', variant: 'secondary' }
  ]
}