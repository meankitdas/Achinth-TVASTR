import { researchContent } from '@/content/homepage/research'
import { SectionShell } from '@/components/primitives/SectionShell'

export function ResearchSection() {
  return (
    <SectionShell id="research" type="research" content={researchContent}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <p className="text-base text-metallic-400 leading-relaxed max-w-4xl mx-auto mb-12">
          {researchContent.body}
        </p>

        <div className="space-y-8">
          {researchContent.pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-6 bg-charcoal-950 rounded-lg border border-metallic-800/30"
            >
              <h3 className="text-xl font-bold text-metallic-100 mb-3">
                {pillar.name}
              </h3>
              <p className="text-base text-metallic-400 mb-3 leading-relaxed">
                {pillar.description}
              </p>
              <p className="text-sm text-amber-forge font-medium italic">
                {pillar.relevance}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}