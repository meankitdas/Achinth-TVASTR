import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { operationalBenefitsContent } from '@/content/homepage/operational-benefits'

export function OperationalBenefitsSection() {
  return (
    <SectionShell id={operationalBenefitsContent.id}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title={operationalBenefitsContent.title}
          subtitle={operationalBenefitsContent.subtitle}
        />
        
        <p className="text-lg text-metallic-300 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
          {operationalBenefitsContent.body}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {operationalBenefitsContent.benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-6 rounded-lg transition-all duration-300"
              style={{
                background: 'rgba(17,17,19,0.6)',
                border: '1px solid rgba(168,168,180,0.08)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                  style={{ background: '#f59e0b' }}
                />
                <div className="flex-1">
                  <h3 className="text-base font-bold mb-2 text-white">
                    {benefit.name}
                  </h3>
                  <p className="text-sm text-metallic-400 leading-relaxed mb-3">
                    {benefit.description}
                  </p>
                  <p className="text-xs text-amber-forge/70 italic">
                    {benefit.metric}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}