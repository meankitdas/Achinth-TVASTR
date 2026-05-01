import { useScrollReveal } from '../hooks/useScrollReveal'
import { Link } from 'react-router-dom'

/**
 * SEOContentSection — SEO-optimized content section for foundry keywords.
 * 
 * Adds ~500 words of structured, keyword-rich content to improve search visibility
 * for: AI for foundry, casting defect detection, rejection analysis, PIRAS, process intelligence
 * 
 * Styled to match existing design system without disrupting visual flow.
 * Includes internal links with keyword-rich anchor text for Google crawling.
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
        
        {/* Section 1: AI for Foundry Quality */}
        <div className="reveal mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
              AI for Foundry
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-metallic-100 leading-tight mb-6">
            AI for Foundry Quality Control
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-base text-metallic-300 leading-relaxed mb-4">
                <Link to="/systems/rejection-analysis-system" className="text-amber-forge font-semibold hover:text-amber-glow transition-colors">Casting defect detection</Link> in foundries has traditionally relied on manual inspection—a process that is subjective, time-consuming, and inconsistent across shifts. Tvastr's <Link to="/systems/rejection-analysis-system" className="text-amber-forge hover:text-amber-glow transition-colors">AI for foundry</Link> operations transforms this critical quality gate into an automated, data-driven system that detects surface defects with precision and consistency.
              </p>
              <p className="text-base text-metallic-300 leading-relaxed">
                Our <Link to="/systems/rejection-analysis-system" className="text-amber-forge font-semibold hover:text-amber-glow transition-colors">rejection analysis system</Link> uses computer vision and machine learning to identify pinholes, blowholes, shrinkage, cracks, and misruns in real-time. Every inspection generates structured data that feeds into <Link to="/systems/plant-intelligence" className="text-amber-forge font-semibold hover:text-amber-glow transition-colors">process intelligence</Link> analytics, enabling foundries to move from reactive quality control to proactive process optimization.
              </p>
            </div>
            
            <div className="liquid-glass p-6 rounded-lg">
              <h3 className="text-lg font-bold text-metallic-100 mb-4">Key Capabilities</h3>
              <ul className="space-y-3">
                {[
                  'Automated casting defect detection with 95%+ accuracy',
                  'Real-time rejection analysis and root cause identification',
                  'Integration with ERP and MES systems for full traceability',
                  'Process intelligence dashboards for quality trend monitoring',
                  'Continuous learning from production data'
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

        {/* Section 2: What is PIRAS */}
        <div className="reveal reveal-delay-1 mb-16 md:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
              Our System
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-metallic-100 leading-tight mb-6">
            What is PIRAS?
          </h2>
          
          <div className="max-w-4xl">
            <p className="text-lg text-metallic-200 leading-relaxed mb-6">
              <strong className="text-amber-forge">PIRAS (<Link to="/systems/plant-intelligence" className="text-amber-forge hover:text-amber-glow transition-colors">Plant Intelligence and Rejection Analysis System</Link>)</strong> is Tvastr's comprehensive <Link to="/systems/rejection-analysis-system" className="text-amber-forge hover:text-amber-glow transition-colors">AI platform for foundry</Link> quality control and manufacturing intelligence. It combines automated inspection, defect analysis, and process-level understanding into a single integrated system.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="liquid-glass-amber p-5 rounded-lg">
                <h4 className="text-base font-bold text-amber-forge mb-2">Inspection Layer</h4>
                <p className="text-sm text-metallic-400 leading-relaxed">
                  AI-powered vision system detects and classifies casting defects automatically at the inspection station.
                </p>
              </div>
              
              <div className="liquid-glass-amber p-5 rounded-lg">
                <h4 className="text-base font-bold text-amber-forge mb-2">Analysis Layer</h4>
                <p className="text-sm text-metallic-400 leading-relaxed">
                  <strong className="text-metallic-200">Root cause analysis</strong> links defect patterns to process parameters like heat number, mold condition, and pouring temperature.
                </p>
              </div>
              
              <div className="liquid-glass-amber p-5 rounded-lg">
                <h4 className="text-base font-bold text-amber-forge mb-2">Intelligence Layer</h4>
                <p className="text-sm text-metallic-400 leading-relaxed">
                  Plant-level analytics provide <strong className="text-metallic-200">process-level understanding</strong> through trend analysis, drift detection, and predictive insights.
                </p>
              </div>
            </div>
            
            <p className="text-base text-metallic-300 leading-relaxed">
              By connecting casting-level inspection with manufacturing context, PIRAS enables foundries to identify recurring quality issues, understand their root causes, and implement targeted process improvements—all while maintaining complete traceability for compliance and audit requirements.
            </p>
          </div>
        </div>

        {/* Section 3: Use Cases */}
        <div className="reveal reveal-delay-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
              Applications
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-metallic-100 leading-tight mb-8">
            Use Cases in Production
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="liquid-glass p-6 rounded-lg hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-bold text-metallic-100 mb-3">Defect Detection</h3>
              <p className="text-sm text-metallic-400 leading-relaxed">
                Automated surface inspection for all casting types. Detects pinholes, porosity, cracks, sand inclusions, and misruns with consistent accuracy across shifts and operators.
              </p>
            </div>
            
            <div className="liquid-glass p-6 rounded-lg hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-bold text-metallic-100 mb-3">Rejection Reduction</h3>
              <p className="text-sm text-metallic-400 leading-relaxed">
                Identify high-risk process conditions before they cause batch rejections. Track rejection trends by heat, mold, shift, and operator to target improvement efforts effectively.
              </p>
            </div>
            
            <div className="liquid-glass p-6 rounded-lg hover:scale-105 transition-transform duration-300">
              <h3 className="text-lg font-bold text-metallic-100 mb-3">Process Optimization</h3>
              <p className="text-sm text-metallic-400 leading-relaxed">
                Use structured quality data to drive continuous improvement. Detect process drift, analyze defect patterns, and validate the impact of process changes with measurable quality metrics.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section with Internal Links */}
        <div className="reveal reveal-delay-3 mt-20">
          <div className="liquid-glass p-8 rounded-lg text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-metallic-100 mb-4">
              Explore Our Systems
            </h3>
            <p className="text-base text-metallic-300 mb-8 max-w-2xl mx-auto">
              Learn more about our AI-powered solutions for foundry quality control and manufacturing intelligence
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
