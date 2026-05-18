import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { coreArchitectureContent } from '@/content/technology/core-architecture'

export function CoreArchitectureSection() {
  const { title, subtitle, body, layers, keyMessage } = coreArchitectureContent

  return (
    <SectionShell id="core-architecture">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="System Architecture" />

      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Layered architecture diagram — stacked with flow indicators */}
      <div className="space-y-4">
        {layers.map((layer, i) => (
          <div key={layer.id} className="relative">
            {/* Flow arrow between layers */}
            {i > 0 && (
              <div className="flex justify-center -mt-2 mb-2">
                <div className="w-[1px] h-4 bg-amber-forge/40" />
              </div>
            )}

            <div className="flex flex-col md:flex-row items-stretch gap-4 p-5 rounded-lg border border-border-subtle bg-bg-primary/50">
              {/* Layer label */}
              <div className="flex-shrink-0 md:w-48 flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-telemetry-primary/10 border border-telemetry-primary/30 flex items-center justify-center">
                  <span className="text-xs font-bold text-telemetry-primary">{i + 1}</span>
                </div>
                <h4 className="text-sm font-bold text-txt-primary">{layer.name}</h4>
              </div>

              {/* Description */}
              <div className="flex-1">
                <p className="text-xs text-txt-secondary leading-relaxed mb-3">{layer.description}</p>
                
                {/* Responsibilities */}
                <div className="flex flex-wrap gap-2">
                  {layer.responsibilities.map((resp, j) => (
                    <span
                      key={j}
                      className="inline-block px-2 py-1 text-[11px] text-txt-secondary bg-charcoal-900/80 border border-border-subtle rounded"
                    >
                      {resp}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key message */}
      <p className="mt-10 text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
