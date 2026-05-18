import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { deploymentContent } from '@/content/homepage/deployment'

export function DeploymentSection() {
  const { id, title, subtitle, body, principles, keyMessage } = deploymentContent

  return (
    <SectionShell id={id}>
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Deployment" />

      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {principles.map((principle, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50"
          >
            <h4 className="text-sm font-bold text-metallic-100 mb-2">{principle.name}</h4>
            <p className="text-xs text-metallic-400 leading-relaxed">{principle.description}</p>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-metallic-400 max-w-2xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
