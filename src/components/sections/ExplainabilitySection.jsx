import { explainabilityContent } from '@/content/homepage/explainability'
import { SectionShell } from '@/components/primitives/SectionShell'

export function ExplainabilitySection() {
  return (
    <SectionShell id="explainability" type="explainability" content={explainabilityContent}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Traditional AI */}
          <div>
            <h3 className="text-2xl font-bold text-metallic-100 mb-6">Traditional AI Systems</h3>
            <p className="text-base text-metallic-400 leading-relaxed mb-6">
              {explainabilityContent.sections[0].description}
            </p>
            <ul className="space-y-3">
              {explainabilityContent.sections[0].points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-2" />
                  <p className="text-sm text-metallic-400 leading-relaxed">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Tvastr Reasoning */}
          <div>
            <h3 className="text-2xl font-bold text-metallic-100 mb-6">Tvastr Explainable Reasoning</h3>
            <p className="text-base text-metallic-400 leading-relaxed mb-6">
              {explainabilityContent.sections[1].description}
            </p>
            <ul className="space-y-3">
              {explainabilityContent.sections[1].points.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-forge flex-shrink-0 mt-2" />
                  <p className="text-sm text-metallic-400 leading-relaxed">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}