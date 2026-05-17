import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { coreThesisContent } from '@/content/homepage/core-thesis'

export function CoreThesisSection() {
  const { title, subtitle, body, signals, keyMessage } = coreThesisContent

  return (
    <SectionShell id="core-thesis">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Core Thesis" />

      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Signal sources — visual grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {signals.map((signal, i) => (
          <div
            key={i}
            className="p-4 rounded-lg border border-metallic-800/20 bg-charcoal-950/50 hover:border-amber-forge/30 transition-colors"
          >
            <h4 className="text-sm font-bold text-metallic-100 mb-1">{signal.name}</h4>
            <p className="text-xs text-metallic-400 leading-relaxed">{signal.description}</p>
          </div>
        ))}
      </div>

      {/* Key message */}
      <p className="mt-6 text-center text-base text-metallic-400 leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
