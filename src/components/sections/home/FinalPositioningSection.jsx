import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { finalPositioningContent } from '@/content/homepage/final-positioning'

export function FinalPositioningSection() {
  const { title, subtitle, body, directions, closingStatement, ctas } = finalPositioningContent

  return (
    <SectionShell id="final-positioning">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Vision" />

      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Direction pillars */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {directions.map((dir, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50"
          >
            <h4 className="text-sm font-bold text-metallic-100 mb-2">{dir.name}</h4>
            <p className="text-xs text-metallic-400 leading-relaxed">{dir.description}</p>
          </div>
        ))}
      </div>

      {/* Closing statement */}
      <div className="text-center">
        <p className="text-xl md:text-2xl font-black text-metallic-100 tracking-tight mb-8">
          {closingStatement}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {ctas.map((cta, i) => (
            <a
              key={i}
              href={cta.href}
              className={`px-6 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                i === 0
                  ? 'bg-amber-forge text-charcoal-950 hover:bg-amber-forge/90'
                  : 'border border-metallic-700/50 text-metallic-200 hover:border-amber-forge/50 hover:text-amber-forge'
              }`}
            >
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
