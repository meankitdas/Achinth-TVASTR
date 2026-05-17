import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { industryProblemContent } from '@/content/homepage/industry-problem'

export function IndustryProblemSection() {
  const { id, title, subtitle, body, problems } = industryProblemContent

  return (
    <SectionShell id={id}>
      <SectionHeader title={title} subtitle={subtitle} eyebrow="The Problem" />

      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Problem cards — 2x3 grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {problems.map((problem, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50"
          >
            <h4 className="text-sm font-bold text-metallic-100 mb-2">{problem.title}</h4>
            <p className="text-xs text-metallic-400 leading-relaxed">{problem.description}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}
