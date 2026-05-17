import { qualityGatesContent } from '@/content/homepage/quality-gates'
import { SectionShell } from '@/components/primitives/SectionShell'

export function QualityGatesSection() {
  return (
    <SectionShell id="quality-gates" type="quality-gates" content={qualityGatesContent}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-10">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-base text-metallic-400 leading-relaxed">
              {qualityGatesContent.body}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {qualityGatesContent.gates.map((gate, i) => (
              <div
                key={i}
                className="p-6 bg-charcoal-950 rounded-lg border border-metallic-800/30"
              >
                <h4 className="text-xl font-bold text-metallic-100 mb-3">
                  {gate.name}
                </h4>
                <p className="text-base text-metallic-400 mb-4 leading-relaxed">
                  {gate.description}
                </p>
                <div className="space-y-2">
                  {gate.signals.map((signal, j) => (
                    <div
                      key={j}
                      className="text-sm text-metallic-500 bg-metallic-900/20 px-3 py-1 rounded-full inline-block"
                    >
                      {signal}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center max-w-4xl mx-auto pt-8">
            <p className="text-lg text-amber-forge font-semibold italic leading-relaxed">
              {qualityGatesContent.keyMessage}
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}