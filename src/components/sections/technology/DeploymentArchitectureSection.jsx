import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { deploymentArchitectureContent } from '@/content/technology/index'

export function DeploymentArchitectureSection() {
  const { title, subtitle, body, coreProperties, deploymentModels, infrastructure, keyMessage } = deploymentArchitectureContent

  return (
    <SectionShell id="deployment-architecture">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Infrastructure" />
      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">{body}</p>

      {/* Core Properties */}
      <div className="p-6 rounded-xl border border-amber-forge/20 bg-amber-forge/5 mb-12">
        <h3 className="text-base font-bold text-metallic-100 mb-4">Core Properties</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {coreProperties.map((prop, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-amber-forge text-xs mt-0.5 flex-shrink-0">&#10003;</span>
              <span className="text-sm text-metallic-300">{prop}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Models */}
      <div className="mb-12">
        <h3 className="text-base font-bold text-metallic-100 mb-6 text-center">Deployment Models</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {deploymentModels.map((model, i) => (
            <div key={i} className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50">
              <h4 className="text-sm font-bold text-amber-forge mb-2">{model.name}</h4>
              <p className="text-xs text-metallic-400 leading-relaxed mb-3">{model.description}</p>
              
              <div className="space-y-1 mb-3">
                {model.components.map((comp, j) => (
                  <p key={j} className="text-[11px] text-metallic-300 flex items-start gap-1.5">
                    <span className="text-amber-forge/60 mt-0.5">&#8226;</span>
                    <span>{comp}</span>
                  </p>
                ))}
              </div>

              <p className="text-[11px] text-metallic-500 italic">{model.useCase}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {Object.values(infrastructure).map((item, i) => (
          <div key={i} className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50">
            <h4 className="text-sm font-bold text-metallic-100 mb-2">{item.title}</h4>
            <p className="text-xs text-metallic-400 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-metallic-400 mt-8 max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
