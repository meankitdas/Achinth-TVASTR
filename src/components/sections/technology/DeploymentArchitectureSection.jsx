import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { deploymentArchitectureContent } from '@/content/technology'

export function DeploymentArchitectureSection() {
  const { title, subtitle, body, coreProperties, deploymentModels, databaseIntegration, apiArchitecture, hardwareRequirements, networkRequirements, dataRetention } = deploymentArchitectureContent

  return (
    <SectionShell id="deployment-architecture">
      <SectionHeader title={title} subtitle={subtitle} align="center" />
      <p className="text-metallic-400 text-center max-w-3xl mx-auto mb-12">{body}</p>

      {/* Core Properties */}
      <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-6 mb-12">
        <ul className="grid md:grid-cols-2 gap-3">
          {coreProperties.map((prop, idx) => (
            <li key={idx} className="text-metallic-300 flex items-start gap-2">
              <span className="text-amber-forge mt-1">✓</span>
              <span>{prop}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Deployment Models */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-6 text-center">Deployment Models</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {deploymentModels.map((model, idx) => (
            <div key={idx} className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-metallic-100 mb-3">{model.name}</h4>
              <p className="text-sm text-metallic-400 mb-4">{model.description}</p>
              <ul className="space-y-2 mb-4">
                {model.components.map((comp, cidx) => (
                  <li key={cidx} className="text-xs text-metallic-500 flex items-start gap-2">
                    <span className="text-amber-forge mt-1">•</span>
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-metallic-600 italic">Use Case: {model.useCase}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integration */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-3">{databaseIntegration.title}</h3>
          <p className="text-metallic-400 mb-4">{databaseIntegration.description}</p>
          <ul className="space-y-2">
            {databaseIntegration.features.map((feature, idx) => (
              <li key={idx} className="text-sm text-metallic-500">• {feature}</li>
            ))}
          </ul>
        </div>

        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-3">{apiArchitecture.title}</h3>
          <p className="text-metallic-400 mb-4">{apiArchitecture.description}</p>
          <ul className="space-y-2">
            {apiArchitecture.features.map((feature, idx) => (
              <li key={idx} className="text-sm text-metallic-500">• {feature}</li>
            ))}
          </ul>
          <p className="text-xs text-metallic-600 mt-3">Access: {apiArchitecture.access}</p>
        </div>
      </div>

      {/* Hardware Requirements */}
      <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-metallic-100 mb-6">{hardwareRequirements.title}</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-base font-semibold text-metallic-200 mb-3">Minimum</h4>
            <ul className="space-y-1">
              {hardwareRequirements.minimum.map((req, idx) => (
                <li key={idx} className="text-sm text-metallic-500">• {req}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-base font-semibold text-metallic-200 mb-3">Recommended</h4>
            <ul className="space-y-1">
              {hardwareRequirements.recommended.map((req, idx) => (
                <li key={idx} className="text-sm text-metallic-500">• {req}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
