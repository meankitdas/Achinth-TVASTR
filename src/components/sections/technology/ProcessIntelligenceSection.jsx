import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { processIntelligenceContent } from '@/content/technology/index'

export function ProcessIntelligenceSection() {
  const { title, subtitle, body, capabilities, architecture, keyMessage } = processIntelligenceContent

  return (
    <SectionShell id="process-intelligence">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Process Layer" />
      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">{body}</p>

      {/* Capabilities */}
      <div className="space-y-6 mb-12">
        {capabilities.map((cap, i) => (
          <div key={i} className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-md bg-amber-forge/10 border border-amber-forge/30 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-forge">{i + 1}</span>
              </div>
              <h4 className="text-base font-bold text-metallic-100">{cap.name}</h4>
            </div>
            <p className="text-xs text-metallic-400 leading-relaxed mb-3">{cap.description}</p>
            <div className="flex flex-wrap gap-2">
              {cap.features.map((feat, j) => (
                <span
                  key={j}
                  className="inline-block px-2 py-1 text-[11px] text-metallic-300 bg-charcoal-900/80 border border-metallic-800/20 rounded"
                >
                  {feat}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture summary */}
      <div className="p-6 rounded-xl border border-amber-forge/20 bg-amber-forge/5 mb-8">
        <h3 className="text-base font-bold text-metallic-100 mb-4">Architecture</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {Object.entries(architecture).map(([key, value]) => (
            <div key={key} className="flex items-start gap-2">
              <span className="text-amber-forge text-xs mt-0.5 flex-shrink-0">&#10003;</span>
              <span className="text-sm text-metallic-300">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-metallic-400 mt-8 max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
