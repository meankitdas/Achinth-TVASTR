import { useScrollReveal } from '../hooks/useScrollReveal'
import { useEffect, useRef, useState } from 'react'

/**
 * SVG Icon Components
 */
const Icons = {
  Camera: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  ),
  Check: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
    </svg>
  ),
  Search: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35" />
    </svg>
  ),
  Hexagon: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
    </svg>
  ),
  Clipboard: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Connection: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Link: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  ),
  Trending: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  Fire: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
    </svg>
  ),
  Cog: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  ),
  Ruler: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Currency: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Chat: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  List: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  Target: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <circle cx="12" cy="12" r="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
      <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  ),
}

/**
 * Tile data with foundry-optimized copy
 */
const capabilityTiles = [
  // ROW 1: Inspection Pipeline
  {
    icon: <Icons.Camera />,
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
    icon: <Icons.Check />,
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
    icon: <Icons.Search />,
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
    icon: <Icons.Hexagon />,
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
    icon: <Icons.Clipboard />,
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
    icon: <Icons.Connection />,
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
    icon: <Icons.Link />,
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
    icon: <Icons.Trending />,
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
    icon: <Icons.Fire />,
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
    icon: <Icons.Cog />,
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
    icon: <Icons.Ruler />,
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
    icon: <Icons.Alert />,
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
    icon: <Icons.Currency />,
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
    icon: <Icons.Chat />,
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
    icon: <Icons.List />,
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
function CapabilityTile({ tile, isActive, tileRef, onClick, compact = false }) {
  return (
    <div
      ref={tileRef}
      onClick={onClick}
      className={`${tile.accent ? 'liquid-glass-amber' : 'liquid-glass'} relative flex flex-col items-center justify-center text-center p-3 md:p-4 flex-1 min-h-[110px] max-w-[280px] md:max-w-none mx-auto md:mx-0 transition-all duration-300 cursor-pointer hover:scale-105 transform-gpu ${
        isActive ? 'tile-active-glow' : ''
      }`}
      style={{
        minWidth: compact ? 'auto' : '140px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRadius: '12px',
      }}
    >
      <div className="relative z-10">
        {!compact && <div className={`${tile.accent ? 'text-amber-forge' : 'text-metallic-400'} mb-2 flex justify-center`}>{tile.icon}</div>}
        <h4 className={`text-xs md:text-sm font-bold ${compact ? '' : 'mb-1'} ${tile.accent ? 'text-amber-forge' : 'text-metallic-100'}`}>
          {tile.title}
        </h4>
        {!compact && <p className="text-xs text-metallic-500 leading-snug">{tile.description}</p>}
      </div>
    </div>
  )
}

/**
 * BeltConnector — Horizontal belt segment (left to right).
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
 * ReverseBeltConnector — Horizontal belt segment (right to left).
 */
function ReverseBeltConnector() {
  return (
    <div className="hidden md:flex items-center justify-center relative flex-shrink-0" style={{ width: '50px' }}>
      <div className="w-full h-px bg-amber-forge opacity-30" />
      <div className="absolute left-0 w-2 h-2 border-l border-b border-amber-forge opacity-40 transform rotate-45 -ml-1" />
    </div>
  )
}

/**
 * RowTurn — Serpentine U-turn connector.
 * Turn 1 (after row 1): drops straight down on the right side
 * Turn 2 (after row 2): drops straight down on the left side
 * @param {number} xPercent - The X position as a percentage (0-100) where the vertical line should be drawn
 */
function RowTurn({ turnRef, isRightSide = true, xPercent = 50 }) {
  // Convert percentage to SVG viewBox coordinate (0-1000 scale)
  const svgX = (xPercent / 100) * 1000
  
  return (
    <div ref={turnRef} className="hidden md:block relative w-full" style={{ height: '50px' }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 50" preserveAspectRatio="none">
        <path
          d={`M ${svgX} 0 L ${svgX} 50`}
          fill="none"
          stroke="rgba(245,158,11,0.3)"
          strokeWidth="1"
        />
        <path 
          d={`M ${svgX - 2} 42 L ${svgX} 46 L ${svgX + 2} 42`} 
          fill="none" 
          stroke="rgba(245,158,11,0.4)" 
          strokeWidth="1" 
        />
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
        className={`${tile.accent ? 'liquid-glass-amber-expanded' : 'liquid-glass-expanded'} relative max-w-2xl w-full p-8 rounded-xl`}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: tile.accent
            ? '0 20px 60px rgba(245,158,11,0.15), 0 0 80px rgba(0,0,0,0.5)'
            : '0 20px 60px rgba(168,168,180,0.2), 0 0 40px rgba(168,168,180,0.15), 0 0 80px rgba(0,0,0,0.5)',
        }}
      >
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
  const [reverseOrbPositions, setReverseOrbPositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ])
  const [isVisible, setIsVisible] = useState(false)
  const [expandedTile, setExpandedTile] = useState(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [turn1XPercent, setTurn1XPercent] = useState(98) // Default fallback for turn 1
  const [turn2XPercent, setTurn2XPercent] = useState(2)  // Default fallback for turn 2

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
    // Track mobile/desktop state for conditional ref assignment
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Compute dynamic X positions for vertical drop lines based on actual tile centers
    const computeTurnPositions = () => {
      if (!containerRef.current || window.innerWidth < 768) return // Desktop only

      const containerRect = containerRef.current.getBoundingClientRect()
      const containerWidth = containerRect.width

      // Turn 1: Use tile 4 (last tile in row 1) center X position
      const tile4 = tileRefs.current[4]
      if (tile4) {
        const tile4Rect = tile4.getBoundingClientRect()
        const tile4CenterX = tile4Rect.left + tile4Rect.width / 2 - containerRect.left
        const tile4Percent = (tile4CenterX / containerWidth) * 100
        setTurn1XPercent(tile4Percent)
      }

      // Turn 2: Use tile 9 (last tile in row 2) center X position
      const tile9 = tileRefs.current[9]
      if (tile9) {
        const tile9Rect = tile9.getBoundingClientRect()
        const tile9CenterX = tile9Rect.left + tile9Rect.width / 2 - containerRect.left
        const tile9Percent = (tile9CenterX / containerWidth) * 100
        setTurn2XPercent(tile9Percent)
      }
    }

    // Compute on mount and resize
    computeTurnPositions()
    window.addEventListener('resize', computeTurnPositions)
    return () => window.removeEventListener('resize', computeTurnPositions)
  }, [])

  useEffect(() => {
    // Don't run animation if not visible or no tiles
    if (!isVisible || tileRefs.current.length < 15) return

    let animationFrameId
    const cycleDuration = window.innerWidth < 768 ? 8000 : 10000 // Mobile: 8s, Desktop: 10s
    let startTime = Date.now()

    // Build waypoints from actual tile positions
    const buildWaypoints = () => {
      const container = containerRef.current
      if (!container) return []

      const containerRect = container.getBoundingClientRect()
      const waypoints = []
      const isMobile = window.innerWidth < 768 // md breakpoint

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

        // Desktop: Add U-turn waypoints after tiles 4 and 9
        // Mobile: Skip U-turns, go directly tile-to-tile (zigzag)
        if (!isMobile && (index === 4 || index === 9)) {
          const nextTile = tileRefs.current[index + 1]
          const turnRef = index === 4 ? turn1Ref.current : turn2Ref.current
          
          if (nextTile && turnRef) {
            const nextRect = nextTile.getBoundingClientRect()
            const nextCenterX = nextRect.left + nextRect.width / 2 - containerRect.left
            const nextCenterY = nextRect.top + nextRect.height / 2 - containerRect.top

            // Get the U-turn connector's actual position
            const turnRect = turnRef.getBoundingClientRect()
            const turnTop = turnRect.top - containerRect.top
            const turnBottom = turnTop + turnRect.height

            // Serpentine turns are now straight vertical drops:
            // - Turn 1 (after tile 4): drops straight down on RIGHT side (to tile 5)
            // - Turn 2 (after tile 9): drops straight down on LEFT side (to tile 10)
            // Use the next tile's X coordinate for the vertical drop

            // Waypoint at bottom of current tile (start of turn)
            waypoints.push({
              x: nextCenterX,
              y: turnTop,
              tileIndex: index,
              isUTurn: true,
            })

            // Waypoint at top of next tile (end of turn)
            waypoints.push({
              x: nextCenterX, // Same X coordinate (vertical drop)
              y: turnBottom,
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

    // Helper function to calculate position along path
    const getPositionAtProgress = (progress) => {
      const targetDistance = progress * totalDistance

      let currentSegment = 0
      for (let i = 0; i < cumulativeDistances.length - 1; i++) {
        if (targetDistance >= cumulativeDistances[i] && targetDistance < cumulativeDistances[i + 1]) {
          currentSegment = i
          break
        }
      }

      if (currentSegment >= waypoints.length - 1) {
        currentSegment = waypoints.length - 2
      }

      const start = waypoints[currentSegment]
      const end = waypoints[currentSegment + 1]

      const segmentStartDist = cumulativeDistances[currentSegment]
      const segmentLength = segmentDistances[currentSegment]
      const segmentProgress = segmentLength > 0 
        ? (targetDistance - segmentStartDist) / segmentLength 
        : 0

      const x = start.x + (end.x - start.x) * segmentProgress
      const y = start.y + (end.y - start.y) * segmentProgress

      let tileIndex = -1
      if (!start.isUTurn && !end.isUTurn) {
        tileIndex = segmentProgress > 0.5 ? end.tileIndex : start.tileIndex
      } else if (!start.isUTurn) {
        tileIndex = start.tileIndex
      } else if (!end.isUTurn) {
        tileIndex = end.tileIndex
      } else {
        // Both are U-turn waypoints — use the nearest tile index
        tileIndex = segmentProgress > 0.5 ? end.tileIndex : start.tileIndex
      }

      return { x, y, tileIndex }
    }

    // Animation loop
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = (elapsed % cycleDuration) / cycleDuration // 0 to 1

      // Forward orb (tile 0 → tile 14)
      const forwardPos = getPositionAtProgress(progress)
      setOrbPosition(forwardPos)
      setActiveTileIndex(forwardPos.tileIndex)

      // Reverse orbs (tile 14 → tile 0) - 3 orbs in a tight queue
      const reverseOrbs = [
        getPositionAtProgress(1 - progress), // Orb 1: no offset
        getPositionAtProgress(1 - ((progress + 0.008) % 1)), // Orb 2: 0.8% behind
        getPositionAtProgress(1 - ((progress + 0.016) % 1)), // Orb 3: 1.6% behind
      ]
      setReverseOrbPositions(reverseOrbs)

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
      className="relative py-20 md:py-36 bg-charcoal-950 overflow-hidden"
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
            Watch data flow through the complete manufacturing intelligence pipeline - from raw inspection to plant-level insights. Click any tile to learn more.
          </p>
        </div>

        {/* Serpentine Conveyor Belt Diagram */}
        <div ref={containerRef} className="reveal reveal-delay-2 space-y-6 max-w-[1400px] mx-auto relative">
          
          {/* Forward orb - fades in at tile 0, fades out at tile 14 */}
          <div
            className="absolute w-3 h-3 rounded-full bg-amber-forge pointer-events-none z-10 transition-opacity duration-500"
            style={{
              left: `${orbPosition.x}px`,
              top: `${orbPosition.y}px`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 20px rgba(245,158,11,0.9), 0 0 40px rgba(245,158,11,0.6)',
              opacity: isVisible && activeTileIndex !== -1 
                ? (
                  activeTileIndex === 0 ? 0.2 :
                  activeTileIndex === 1 ? 0.6 :
                  activeTileIndex === 13 ? 0.6 :
                  activeTileIndex === 14 ? 0.2 :
                  1
                )
                : 0,
            }}
          />

          {/* 3 Reverse orbs (feedback/auto-tuning) - smaller, lighter, traveling backward - hidden on mobile */}
          {reverseOrbPositions.map((pos, i) => (
            <div
              key={`reverse-orb-${i}`}
              className="hidden md:block absolute w-2 h-2 rounded-full pointer-events-none z-0 transition-opacity duration-500"
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                transform: 'translate(-50%, -50%)',
                marginTop: 0, // Override space-y-6 margin
                background: 'rgba(147,197,253,0.9)', // Light blue tint for feedback
                boxShadow: '0 0 20px rgba(147,197,253,0.9), 0 0 40px rgba(147,197,253,0.6), 0 0 60px rgba(147,197,253,0.3)',
                opacity: isVisible && pos.tileIndex !== -1 
                  ? (
                    pos.tileIndex === 14 ? 0.2 :
                    pos.tileIndex === 13 ? 0.5 :
                    pos.tileIndex === 1 ? 0.5 :
                    pos.tileIndex === 0 ? 0.2 :
                    0.8
                  )
                  : 0,
              }}
            />
          ))}

          {/* MOBILE ZIGZAG LAYOUT */}
          <div className="md:hidden relative">
            {/* Draw connecting lines using actual tile positions */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {capabilityTiles.slice(0, -1).map((tile, index) => {
                const currentTile = tileRefs.current[index]
                const nextTile = tileRefs.current[index + 1]
                
                if (!currentTile || !nextTile || !containerRef.current) return null
                
                const containerRect = containerRef.current.getBoundingClientRect()
                const currentRect = currentTile.getBoundingClientRect()
                const nextRect = nextTile.getBoundingClientRect()
                
                const x1 = currentRect.left + currentRect.width / 2 - containerRect.left
                const y1 = currentRect.top + currentRect.height / 2 - containerRect.top
                const x2 = nextRect.left + nextRect.width / 2 - containerRect.left
                const y2 = nextRect.top + nextRect.height / 2 - containerRect.top
                
                return (
                  <g key={index}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(245,158,11,0.3)"
                      strokeWidth="1"
                    />
                    {/* Arrow head */}
                    <circle
                      cx={x2}
                      cy={y2}
                      r="2"
                      fill="rgba(245,158,11,0.4)"
                    />
                  </g>
                )
              })}
            </svg>

            {/* Tiles */}
            <div className="relative space-y-2" style={{ zIndex: 1 }}>
              {capabilityTiles.map((tile, index) => {
                const isLeft = index % 2 === 0
                
                // Section headers before tiles 0, 5, 10
                const sectionHeader = index === 0 ? (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-amber-forge">
                      <Icons.Hexagon />
                    </div>
                    <h3 className="text-sm font-bold text-amber-forge tracking-wide uppercase">
                      Inspection Pipeline
                    </h3>
                  </div>
                ) : index === 5 ? (
                  <div className="flex items-center gap-3 mb-3 mt-6">
                    <div className="text-metallic-400">
                      <Icons.Link />
                    </div>
                    <h3 className="text-sm font-bold text-metallic-100 tracking-wide uppercase">
                      Process Intelligence
                    </h3>
                  </div>
                ) : index === 10 ? (
                  <div className="flex items-center gap-3 mb-3 mt-6">
                    <div className="text-amber-forge">
                      <Icons.Target />
                    </div>
                    <h3 className="text-sm font-bold text-amber-forge tracking-wide uppercase">
                      Plant-Level Intelligence
                    </h3>
                  </div>
                ) : null

                return (
                  <div key={index}>
                    {sectionHeader}
                    
                    {/* Tile */}
                    <div
                      className={`relative ${isLeft ? 'mr-auto' : 'ml-auto'}`}
                      style={{ width: '48%' }}
                    >
                      <CapabilityTile
                        tile={tile}
                        isActive={activeTileIndex === index}
                        tileRef={isMobile ? setTileRef(index) : undefined}
                        onClick={() => setExpandedTile(tile)}
                        compact={true}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* DESKTOP HORIZONTAL LAYOUT */}
          <div className="hidden md:block space-y-6">
          {/* ROW 1: Inspection Pipeline */}
          <div>
            {/* Row label above */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-amber-forge">
                <Icons.Hexagon />
              </div>
              <h3 className="text-sm font-bold text-amber-forge tracking-wide uppercase">
                Inspection Pipeline
              </h3>
            </div>
            
            {/* Tiles */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
              <CapabilityTile
                tile={capabilityTiles[0]}
                isActive={activeTileIndex === 0}
                tileRef={!isMobile ? setTileRef(0) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[0])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[1]}
                isActive={activeTileIndex === 1}
                tileRef={!isMobile ? setTileRef(1) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[1])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[2]}
                isActive={activeTileIndex === 2}
                tileRef={!isMobile ? setTileRef(2) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[2])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[3]}
                isActive={activeTileIndex === 3}
                tileRef={!isMobile ? setTileRef(3) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[3])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[4]}
                isActive={activeTileIndex === 4}
                tileRef={!isMobile ? setTileRef(4) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[4])}
              />
            </div>
          </div>

          {/* Turn connector Row 1 → Row 2 (right side drop) */}
          <RowTurn turnRef={turn1Ref} isRightSide={true} xPercent={turn1XPercent} />

          {/* ROW 2: Process Intelligence (REVERSED - Right to Left) */}
          <div>
            {/* Row label above */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-metallic-400">
                <Icons.Link />
              </div>
              <h3 className="text-sm font-bold text-metallic-100 tracking-wide uppercase">
                Process Intelligence
              </h3>
            </div>
            
            {/* Tiles - rendered right to left: 9 ← 8 ← 7 ← 6 ← 5 */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
              <CapabilityTile
                tile={capabilityTiles[9]}
                isActive={activeTileIndex === 9}
                tileRef={!isMobile ? setTileRef(9) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[9])}
              />
              <ReverseBeltConnector />
              <CapabilityTile
                tile={capabilityTiles[8]}
                isActive={activeTileIndex === 8}
                tileRef={!isMobile ? setTileRef(8) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[8])}
              />
              <ReverseBeltConnector />
              <CapabilityTile
                tile={capabilityTiles[7]}
                isActive={activeTileIndex === 7}
                tileRef={!isMobile ? setTileRef(7) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[7])}
              />
              <ReverseBeltConnector />
              <CapabilityTile
                tile={capabilityTiles[6]}
                isActive={activeTileIndex === 6}
                tileRef={!isMobile ? setTileRef(6) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[6])}
              />
              <ReverseBeltConnector />
              <CapabilityTile
                tile={capabilityTiles[5]}
                isActive={activeTileIndex === 5}
                tileRef={!isMobile ? setTileRef(5) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[5])}
              />
            </div>
          </div>

          {/* Turn connector Row 2 → Row 3 (left side drop) */}
          <RowTurn turnRef={turn2Ref} isRightSide={false} xPercent={turn2XPercent} />

          {/* ROW 3: Plant-Level Intelligence */}
          <div>
            {/* Row label above */}
            <div className="flex items-center gap-3 mb-4">
              <div className="text-amber-forge">
                <Icons.Target />
              </div>
              <h3 className="text-sm font-bold text-amber-forge tracking-wide uppercase">
                Plant-Level Intelligence
              </h3>
            </div>
            
            {/* Tiles */}
            <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
              <CapabilityTile
                tile={capabilityTiles[10]}
                isActive={activeTileIndex === 10}
                tileRef={!isMobile ? setTileRef(10) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[10])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[11]}
                isActive={activeTileIndex === 11}
                tileRef={!isMobile ? setTileRef(11) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[11])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[12]}
                isActive={activeTileIndex === 12}
                tileRef={!isMobile ? setTileRef(12) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[12])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[13]}
                isActive={activeTileIndex === 13}
                tileRef={!isMobile ? setTileRef(13) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[13])}
              />
              <BeltConnector />
              <CapabilityTile
                tile={capabilityTiles[14]}
                isActive={activeTileIndex === 14}
                tileRef={!isMobile ? setTileRef(14) : undefined}
                onClick={() => setExpandedTile(capabilityTiles[14])}
              />
            </div>
          </div>
          </div>
          {/* End desktop layout */}

          {/* Continuous Improvement Loop - shown on all screen sizes */}
          <div className="mt-8">
            <div
              className="p-5 text-center rounded-lg"
              style={{
                border: '1px dashed rgba(147,197,253,0.25)',
                background: 'rgba(147,197,253,0.03)',
                boxShadow: '0 0 15px rgba(147,197,253,0.08), 0 0 30px rgba(147,197,253,0.04)',
              }}
            >
              <p className="text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'rgba(147,197,253,0.9)' }}>
                ↻ Continuous Improvement Loop
              </p>
              <p className="text-xs text-metallic-400 leading-relaxed">
                Supervisor corrections improve analysis. Continuous feedback and logging enable auto‑tuning and auto‑calibration of the system over time.
              </p>
            </div>
          </div>

        </div>
        {/* End container */}

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
                boxShadow: '0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)',
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
                boxShadow: '0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)',
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
              boxShadow: '0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)',
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
