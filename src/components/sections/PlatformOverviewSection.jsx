import { Link } from 'react-router-dom'
import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { platformOverviewContent } from '@/content/homepage/platform-overview'

export function PlatformOverviewSection() {
  const { id, title, subtitle, body, systems, keyMessage } = platformOverviewContent

  return (
    <SectionShell id={id}>
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Platform" />

      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        {systems.map((system) => (
          <div
            key={system.id}
            className="p-6 rounded-lg border bg-bg-primary/50"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <h3 className="text-xl font-bold text-txt-primary mb-1">{system.name}</h3>
            <p className="text-xs text-telemetry-primary font-semibold mb-3">{system.tagline}</p>
            <p className="text-sm text-txt-secondary leading-relaxed mb-4">{system.description}</p>
            <Link
              to={system.route}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-telemetry-primary hover:text-telemetry-secondary transition-colors"
            >
              Explore
              <span>→</span>
            </Link>
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-txt-muted max-w-2xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
