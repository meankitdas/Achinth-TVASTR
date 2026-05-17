import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { fishboneContent } from '@/content/technology/index'

export function FishboneSection() {
  const { title, subtitle, body, fishboneDiagrams, fmea, rootCauseWorkflow, applications } = fishboneContent

  return (
    <SectionShell id="fishbone">
      <SectionHeader title={title} subtitle={subtitle} align="center" />
      <p className="text-metallic-400 text-center max-w-3xl mx-auto mb-12">{body}</p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Fishbone */}
        <div>
          <h3 className="text-2xl font-semibold text-metallic-100 mb-4">{fishboneDiagrams.title}</h3>
          <p className="text-metallic-400 mb-6">{fishboneDiagrams.description}</p>
          <div className="space-y-4">
            {fishboneDiagrams.categories.map((cat, idx) => (
              <div key={idx} className="border border-metallic-800 bg-metallic-950/30 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-metallic-100 mb-2">{cat.name}</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {cat.factors.map((factor, fidx) => (
                    <li key={fidx} className="text-sm text-metallic-500">• {factor}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FMEA */}
        <div>
          <h3 className="text-2xl font-semibold text-metallic-100 mb-4">{fmea.title}</h3>
          <p className="text-metallic-400 mb-6">{fmea.description}</p>
          <div className="space-y-3">
            {fmea.components.map((comp, idx) => (
              <div key={idx} className="border border-metallic-800 bg-metallic-950/30 p-3 rounded">
                <h4 className="text-base font-semibold text-metallic-100 mb-1">{comp.name}</h4>
                <p className="text-sm text-metallic-500 mb-1">{comp.description}</p>
                {comp.scale && <p className="text-xs text-metallic-600 italic">{comp.scale}</p>}
                {comp.formula && <code className="block text-xs text-amber-forge font-mono mt-2">{comp.formula}</code>}
                {comp.threshold && <p className="text-xs text-metallic-600 mt-1">{comp.threshold}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workflow */}
      <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-metallic-100 mb-4">{rootCauseWorkflow.title}</h3>
        <ol className="space-y-2">
          {rootCauseWorkflow.steps.map((step, idx) => (
            <li key={idx} className="text-metallic-300 flex items-start gap-3">
              <span className="text-amber-forge font-bold">{idx + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  )
}
