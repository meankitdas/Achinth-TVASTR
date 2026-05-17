import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { paretoContent } from '@/content/technology/index'

export function ParetoSection() {
  const { title, subtitle, body, paretoAnalysis, spatialConcentration, prioritizationWorkflow, integrations, benefits } = paretoContent

  return (
    <SectionShell id="pareto">
      <SectionHeader title={title} subtitle={subtitle} align="center" />
      <p className="text-metallic-400 text-center max-w-3xl mx-auto mb-12">{body}</p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-3">{paretoAnalysis.title}</h3>
          <p className="text-metallic-400 mb-4">{paretoAnalysis.description}</p>
          <p className="text-sm text-amber-forge mb-4">{paretoAnalysis.principle}</p>
          <ul className="space-y-2">
            {paretoAnalysis.outputs.map((output, idx) => (
              <li key={idx} className="text-sm text-metallic-500 flex items-start gap-2">
                <span className="text-amber-forge mt-1">•</span>
                <span>{output}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-3">{spatialConcentration.title}</h3>
          <p className="text-metallic-400 mb-4">{spatialConcentration.description}</p>
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-metallic-200 mb-2">Applications:</h4>
            <ul className="space-y-1">
              {spatialConcentration.applications.map((app, idx) => (
                <li key={idx} className="text-xs text-metallic-500">• {app}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Workflow */}
      <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-6 mb-12">
        <h3 className="text-xl font-semibold text-metallic-100 mb-4">{prioritizationWorkflow.title}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prioritizationWorkflow.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-amber-forge font-bold text-lg">{step.step}</span>
              <div>
                <h4 className="text-metallic-100 font-semibold mb-1">{step.name}</h4>
                <p className="text-sm text-metallic-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <h3 className="text-2xl font-semibold text-metallic-100 mb-6 text-center">Benefits</h3>
        <ul className="grid md:grid-cols-2 gap-3 max-w-4xl mx-auto">
          {benefits.map((benefit, idx) => (
            <li key={idx} className="text-metallic-300 flex items-start gap-2">
              <span className="text-amber-forge mt-1">•</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  )
}
