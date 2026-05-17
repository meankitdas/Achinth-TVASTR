import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { fingerprintingContent } from '@/content/technology/index'

export function FingerprintingSection() {
  const { title, subtitle, body, alignmentPipeline, vectorFormat, clustering, similarityMatching, storage } = fingerprintingContent

  return (
    <SectionShell id="fingerprinting">
      <SectionHeader title={title} subtitle={subtitle} align="center" />
      <p className="text-metallic-400 text-center max-w-3xl mx-auto mb-12">{body}</p>

      {/* Alignment Methods */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-4">{alignmentPipeline.title}</h3>
        <p className="text-metallic-400 mb-6">{alignmentPipeline.description}</p>
        <div className="space-y-4">
          {alignmentPipeline.methods.map((method, idx) => (
            <div key={idx} className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-amber-forge font-bold text-sm">{method.priority}</span>
                <h4 className="text-lg font-semibold text-metallic-100">{method.name}</h4>
              </div>
              <p className="text-metallic-400 mb-3">{method.description}</p>
              <ul className="space-y-1">
                {method.process.map((step, sidx) => (
                  <li key={sidx} className="text-sm text-metallic-500 flex items-start gap-2">
                    <span className="text-amber-forge mt-1">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
              {method.performance && (
                <p className="text-xs text-metallic-600 mt-3">Performance: {method.performance}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Vector Format */}
      <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-6 mb-12">
        <h3 className="text-xl font-semibold text-metallic-100 mb-3">{vectorFormat.title}</h3>
        <p className="text-metallic-400 mb-4">{vectorFormat.description}</p>
        <div className="grid md:grid-cols-2 gap-3">
          {vectorFormat.fields.map((field, idx) => (
            <div key={idx} className="text-sm">
              <span className="text-amber-forge font-mono">{field.name}</span>
              <span className="text-metallic-500">: {field.description}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-metallic-600 mt-4 italic">{vectorFormat.note}</p>
      </div>

      {/* Clustering & Matching */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-3">{clustering.title}</h3>
          <p className="text-metallic-400 mb-4">{clustering.description}</p>
          <p className="text-sm text-metallic-500">{clustering.output}</p>
        </div>
        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-3">{similarityMatching.title}</h3>
          <p className="text-metallic-400 mb-4">{similarityMatching.description}</p>
          <ul className="space-y-2">
            {similarityMatching.applications.map((app, idx) => (
              <li key={idx} className="text-sm text-metallic-500 flex items-start gap-2">
                <span className="text-amber-forge mt-1">•</span>
                <span>{app}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  )
}
