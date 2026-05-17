import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { workflowIntegrationContent } from '@/content/homepage/workflow-integration'

export function WorkflowIntegrationSection() {
  return (
    <SectionShell id={workflowIntegrationContent.id}>
      <div className="max-w-5xl mx-auto">
        <SectionHeader
          title={workflowIntegrationContent.title}
          subtitle={workflowIntegrationContent.subtitle}
        />
        
        <p className="text-lg text-metallic-300 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
          {workflowIntegrationContent.body}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowIntegrationContent.integrations.map((integration, index) => (
            <div
              key={index}
              className="p-6 rounded-lg transition-all duration-300"
              style={{
                background: 'rgba(17,17,19,0.6)',
                border: '1px solid rgba(168,168,180,0.08)',
              }}
            >
              <h3 className="text-base font-bold mb-3 text-white">
                {integration.name}
              </h3>
              <p className="text-sm text-metallic-400 leading-relaxed mb-4">
                {integration.description}
              </p>
              <ul className="space-y-2">
                {integration.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-metallic-500">
                    <span className="text-amber-forge mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-metallic-400 mt-12 max-w-2xl mx-auto">
          {workflowIntegrationContent.keyMessage}
        </p>
      </div>
    </SectionShell>
  )
}