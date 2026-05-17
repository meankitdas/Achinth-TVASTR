import { architectureContent } from '@/content/homepage/architecture'
import { SectionShell } from '@/components/primitives/SectionShell'
import { IconResolver } from '@/components/primitives/IconResolver'

export function PlatformArchitectureSection() {
  return (
    <SectionShell id="architecture" type="architecture" content={architectureContent}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="space-y-6">
          {architectureContent.layers.map((layer, i) => (
            <div
              key={layer.id}
              className="flex items-center gap-6 md:gap-12 p-6 rounded-lg"
              style={{
                background: 'rgba(26,26,30,0.6)',
                border: '1px solid rgba(168,168,180,0.15)',
                boxShadow: '0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)',
              }}
            >
              {/* Left: icon */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-md"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.3)',
                }}
              >
                <IconResolver iconId={layer.icon} />
              </div>

              {/* Right: text */}
              <div>
                <h3 className="text-lg font-bold text-metallic-100 mb-1">
                  {layer.name}
                </h3>
                <p className="text-sm text-metallic-400 leading-relaxed">
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}