import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { signalFirstAIContent } from '@/content/homepage/signal-first-ai'

export function SignalFirstAISection() {
  const { title, subtitle, body, signalSystems, differentiators, keyMessage } = signalFirstAIContent

  return (
    <SectionShell id="signal-first-ai">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Signal Architecture" />

      {/* Body text */}
      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Signal systems diagram — 2x3 grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {signalSystems.map((signal, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50 hover:border-amber-forge/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-forge/70" />
              <h4 className="text-sm font-bold text-metallic-100">{signal.name}</h4>
            </div>
            <p className="text-xs text-metallic-400 leading-relaxed">{signal.description}</p>
          </div>
        ))}
      </div>

      {/* Differentiators */}
      <div className="border-t border-metallic-800/20 pt-8">
        <h3 className="text-base font-bold text-metallic-200 mb-4">
          How This Differs From Standard Inspection AI
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {differentiators.map((diff, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-amber-forge text-xs mt-1 flex-shrink-0">&#10003;</span>
              <span className="text-sm text-metallic-300">{diff}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key message */}
      <p className="mt-10 text-center text-base text-metallic-400 leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
