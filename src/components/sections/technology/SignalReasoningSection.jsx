import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { signalReasoningContent } from '@/content/technology/signal-reasoning'

export function SignalReasoningSection() {
  const {
    title, subtitle, body, signalChannels, fusionArchitecture,
    classificationRequirement, explainability, keyMessage
  } = signalReasoningContent

  return (
    <SectionShell id="signal-reasoning">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Reasoning Layer" />

      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Signal channels — weight-annotated cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {signalChannels.map((ch, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-bold text-metallic-100">{ch.name}</h4>
              <span className="text-[11px] font-mono text-amber-forge/80 bg-amber-forge/10 px-2 py-0.5 rounded">
                {ch.weight}
              </span>
            </div>
            <p className="text-xs text-metallic-400 leading-relaxed mb-2">{ch.description}</p>
            <p className="text-[11px] text-metallic-500 italic">{ch.interpretation}</p>
          </div>
        ))}
      </div>

      {/* Fusion architecture */}
      <div className="p-6 rounded-xl border border-metallic-800/30 bg-charcoal-950/60 mb-8">
        <h3 className="text-base font-bold text-metallic-100 mb-2">{fusionArchitecture.title}</h3>
        <p className="text-xs text-metallic-400 mb-4">{fusionArchitecture.description}</p>

        <div className="space-y-2">
          {fusionArchitecture.weights.map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-mono text-amber-forge w-10 text-right">{w.weight}</span>
              <div className="flex-1 h-[1px] bg-metallic-800/30" />
              <span className="text-xs text-metallic-200 font-semibold">{w.source}</span>
              <span className="text-[11px] text-metallic-500 hidden sm:inline">— {w.role}</span>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-metallic-300 italic">{fusionArchitecture.principle}</p>
      </div>

      {/* Classification requirement */}
      <div className="p-4 rounded-lg border border-amber-forge/20 bg-amber-forge/5 mb-8">
        <p className="text-sm text-metallic-300 leading-relaxed">{classificationRequirement}</p>
      </div>

      {/* Explainability */}
      <div className="grid sm:grid-cols-2 gap-3">
        {explainability.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-amber-forge text-xs mt-0.5 flex-shrink-0">&#10003;</span>
            <span className="text-sm text-metallic-300">{item}</span>
          </div>
        ))}
      </div>

      {/* Key message */}
      <p className="mt-10 text-center text-base text-metallic-400 leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
