import { heroContent } from '@/content/homepage/hero'
import { SectionHeader } from '@/components/primitives/SectionHeader'

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-charcoal-950"
    >
      {/* Radial forge glow backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(245,158,11,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />

      {/* Subtle accent lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-0 left-1/4 w-px h-full opacity-20"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245,158,11,0.3) 50%, transparent 100%)',
          }}
        />
        <div
          className="absolute top-0 right-1/3 w-px h-full opacity-20"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(245,158,11,0.3) 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-16 md:py-32">
        <div className="max-w-2xl">
          {/* Eyebrow label */}
          <div className="flex items-center gap-3 mb-5 md:mb-8">
            <div className="w-8 h-px bg-amber-forge" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-80">
              Industrial Intelligence
            </span>
          </div>

          {/* Main title */}
          <SectionHeader 
            title={heroContent.title} 
            subtitle={heroContent.subtitle}
          />

        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #0a0a0b 100%)',
        }}
      />

      {/* Scroll indicator arrow */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div
          className="w-px h-12 bg-metallic-400"
          style={{
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  )
}