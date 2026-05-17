import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { spcContent } from '@/content/technology/index'

export function SPCSection() {
  const { title, subtitle, body, controlCharts, processCapability, applications } = spcContent

  return (
    <SectionShell id="spc">
      <SectionHeader title={title} subtitle={subtitle} align="center" />
      <p className="text-metallic-400 text-center max-w-3xl mx-auto mb-12">{body}</p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Control Charts */}
        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-4">{controlCharts.title}</h3>
          <p className="text-metallic-400 mb-6">{controlCharts.description}</p>
          {controlCharts.features.map((feature, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="text-lg font-semibold text-metallic-200 mb-2">{feature.name}</h4>
              <p className="text-sm text-metallic-500">{feature.description}</p>
              {feature.rules && (
                <ul className="mt-2 space-y-1">
                  {feature.rules.map((rule, ridx) => (
                    <li key={ridx} className="text-xs text-metallic-600 ml-4">• {rule}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Process Capability */}
        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-4">{processCapability.title}</h3>
          <p className="text-metallic-400 mb-6">{processCapability.description}</p>
          {processCapability.indices.map((index, idx) => (
            <div key={idx} className="mb-4">
              <h4 className="text-lg font-semibold text-metallic-200 mb-1">{index.name}</h4>
              <p className="text-xs text-metallic-600 mb-2">{index.fullName}</p>
              <p className="text-sm text-metallic-500 mb-2">{index.description}</p>
              {index.formula && (
                <code className="block text-xs text-amber-forge font-mono bg-metallic-950/50 p-2 rounded mb-2">
                  {index.formula}
                </code>
              )}
              {index.interpretation && (
                <ul className="space-y-1">
                  {index.interpretation.map((interp, iidx) => (
                    <li key={iidx} className="text-xs text-metallic-600">• {interp}</li>
                  ))}
                </ul>
              )}
              {index.levels && (
                <ul className="space-y-1 mt-2">
                  {index.levels.map((level, lidx) => (
                    <li key={lidx} className="text-xs text-metallic-600">• {level}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Applications */}
      <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-metallic-100 mb-4">Applications</h3>
        <ul className="grid md:grid-cols-2 gap-3">
          {applications.map((app, idx) => (
            <li key={idx} className="text-metallic-300 flex items-start gap-2">
              <span className="text-amber-forge mt-1">•</span>
              <span>{app}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  )
}
