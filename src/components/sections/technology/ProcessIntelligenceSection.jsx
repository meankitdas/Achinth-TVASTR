import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { processIntelligenceContent } from '@/content/technology'

export function ProcessIntelligenceSection() {
  const { title, subtitle, body, analyticsCapabilities, qualityFrameworks, processIntelligence, architecture, realTimeUpdates } = processIntelligenceContent

  return (
    <SectionShell id="process-intelligence">
      <SectionHeader title={title} subtitle={subtitle} align="center" />
      <p className="text-metallic-400 text-center max-w-3xl mx-auto mb-12">{body}</p>

      {/* Analytics */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-6">Analytics Capabilities</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {analyticsCapabilities.map((cap, idx) => (
            <div key={idx} className="border border-metallic-800 bg-metallic-950/30 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-metallic-100 mb-2">{cap.name}</h4>
              <p className="text-xs text-amber-forge font-mono mb-2">{cap.endpoint}</p>
              <p className="text-sm text-metallic-400">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Frameworks */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-6">Quality Frameworks</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {qualityFrameworks.map((fw, idx) => (
            <div key={idx} className="border border-metallic-800 bg-metallic-950/30 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-metallic-100 mb-1">{fw.name}</h4>
              <p className="text-xs text-metallic-600 mb-2">{fw.fullName}</p>
              <p className="text-sm text-metallic-400">{fw.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Process Intelligence */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-6">Process Intelligence</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {processIntelligence.map((proc, idx) => (
            <div key={idx} className="border border-metallic-800 bg-metallic-950/30 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-metallic-100 mb-2">{proc.name}</h4>
              <p className="text-sm text-metallic-400">{proc.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture */}
      <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-metallic-100 mb-4">{architecture.title}</h3>
        <ul className="grid md:grid-cols-2 gap-3">
          {architecture.components.map((comp, idx) => (
            <li key={idx} className="text-metallic-300 flex items-start gap-2">
              <span className="text-amber-forge mt-1">•</span>
              <span>{comp}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-metallic-500 mt-4">{architecture.deployment}</p>
      </div>
    </SectionShell>
  )
}
