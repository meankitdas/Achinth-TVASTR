import { useRef, useState, useCallback, useEffect } from 'react'
import { ProductCard } from './ProductCard'
import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * Product data — defined here to keep the slider self-contained.
 */
const PRODUCTS = [
  {
    id: 1,
    route: '/systems/rejection-analysis-system',
    tag: 'Vision AI',
    badge: 'Core / Enterprise',
    title: 'Rejection Analysis System',
    subtitle: 'Inspection and Process-Aware Analysis',
    description:
      'The Rejection Analysis System (RAS) is an AI-powered inspection platform that detects defects, maps root causes, and generates structured inspection records.',
    note: 'Available in two configurations: Core (standalone inspection) and Enterprise (integrated with full traceability and process intelligence).',
    capabilities: [
      'AI-powered defect detection and classification',
      'Root cause mapping with manufacturing context',
      'Multi-stage inspection pipeline (image → structured decision)',
      'Traceable inspection records with full casting metadata',
      'Recurring defect pattern recognition across production runs',
      'Process intelligence (Enterprise): drift detection, defect graph, heat analysis',
    ],
  },
  {
    id: 2,
    route: '/systems/plant-intelligence',
    tag: 'Plant AI',
    badge: 'Full Stack Only',
    title: 'Plant Intelligence',
    subtitle: 'Manufacturing Analytics and Decision Intelligence',
    description:
      'Plant Intelligence (PI) is a plant-level analytics and decision support system that transforms structured inspection and production data into actionable insights.',
    note: 'Requires structured inspection data (RAS Enterprise or equivalent data source).',
    capabilities: [
      'Rejection trend analysis and defect pattern detection',
      'Quality engineering frameworks (FMEA, Fishbone, SPC)',
      'Process risk detection and anomaly monitoring',
      'Natural language queries against plant data',
      'Cost of quality analytics by defect type and process stage',
      'Decision intelligence and action tracking',
    ],
  },
]

/**
 * ProductSlider — Horizontally snapping panel slider.
 *
 * Navigation methods:
 *   • Arrow buttons (desktop)
 *   • Mouse drag (desktop)
 *   • Touch swipe (mobile/tablet)
 *   • Dot indicators
 *
 * Uses CSS scroll-snap for smooth snapping behavior.
 * No external carousel libraries.
 */
export function ProductSlider() {
  const sectionRef = useScrollReveal()
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Drag state
  const dragRef = useRef({ isDragging: false, startX: 0, scrollLeft: 0 })

  /**
   * Scroll to a specific slide index with smooth behavior.
   */
  const goToSlide = useCallback((index) => {
    const track = trackRef.current
    if (!track) return
    const slideWidth = track.clientWidth
    track.scrollTo({ left: slideWidth * index, behavior: 'smooth' })
    setActiveIndex(index)
  }, [])

  /**
   * Keyboard navigation: Arrow keys to navigate slides
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const newIndex = Math.max(0, activeIndex - 1)
        if (newIndex !== activeIndex) goToSlide(newIndex)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        const newIndex = Math.min(PRODUCTS.length - 1, activeIndex + 1)
        if (newIndex !== activeIndex) goToSlide(newIndex)
      }
    }

    // Only add listener when slider is in viewport
    const track = trackRef.current
    if (track) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, goToSlide])

  // ─── Scroll sync: update active dot on native scroll ──────────────────
  const handleScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const slideWidth = track.clientWidth
    const newIndex = Math.round(track.scrollLeft / slideWidth)
    setActiveIndex(newIndex)
  }, [])

  // ─── Mouse drag handlers ───────────────────────────────────────────────
  const onMouseDown = (e) => {
    const track = trackRef.current
    if (!track) return
    dragRef.current = {
      isDragging: true,
      startX: e.pageX - track.offsetLeft,
      scrollLeft: track.scrollLeft,
    }
    track.style.cursor = 'grabbing'
    track.style.userSelect = 'none'
  }

  const onMouseMove = (e) => {
    if (!dragRef.current.isDragging) return
    const track = trackRef.current
    if (!track) return
    e.preventDefault()
    const x = e.pageX - track.offsetLeft
    const walk = (x - dragRef.current.startX) * 1.2
    track.scrollLeft = dragRef.current.scrollLeft - walk
  }

  const onMouseUp = () => {
    const track = trackRef.current
    if (!track) return
    dragRef.current.isDragging = false
    track.style.cursor = 'grab'
    track.style.removeProperty('user-select')
    // Snap to nearest slide after drag
    const slideWidth = track.clientWidth
    const nearestIndex = Math.round(track.scrollLeft / slideWidth)
    goToSlide(Math.max(0, Math.min(nearestIndex, PRODUCTS.length - 1)))
  }

  const onMouseLeave = () => {
    if (dragRef.current.isDragging) onMouseUp()
  }

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-charcoal-950 overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(245,158,11,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        {/* Section header */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-12">
          <div className="reveal flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
              Our Systems
            </span>
          </div>
          <div className="flex items-end justify-between">
            <h2
              className="reveal text-4xl md:text-5xl font-black tracking-tight"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #a8a8b4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Forged Systems
            </h2>

            {/* Desktop arrow navigation */}
            <div className="reveal hidden md:flex items-center gap-3">
              <button
                onClick={() => goToSlide(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="w-10 h-10 flex items-center justify-center transition-all duration-200 disabled:opacity-20"
                style={{
                  border: '1px solid rgba(168,168,180,0.2)',
                  background: 'rgba(26,26,30,0.8)',
                  color: '#888896',
                }}
                aria-label="Previous product"
              >
                ←
              </button>
              <button
                onClick={() => goToSlide(Math.min(PRODUCTS.length - 1, activeIndex + 1))}
                disabled={activeIndex === PRODUCTS.length - 1}
                className="w-10 h-10 flex items-center justify-center transition-all duration-200 disabled:opacity-20"
                style={{
                  border: '1px solid rgba(168,168,180,0.2)',
                  background: 'rgba(26,26,30,0.8)',
                  color: '#888896',
                }}
                aria-label="Next product"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Slide track — CSS scroll-snap container */}
        <div
          ref={trackRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          className="flex overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden"
          style={{
            cursor: 'grab',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >

          {PRODUCTS.map((product, i) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-full snap-start px-6 md:px-12 lg:px-16 flex justify-center"
              style={{ minHeight: '420px' }}
            >
              <div className="w-full max-w-5xl">
                <ProductCard
                  product={product}
                  visual={i === 0 ? 'defect' : 'dataflow'}
                  index={i}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Dot navigation indicators */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="transition-all duration-300"
              style={{
                width: i === activeIndex ? '28px' : '6px',
                height: '6px',
                background: i === activeIndex ? '#f59e0b' : 'rgba(168,168,180,0.3)',
                border: 'none',
                borderRadius: i === activeIndex ? '3px' : '50%',
                cursor: 'pointer',
              }}
              aria-label={`Go to product ${i + 1}`}
            />
          ))}
        </div>

        {/* Swipe hint for mobile */}
        <p className="md:hidden text-center text-xs text-metallic-500 mt-4 tracking-widest uppercase opacity-50">
          Swipe to explore
        </p>
      </div>
    </section>
  )
}
