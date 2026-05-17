import { Link } from 'react-router-dom'
import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { platformOverviewContent } from '@/content/homepage/platform-overview'

export function PlatformOverviewSection() {
  return (
    <SectionShell id={platformOverviewContent.id}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title={platformOverviewContent.title}
          subtitle={platformOverviewContent.subtitle}
        />
        
        <p className="text-lg text-metallic-300 leading-relaxed mb-12 text-center max-w-3xl mx-auto">
          {platformOverviewContent.body}
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {platformOverviewContent.systems.map((system) => (
            <div
              key={system.id}
              className="p-8 rounded-lg transition-all duration-300"
              style={{
                background: 'rgba(17,17,19,0.6)',
                border: '1px solid rgba(168,168,180,0.08)',
              }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {system.name}
                </h3>
                <p className="text-sm text-amber-forge font-semibold mb-4">
                  {system.tagline}
                </p>
                <p className="text-sm text-metallic-400 leading-relaxed">
                  {system.description}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-metallic-500 mb-3">
                  Key Capabilities
                </h4>
                <ul className="space-y-2">
                  {system.capabilities.map((capability, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-metallic-400">
                      <span className="text-amber-forge mt-1">•</span>
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={system.route}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-forge hover:text-amber-500 transition-colors duration-200"
              >
                Learn More
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm text-metallic-400 mb-4">
            {platformOverviewContent.integration}
          </p>
          <p className="text-base font-semibold text-white">
            {platformOverviewContent.keyMessage}
          </p>
        </div>
      </div>
    </SectionShell>
  )
}