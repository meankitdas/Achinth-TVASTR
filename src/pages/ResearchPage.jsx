import { useDocumentHead } from '../hooks/useDocumentHead'

export function ResearchPage() {
  useDocumentHead(
    'Research | Tvastr Industrial Intelligence',
    'Explore Tvastr\'s research in signal-based defect classification, explainable AI, and industrial process intelligence.',
    'https://tvastr.co/research'
  )

  const researchAreas = [
    {
      title: 'Signal-Based Defect Classification',
      description: 'Combining multi-sensor fusion with physics-driven feature extraction for reliable defect detection',
      topics: [
        'Multi-modal sensor fusion (vision, thermal, eddy current, ultrasonic)',
        'Interpretable feature engineering for manufacturing signals',
        'Hard threshold classification vs black-box ML',
        'Signal correlation analysis for root cause attribution'
      ]
    },
    {
      title: 'Explainable AI for Manufacturing',
      description: 'Making AI decisions transparent and auditable for quality engineers',
      topics: [
        'Feature importance visualization for defect classification',
        'Decision tree explanations for rejection reasoning',
        'Counterfactual analysis ("what-if" scenarios)',
        'Compliance with ISO 9001 and IATF 16949 traceability'
      ]
    },
    {
      title: 'Process Intelligence & Analytics',
      description: 'Transforming inspection data into actionable process improvement insights',
      topics: [
        'Statistical Process Control (SPC) for real-time monitoring',
        'Pareto analysis for defect prioritization',
        'Fishbone (Ishikawa) diagrams for root cause investigation',
        'Predictive quality modeling using historical trends'
      ]
    },
    {
      title: 'Edge AI Deployment',
      description: 'Optimizing AI inference for real-time industrial environments',
      topics: [
        'Model quantization and pruning for edge hardware',
        'Sub-200ms inference latency on industrial PCs',
        'Hybrid edge-cloud architecture for scalability',
        'Offline-capable inspection with cloud sync'
      ]
    }
  ]

  const publications = [
    {
      title: 'Signal-First Defect Detection in Foundry Casting',
      authors: 'Achintharya, et al.',
      venue: 'Internal Technical Report',
      year: '2026',
      abstract: 'We present a signal-based approach to casting defect detection that combines vision, thermal, and electromagnetic sensors with physics-driven classification rules. Unlike pure ML approaches, our system achieves 95%+ accuracy while maintaining full explainability.',
      topics: ['Casting', 'Multi-Sensor Fusion', 'Explainable AI']
    },
    {
      title: 'Energy-Topology Optimization with Lyapunov Stability for Defect Classification',
      authors: 'Achintharya',
      venue: 'Internal Technical Report',
      year: '2026',
      abstract: 'We present a physics-inspired classification system that models defect detection as an energy minimization problem using Lyapunov stability functions. The system combines topology reasoning (spatial defect coherence) with energy-based force application to achieve guaranteed convergence and 35% higher accuracy than threshold-based approaches.',
      topics: ['Energy Optimization', 'Lyapunov Stability', 'Topology Reasoning', 'Physics-Informed AI']
    }
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0b' }}>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-amber-forge text-xs tracking-[0.2em] uppercase font-semibold">
              Research & Innovation
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-metallic-50">
              Advancing Industrial AI Through Research
            </h1>
            
            <p className="text-xl md:text-2xl text-metallic-300 font-light">
              Exploring signal-based defect detection, explainable AI, and process intelligence 
              to transform manufacturing quality control.
            </p>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-metallic-50 mb-6">
              Research Areas
            </h2>
            <p className="text-lg text-metallic-300">
              Our research focuses on making AI practical, explainable, and deployment-ready for industrial environments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {researchAreas.map((area, idx) => (
              <div 
                key={idx}
                className="border border-metallic-800 bg-metallic-950/30 p-8 rounded-lg"
              >
                <h3 className="text-2xl font-bold text-metallic-50 mb-3">
                  {area.title}
                </h3>
                <p className="text-metallic-300 mb-6">
                  {area.description}
                </p>
                <ul className="space-y-3">
                  {area.topics.map((topic, tidx) => (
                    <li key={tidx} className="text-metallic-400 flex items-start gap-2">
                      <span className="text-amber-forge mt-1">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#12121a' }}>
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-metallic-50 mb-6">
              Technical Reports & Publications
            </h2>
            <p className="text-lg text-metallic-300">
              Internal technical reports documenting our approach and findings.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            {publications.map((pub, idx) => (
              <div 
                key={idx}
                className="border border-metallic-800 bg-metallic-950/30 p-8 rounded-lg"
              >
                <h3 className="text-xl font-bold text-metallic-50 mb-2">
                  {pub.title}
                </h3>
                <p className="text-sm text-metallic-400 mb-4">
                  {pub.authors} • {pub.venue} • {pub.year}
                </p>
                <p className="text-metallic-300 mb-4">
                  {pub.abstract}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pub.topics.map((topic, tidx) => (
                    <span 
                      key={tidx}
                      className="px-3 py-1 text-xs bg-amber-forge/10 text-amber-forge rounded-full border border-amber-forge/30"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaboration CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-metallic-50">
              Collaborate With Us
            </h2>
            
            <p className="text-lg text-metallic-400">
              We're interested in research partnerships with universities, manufacturing companies, 
              and quality professionals. If you're working on related problems, let's talk.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="px-8 py-3 bg-amber-forge text-metallic-950 font-semibold rounded hover:bg-amber-600 transition-colors"
              >
                Get in Touch
              </a>
              <a
                href="/technology"
                className="px-8 py-3 border border-metallic-700 text-metallic-200 font-semibold rounded hover:border-amber-forge hover:text-amber-forge transition-colors"
              >
                Explore Our Technology
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
