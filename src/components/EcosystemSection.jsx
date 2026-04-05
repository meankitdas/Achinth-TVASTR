import { useScrollReveal } from '../hooks/useScrollReveal'
import { useEffect, useRef, useState } from 'react'

/**
 * CapabilityTile — Compact tile representing a single capability in the pipeline.
 */
function CapabilityTile({ icon, title, description, accent, isActive, tileRef }) {
  return (
    <div
      ref={tileRef}
      className={`relative flex flex-col items-center justify-center text-center p-4 flex-1 min-h-[110px] transition-shadow duration-300 ${
        isActive ? 'tile-active-glow' : ''
      }`}
      style={{
        background: accent ? 'rgba(245,158,11,0.06)' : 'rgba(26,26,30,0.8)',
        border: accent ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(168,168,180,0.1)',
        backdropFilter: 'blur(12px)',
        minWidth: '140px',
      }}
    >
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className={`text-xs md:text-sm font-bold mb-1 ${accent ? 'text-amber-forge' : 'text-metallic-100'}`}>
        {title}
      </h4>
      <p className="text-xs text-metallic-500 leading-snug">{description}</p>
    </div>
  )
}

/**
 * BeltConnector — Horizontal belt segment.
 */
function BeltConnector() {
  return (
    <div className="hidden md:flex items-center justify-center relative flex-shrink-0" style={{ width: '50px' }}>
      <div className="w-full h-px bg-amber-forge opacity-30" />
      <div className="absolute right-0 w-2 h-2 border-r border-t border-amber-forge opacity-40 transform rotate-45 -mr-1" />
    </div>
  )
}

/**
 * RowTurn — Full-width U-turn connector from end of one row to start of next.
 */
