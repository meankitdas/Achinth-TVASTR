import { howItWorksContent } from '@/content/homepage/how-it-works'
import { SectionShell } from '@/components/primitives/SectionShell'
import { DiagramFlow } from '@/components/primitives/DiagramFlow'

export function HowItWorksSection() {
  return (
    <SectionShell id="how-it-works" type="how-it-works" content={howItWorksContent}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <DiagramFlow
            steps={howItWorksContent.steps}
            description={howItWorksContent.flowDescription}
          />
        </div>
      </div>
    </SectionShell>
  )
}