import { Link } from 'react-router-dom'
import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { platformOverviewContent } from '@/content/homepage/platform-overview'

export function PlatformOverviewSection() {
  const { id, title, subtitle, body, systems, keyMessage } = platformOverviewContent

  return (
    <SectionShell id={id}>
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Platform" />

      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {systems.map((system) => (
          <div
            key={system.id}
            className="p-6 rounded-lg border border-metallic-800/20 bg-charcoal-950/50"
          >
            <h3 className="text-xl font-bold text-metallic-100 mb-1">{system.name}</h3>
            <p className="text-xs text-amber-forge font-semibold mb-3">{system.tagline}</p>
            <p className="text-sm text-metallic-400 leading-relaxed mb-4">{system.description}</p>
            <Link
              to={system.route}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-forge hover:text-amber-500 transition-colors"
            >
              Explore
              <span>→</span>
            </Link>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-metallic-400 max-w-2xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
