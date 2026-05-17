import { edgeDeploymentContent } from '@/content/homepage/edge-deployment'
import { SectionShell } from '@/components/primitives/SectionShell'

export function EdgeDeploymentSection() {
  return (
    <SectionShell id="edge-deployment" type="edge-deployment" content={edgeDeploymentContent}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: text */}
          <div className="flex flex-col justify-center">
            <p className="text-base text-metallic-400 leading-relaxed mb-8">
              {edgeDeploymentContent.body}
            </p>
            <p className="text-sm text-red-400 font-medium italic">
              {edgeDeploymentContent.securityNote}
            </p>
          </div>

          {/* Right: principles */}
          <div className="space-y-6">
            {edgeDeploymentContent.keyPrinciples.map((principle, i) => (
              <div
                key={i}
                className="p-6 bg-charcoal-950 rounded-lg border border-metallic-800/30"
              >
                <h4 className="text-lg font-bold text-metallic-100 mb-2">
                  {principle.title}
                </h4>
                <p className="text-sm text-metallic-400 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}