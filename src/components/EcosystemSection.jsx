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

        {/* Vertical flow diagram */}
        <div className="flex flex-col items-center">

          <EcosystemCard
            icon="📷"
            title="Inspection Images"
            subtitle="Surface images captured during casting inspection at the foundry floor."
            delay={1}
          />

          <FlowArrow />

          <EcosystemCard
            icon="⬡"
            title="Rejection Analysis System"
            subtitle="AI-powered defect detection and rejection diagnostics applied to each casting image."
            bullets={[
              'Defect detection and classification',
              'Severity scoring per surface zone',
              'Traceable inspection records',
              'Root cause indicators',
            ]}
            accent
            delay={2}
          />

          <FlowArrow />

          <EcosystemCard
            icon="◈"
            title="Structured Inspection Data"
            subtitle="Each inspection becomes a structured manufacturing record. This creates a continuous data stream across production."
            bullets={[
              'Heat number',
              'Mold identifier',
              'Production shift',
              'Operator',
              'Defect types and locations',
            ]}
            delay={2}
          />

          <FlowArrow />

          <EcosystemCard
            icon="◎"
            title="Plant Intelligence"
            subtitle="Plant-level analytics and decision intelligence built on accumulated inspection data."
            bullets={[
              'Rejection trend analysis',
              'Defect pattern detection',
              'Process risk scoring',
              'Statistical process control',
              'Plant quality dashboards',
            ]}
            accent
            delay={3}
          />
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
