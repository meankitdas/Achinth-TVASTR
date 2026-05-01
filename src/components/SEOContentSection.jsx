import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

/**
 * SEOContentSection - SEO-optimized content section for foundry keywords.
 * 
 * Provides unique educational content not found elsewhere on the site.
 * Focus: business case, data journey, measurable impact.
 */
export function SEOContentSection() {
  const ref = useScrollReveal()

  return (
    <section
      id="seo-content"
      ref={ref}
      className="relative z-10 py-20 md:py-32 bg-charcoal-950 overflow-hidden"
    >
      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      
      {/* Subtle radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-12 lg:px-16">
        
        {/* Section 1: Why Automated Inspection */}
        <div className="reveal mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
              The Problem
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-metallic-100 leading-tight mb-6">
            Why Automated Inspection?
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-base text-metallic-300 leading-relaxed mb-4">
                Manual inspection creates variability. Different inspectors make different calls on the same casting. Shift changes introduce inconsistency. Fatigue affects judgment. Defects get missed or over-reported depending on who inspects when.
              </p>
              <p className="text-base text-metallic-300 leading-relaxed">
                Quality data from manual inspection is unstructured. Inspector notes vary. Rejection causes are described differently across shifts. Linking defects to process parameters requires manual correlation. Root cause analysis depends on tribal knowledge.
              </p>
            </div>
            
            <div className="liquid-glass p-6 rounded-lg">
              <h3 className="text-lg font-bold text-metallic-100 mb-4">What Changes</h3>
              <ul className="space-y-3">
                {[
                  'Consistent defect detection independent of inspector or shift',
                  'Structured data for every inspection with defect type, location, confidence',
                  'Automatic linking to heat number, mold ID, shift, and operator',
                  'Process-level view of rejection trends across production runs',
                  'Faster identification of recurring defect patterns'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-metallic-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-forge flex-shrink-0 mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: From Inspection to Intelligence */}
        <div className="reveal reveal-delay-1 mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
              The Journey
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-metallic-100 leading-tight mb-6">
            From Inspection to Intelligence
          </h2>
          
          <div className="max-w-4xl">
            <p className="text-lg text-metallic-200 leading-relaxed mb-6">
              The system transforms unstructured casting images into actionable manufacturing intelligence through three stages.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="liquid-glass-amber p-5 rounded-lg">
                <h4 className="text-base font-bold text-amber-forge mb-2">Stage 1: Detection</h4>
                <p className="text-sm text-metallic-400 leading-relaxed">
                  Computer vision analyzes casting images and identifies defect locations. Multi-signal fusion combines YOLO object detection, signal-based feature analysis, and LLM reasoning to classify defect types with confidence scores.
                </p>
              </div>
              
              <div className="liquid-glass-amber p-5 rounded-lg">
                <h4 className="text-base font-bold text-amber-forge mb-2">Stage 2: Analysis</h4>
                <p className="text-sm text-metallic-400 leading-relaxed">
                  The system maps detected defects to probable root causes. Diagnosis identifies whether the issue originates from moulding, pouring, or core processes. Every inspection is linked to production context through heat numbers, mold IDs, and shift data.
                </p>
              </div>
              
              <div className="liquid-glass-amber p-5 rounded-lg">
                <h4 className="text-base font-bold text-amber-forge mb-2">Stage 3: Intelligence</h4>
                <p className="text-sm text-metallic-400 leading-relaxed">
                  Structured inspection data feeds plant-level analytics. The system identifies rejection trends by heat, mold, shift, and operator. Process drift detection triggers alerts before rejection rates climb. Pattern matching finds recurring defects across production runs.
                </p>
              </div>
            </div>
            
            <p className="text-base text-metallic-300 leading-relaxed">
              Each inspection adds data to the system. Over time, this builds a complete picture of quality across the plant. Trends become visible. Root causes surface. Process improvements become targeted instead of reactive.
            </p>
          </div>
        </div>

        {/* Section 3: Measurable Impact */}
        <div className="reveal reveal-delay-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
              The Outcome
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-metallic-100 leading-tight mb-8">
            Measurable Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="liquid-glass p-6 rounded-lg">
              <h3 className="text-lg font-bold text-metallic-100 mb-3">Reduced Rejection</h3>
              <p className="text-sm text-metallic-400 leading-relaxed">
                Consistent detection catches defects that manual inspection misses. Process-level understanding enables targeted improvements. Rejection rates decline as root causes are identified and addressed systematically.
              </p>
            </div>
            
            <div className="liquid-glass p-6 rounded-lg">
              <h3 className="text-lg font-bold text-metallic-100 mb-3">Faster Root Cause ID</h3>
              <p className="text-sm text-metallic-400 leading-relaxed">
                Structured data links defects to process parameters automatically. Heat-level analysis identifies problematic batches immediately. Pattern recognition spots recurring issues without manual investigation.
              </p>
            </div>
            
            <div className="liquid-glass p-6 rounded-lg">
              <h3 className="text-lg font-bold text-metallic-100 mb-3">Process Visibility</h3>
              <p className="text-sm text-metallic-400 leading-relaxed">
                Quality trends by shift, heat, mold, and operator become visible. Process drift gets detected before major issues occur. Improvement efforts target actual problem areas instead of assumptions.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section with Internal Links */}
        <div className="reveal reveal-delay-3 mt-20">
          <div className="liquid-glass p-8 rounded-lg text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-metallic-100 mb-4">
              Learn More
            </h3>
            <p className="text-base text-metallic-300 mb-8 max-w-2xl mx-auto">
              Explore detailed technical information about our <Link to="/systems/rejection-analysis-system" className="text-amber-forge hover:text-amber-glow transition-colors">defect detection system</Link> and <Link to="/systems/plant-intelligence" className="text-amber-forge hover:text-amber-glow transition-colors">plant intelligence platform</Link>.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/systems/rejection-analysis-system"
                className="group relative inline-block px-6 py-3 text-sm font-semibold tracking-wider uppercase overflow-hidden transition-all duration-300 rounded"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  color: '#fbbf24',
                }}
              >
                <span className="relative">Rejection Analysis System</span>
              </Link>
              
              <Link
                to="/systems/plant-intelligence"
                className="group relative inline-block px-6 py-3 text-sm font-semibold tracking-wider uppercase overflow-hidden transition-all duration-300 rounded"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  color: '#fbbf24',
                }}
              >
                <span className="relative">Plant Intelligence</span>
              </Link>
              
              <Link
                to="/system"
                className="group relative inline-block px-6 py-3 text-sm font-semibold tracking-wider uppercase overflow-hidden transition-all duration-300 rounded"
                style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.05) 100%)',
                  border: '1px solid rgba(245,158,11,0.4)',
                  color: '#fbbf24',
                }}
              >
                <span className="relative">System Documentation</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
