import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * FlowArrow — SVG down-arrow connector between ecosystem cards.
 */
function FlowArrow() {
  return (
    <div className="flex items-center justify-center h-10">
      <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
        <line x1="12" y1="0" x2="12" y2="22" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
        <path d="M5 16l7 10 7-10" stroke="rgba(245,158,11,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/**
 * EcosystemCard — A single node in the flow diagram.
 *
 * Props:
 *   icon     — small emoji/symbol for the card header
 *   title    — card heading
 *   subtitle — short description line
 *   bullets  — optional string[] of output/content items
 *   accent   — if true, uses amber-tinted border to highlight key system nodes
 *   delay    — reveal delay class suffix (1-4)
 */
function EcosystemCard({ icon, title, subtitle, bullets, accent, delay }) {
  return (
    <div
      className={`reveal reveal-delay-${delay} relative p-6 w-full max-w-[560px] mx-auto`}
      style={{
        background: accent ? 'rgba(245,158,11,0.04)' : 'rgba(26,26,30,0.8)',
        border: accent ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(168,168,180,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{
          background: accent
            ? 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.6), transparent)'
            : 'linear-gradient(to bottom, transparent, rgba(168,168,180,0.15), transparent)',
        }}
      />

      <div className="flex items-start gap-4">
        <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-metallic-100 tracking-wide mb-1">{title}</h3>
          <p className="text-xs text-metallic-400 leading-relaxed mb-3">{subtitle}</p>

          {bullets && bullets.length > 0 && (
            <ul className="space-y-1.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-metallic-500">
                  <span
                    className="flex-shrink-0 w-1 h-1 rounded-full"
                    style={{ background: accent ? 'rgba(245,158,11,0.5)' : 'rgba(168,168,180,0.3)' }}
                  />
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * EcosystemSection — Manufacturing Intelligence Ecosystem.
 *
 * Shows the data flow from raw inspection images through RAS and structured
 * records into Plant Intelligence analytics. Demonstrates how the two products
 * relate to each other in a real factory deployment.
 *
 * Inserted between AboutSection and ProductSlider on the homepage.
 */
export function EcosystemSection() {
  const ref = useScrollReveal()

  return (
    <section
      id="technology"
      ref={ref}
      className="relative py-28 md:py-36 bg-charcoal-950 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.03) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

        {/* Section label */}
        <div className="reveal flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-amber-forge opacity-60" />
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
            Product Ecosystem
          </span>
        </div>

        {/* Header */}
        <div className="reveal mb-4">
          <h2 className="text-4xl md:text-5xl font-black text-metallic-100 leading-tight tracking-tight">
            Manufacturing Intelligence Ecosystem
          </h2>
        </div>
        <p className="reveal reveal-delay-1 text-base text-metallic-400 max-w-[560px] leading-relaxed mb-16">
          How inspection data becomes plant-level manufacturing intelligence.
        </p>

        {/* Horizontal layered architecture diagram */}
        <div className="space-y-6">

          {/* TIER 3: Plant-Level Intelligence */}
          <div className="reveal reveal-delay-1">
            <div
              className="p-6 md:p-8"
              style={{
                background: 'rgba(245,158,11,0.04)',
                border: '1px solid rgba(245,158,11,0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-lg">◎</span>
                <h3 className="text-sm font-bold text-amber-forge tracking-wide uppercase">
                  Plant-Level Intelligence
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">Quality Engineering</p>
                  <ul className="space-y-1">
                    {['FMEA', 'Fishbone', 'SPC/Cpk', 'Quality Gates', 'TPM'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">Process Risk</p>
                  <ul className="space-y-1">
                    {['Anomaly detection', 'Real-time alerts', 'Threshold monitoring', 'Drift tracking'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">Cost of Quality</p>
                  <ul className="space-y-1">
                    {['Scrap cost by defect', 'Cost by process stage', 'Financial impact analysis'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">Natural Language</p>
                  <ul className="space-y-1">
                    {['Query plant data', 'Plain language interface', 'Automated insights'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">Decision Intelligence</p>
                  <ul className="space-y-1">
                    {['Corrective actions', 'Action tracking', 'Daily/weekly reports'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Connector line */}
          <div className="flex items-center justify-center h-8">
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="0" x2="12" y2="18" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
                <path d="M6 12l6-8 6 8" stroke="rgba(245,158,11,0.3)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-xs text-metallic-500 mt-1">data flows up</p>
            </div>
          </div>

          {/* TIER 2: Process Intelligence */}
          <div className="reveal reveal-delay-2">
            <div
              className="p-6 md:p-8"
              style={{
                background: 'rgba(26,26,30,0.8)',
                border: '1px solid rgba(168,168,180,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-lg">🔗</span>
                <h3 className="text-sm font-bold text-metallic-100 tracking-wide uppercase">
                  Process Intelligence
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">ERP/MES Integration</p>
                  <ul className="space-y-1">
                    {['SQL connection', 'Batch ingestion', 'Manufacturing context'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">Cross-Part Patterns</p>
                  <ul className="space-y-1">
                    {['Defect graph', 'Co-occurrence analysis', 'Pattern recognition'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">Drift Detection</p>
                  <ul className="space-y-1">
                    {['Rejection rate trends', 'Statistical alerts', 'Baseline comparison'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">Heat Intelligence</p>
                  <ul className="space-y-1">
                    {['Per-batch analysis', 'Mold risk profiling', 'Metallurgical causes'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs font-semibold text-metallic-200 mb-2">Self-Tuning</p>
                  <ul className="space-y-1">
                    {['Adaptive sensitivity', 'Auto-optimization', 'Continuous refinement'].map((item, i) => (
                      <li key={i} className="text-xs text-metallic-500">• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Connector line */}
          <div className="flex items-center justify-center h-8">
            <div className="flex flex-col items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="0" x2="12" y2="18" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
                <path d="M6 12l6-8 6 8" stroke="rgba(245,158,11,0.3)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-xs text-metallic-500 mt-1">data flows up</p>
            </div>
          </div>

          {/* TIER 1: Inspection Pipeline */}
          <div className="reveal reveal-delay-3">
            <div
              className="p-6 md:p-8"
              style={{
                background: 'rgba(245,158,11,0.04)',
                border: '1px solid rgba(245,158,11,0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-lg">⬡</span>
                <h3 className="text-sm font-bold text-amber-forge tracking-wide uppercase">
                  Inspection Pipeline
                </h3>
              </div>

              {/* Pipeline flow */}
              <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
                <div className="flex-1 p-4 text-center" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-lg mb-1">📷</p>
                  <p className="text-xs font-semibold text-metallic-200 mb-1">Image Capture</p>
                  <p className="text-xs text-metallic-500">Single or batch queue</p>
                </div>

                <svg className="hidden lg:block" width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path d="M0 8h16M12 4l4 4-4 4" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div className="flex-1 p-4 text-center" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-lg mb-1">✓</p>
                  <p className="text-xs font-semibold text-metallic-200 mb-1">Quality Gate</p>
                  <p className="text-xs text-metallic-500">Image verification</p>
                </div>

                <svg className="hidden lg:block" width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path d="M0 8h16M12 4l4 4-4 4" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div className="flex-1 p-4 text-center" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-lg mb-1">🔍</p>
                  <p className="text-xs font-semibold text-metallic-200 mb-1">Defect Detection</p>
                  <p className="text-xs text-metallic-500">6 types + heatmap</p>
                </div>

                <svg className="hidden lg:block" width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path d="M0 8h16M12 4l4 4-4 4" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div className="flex-1 p-4 text-center" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-lg mb-1">⬡</p>
                  <p className="text-xs font-semibold text-metallic-200 mb-1">Diagnosis</p>
                  <p className="text-xs text-metallic-500">Root cause + zones</p>
                </div>

                <svg className="hidden lg:block" width="20" height="16" viewBox="0 0 20 16" fill="none">
                  <path d="M0 8h16M12 4l4 4-4 4" stroke="rgba(245,158,11,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div className="flex-1 p-4 text-center" style={{ background: 'rgba(26,26,30,0.6)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-lg mb-1">✓</p>
                  <p className="text-xs font-semibold text-metallic-200 mb-1">Decision</p>
                  <p className="text-xs text-metallic-500">Accept/Check/Reject</p>
                </div>
              </div>

              {/* Additional capabilities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 text-center" style={{ background: 'rgba(26,26,30,0.4)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs text-metallic-400">Defect fingerprinting • Recurring pattern detection</p>
                </div>
                <div className="p-3 text-center" style={{ background: 'rgba(26,26,30,0.4)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs text-metallic-400">Human validation • Supervisor review + training</p>
                </div>
                <div className="p-3 text-center" style={{ background: 'rgba(26,26,30,0.4)', border: '1px solid rgba(168,168,180,0.08)' }}>
                  <p className="text-xs text-metallic-400">PDF reports • Full traceability • Audit trail</p>
                </div>
              </div>
            </div>
          </div>

          {/* Continuous Improvement Loop */}
          <div className="reveal reveal-delay-4 mt-8">
            <div
              className="p-5 text-center"
              style={{
                border: '1px dashed rgba(245,158,11,0.25)',
                background: 'rgba(245,158,11,0.03)',
              }}
            >
              <p className="text-xs font-semibold text-amber-forge mb-2 tracking-wider uppercase">
                ↻ Continuous Improvement Loop
              </p>
              <p className="text-xs text-metallic-400 leading-relaxed">
                Supervisor corrections improve AI models. Process insights drive manufacturing change. Self-tuning adjusts sensitivity over time.
              </p>
            </div>
          </div>
        </div>

        {/* Deployment & Architecture note */}
        <div className="reveal reveal-delay-4 mt-16 mx-auto max-w-[700px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-forge opacity-60">
              Deployment & Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Left: Tier-Based Architecture */}
            <div
              className="p-6"
              style={{
                border: '1px solid rgba(168,168,180,0.08)',
                background: 'rgba(26,26,30,0.5)',
              }}
            >
              <p className="text-sm text-metallic-300 leading-relaxed mb-2">
                Tvastr is built in tiers.
              </p>
              <p className="text-sm text-metallic-400 leading-relaxed">
                Start with the Rejection Analysis System for AI-powered inspection, then upgrade to Plant Intelligence for plant-wide analytics. Individual features and technologies within each tier are modular and upgradable.
              </p>
            </div>

            {/* Right: On-Premise Deployment */}
            <div
              className="p-6"
              style={{
                border: '1px solid rgba(168,168,180,0.08)',
                background: 'rgba(26,26,30,0.5)',
              }}
            >
              <p className="text-sm text-metallic-300 leading-relaxed mb-3">
                Industrial deployment model:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-xs text-metallic-400">
                  <span className="flex-shrink-0 w-1 h-1 rounded-full mt-1.5" style={{ background: 'rgba(245,158,11,0.5)' }} />
                  Runs on-premise inside the plant network
                </li>
                <li className="flex items-start gap-2 text-xs text-metallic-400">
                  <span className="flex-shrink-0 w-1 h-1 rounded-full mt-1.5" style={{ background: 'rgba(245,158,11,0.5)' }} />
                  Processes casting images locally in real time
                </li>
                <li className="flex items-start gap-2 text-xs text-metallic-400">
                  <span className="flex-shrink-0 w-1 h-1 rounded-full mt-1.5" style={{ background: 'rgba(245,158,11,0.5)' }} />
                  Integrates with ERP or MES systems
                </li>
              </ul>
            </div>
          </div>

          {/* Network boundary note */}
          <div
            className="px-5 py-3"
            style={{
              border: '1px dashed rgba(245,158,11,0.15)',
              background: 'rgba(245,158,11,0.02)',
            }}
          >
            <p className="text-xs text-center text-metallic-500">
              All components operate within the plant network boundary. Inspection data remains on-site while enabling advanced analytics.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
