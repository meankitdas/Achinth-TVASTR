import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { deploymentContent } from '@/content/homepage/deployment'

export function DeploymentSection() {
  return (
    <SectionShell id={deploymentContent.id}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title={deploymentContent.title}
          subtitle={deploymentContent.subtitle}
        />
        
        <p className="text-lg text-metallic-300 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
          {deploymentContent.body}
        </p>

        {/* Deployment Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {deploymentContent.features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg transition-all duration-300"
              style={{
                background: 'rgba(17,17,19,0.6)',
                border: '1px solid rgba(168,168,180,0.08)',
              }}
            >
              <h3 className="text-base font-bold mb-3 text-white">
                {feature.name}
              </h3>
              <p className="text-sm text-metallic-400 leading-relaxed mb-4">
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-metallic-500">
                    <span className="text-amber-forge mt-1">•</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Deployment Models */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-8 text-white">
            Deployment Models
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {deploymentContent.deployment_models.map((model, index) => (
              <div
                key={index}
                className="p-6 rounded-lg text-center transition-all duration-300"
                style={{
                  background: 'rgba(17,17,19,0.6)',
                  border: '1px solid rgba(168,168,180,0.08)',
                }}
              >
                <h4 className="text-sm font-bold mb-3 text-amber-forge">
                  {model.name}
                </h4>
                <p className="text-xs text-metallic-400 leading-relaxed">
                  {model.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-metallic-400 mt-12 max-w-2xl mx-auto">
          {deploymentContent.keyMessage}
        </p>
      </div>
    </SectionShell>
  )
}