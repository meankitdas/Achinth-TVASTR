import { platform } from '@/config/platformModel'
import { SectionShell } from '@/components/primitives/SectionShell'
import { FeatureGrid } from '@/components/primitives/FeatureGrid'

export function TechnicalDifferentiationSection() {
  const reasoningCapabilities = platform.capabilities.filter(c => c.category === "Reasoning")
  const architectureCapabilities = platform.capabilities.filter(c => c.category === "Architecture")

  return (
    <SectionShell id="technical-differentiation" type="technical-differentiation" content={{ title: "Technical Differentiation" }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Reasoning */}
          <div>
            <h3 className="text-2xl font-bold text-metallic-100 mb-6">Signal-First Reasoning</h3>
            <p className="text-base text-metallic-400 leading-relaxed mb-8">
              Traditional AI systems treat images as the primary input. Tvastr starts with raw signals — texture, temperature, and process parameters — to create a physically grounded understanding of defect formation.
            </p>
            <FeatureGrid features={reasoningCapabilities} />
          </div>

          {/* Right: Architecture */}
          <div>
            <h3 className="text-2xl font-bold text-metallic-100 mb-6">Architecture-First Design</h3>
            <p className="text-base text-metallic-400 leading-relaxed mb-8">
              Built as a persistent intelligence layer, not just an inspection tool. Every defect feeds a growing model of plant behavior — enabling evolution, not just classification.
            </p>
            <FeatureGrid features={architectureCapabilities} />
          </div>
        </div>
      </div>
    </SectionShell>
  )
}