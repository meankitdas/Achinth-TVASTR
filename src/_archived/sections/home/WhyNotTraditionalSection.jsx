import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { whyNotTraditionalContent } from '@/content/homepage/why-not-traditional'

export function WhyNotTraditionalSection() {
  return (
    <SectionShell id={whyNotTraditionalContent.id}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title={whyNotTraditionalContent.title}
          subtitle={whyNotTraditionalContent.subtitle}
        />
        
        <p className="text-lg text-metallic-300 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
          {whyNotTraditionalContent.body}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(168,168,180,0.15)' }}>
                <th className="text-left py-4 px-4 text-sm font-bold text-metallic-300 uppercase tracking-wider">
                  Aspect
                </th>
                <th className="text-left py-4 px-4 text-sm font-bold text-metallic-300 uppercase tracking-wider">
                  Traditional Inspection
                </th>
                <th className="text-left py-4 px-4 text-sm font-bold text-amber-forge uppercase tracking-wider">
                  Tvastr
                </th>
              </tr>
            </thead>
            <tbody>
              {whyNotTraditionalContent.comparisons.map((comparison, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <td className="py-4 px-4 text-sm font-semibold text-white align-top">
                    {comparison.aspect}
                  </td>
                  <td className="py-4 px-4 text-sm text-metallic-400 align-top">
                    {comparison.traditional}
                  </td>
                  <td className="py-4 px-4 text-sm text-metallic-300 align-top">
                    {comparison.tvastr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-metallic-400 mt-12 max-w-2xl mx-auto italic">
          {whyNotTraditionalContent.keyMessage}
        </p>
      </div>
    </SectionShell>
  )
}