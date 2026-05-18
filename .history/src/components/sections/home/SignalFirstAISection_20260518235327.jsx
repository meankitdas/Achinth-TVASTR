import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { signalFirstAIContent } from '@/content/homepage/signal-first-ai'

export function SignalFirstAISection() {
  const { title, subtitle, body, signalSystems, differentiators, keyMessage } = signalFirstAIContent

  return (
    <SectionShell id="signal-first-ai">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Signal Architecture" />

      {/* Body text */}
      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Signal systems diagram — 2x3 grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {signalSystems.map((signal, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border bg-bg-primary/50 hover:border-telemetry-primary/30 transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-telemetry-primary/70" />
              <h4 className="text-sm font-bold text-txt-primary">{signal.name}</h4>
            </div>
            <p className="text-xs text-txt-secondary leading-relaxed">{signal.description}</p>
          </div>
        ))}
      </div>

      {/* Differentiators */}
      <div className="border-t pt-8" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-base font-bold text-txt-primary mb-4">
          How This Differs From Standard Inspection AI
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {differentiators.map((diff, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-telemetry-primary text-xs mt-1 flex-shrink-0">&#10003;</span>
              <span className="text-sm text-txt-secondary">{diff}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key message */}
      <p className="mt-10 text-center text-base text-txt-muted leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
