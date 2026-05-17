import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { signalAnalysisContent } from '@/content/technology/index'

export function SignalAnalysisSection() {
  const { title, subtitle, body, featureCategories, scoringFormula, classificationRules, whySignalFirst } = signalAnalysisContent

  return (
    <SectionShell id="signal-analysis">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        align="center"
      />
      
      <p className="text-metallic-400 text-center max-w-3xl mx-auto mb-12">
        {body}
      </p>

      {/* Feature Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {featureCategories.map((category, idx) => (
          <div
            key={idx}
            className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-metallic-100">
                {category.name}
              </h3>
              <span className="text-amber-forge font-bold text-sm">
                {category.weight}
              </span>
            </div>
            <p className="text-sm text-metallic-400 mb-4">
              {category.description}
            </p>
            <ul className="space-y-2 mb-4">
              {category.components.map((component, cidx) => (
                <li key={cidx} className="text-xs text-metallic-500 flex items-start gap-2">
                  <span className="text-amber-forge mt-0.5">•</span>
                  <span>{component}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-metallic-800 pt-3">
              <p className="text-xs text-metallic-500 italic">
                {category.interpretation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Scoring Formula */}
      <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-6 mb-12">
        <h3 className="text-xl font-semibold text-metallic-100 mb-3">
          {scoringFormula.title}
        </h3>
        <code className="block text-amber-forge font-mono text-sm mb-3 p-4 bg-metallic-950/50 rounded">
          {scoringFormula.formula}
        </code>
        <p className="text-metallic-400 text-sm">
          {scoringFormula.description}
        </p>
      </div>

      {/* Classification Rules */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-6 text-center">
          Hard Threshold Classification Rules
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {classificationRules.map((rule, idx) => (
            <div
              key={idx}
              className="border border-metallic-800 bg-metallic-950/30 p-4 rounded-lg"
            >
              <h4 className="text-lg font-semibold text-metallic-100 mb-2">
                {rule.defectType}
              </h4>
              <p className="text-sm text-metallic-400 mb-2">
                {rule.rule}
              </p>
              <p className="text-xs text-metallic-500 italic">
                {rule.signals}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Signal First */}
      <div className="border-t border-metallic-800 pt-8">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-6 text-center">
          Why Signal-First Classification?
        </h3>
        <ul className="max-w-3xl mx-auto space-y-3">
          {whySignalFirst.map((reason, idx) => (
            <li key={idx} className="text-metallic-300 flex items-start gap-3">
              <span className="text-amber-forge mt-1">•</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  )
}
