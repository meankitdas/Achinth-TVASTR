import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { inspectionPipelineContent } from '@/content/technology'

export function InspectionPipelineSection() {
  const { title, subtitle, body, stages, postDecisionStages, keyFeatures } = inspectionPipelineContent

  return (
    <SectionShell id="inspection-pipeline">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        align="center"
      />
      
      <p className="text-metallic-400 text-center max-w-3xl mx-auto mb-12">
        {body}
      </p>

      {/* Pipeline Stages */}
      <div className="space-y-4 mb-12">
        {stages.map((stage) => (
          <div
            key={stage.number}
            className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg hover:border-metallic-700 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-amber-forge/10 border border-amber-forge/30 flex items-center justify-center">
                <span className="text-amber-forge font-bold text-lg">{stage.number}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-metallic-100 mb-2">
                  {stage.name}
                </h3>
                <p className="text-metallic-400 mb-3">
                  {stage.description}
                </p>
                <ul className="space-y-1">
                  {stage.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-metallic-500 flex items-start gap-2">
                      <span className="text-amber-forge mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post-Decision Stages */}
      <div className="border-t border-metallic-800 pt-8 mb-12">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-6 text-center">
          Post-Decision Stages
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {postDecisionStages.map((stage) => (
            <div
              key={stage.number}
              className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg"
            >
              <div className="text-amber-forge font-bold text-sm mb-2">
                Stage {stage.number}
              </div>
              <h4 className="text-lg font-semibold text-metallic-100 mb-2">
                {stage.name}
              </h4>
              <p className="text-sm text-metallic-400">
                {stage.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-metallic-100 mb-4">
          Key Features
        </h3>
        <ul className="grid md:grid-cols-2 gap-3">
          {keyFeatures.map((feature, idx) => (
            <li key={idx} className="text-metallic-300 flex items-start gap-2">
              <span className="text-amber-forge mt-1">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  )
}
