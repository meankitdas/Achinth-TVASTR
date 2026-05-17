import { useDocumentHead } from '../hooks/useDocumentHead'

export function IndustriesPage() {
  useDocumentHead(
    'Industries | Tvastr Industrial Intelligence',
    'Tvastr serves foundries, aerospace, automotive, and precision manufacturing industries with AI-powered quality inspection.',
    'https://tvastr.co/industries'
  )

  const industries = [
    {
      name: 'Foundries & Casting',
      icon: '🔥',
      description: 'AI-powered defect detection for casting quality control',
      challenges: [
        'Shrinkage porosity detection',
        'Surface crack identification',
        'Inclusion and slag detection',
        'Cold shut and misrun classification'
      ],
      solutions: [
        'Multi-sensor inspection (vision, thermal, eddy current, ultrasonic)',
        'Signal-based classification with 95%+ accuracy',
        'Real-time rejection with <200ms latency',
        'Root cause analysis linking defects to process parameters'
      ],
      benefits: [
        '40-60% reduction in scrap rate',
        '3-5x faster inspection vs manual',
        'Complete traceability from melt to shipment',
        'ISO 9001 / IATF 16949 compliance'
      ]
    },
    {
      name: 'Aerospace Manufacturing',
      icon: '✈️',
      description: 'Zero-defect inspection for mission-critical components',
      challenges: [
        'Stringent AS9100 quality requirements',
        'Complex part geometries',
        'Material property variations',
        'Documentation and traceability mandates'
      ],
      solutions: [
        'Multi-modal NDT (non-destructive testing)',
        'Automated inspection reports with signatures',
        'Calibration tracking and sensor validation',
        'Full audit trail for regulatory compliance'
      ],
      benefits: [
        'Meet AS9100 Rev D requirements',
        'Reduce manual inspection labor by 70%',
        'Eliminate human subjectivity in quality decisions',
        'Instant access to historical inspection data'
      ]
    },
    {
      name: 'Automotive Components',
      icon: '🚗',
      description: 'High-volume quality control for automotive parts',
      challenges: [
        'High production volumes (1000s parts/day)',
        'Tight tolerances and strict defect limits',
        'Supplier quality scorecarding',
        'PPAP documentation requirements'
      ],
      solutions: [
        'Inline inspection at production speed',
        'Automated PPAP report generation',
        'Supplier performance dashboards',
        'SPC monitoring for process stability'
      ],
      benefits: [
        'Achieve Cpk > 1.67 on critical dimensions',
        '< 100 DPM (defects per million)',
        'Real-time alerts on process shifts',
        'Reduce warranty claims by catching defects early'
      ]
    },
    {
      name: 'Precision Machining',
      icon: '⚙️',
      description: 'Dimensional accuracy and surface finish inspection',
      challenges: [
        'Tight dimensional tolerances (±0.01mm)',
        'Surface roughness requirements',
        'Tool wear monitoring',
        'Batch-to-batch consistency'
      ],
      solutions: [
        'Vision-based dimensional measurement',
        'Surface texture analysis (Ra, Rz)',
        'Automated tool wear prediction',
        'Process capability tracking (Cp, Cpk)'
      ],
      benefits: [
        'Automated CMM (coordinate measuring machine) replacement',
        '100% inspection vs statistical sampling',
        'Early detection of tool degradation',
        'Reduced rework and scrap'
      ]
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
              Industries We Serve
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-metallic-50">
              AI-Powered Quality Inspection Across Manufacturing
            </h1>
            
            <p className="text-xl md:text-2xl text-metallic-300 font-light">
              From foundries to aerospace, Tvastr delivers explainable, deployment-ready inspection systems 
              tailored to your industry's unique quality requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="space-y-16">
            {industries.map((industry, idx) => (
              <div 
                key={idx}
                className="border border-metallic-800 bg-metallic-950/30 rounded-lg overflow-hidden"
              >
                <div className="p-8 md:p-12">
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="text-5xl">{industry.icon}</div>
                    <div>
                      <h2 className="text-3xl font-bold text-metallic-50 mb-2">
                        {industry.name}
                      </h2>
                      <p className="text-lg text-metallic-300">
                        {industry.description}
                      </p>
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="grid md:grid-cols-3 gap-8 mt-8">
                    {/* Challenges */}
                    <div>
                      <h3 className="text-xl font-semibold text-amber-forge mb-4">
                        Challenges
                      </h3>
                      <ul className="space-y-3">
                        {industry.challenges.map((challenge, cidx) => (
                          <li key={cidx} className="text-metallic-400 flex items-start gap-2">
                            <span className="text-metallic-600 mt-1">▸</span>
                            <span>{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Solutions */}
                    <div>
                      <h3 className="text-xl font-semibold text-amber-forge mb-4">
                        Tvastr Solutions
                      </h3>
                      <ul className="space-y-3">
                        {industry.solutions.map((solution, sidx) => (
                          <li key={sidx} className="text-metallic-400 flex items-start gap-2">
                            <span className="text-amber-forge mt-1">✓</span>
                            <span>{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h3 className="text-xl font-semibold text-amber-forge mb-4">
                        Business Impact
                      </h3>
                      <ul className="space-y-3">
                        {industry.benefits.map((benefit, bidx) => (
                          <li key={bidx} className="text-metallic-400 flex items-start gap-2">
                            <span className="text-amber-forge mt-1">→</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Capabilities */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#12121a' }}>
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-metallic-50 mb-6">
              Common Capabilities Across All Industries
            </h2>
            <p className="text-lg text-metallic-300">
              Every Tvastr deployment includes these core features, regardless of industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-metallic-100 mb-2">
                Real-Time Inspection
              </h3>
              <p className="text-sm text-metallic-400">
                &lt;200ms decision latency for inline production
              </p>
            </div>

            <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-metallic-100 mb-2">
                Process Intelligence
              </h3>
              <p className="text-sm text-metallic-400">
                SPC, Pareto, Fishbone analytics for continuous improvement
              </p>
            </div>

            <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-metallic-100 mb-2">
                Full Traceability
              </h3>
              <p className="text-sm text-metallic-400">
                Material-to-shipment tracking with audit trails
              </p>
            </div>

            <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-metallic-100 mb-2">
                Compliance Ready
              </h3>
              <p className="text-sm text-metallic-400">
                ISO 9001, IATF 16949, AS9100 compliant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-metallic-50">
              Ready to Transform Quality in Your Industry?
            </h2>
            
            <p className="text-lg text-metallic-400">
              Schedule a consultation to discuss your specific quality challenges and see how 
              Tvastr can deliver measurable ROI in your manufacturing environment.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="px-8 py-3 bg-amber-forge text-metallic-950 font-semibold rounded hover:bg-amber-600 transition-colors"
              >
                Request Industry-Specific Demo
              </a>
              <a
                href="/technology"
                className="px-8 py-3 border border-metallic-700 text-metallic-200 font-semibold rounded hover:border-amber-forge hover:text-amber-forge transition-colors"
              >
                Explore Technology
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}