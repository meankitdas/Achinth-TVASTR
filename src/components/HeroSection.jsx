import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ForgeCore } from '../three/ForgeCore'
import { FloatingGeometry } from '../three/FloatingGeometry'

/**
 * HeroSection — Cinematic full-viewport landing section.
 *
 * Layout: Two-column on desktop (text left, 3D canvas right),
 * stacked on mobile (canvas behind text).
 *
 * The Three.js canvas renders ForgeCore + FloatingGeometry.
 * Canvas is pointer-events-none so scroll/interactions pass through.
 * 
 * On low-power devices, shows a static fallback instead of 3D canvas.
 */
export function HeroSection() {
  const [shouldRenderThree, setShouldRenderThree] = useState(true)
  const [scaleFactor, setScaleFactor] = useState(1)

  useEffect(() => {
    // Detect low-power devices
    const isLowPower = 
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
      (navigator.deviceMemory && navigator.deviceMemory < 4)

    if (isLowPower) {
      setShouldRenderThree(false)
    }

    // Compute initial scale based on viewport width
    const updateScale = () => {
      const width = window.innerWidth
      if (width < 768) {
        setScaleFactor(0.35) // Mobile: much smaller scene
      } else if (width < 1024) {
        setScaleFactor(0.8) // Tablet: medium scene
      } else {
        setScaleFactor(1.0) // Desktop: full scene
      }
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
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

      {/* Three.js Canvas — full section, pointer-events-none */}
      {/* On low-power devices, show static fallback */}
      <div className="absolute inset-0 pointer-events-none opacity-50 md:opacity-100">
        {shouldRenderThree ? (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 1.5]} // cap pixel ratio for performance
          >
            <Suspense fallback={null}>
              <ForgeCore scale={scaleFactor} />
              <FloatingGeometry scale={scaleFactor} />
            </Suspense>
          </Canvas>
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
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-40 pb-24 md:py-32">
        <div className="max-w-2xl">
          {/* Eyebrow label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-amber-forge" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-80">
              Industrial AI
            </span>
          </div>

          {/* Main title */}
          <h1 className="mb-6">
            <span
              className="block text-[clamp(4rem,12vw,9rem)] font-black leading-none tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 40%, #888896 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.2))',
              }}
            >
              TVASTR
            </span>
            <span className="block text-xl md:text-2xl lg:text-3xl font-light text-amber-glow mt-4 tracking-wide">
              Industrial Intelligence,{' '}
              <span className="font-semibold text-amber-forge">Forged.</span>
            </span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-metallic-300 leading-relaxed mb-16 md:mb-12 max-w-lg">
            Tvastr builds intelligent systems that bring perception, reasoning,
            and operational insight to heavy manufacturing environments.
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
