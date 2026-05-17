import { industryProblemContent } from '@/content/homepage/industry-problem'
import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'

export function IndustryProblemSection() {
  return (
    <SectionShell id="industry-problem" type="industry-problem" content={industryProblemContent}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left column: visual */}
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              {industryProblemContent.bullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-amber-forge flex-shrink-0 mt-2"
                    style={{ background: '#f59e0b' }}
                  />
                  <p className="text-sm md:text-base text-metallic-400 leading-relaxed">
                    {bullet}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: text */}
          <div className="flex flex-col justify-center">
            <p className="text-base md:text-lg text-metallic-300 leading-relaxed">
              {industryProblemContent.body}
            </p>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}