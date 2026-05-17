import { useDocumentHead } from '../hooks/useDocumentHead'

export function AboutPage() {
  useDocumentHead(
    'About Tvastr | Industrial Intelligence Platform',
    'Learn about Tvastr - pioneering AI-powered quality inspection and process intelligence for manufacturing industries.',
    'https://tvastr.co/about'
  )

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0b' }}>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-amber-forge text-xs tracking-[0.2em] uppercase font-semibold">
              About Tvastr
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-metallic-50">
              Building the Future of Industrial Intelligence
            </h1>
            
            <p className="text-xl md:text-2xl text-metallic-300 font-light">
              Empowering manufacturers with explainable AI-driven quality inspection and process optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-metallic-50 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-metallic-300 leading-relaxed mb-4">
                Tvastr is on a mission to transform traditional manufacturing quality control through 
                signal-based AI inspection systems that are explainable, auditable, and deployment-ready.
              </p>
              <p className="text-lg text-metallic-300 leading-relaxed">
                We believe that quality inspection should not be a black box. Our technology combines 
                physics-driven signal analysis with machine learning to deliver reliable defect detection 
                that engineers can trust and understand.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-amber-forge mb-3">Vision</h3>
                <p className="text-metallic-400">
                  To become the global standard for AI-powered quality inspection in precision manufacturing, 
                  enabling zero-defect production at scale.
                </p>
              </div>
              
              <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-amber-forge mb-3">Values</h3>
                <ul className="space-y-2 text-metallic-400">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-forge mt-1">•</span>
                    <span>Explainability over black-box AI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-forge mt-1">•</span>
                    <span>Engineering rigor in every decision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-forge mt-1">•</span>
                    <span>Customer success through tangible ROI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-forge mt-1">•</span>
                    <span>Continuous innovation backed by research</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Approach */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#12121a' }}>
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-metallic-50 mb-6">
              Our Technology Approach
            </h2>
            <p className="text-lg text-metallic-300">
              Unlike pure computer vision ML approaches, Tvastr uses multi-sensor signal fusion 
              combined with physics-based classification rules.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-metallic-100 mb-3">
                Signal-First Classification
              </h3>
              <p className="text-metallic-400">
                We extract interpretable features from vision, thermal, eddy current, and ultrasonic sensors 
                to classify defects based on physical principles.
              </p>
            </div>

            <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-metallic-100 mb-3">
                Process Intelligence
              </h3>
              <p className="text-metallic-400">
                Our PI system transforms rejection data into actionable insights using SPC, Pareto, 
                Fishbone, and correlation analytics.
              </p>
            </div>

            <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-metallic-100 mb-3">
                Edge Deployment
              </h3>
              <p className="text-metallic-400">
                Hybrid edge-cloud architecture enables real-time inspection with &lt;200ms latency 
                while maintaining centralized analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-metallic-50 mb-6">
              Built by Engineers, for Engineers
            </h2>
            <p className="text-lg text-metallic-300">
              Our team combines deep expertise in computer vision, signal processing, manufacturing engineering, 
              and industrial AI deployment.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-metallic-100 mb-4 text-center">
                Leadership
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-metallic-100">Achinth Arya</h4>
                  <p className="text-amber-forge mb-2">Founder & CEO</p>
                  <p className="text-metallic-400">
                    Building AI systems for industrial quality control with focus on explainability and reliability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden" style={{ background: '#12121a' }}>
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-metallic-50">
              Join Us in Transforming Manufacturing Quality
            </h2>
            
            <p className="text-lg text-metallic-400">
              Whether you're a foundry looking to reduce scrap or a manufacturing engineer seeking better 
              process insights, we'd love to discuss how Tvastr can help.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#contact"
                className="px-8 py-3 bg-amber-forge text-metallic-950 font-semibold rounded hover:bg-amber-600 transition-colors"
              >
                Schedule Demo
              </a>
              <a
                href="/technology"
                className="px-8 py-3 border border-metallic-700 text-metallic-200 font-semibold rounded hover:border-amber-forge hover:text-amber-forge transition-colors"
              >
                Learn About Our Technology
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}