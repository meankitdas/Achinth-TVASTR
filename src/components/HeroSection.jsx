import { useState, useEffect } from 'react'
import { LaserFlow } from './LaserFlow'

/**
 * HeroSection — Cinematic full-viewport landing section.
 *
 * Features an interactive LaserFlow WebGL shader that simulates
 * molten metal pouring down like a furnace, with mouse-reactive fog.
 * 
 * On low-power devices, shows a static fallback gradient.
 */
export function HeroSection() {
  const [shouldRenderEffect, setShouldRenderEffect] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detect low-power devices
    const isLowPower = 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
      (navigator.deviceMemory && navigator.deviceMemory < 4)

    if (isLowPower) {
      setShouldRenderEffect(false)
    }

    // Detect mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
  }

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
            'radial-gradient(ellipse 80% 60% at 60% 50%, rgba(245,158,11,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />

      {/* LaserFlow WebGL background — molten metal beam pouring down */}
      <div className="absolute inset-0 pointer-events-none">
        {shouldRenderEffect ? (
          <LaserFlow
            color="#ff9100"
            centerYFraction={isMobile ? 0.15 : 0.1}
            verticalBeamOffset={0.0}
            horizontalBeamOffset={0.0}
            verticalSizing={isMobile ? 3.0 : 5.0}
            horizontalSizing={isMobile ? 3.0 : 2.5}
            fogIntensity={isMobile ? 0.1 : 0.2}
            fogScale={isMobile ? 0.1 : 0.3}
            flowSpeed={1.0}
            wispDensity={isMobile ? 1.0 : 1.4}
            wispSpeed={13}
            wispIntensity={isMobile ? 2.5 : 5.2}
            flowStrength={0.07}
            decay={isMobile ? 0.5 : 0.6}
            falloffStart={1.2}
            mouseTiltStrength={isMobile ? 0.0 : 0.12}
            fogFallSpeed={1.0}
            mouseSmoothTime={0.25}
            dpr={isMobile ? 1 : undefined}
            style={{ position: 'absolute', inset: 0 }}
          />
        ) : (
          // Static fallback for low-power devices
          <div 
            className="w-full h-full"
            style={{
              background: 'radial-gradient(ellipse 60% 50% at 60% 50%, rgba(245,158,11,0.12) 0%, transparent 70%)',
            }}
          />
        )}
      </div>

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-24 pb-16 md:py-32">
        <div className="max-w-2xl">
          {/* Eyebrow label */}
          <div className="flex items-center gap-3 mb-5 md:mb-8">
            <div className="w-8 h-px bg-amber-forge" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-80">
              Industrial AI
            </span>
          </div>

          {/* Main title */}
          <h1 className="mb-6">
              <span
                className="block text-[clamp(4rem,3.5vw,9rem)] font-black leading-none tracking-tight"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 40%, #888896 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.2))',
                }}
              >
                TVASTR INDUSTRIAL INTELLIGENCE
              </span>
            <span className="block text-xl md:text-2xl lg:text-3xl font-light text-amber-glow mt-2 md:mt-4 tracking-wide">
              Casting Defect Detection and Process Intelligence
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-metallic-300 leading-relaxed mb-10 md:mb-12 max-w-lg">
            Automated inspection. Structured data. Root cause identification.
          </p>

          {/* CTA */}
          <div className="flex items-center gap-6">
            <a
              href="#products"
              onClick={(e) => {
                e.preventDefault()
                scrollToProducts()
              }}
              className="group relative inline-block px-8 py-4 text-sm font-semibold tracking-widest uppercase overflow-hidden transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
                border: '1px solid rgba(245,158,11,0.4)',
                color: '#fbbf24',
                letterSpacing: '0.2em',
              }}
            >
              {/* Hover fill animation */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'rgba(245,158,11,0.1)' }}
              />
              {/* Glow on hover */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: 'inset 0 0 20px rgba(245,158,11,0.15)' }}
              />
              <span className="relative">Explore Systems</span>
            </a>

            {/* Secondary scroll indicator */}
            <div className="flex items-center gap-2 text-metallic-400 text-xs tracking-widest uppercase opacity-60">
              <div className="w-4 h-px bg-metallic-400" />
              <span>Scroll</span>
            </div>
          </div>
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
