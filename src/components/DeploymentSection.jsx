import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * ArchNode — A single box in the vertical architecture diagram.
 */
function ArchNode({ label, sublabel, delay }) {
  return (
    <div
      className={`reveal reveal-delay-${delay} w-full max-w-[400px] mx-auto px-5 py-3 rounded-lg`}
      style={{
        border: '1px solid rgba(168,168,180,0.15)',
        background: 'rgba(26,26,30,0.6)',
      }}
    >
      <p className="text-xs font-semibold text-metallic-200 tracking-wide">{label}</p>
      {sublabel && (
        <p className="text-xs text-metallic-500 mt-0.5">{sublabel}</p>
      )}
    </div>
  )
}

/**
 * ArchArrow — Small down-arrow between architecture diagram nodes.
 */
function ArchArrow() {
  return (
    <div className="flex items-center justify-center h-7 w-full max-w-[400px] mx-auto">
      <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
        <line x1="8" y1="0" x2="8" y2="14" stroke="rgba(168,168,180,0.25)" strokeWidth="1" />
        <path d="M3 10l5 8 5-8" stroke="rgba(168,168,180,0.25)" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/**
 * DeploymentSection — Industrial Deployment Model.
 *
 * Explains that Tvastr systems run on-premise inside the plant network,
 * not as cloud-first SaaS. Includes a simple vertical architecture diagram
 * showing the physical data flow within a factory deployment.
 *
 * Inserted between EcosystemSection and ProductSlider on the homepage.
 */
export function DeploymentSection() {
  const ref = useScrollReveal()

  return (
    <section
      id="deployment"
      ref={ref}
      className="relative py-28 md:py-36 overflow-hidden"
      style={{ background: 'rgba(10,10,11,0.98)' }}
    >
      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />

      {/* Subtle top border separator */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.15), transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">

        {/* Section label */}
        <div className="reveal flex items-center gap-3 mb-12">
          <div className="w-8 h-px bg-amber-forge opacity-60" />
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
            Deployment
          </span>
        </div>

        {/* Two-column layout: text left, diagram right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* LEFT — Text content */}
          <div>
            <h2 className="reveal text-4xl md:text-5xl font-black text-metallic-100 leading-tight tracking-tight mb-4">
              Industrial Deployment Model
            </h2>
            <p className="reveal reveal-delay-1 text-base text-metallic-400 leading-relaxed mb-10">
              Designed for real factory environments.
            </p>

            {/* Deployment properties */}
            <ul className="space-y-4 mb-10">
              {[
                {
                  text: 'Runs directly on the inspection workstation inside the plant network',
                  delay: 1,
                },
                {
                  text: 'Processes casting images locally in real time',
                  delay: 2,
                },
                {
                  text: 'Stores inspection records in a plant SQL database',
                  delay: 2,
                },
                {
                  text: 'Integrates with ERP or MES systems for production metadata',
                  delay: 3,
                },
              ].map((item, i) => (
                <li
                  key={i}
                  className={`reveal reveal-delay-${item.delay} flex items-start gap-4`}
                >
                  <div
                    className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full"
                    style={{ background: 'rgba(245,158,11,0.5)' }}
                  />
                  <p className="text-sm text-metallic-300 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>

            {/* Description paragraphs */}
            <div
              className="reveal reveal-delay-3 p-5 rounded-lg"
              style={{
                border: '1px solid rgba(168,168,180,0.08)',
                background: 'rgba(26,26,30,0.6)',
              }}
            >
              <p className="text-sm text-metallic-400 leading-relaxed mb-3">
                The system is designed for industrial environments where reliability,
                traceability, and local deployment are essential.
              </p>
              <p className="text-sm text-metallic-500 leading-relaxed">
                Inspection data remains within the plant network while still enabling
                advanced analytics and manufacturing intelligence.
              </p>
            </div>
          </div>

          {/* RIGHT — Architecture diagram */}
          <div className="reveal reveal-delay-2">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-metallic-500 mb-8 text-center lg:text-left">
              Deployment Architecture
            </p>

            <div className="flex flex-col">
              <ArchNode
                label="Inspection Workstation"
                sublabel="Camera capture + operator input"
                delay={2}
              />
              <ArchArrow />
              <ArchNode
                label="Rejection Analysis System"
                sublabel="Defect detection · Decision engine · Structured logging"
                delay={2}
              />
              <ArchArrow />
              <ArchNode
                label="Plant SQL Database"
                sublabel="Inspection records · Metadata · Audit trail"
                delay={3}
              />
              <ArchArrow />
              <ArchNode
                label="Plant Intelligence Dashboard"
                sublabel="Analytics · Trends · Process risk · NL queries"
                delay={3}
              />
            </div>

            {/* Network boundary note */}
            <div
              className="reveal reveal-delay-4 mt-6 px-5 py-3 w-full max-w-[400px] mx-auto rounded-lg"
              style={{
                border: '1px dashed rgba(245,158,11,0.15)',
                background: 'rgba(245,158,11,0.02)',
              }}
            >
              <p className="text-xs text-center text-metallic-500">
                All components operate within the plant network boundary.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Subtle bottom border separator */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(168,168,180,0.08), transparent)' }}
      />
    </section>
  )
}
