import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { DiagramFlow } from '@/components/primitives/DiagramFlow'
import { perceptionEngineContent } from '@/content/technology/perception-engine'

export function PerceptionEngineSection() {
  const { title, subtitle, body, stages, designPrinciple, keyMessage } = perceptionEngineContent

  return (
    <SectionShell id="perception-engine">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Perception Layer" />

      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Pipeline flow diagram */}
      <DiagramFlow
        steps={stages.map((s) => s.name)}
        description="Each stage produces structured outputs that flow into the next. The final output is a feature vector — not a classification decision."
      />

      {/* Stage detail cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {stages.map((stage, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-amber-forge/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-amber-forge">{i + 1}</span>
              </div>
              <h4 className="text-sm font-bold text-metallic-100">{stage.name}</h4>
            </div>
            <p className="text-xs text-metallic-400 leading-relaxed mb-3">{stage.description}</p>
            <div className="px-3 py-1.5 bg-charcoal-900/80 border border-metallic-800/20 rounded text-[11px] text-metallic-300">
              Output: {stage.output}
            </div>
          </div>
        ))}
      </div>

      {/* Design principle */}
      <div className="mt-10 p-4 rounded-lg border border-amber-forge/20 bg-amber-forge/5 text-center">
        <p className="text-sm text-metallic-300 leading-relaxed">{designPrinciple}</p>
      </div>

      {/* Key message */}
      <p className="mt-8 text-center text-base text-metallic-400 leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
