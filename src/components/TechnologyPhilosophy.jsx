import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * GeometricSeparator — Minimal SVG rule between philosophy blocks.
 * Echoes the yantra motif used in the About section.
 */
function GeometricSeparator({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 my-8">
        <div className="flex-1 h-px" style={{ background: 'rgba(168,168,180,0.08)' }} />
        <div
          className="w-1.5 h-1.5 rotate-45"
          style={{ background: 'rgba(245,158,11,0.4)' }}
        />
        <div className="flex-1 h-px" style={{ background: 'rgba(168,168,180,0.08)' }} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center my-16">
      <svg
        width="240"
        height="24"
        viewBox="0 0 240 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-30"
      >
        <line x1="0" y1="12" x2="90" y2="12" stroke="#f59e0b" strokeWidth="0.5" />
        <polygon
          points="120,4 132,12 120,20 108,12"
          stroke="#f59e0b"
          strokeWidth="0.6"
          fill="none"
        />
        <polygon
          points="120,8 126,12 120,16 114,12"
          stroke="#f59e0b"
          strokeWidth="0.4"
          fill="rgba(245,158,11,0.05)"
        />
        <circle cx="120" cy="12" r="1" fill="#f59e0b" />
        <line x1="150" y1="12" x2="240" y2="12" stroke="#f59e0b" strokeWidth="0.5" />
      </svg>
    </div>
  )
}

/**
 * PhilosophyBlock — A single principle card.
 * Large number accent + title + description.
 */
function PhilosophyBlock({ number, title, description, detail, delay }) {
  return (
    <div className={`reveal reveal-delay-${delay} group relative`}>
      {/* Number accent */}
      <div
        className="text-[7rem] font-black leading-none mb-4 select-none pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(245,158,11,0.08) 0%, transparent 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.04em',
        }}
      >
        {number}
      </div>

      {/* Content */}
      <div className="relative pl-5" style={{ borderLeft: '2px solid rgba(245,158,11,0.15)' }}>
        {/* Hover: animate left border brightness */}
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)' }}
        />

        <h3 className="text-xl md:text-2xl font-bold text-metallic-100 mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-base text-metallic-400 leading-relaxed mb-4">{description}</p>
        <p className="text-sm text-metallic-500 leading-relaxed">{detail}</p>
      </div>
    </div>
  )
}

/**
 * TechnologyPhilosophy — Engineering principles section.
 * Four philosophy blocks in a 2-column grid on desktop.
 * Geometric separators between rows.
 */
export function TechnologyPhilosophy() {
  const ref = useScrollReveal()

  const principles = [
    {
      number: '01',
      title: 'Precision Engineering',
      description:
        'Every model, every query, every output is held to the standard of industrial precision — where accuracy is not a feature, it is a requirement.',
      detail:
        'We build systems where a wrong answer carries operational cost. That constraint drives rigor into every layer of our stack.',
    },
    {
      number: '02',
      title: 'Systems Thinking',
      description:
        'Industrial problems are never isolated. A casting defect is also a furnace issue, a mold design problem, and a process parameter drift.',
      detail:
        'Our systems are designed to reason across boundaries — connecting signals that siloed tools miss entirely.',
    },
    {
      number: '03',
      title: 'Industrial Data Intelligence',
      description:
        'Factory data is messy, inconsistent, and domain-specific. Tvastr systems are built to work with real data — not clean, curated laboratory datasets.',
      detail:
        'We treat data quality as an engineering problem, not a prerequisite — building robustness directly into model architecture.',
    },
    {
      number: '04',
      title: 'Manufacturing Optimization',
      description:
        'Insight without action is noise. Every system we build is designed to surface decisions, not just dashboards.',
      detail:
        'From rejection rate reduction to OEE improvement — our outputs are calibrated to the metrics that matter on the factory floor.',
    },
  ]

  return (
    <section
      id="technology"
      ref={ref}
      className="relative py-28 md:py-36 overflow-hidden"
      style={{ background: '#0d0d0f' }}
    >
      {/* Subtle top gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(168,168,180,0.08), transparent)' }}
      />

      {/* Background texture */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Faint glow top-right */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Section header */}
        <div className="reveal flex items-center gap-3 mb-6">
          <div className="w-8 h-px bg-amber-forge opacity-60" />
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
            Engineering Philosophy
          </span>
        </div>

        <div className="mb-16">
          <h2
            className="reveal text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #888896 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Built to Last.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Built to Work.
            </span>
          </h2>
        </div>

        {/* Philosophy blocks — 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 lg:gap-x-24">
          {/* Row 1 */}
          <PhilosophyBlock {...principles[0]} delay={1} />
          <PhilosophyBlock {...principles[1]} delay={2} />

          <GeometricSeparator compact />
          <GeometricSeparator compact />

          {/* Row 2 */}
          <PhilosophyBlock {...principles[2]} delay={1} />
          <PhilosophyBlock {...principles[3]} delay={2} />
        </div>

        {/* Full-width geometric divider at bottom */}
        <GeometricSeparator />

        {/* Closing statement */}
        <div className="reveal text-center">
          <p className="text-metallic-400 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Like the Vedic craftsman who shaped the weapons of celestial warriors —
            <br className="hidden md:block" />
            <span className="text-metallic-300"> we forge systems that stand at the edge of what is possible.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