function RowTurn({ turnRef }) {
  return (
    <div ref={turnRef} className="hidden md:block relative w-full" style={{ height: '50px' }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 50" preserveAspectRatio="none">
        <path
          d="M 980 0 L 980 30 L 20 30 L 20 50"
          fill="none"
          stroke="rgba(245,158,11,0.3)"
          strokeWidth="1"
        />
        <path d="M 978 8 L 980 12 L 982 8" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
        <path d="M 18 42 L 20 46 L 22 42" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1" />
      </svg>
    </div>
  )
}

/**
 * EcosystemSection — Manufacturing Intelligence Ecosystem with serpentine conveyor belt.
 */
export function EcosystemSection() {
  const ref = useScrollReveal()
  const containerRef = useRef(null)
  
  // Refs for all 15 tiles and 2 U-turn connectors
  const tileRefs = useRef([])
  const turn1Ref = useRef(null) // U-turn between row 1 and 2
  const turn2Ref = useRef(null) // U-turn between row 2 and 3
  
  // State for orb position and active tile
  const [orbPosition, setOrbPosition] = useState({ x: 0, y: 0 })
  const [activeTileIndex, setActiveTileIndex] = useState(-1)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if the section is visible on screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Don't run animation if not visible or no tiles
    if (!isVisible || tileRefs.current.length < 15) return

    let animationFrameId
    const cycleDuration = 45000 // 45 seconds for full cycle
    let startTime = Date.now()

    // Build waypoints from actual tile positions
    const buildWaypoints = () => {
      const container = containerRef.current
      if (!container) return []

      const containerRect = container.getBoundingClientRect()
      const waypoints = []

      // Get positions of all 15 tiles relative to container
      tileRefs.current.forEach((tileEl, index) => {
        if (!tileEl) return
        const rect = tileEl.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2 - containerRect.left
        const centerY = rect.top + rect.height / 2 - containerRect.top

        waypoints.push({
          x: centerX,
          y: centerY,
          tileIndex: index,
          isUTurn: false,
        })

        // Add U-turn waypoints after tiles 4 and 9
        if (index === 4 || index === 9) {
          const nextTile = tileRefs.current[index + 1]
          const turnRef = index === 4 ? turn1Ref.current : turn2Ref.current
          
          if (nextTile && turnRef) {
            const nextRect = nextTile.getBoundingClientRect()
            const nextCenterX = nextRect.left + nextRect.width / 2 - containerRect.left
            const nextCenterY = nextRect.top + nextRect.height / 2 - containerRect.top

            // Get the U-turn connector's actual position
            const turnRect = turnRef.getBoundingClientRect()
            const turnTop = turnRect.top - containerRect.top
            const turnHeight = turnRect.height

            // Get the actual container width for the U-turn path
            // SVG path uses viewBox="0 0 1000 50" with path "M 980 0 L 980 30 L 20 30 L 20 50"
            const containerWidth = containerRect.width
            const rightEdge = containerWidth * 0.98 // 980/1000 = 98%
            const leftEdge = containerWidth * 0.02 // 20/1000 = 2%

            // Calculate the horizontal line position (30/50 = 60% of turn height)
            const midY = turnTop + (turnHeight * 0.6)

            // U-turn intermediate points following the SVG path exactly
            // Path: tile center → right edge → down to horizontal line → across to left edge → down → next tile center
            waypoints.push({
              x: rightEdge,
              y: centerY,
              tileIndex: index,
              isUTurn: true,
            })
            waypoints.push({
              x: rightEdge,
              y: midY,
              tileIndex: index,
              isUTurn: true,
            })
            waypoints.push({
              x: leftEdge,
              y: midY,
              tileIndex: index,
              isUTurn: true,
            })
            waypoints.push({
              x: leftEdge,
              y: nextCenterY,
              tileIndex: index + 1,
              isUTurn: true,
            })
          }
        }
      })

      return waypoints
    }

    const waypoints = buildWaypoints()
    if (waypoints.length === 0) return

    // Animation loop
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = (elapsed % cycleDuration) / cycleDuration // 0 to 1

      // Calculate total path length
      const totalSegments = waypoints.length - 1
      const currentSegment = Math.floor(progress * totalSegments)
      const segmentProgress = (progress * totalSegments) % 1

      if (currentSegment < totalSegments) {
        const start = waypoints[currentSegment]
        const end = waypoints[currentSegment + 1]

        // Interpolate position
        const x = start.x + (end.x - start.x) * segmentProgress
        const y = start.y + (end.y - start.y) * segmentProgress

        setOrbPosition({ x, y })

        // Update active tile based on progress through segment
        // Use end tile when more than 50% through the segment for smoother transition
        if (!start.isUTurn && !end.isUTurn) {
          // Both waypoints are tiles - use the one we're closer to
          const activeTile = segmentProgress > 0.5 ? end.tileIndex : start.tileIndex
          setActiveTileIndex(activeTile)
        } else if (!start.isUTurn) {
          // Moving from tile to U-turn - keep the start tile active
          setActiveTileIndex(start.tileIndex)
        } else if (!end.isUTurn) {
          // Moving from U-turn to tile - activate the end tile
          setActiveTileIndex(end.tileIndex)
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Rebuild waypoints on resize
    const handleResize = () => {
      startTime = Date.now() // Reset animation on resize
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isVisible])

  // Helper to assign refs
  const setTileRef = (index) => (el) => {
    tileRefs.current[index] = el
  }

  return (
    <section
      id="technology"
      ref={ref}
      className="relative py-28 md:py-36 bg-charcoal-950 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-16">
        {/* Section label */}
        <div className="reveal flex items-center gap-3 mb-12 max-w-7xl mx-auto">
          <div className="w-8 h-px bg-amber-forge opacity-60" />
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
            Product Ecosystem
          </span>
        </div>

        {/* Header */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="reveal mb-4">
            <h2 className="text-4xl md:text-5xl font-black text-metallic-100 leading-tight tracking-tight">
              Manufacturing Intelligence Ecosystem
            </h2>
          </div>
          <p className="reveal reveal-delay-1 text-base text-metallic-400 max-w-[640px] leading-relaxed">
            Watch data flow through the complete manufacturing intelligence pipeline — from raw inspection to plant-level insights.
          </p>
        </div>

        {/* Serpentine Conveyor Belt Diagram */}
        <div ref={containerRef} className="reveal reveal-delay-2 space-y-6 max-w-[1400px] mx-auto relative">
          
          {/* Single glowing orb - positioned via JS with fade-out at last tile */}
          <div
            className="hidden md:block absolute w-3 h-3 rounded-full bg-amber-forge pointer-events-none z-10 transition-opacity duration-1000"
            style={{
              left: `${orbPosition.x}px`,
              top: `${orbPosition.y}px`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 20px rgba(245,158,11,0.9), 0 0 40px rgba(245,158,11,0.6)',
              opacity: isVisible && activeTileIndex !== -1 ? (activeTileIndex === 14 ? 0.3 : 1) : 0,
            }}
          />

          {/* ROW 1: Inspection Pipeline */}
          <div>
            {/* Row label above */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg">⬡</span>
              <h3 className="text-sm font-bold text-amber-forge tracking-wide uppercase">
                Inspection Pipeline
              </h3>
            </div>
            
            {/* Tiles */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
                <CapabilityTile
                  icon="📷"
                  title="Image Capture"
                  description="Single or batch queue"
                  accent={true}
                  isActive={activeTileIndex === 0}
                  tileRef={setTileRef(0)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="✓"
                  title="Quality Gate"
                  description="Image verification"
                  accent={true}
                  isActive={activeTileIndex === 1}
                  tileRef={setTileRef(1)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="🔍"
                  title="Defect Detection"
                  description="6 types + heatmap"
                  accent={true}
                  isActive={activeTileIndex === 2}
                  tileRef={setTileRef(2)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="⬡"
                  title="Diagnosis & Decision"
                  description="Root cause + Accept/Reject"
                  accent={true}
                  isActive={activeTileIndex === 3}
                  tileRef={setTileRef(3)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="📋"
                  title="Validation & Audit"
                  description="Human review + reports"
                  accent={true}
                  isActive={activeTileIndex === 4}
                  tileRef={setTileRef(4)}
                />
              </div>
          </div>

          {/* Turn connector Row 1 → Row 2 */}
          <RowTurn turnRef={turn1Ref} />

          {/* ROW 2: Process Intelligence */}
          <div>
            {/* Row label above */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg">🔗</span>
              <h3 className="text-sm font-bold text-metallic-100 tracking-wide uppercase">
                Process Intelligence
              </h3>
            </div>
            
            {/* Tiles */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
                <CapabilityTile
                  icon="📡"
                  title="ERP/MES Integration"
                  description="SQL connection, batch context"
                  accent={false}
                  isActive={activeTileIndex === 5}
                  tileRef={setTileRef(5)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="🔗"
                  title="Cross-Part Patterns"
                  description="Defect graph, co-occurrence"
                  accent={false}
                  isActive={activeTileIndex === 6}
                  tileRef={setTileRef(6)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="📈"
                  title="Drift Detection"
                  description="Rejection trends, alerts"
                  accent={false}
                  isActive={activeTileIndex === 7}
                  tileRef={setTileRef(7)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="🔥"
                  title="Heat Intelligence"
                  description="Per-batch, mold risk"
                  accent={false}
                  isActive={activeTileIndex === 8}
                  tileRef={setTileRef(8)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="⚙"
                  title="Self-Tuning"
                  description="Adaptive sensitivity"
                  accent={false}
                  isActive={activeTileIndex === 9}
                  tileRef={setTileRef(9)}
                />
              </div>
          </div>

          {/* Turn connector Row 2 → Row 3 */}
          <RowTurn turnRef={turn2Ref} />

          {/* ROW 3: Plant-Level Intelligence */}
          <div>
            {/* Row label above */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg">◎</span>
              <h3 className="text-sm font-bold text-amber-forge tracking-wide uppercase">
                Plant-Level Intelligence
              </h3>
            </div>
            
            {/* Tiles */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
                <CapabilityTile
                  icon="📐"
                  title="Quality Engineering"
                  description="FMEA, Fishbone, SPC/Cpk"
                  accent={true}
                  isActive={activeTileIndex === 10}
                  tileRef={setTileRef(10)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="⚠"
                  title="Process Risk"
                  description="Anomaly detection, alerts"
                  accent={true}
                  isActive={activeTileIndex === 11}
                  tileRef={setTileRef(11)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="💰"
                  title="Cost of Quality"
                  description="Scrap cost by defect"
                  accent={true}
                  isActive={activeTileIndex === 12}
                  tileRef={setTileRef(12)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="💬"
                  title="Natural Language"
                  description="Query plant data"
                  accent={true}
                  isActive={activeTileIndex === 13}
                  tileRef={setTileRef(13)}
                />
                <BeltConnector />
                <CapabilityTile
                  icon="📋"
                  title="Decision Intelligence"
                  description="Corrective actions"
                  accent={true}
                  isActive={activeTileIndex === 14}
                  tileRef={setTileRef(14)}
                />
              </div>
          </div>

          {/* Continuous Improvement Loop */}
          <div className="mt-8">
            <div
              className="p-5 text-center"
              style={{
                border: '1px dashed rgba(245,158,11,0.25)',
                background: 'rgba(245,158,11,0.03)',
              }}
            >
              <p className="text-xs font-semibold text-amber-forge mb-2 tracking-wider uppercase">
                ↻ Continuous Improvement Loop
              </p>
              <p className="text-xs text-metallic-400 leading-relaxed">
                Supervisor corrections improve AI models. Process insights drive manufacturing change. Self-tuning adjusts sensitivity over time.
              </p>
            </div>
          </div>
        </div>

        {/* Deployment note */}
        <div className="reveal reveal-delay-4 mt-20 mx-auto max-w-[800px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-4 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-forge opacity-60">
              Deployment & Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tier-Based */}
            <div
              className="p-6"
              style={{
                border: '1px solid rgba(168,168,180,0.08)',
                background: 'rgba(26,26,30,0.5)',
              }}
            >
              <p className="text-sm text-metallic-300 leading-relaxed mb-3">
                Tvastr is built in tiers.
              </p>
              <p className="text-sm text-metallic-400 leading-relaxed">
                Start with the Rejection Analysis System for AI-powered inspection, then upgrade to Plant Intelligence for plant-wide analytics. Individual features and technologies within each tier are modular and upgradable.
              </p>
            </div>

            {/* On-Premise */}
            <div
              className="p-6"
              style={{
                border: '1px solid rgba(168,168,180,0.08)',
                background: 'rgba(26,26,30,0.5)',
              }}
            >
              <p className="text-sm text-metallic-300 leading-relaxed mb-3">
                Industrial deployment model:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-metallic-400">
                  <span
                    className="flex-shrink-0 w-1 h-1 rounded-full mt-1.5"
                    style={{ background: 'rgba(245,158,11,0.5)' }}
                  />
                  Runs on-premise inside the plant network
                </li>
                <li className="flex items-start gap-2 text-sm text-metallic-400">
                  <span
                    className="flex-shrink-0 w-1 h-1 rounded-full mt-1.5"
                    style={{ background: 'rgba(245,158,11,0.5)' }}
                  />
                  Processes casting images locally in real time
                </li>
                <li className="flex items-start gap-2 text-sm text-metallic-400">
                  <span
                    className="flex-shrink-0 w-1 h-1 rounded-full mt-1.5"
                    style={{ background: 'rgba(245,158,11,0.5)' }}
                  />
                  Integrates with ERP or MES systems
                </li>
              </ul>
            </div>
          </div>

          {/* Network boundary note */}
          <div
            className="mt-6 px-5 py-3"
            style={{
              border: '1px dashed rgba(245,158,11,0.15)',
              background: 'rgba(245,158,11,0.02)',
            }}
          >
            <p className="text-xs text-center text-metallic-500">
              All components operate within the plant network boundary. Inspection data remains on-site while enabling advanced analytics.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
