import { useScrollReveal } from '../hooks/useScrollReveal'
import { useEffect, useRef, useState } from 'react'

/**
 * Tile data with foundry-optimized copy
 */
const capabilityTiles = [
  // ROW 1: Inspection Pipeline
  {
    icon: "📷",
    title: "Image Capture",
    description: "Capture casting images for inspection",
    accent: true,
    details: [
      "Supports single and batch image upload from shop floor",
      "Works with camera or manual upload",
      "Queue-based processing for multiple parts",
      "Organizes images by part, batch, and time"
    ]
  },
  {
    icon: "✓",
    title: "Inspection Readiness Check",
    description: "Ensures image is suitable for inspection",
    accent: true,
    details: [
      "Rejects blurred or unclear images before analysis",
      "Checks lighting and surface visibility",
      "Prevents wrong defect detection due to poor input",
      "Reduces rework caused by bad inspection images"
    ]
  },
  {
    icon: "🔍",
    title: "Defect Detection",
    description: "Detects surface defects automatically",
    accent: true,
    details: [
      "Detects pinholes, blowholes, shrinkage, misrun, and cracks",
      "Marks exact defect locations on casting image",
      "Provides confidence score for each defect",
      "Reduces manual inspection time and misses"
    ]
  },
  {
    icon: "⬡",
    title: "Diagnosis & Decision",
    description: "Finds root cause and suggests action",
    accent: true,
    details: [
      "Identifies whether issue is moulding, pouring, or core related",
      "Suggests accept, reject, or manual review decision",
      "Helps reduce dependency on expert inspectors",
      "Standardizes decision-making across shifts"
    ]
  },
  {
    icon: "📋",
    title: "Validation & Audit",
    description: "Human review and traceability",
    accent: true,
    details: [
      "Allows supervisor validation of AI decisions",
      "Maintains complete inspection history",
      "Supports audit and compliance requirements",
      "Tracks who approved or modified decisions"
    ]
  },
  // ROW 2: Process Intelligence
  {
    icon: "📡",
    title: "ERP / MES Integration",
    description: "Connects inspection with production data",
    accent: false,
    details: [
      "Links inspection data with heat number, mould, and shift",
      "Supports SQL, CSV, and ERP systems like SAP",
      "Enables batch-level traceability",
      "No manual data entry required"
    ]
  },
  {
    icon: "🔗",
    title: "Cross-Part Pattern Analysis",
    description: "Finds repeating defect patterns",
    accent: false,
    details: [
      "Identifies recurring defects across similar parts",
      "Detects common problem areas in part families",
      "Helps identify tooling or design issues",
      "Improves long-term process stability"
    ]
  },
  {
    icon: "📈",
    title: "Drift Detection",
    description: "Tracks quality changes over time",
    accent: false,
    details: [
      "Monitors increase in rejection rates",
      "Detects gradual process drift",
      "Triggers alerts when quality deviates",
      "Helps take action before defects increase"
    ]
  },
  {
    icon: "🔥",
    title: "Heat Intelligence",
    description: "Analyzes quality by heat",
    accent: false,
    details: [
      "Tracks rejection trends per heat number",
      "Identifies problematic heats early",
      "Helps isolate metallurgical issues",
      "Links defects to specific batches"
    ]
  },
  {
    icon: "⚙",
    title: "Self-Tuning System",
    description: "Adapts to your process automatically",
    accent: false,
    details: [
      "Adjusts detection sensitivity based on plant data",
      "Learns from past inspection decisions",
      "Improves accuracy over time",
      "Reduces need for manual parameter tuning"
    ]
  },
  // ROW 3: Plant-Level Intelligence
  {
    icon: "📐",
    title: "Quality Engineering Tools",
    description: "Supports process improvement methods",
    accent: true,
    details: [
      "Generates Pareto charts of defects",
      "Supports SPC and process capability analysis",
      "Helps with FMEA and root cause studies",
      "Improves structured quality improvement"
    ]
  },
  {
    icon: "⚠",
    title: "Process Risk Monitoring",
    description: "Identifies high-risk conditions",
    accent: true,
    details: [
      "Detects abnormal patterns in production",
      "Assigns risk scores to heat, mould, or shift",
      "Triggers alerts for critical conditions",
      "Helps prevent large-scale rejection"
    ]
  },
  {
    icon: "💰",
    title: "Cost of Quality",
    description: "Tracks financial impact of defects",
    accent: true,
    details: [
      "Calculates scrap and rework cost",
      "Maps defects to cost impact",
      "Identifies highest cost problem areas",
      "Helps prioritize improvement efforts"
    ]
  },
  {
    icon: "💬",
    title: "Natural Language Queries",
    description: "Ask questions about your plant",
    accent: true,
    details: [
      "Ask questions like 'Which heat has highest rejection?'",
      "Get answers in simple language",
      "No need for manual report generation",
      "Speeds up decision-making"
    ]
  },
  {
    icon: "📋",
    title: "Decision Intelligence",
    description: "Recommends corrective actions",
    accent: true,
    details: [
      "Suggests actions to reduce defects",
      "Ranks actions based on impact and urgency",
      "Tracks effectiveness of implemented actions",
      "Creates a feedback loop for improvement"
    ]
  }
]

