import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * YantraLine — Animated SVG divider inspired by Vedic yantra geometry.
 * Uses concentric geometric shapes with subtle draw-on animation.
 */
function YantraLine() {
  return (
    <div className="flex items-center justify-center my-16 md:my-20">
      <svg
        width="320"
        height="40"
        viewBox="0 0 320 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-40"
      >
        {/* Left extending line */}
        <line x1="0" y1="20" x2="110" y2="20" stroke="#f59e0b" strokeWidth="0.5" />
        {/* Left inner tick */}
        <line x1="115" y1="14" x2="115" y2="26" stroke="#f59e0b" strokeWidth="0.5" />
        {/* Diamond / yantra center motif */}
        <polygon
          points="160,8 178,20 160,32 142,20"
          stroke="#f59e0b"
          strokeWidth="0.7"
          fill="none"
        />
        {/* Inner diamond */}
        <polygon
          points="160,13 170,20 160,27 150,20"
          stroke="#f59e0b"
          strokeWidth="0.5"
          fill="rgba(245,158,11,0.04)"
        />
        {/* Center dot */}
        <circle cx="160" cy="20" r="1.5" fill="#f59e0b" />
        {/* Right inner tick */}
        <line x1="205" y1="14" x2="205" y2="26" stroke="#f59e0b" strokeWidth="0.5" />
        {/* Right extending line */}
        <line x1="210" y1="20" x2="320" y2="20" stroke="#f59e0b" strokeWidth="0.5" />
        {/* Outer flanking ticks */}
        <line x1="60" y1="17" x2="60" y2="23" stroke="#f59e0b" strokeWidth="0.5" opacity="0.5" />
        <line x1="260" y1="17" x2="260" y2="23" stroke="#f59e0b" strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  )
}

/**
 * FocusCard — Individual philosophy/focus area pill.
 */
function FocusCard({ icon, title, description, delay }) {
  return (
    <div
      className={`reveal reveal-delay-${delay} group relative p-6 transition-all duration-500`}
      style={{
        background: 'rgba(26,26,30,0.8)',
        border: '1px solid rgba(168,168,180,0.08)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Amber left accent */}
      <div
        className="absolute left-0 top-0 bottom-0 w-px transition-all duration-500 group-hover:opacity-100 opacity-30"
        style={{ background: 'linear-gradient(to bottom, transparent, #f59e0b, transparent)' }}
      />
      <div className="text-2xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-metallic-100 mb-2 tracking-wide">{title}</h3>
      <p className="text-sm text-metallic-400 leading-relaxed">{description}</p>
    </div>
  )
}

/**
 * AboutSection — Company philosophy section.
 * Narrates the Vedic origin story and three focus pillars.
 * Features a Vedic yantra-inspired geometric divider.
 */
export function AboutSection() {
  const ref = useScrollReveal()

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 md:py-36 bg-charcoal-950 overflow-hidden"
    >
      {/* Subtle radial glow behind text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Section label */}
        <div className="reveal flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-amber-forge opacity-60" />
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
            Our Origin
          </span>
        </div>

        {/* Two-column header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          {/* Left: main title */}
          <div>
            <h2 className="reveal text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
              <span className="text-metallic-100">Ancient</span>
              <br />
              <span className="text-amber-gradient">Craftsmanship.</span>
              <br />
              <span className="text-metallic-100">Modern</span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #e8e8ec 0%, #a8a8b4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Intelligence.
              </span>
            </h2>
          </div>

          {/* Right: philosophy text */}
          <div className="flex flex-col justify-center">
            <p className="reveal reveal-delay-1 text-lg text-metallic-300 leading-relaxed mb-6">
            Tvastr is named after{' '}
              <span className="text-amber-glow font-medium">Tvaṣṭṛ</span>, the
              Vedic artisan deity — the divine architect who forged celestial
              tools and shaped the instruments of the gods.
            </p>
            <p className="reveal reveal-delay-2 text-base text-metallic-400 leading-relaxed mb-6">
              In the same spirit, Tvastr builds intelligent systems that shape
              the future of industrial production — combining the precision of
              ancient master craftsmanship with the power of modern AI.
            </p>
            <p className="reveal reveal-delay-3 text-base text-metallic-400 leading-relaxed">
              Every system we forge is built for the factory floor: reliable,
              explainable, and operationally grounded.
            </p>
          </div>
        </div>

        {/* Yantra geometric divider */}
        <YantraLine />

        {/* Focus area cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FocusCard
            icon="⬡"
            title="Industrial AI"
            description="Machine learning systems designed specifically for manufacturing environments — built for noise, variance, and real-world complexity."
            delay={1}
          />
          <FocusCard
            icon="◈"
            title="Manufacturing Intelligence"
            description="End-to-end insight layers that connect raw production data to actionable decisions, from casting floor to executive dashboard."
            delay={2}
          />
          <FocusCard
            icon="◎"
            title="Operational Insight"
            description="Systems that make the invisible visible — surfacing root causes, patterns, and opportunities buried in operational data."
            delay={3}
          />
        </div>
      </div>
    </section>
  )
}
