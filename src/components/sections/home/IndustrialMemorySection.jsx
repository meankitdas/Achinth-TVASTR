import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { industrialMemoryContent } from '@/content/homepage/industrial-memory'

export function IndustrialMemorySection() {
  const { title, subtitle, body, memoryCapabilities, keyMessage } = industrialMemoryContent

  return (
    <SectionShell id="industrial-memory">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Manufacturing Memory" />

      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Memory capabilities — 2x3 grid with visual nodes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {memoryCapabilities.map((cap, i) => (
          <div
            key={i}
            className="group relative p-5 rounded-lg border bg-bg-primary/50 hover:border-telemetry-primary/30 transition-colors"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {/* Index indicator */}
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-telemetry-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-telemetry-primary/60">{i + 1}</span>
            </div>

            <h4 className="text-sm font-bold text-txt-primary mb-2 pr-6">{cap.name}</h4>
            <p className="text-xs text-txt-secondary leading-relaxed">{cap.description}</p>
          </div>
        ))}
      </div>

      {/* Key message */}
      <p className="mt-10 text-center text-base text-txt-muted leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