/**
 * CapabilityTile — Compact tile representing a single capability in the pipeline.
 */
function CapabilityTile({ tile, isActive, tileRef, onClick }) {
  return (
    <div
      ref={tileRef}
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center text-center p-3 md:p-4 flex-1 min-h-[110px] max-w-[280px] md:max-w-none mx-auto md:mx-0 transition-all duration-300 cursor-pointer hover:scale-105 transform-gpu ${
        isActive ? 'tile-active-glow' : ''
      }`}
      style={{
        background: tile.accent 
          ? 'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(245,158,11,0.03) 100%)'
          : 'linear-gradient(135deg, rgba(26,26,30,0.75) 0%, rgba(17,17,19,0.7) 100%)',
        border: tile.accent ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(168,168,180,0.15)',
        backdropFilter: 'blur(28px)',
        boxShadow: tile.accent
          ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(245,158,11,0.15)'
          : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.3)',
        minWidth: '140px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '12px',
      }}
    >
      {/* Glass shine overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 50%)',
          borderRadius: 'inherit',
        }}
      />
      
      <div className="relative z-10">
        <div className="text-2xl mb-2">{tile.icon}</div>
        <h4 className={`text-xs md:text-sm font-bold mb-1 ${tile.accent ? 'text-amber-forge' : 'text-metallic-100'}`}>
          {tile.title}
        </h4>
        <p className="text-xs text-metallic-500 leading-snug">{tile.description}</p>
      </div>
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
 * TileModal — Expanded detail view when a tile is clicked
 */
function TileModal({ tile, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
      onClick={onClose}
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      <div
        className="relative max-w-2xl w-full p-8 rounded-xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(26,26,30,0.8) 0%, rgba(17,17,19,0.75) 100%)',
          border: tile.accent ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(168,168,180,0.2)',
          backdropFilter: 'blur(28px)',
          boxShadow: tile.accent
            ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 60px rgba(245,158,11,0.15), 0 0 80px rgba(0,0,0,0.5)'
            : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Glass shine overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 50%)',
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-metallic-400 hover:text-metallic-100 transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h3 className={`relative z-10 text-2xl font-bold mb-2 ${tile.accent ? 'text-amber-forge' : 'text-metallic-100'}`}>
          {tile.title}
        </h3>

        {/* Subtitle */}
        <p className="relative z-10 text-base text-metallic-300 mb-6">{tile.description}</p>

        {/* Details */}
        <ul className="relative z-10 space-y-3">
          {tile.details.map((detail, index) => (
            <li key={index} className="flex items-start gap-3 text-sm text-metallic-400 leading-relaxed">
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-2"
                style={{ background: tile.accent ? '#f59e0b' : '#888896' }}
              />
              {detail}
            </li>
          ))}
        </ul>
      </div>
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
  const [expandedTile, setExpandedTile] = useState(null)

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
    const cycleDuration = 25000 // 25 seconds for full cycle (faster than 45s)
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

    // Calculate distances for each segment
    const segmentDistances = []
    let totalDistance = 0
    for (let i = 0; i < waypoints.length - 1; i++) {
      const start = waypoints[i]
      const end = waypoints[i + 1]
      const distance = Math.hypot(end.x - start.x, end.y - start.y)
      segmentDistances.push(distance)
      totalDistance += distance
    }

    // Build cumulative distance array for lookup
    const cumulativeDistances = [0]
    for (let i = 0; i < segmentDistances.length; i++) {
      cumulativeDistances.push(cumulativeDistances[i] + segmentDistances[i])
    }

    // Animation loop
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = (elapsed % cycleDuration) / cycleDuration // 0 to 1

      // Calculate current position based on distance traveled
      const targetDistance = progress * totalDistance

      // Find which segment we're in based on cumulative distance
      let currentSegment = 0
      for (let i = 0; i < cumulativeDistances.length - 1; i++) {
        if (targetDistance >= cumulativeDistances[i] && targetDistance < cumulativeDistances[i + 1]) {
          currentSegment = i
          break
        }
      }

      // Clamp to valid segment range
      if (currentSegment >= waypoints.length - 1) {
        currentSegment = waypoints.length - 2
      }

      const start = waypoints[currentSegment]
      const end = waypoints[currentSegment + 1]

      // Calculate progress within this segment based on distance
      const segmentStartDist = cumulativeDistances[currentSegment]
      const segmentLength = segmentDistances[currentSegment]
      const segmentProgress = segmentLength > 0 
        ? (targetDistance - segmentStartDist) / segmentLength 
        : 0

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
      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />

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
            Watch data flow through the complete manufacturing intelligence pipeline — from raw inspection to plant-level insights. Click any tile to learn more.
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
                tile={capabilityTiles[0]}
                isActive={activeTileIndex === 0}
                tileRef={setTileRef(0)}
                onClick={() => setExpandedTile(capabilityTiles[0])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[1]}
                isActive={activeTileIndex === 1}
                tileRef={setTileRef(1)}
                onClick={() => setExpandedTile(capabilityTiles[1])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[2]}
                isActive={activeTileIndex === 2}
                tileRef={setTileRef(2)}
                onClick={() => setExpandedTile(capabilityTiles[2])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[3]}
                isActive={activeTileIndex === 3}
                tileRef={setTileRef(3)}
                onClick={() => setExpandedTile(capabilityTiles[3])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[4]}
                isActive={activeTileIndex === 4}
                tileRef={setTileRef(4)}
                onClick={() => setExpandedTile(capabilityTiles[4])}
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
                tile={capabilityTiles[5]}
                isActive={activeTileIndex === 5}
                tileRef={setTileRef(5)}
                onClick={() => setExpandedTile(capabilityTiles[5])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[6]}
                isActive={activeTileIndex === 6}
                tileRef={setTileRef(6)}
                onClick={() => setExpandedTile(capabilityTiles[6])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[7]}
                isActive={activeTileIndex === 7}
                tileRef={setTileRef(7)}
                onClick={() => setExpandedTile(capabilityTiles[7])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[8]}
                isActive={activeTileIndex === 8}
                tileRef={setTileRef(8)}
                onClick={() => setExpandedTile(capabilityTiles[8])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[9]}
                isActive={activeTileIndex === 9}
                tileRef={setTileRef(9)}
                onClick={() => setExpandedTile(capabilityTiles[9])}
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
                tile={capabilityTiles[10]}
                isActive={activeTileIndex === 10}
                tileRef={setTileRef(10)}
                onClick={() => setExpandedTile(capabilityTiles[10])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[11]}
                isActive={activeTileIndex === 11}
                tileRef={setTileRef(11)}
                onClick={() => setExpandedTile(capabilityTiles[11])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[12]}
                isActive={activeTileIndex === 12}
                tileRef={setTileRef(12)}
                onClick={() => setExpandedTile(capabilityTiles[12])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[13]}
                isActive={activeTileIndex === 13}
                tileRef={setTileRef(13)}
                onClick={() => setExpandedTile(capabilityTiles[13])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[14]}
                isActive={activeTileIndex === 14}
                tileRef={setTileRef(14)}
                onClick={() => setExpandedTile(capabilityTiles[14])}
              />
            </div>
          </div>

          {/* Continuous Improvement Loop */}
          <div className="mt-8">
            <div
              className="p-5 text-center rounded-lg"
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
              className="p-6 rounded-lg"
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
              className="p-6 rounded-lg"
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
            className="mt-6 px-5 py-3 rounded-lg"
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

      {/* Tile Modal */}
      {expandedTile && (
        <TileModal
          tile={expandedTile}
          onClose={() => setExpandedTile(null)}
        />
      )}
    </section>
  )
}
