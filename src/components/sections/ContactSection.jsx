import { SectionShell } from '@/components/primitives/SectionShell'

export function ContactSection() {
  return (
    <SectionShell id="contact" type="contact" content={{ title: "Contact Us" }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: text */}
          <div className="flex flex-col justify-center">
            <p className="text-base text-metallic-400 leading-relaxed mb-8">
              Ready to bring persistent industrial intelligence to your manufacturing environment? 
              Schedule a live demonstration to see how Tvastr transforms data into actionable insight.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-metallic-400">
                <span className="font-semibold text-metallic-100">Email:</span> achintharya@tvastr.co
              </p>
              <p className="text-sm text-metallic-400">
                <span className="font-semibold text-metallic-100">Location:</span> Bengaluru, India — with global deployment capability
              </p>
            </div>
          </div>

          {/* Right: form placeholder */}
          <div className="p-8 bg-charcoal-950 rounded-lg border border-metallic-800/30">
            <h3 className="text-xl font-bold text-metallic-100 mb-6">Request a Demo</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 bg-metallic-900/50 border border-metallic-800/30 rounded text-metallic-100 focus:outline-none focus:ring-1 focus:ring-amber-forge"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-4 py-3 bg-metallic-900/50 border border-metallic-800/30 rounded text-metallic-100 focus:outline-none focus:ring-1 focus:ring-amber-forge"
              />
              <textarea
                placeholder="Tell us about your manufacturing process"
                rows="4"
                className="w-full px-4 py-3 bg-metallic-900/50 border border-metallic-800/30 rounded text-metallic-100 focus:outline-none focus:ring-1 focus:ring-amber-forge"
              />
              <button className="w-full px-8 py-3 bg-amber-forge text-charcoal-950 font-semibold tracking-wider uppercase rounded hover:bg-amber-forge/90 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}