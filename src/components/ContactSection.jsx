import { useScrollReveal } from '../hooks/useScrollReveal'

/**
 * ContactSection — Minimal footer contact panel.
 * Glowing amber divider line above.
 * Centered layout with name, email, LinkedIn.
 */
export function ContactSection() {
  const ref = useScrollReveal()

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: '#0a0a0b' }}
    >
      {/* Glowing divider line */}
      <div className="relative mb-20">
        <div
          className="absolute left-1/2 -translate-x-1/2 w-[1px] h-16"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(245,158,11,0.6), transparent)',
          }}
        />
        <div
          className="h-px max-w-7xl mx-auto"
          style={{
            background:
              'linear-gradient(to right, transparent 0%, rgba(245,158,11,0.3) 30%, rgba(245,158,11,0.5) 50%, rgba(245,158,11,0.3) 70%, transparent 100%)',
            boxShadow: '0 0 20px rgba(245,158,11,0.15)',
          }}
        />
      </div>

      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Section label */}
        <div className="reveal flex items-center justify-center gap-3 mb-12">
          <div className="w-8 h-px bg-amber-forge opacity-40" />
          <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-40">
            Get In Touch
          </span>
          <div className="w-8 h-px bg-amber-forge opacity-40" />
        </div>

        {/* Main contact panel */}
        <div className="reveal flex flex-col items-center text-center">
          {/* Name */}
          <h2
            className="text-3xl md:text-4xl font-black tracking-tight mb-2"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Achintharya Patil
          </h2>

          <p className="text-sm text-metallic-500 tracking-widest uppercase mb-10">
            Founder · Tvastr
          </p>

          {/* Contact links */}
          <div className="reveal reveal-delay-1 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-12">
            {/* Email */}
            <a
              href="mailto:placeholder@email.com"
              className="group flex items-center gap-3 text-sm text-metallic-300 hover:text-amber-glow transition-colors duration-300"
            >
              <span
                className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-amber-forge"
                style={{
                  border: '1px solid rgba(168,168,180,0.15)',
                  background: 'rgba(26,26,30,0.8)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="3" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="0.8" fill="none"/>
                  <path d="M1 4.5L7 8.5L13 4.5" stroke="currentColor" strokeWidth="0.8" fill="none"/>
                </svg>
              </span>
              <span>placeholder@email.com</span>
            </a>

            {/* Divider */}
            <div className="hidden sm:block w-px h-4 bg-metallic-600 opacity-30" />

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 text-sm text-metallic-300 hover:text-amber-glow transition-colors duration-300"
            >
              <span
                className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-amber-forge"
                style={{
                  border: '1px solid rgba(168,168,180,0.15)',
                  background: 'rgba(26,26,30,0.8)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="0.8" fill="none"/>
                  <circle cx="4.5" cy="4.5" r="1" fill="currentColor"/>
                  <line x1="4.5" y1="6.5" x2="4.5" y2="11" stroke="currentColor" strokeWidth="0.8"/>
                  <path d="M6.5 6.5V11M6.5 8.5C6.5 7.5 7.5 6.5 8.5 6.5C9.5 6.5 10 7.2 10 8V11" stroke="currentColor" strokeWidth="0.8" fill="none"/>
                </svg>
              </span>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Bottom brand + copyright */}
        <div className="reveal reveal-delay-2 flex flex-col md:flex-row items-center justify-between gap-6 pt-8 mt-8"
          style={{ borderTop: '1px solid rgba(168,168,180,0.06)' }}
        >
          {/* Mini logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-6 h-6 flex items-center justify-center"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                transform: 'rotate(45deg)',
              }}
            >
              <div
                className="w-2 h-2"
                style={{
                  background: 'rgba(245,158,11,0.6)',
                  transform: 'rotate(0deg)',
                }}
              />
            </div>
            <span
              className="text-sm font-black tracking-widest"
              style={{
                background: 'linear-gradient(135deg, #c8c8d0 0%, #686878 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              TVASTR
            </span>
          </div>

          <p className="text-xs text-metallic-600 tracking-wide text-center">
            Industrial Intelligence, Forged. © {new Date().getFullYear()} Tvastr. All rights reserved.
          </p>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            {['About', 'Systems', 'Philosophy'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase() === 'systems' ? 'products' : item.toLowerCase() === 'philosophy' ? 'technology' : item.toLowerCase()}`}
                className="text-xs text-metallic-500 hover:text-metallic-200 transition-colors duration-200 tracking-wider uppercase"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
