import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLicense } from '../context/LicenseContext'
import { Logo } from '../components/Logo'

/**
 * PortalManual — Protected page displaying the complete PIRAS User Manual.
 * 
 * Contains the full corrected user manual written for non-technical foundry workers.
 * Features a floating table of contents sidebar for easy navigation.
 */
export function PortalManual() {
  const { user, signOut } = useAuth()
  const { tier } = useLicense()
  const [activeSection, setActiveSection] = useState('')

  // Track active section for TOC highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]')
      let currentSection = ''

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 100 && rect.bottom >= 100) {
          currentSection = section.getAttribute('data-section')
        }
      })

      setActiveSection(currentSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const tocSections = [
    { id: 'section-1', label: '1. What This System Does' },
    { id: 'section-2', label: '2. Starting the System' },
    { id: 'section-3', label: '3. Main Screen Layout' },
    { id: 'section-4', label: '4. Run Inspection' },
    { id: 'section-5', label: '5. Batch Processing' },
    { id: 'section-6', label: '6. Results & Report' },
    { id: 'section-7', label: '7. Human Validation' },
    { id: 'section-8', label: '8. Analytics' },
    { id: 'section-9', label: '9. Understanding Alerts' },
    { id: 'section-10', label: '10. Learning Module' },
    { id: 'section-11', label: '11. Plant Intelligence' },
    { id: 'section-12', label: '12. AI Query' },
    { id: 'section-13', label: '13. Daily Usage Flow' },
    { id: 'section-14', label: '14. Best Practices' },
    { id: 'section-15', label: '15. Troubleshooting' },
    { id: 'section-16', label: '16. Understanding Numbers' },
    { id: 'section-17', label: '17. License Levels' },
    { id: 'section-18', label: '18. Quick Reference' },
  ]

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0b' }}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Top nav */}
      <header
        className="sticky top-0 z-50"
        style={{
          background: 'rgba(10,10,11,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(168,168,180,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <Logo size="sm" />
            <span className="text-txt-muted text-xs hidden md:inline">/ Customer Portal</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/portal/dashboard"
              className="text-xs font-semibold tracking-widest uppercase transition-colors duration-200 text-txt-muted hover:text-txt-primary"
            >
              Dashboard
            </Link>
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: '#f59e0b' }}
            >
              User Manual
            </span>
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }}
              />
              <span className="text-xs text-txt-secondary font-mono">{user?.email}</span>
            </div>
            <button
              onClick={signOut}
              className="text-xs font-medium tracking-widest uppercase text-txt-muted hover:text-txt-primary transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content with TOC sidebar */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="flex gap-8">
          {/* Floating TOC Sidebar - Desktop only */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div
                className="p-4"
                style={{
                  background: 'rgba(17,17,19,0.95)',
                  border: '1px solid rgba(168,168,180,0.08)',
                }}
              >
                <h3 className="text-xs font-bold tracking-widest uppercase text-txt-secondary mb-4">
                  Contents
                </h3>
                <nav className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {tocSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="block w-full text-left text-xs py-1.5 px-2 transition-colors duration-200"
                      style={{
                        color: activeSection === section.id ? '#f59e0b' : '#888896',
                        background: activeSection === section.id ? 'rgba(245,158,11,0.08)' : 'transparent',
                      }}
                    >
                      {section.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Manual content */}
          <main className="flex-1 min-w-0">
            {/* Title */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-signal-warning opacity-60" />
                <span className="text-xs font-semibold tracking-[0.3em] uppercase text-signal-warning opacity-60">
                  Operator Guide
                </span>
              </div>
              <h1
                className="text-4xl md:text-5xl font-black tracking-tight mb-3"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Tvastr PIRAS
              </h1>
              <p className="text-lg text-txt-secondary mb-2">
                AI-Powered Casting Inspection System — User Manual
              </p>
              <p className="text-sm text-txt-muted">
                Version 1.0 | Written for non-technical foundry workers
              </p>
            </div>

            {/* Manual sections */}
            <div className="space-y-12">
              {/* Section 1: What This System Does */}
              <section id="section-1" data-section="section-1" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  1. What This System Does
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-2 uppercase tracking-wide">Purpose</h3>
                    <p className="text-sm text-txt-secondary leading-relaxed">
                      PIRAS inspects casting surfaces and tells you three things:
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-txt-secondary leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span style={{ color: '#10b981' }}>●</span>
                        <span><strong>Is this casting good or bad?</strong> → ACCEPT CASTING (green) / REJECT CASTING (red) / CHECK REQUIRED (orange)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span style={{ color: '#f59e0b' }}>●</span>
                        <span><strong>What type of defect?</strong> → 6 types: Porosity, Shrinkage, Sand Inclusion, Sand & Slag Inclusion, Moulding Error, Pouring Temperature Defect</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span style={{ color: '#ef4444' }}>●</span>
                        <span><strong>Why did it happen?</strong> (root cause) and <strong>What should we fix?</strong> (corrective action)</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-2 uppercase tracking-wide">How It Helps</h3>
                    <ul className="space-y-2 text-sm text-txt-secondary leading-relaxed">
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Reduces scrap and rework by catching defects early</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Finds root causes so you can fix problems at the source</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Improves consistency across shifts and operators</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Provides data for management and quality reviews</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 2: Starting the System */}
              <section id="section-2" data-section="section-2" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  2. Starting the System
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    <strong>Step 1:</strong> Double-click the PIRAS icon on your desktop<br />
                    <strong>Step 2:</strong> Wait 10-15 seconds for the system to start<br />
                    <strong>Step 3:</strong> A desktop window opens showing the web dashboard
                  </p>
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    The system runs inside a desktop window (PyWebView) with a web interface (Streamlit).
                  </p>

                  <div className="mt-4 p-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <h4 className="text-xs font-bold text-signal-warning mb-2 uppercase tracking-wide">Status Indicators</h4>
                    <ul className="space-y-2 text-sm text-txt-secondary">
                      <li className="flex items-start gap-2">
                        <span className="w-3 h-3 rounded-full mt-0.5" style={{ background: '#10b981' }}></span>
                        <span><strong>Green dot</strong> = "Connected to SQL Database" (factory data available)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-3 h-3 rounded-full mt-0.5" style={{ background: '#ef4444' }}></span>
                        <span><strong>Red dot</strong> = "Running in Offline Mode" (upload ERP CSV manually, contact IT)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3: Main Screen Layout */}
              <section id="section-3" data-section="section-3" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  3. Main Screen Layout
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-2 uppercase tracking-wide">Top Bar</h3>
                    <p className="text-sm text-txt-secondary leading-relaxed">
                      Tvastr logo • "Rejection Analysis System" title • Customer name • <strong>Batch Mode toggle</strong> • Database connection status
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-3 uppercase tracking-wide">Tabs (up to 6, depending on your license level)</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)' }}>
                        <span className="text-signal-warning font-bold">1</span>
                        <div>
                          <p className="text-sm font-semibold text-txt-primary">Run Inspection</p>
                          <p className="text-xs text-txt-muted">(or "Batch Processing" when Batch Mode is ON)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)' }}>
                        <span className="text-signal-warning font-bold">2</span>
                        <div>
                          <p className="text-sm font-semibold text-txt-primary">Results & Report</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)' }}>
                        <span className="text-signal-warning font-bold">3</span>
                        <div>
                          <p className="text-sm font-semibold text-txt-primary">Human Validation</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)' }}>
                        <span className="text-signal-warning font-bold">4</span>
                        <div>
                          <p className="text-sm font-semibold text-txt-primary">Analytics</p>
                          <p className="text-xs text-txt-muted">(all license levels)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        <span className="text-txt-secondary font-bold">5</span>
                        <div>
                          <p className="text-sm font-semibold text-txt-primary">Learning</p>
                          <p className="text-xs text-txt-muted">(Standard and Full licenses only)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        <span className="text-txt-secondary font-bold">6</span>
                        <div>
                          <p className="text-sm font-semibold text-txt-primary">Plant Intelligence</p>
                          <p className="text-xs text-txt-muted">(Full license only)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4: Tab 1 - Run Inspection */}
              <section id="section-4" data-section="section-4" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  4. Tab 1 — Run Inspection (Single Casting)
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div className="space-y-3 text-sm text-txt-secondary leading-relaxed">
                    <p><strong className="text-txt-primary">Step 1:</strong> Enter Casting ID (type it or click "Auto-Generate")</p>
                    <p><strong className="text-txt-primary">Step 2:</strong> Upload surface photo (drag-and-drop or click Browse — accepts JPG, JPEG, PNG)</p>
                    <p><strong className="text-txt-primary">Step 3:</strong> If not connected to database, you'll see an option to upload ERP CSV file</p>
                    <p><strong className="text-txt-primary">Step 4:</strong> Click "Run Inspection"</p>
                  </div>

                  <div className="mt-4 p-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <h4 className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: '#10b981' }}>8-Stage Progress Bar</h4>
                    <p className="text-xs text-txt-secondary mb-2">You'll see these stages (takes 3-5 seconds total):</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-txt-secondary">
                      <div>1. Detection</div>
                      <div>2. Classification</div>
                      <div>3. Consolidation</div>
                      <div>4. Diagnosis</div>
                      <div>5. Reasoning</div>
                      <div>6. Visualization</div>
                      <div>7. Traceability</div>
                      <div>8. Intelligence</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-2 uppercase tracking-wide">Results You'll See</h3>
                    <div className="space-y-3">
                      <div className="p-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                        <p className="text-sm font-bold" style={{ color: '#ef4444' }}>REJECT CASTING (red banner)</p>
                      </div>
                      <div className="p-3" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                        <p className="text-sm font-bold" style={{ color: '#10b981' }}>ACCEPT CASTING (green banner)</p>
                      </div>
                      <div className="p-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                        <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>CHECK REQUIRED (orange banner)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-2 uppercase tracking-wide">4 Summary Cards</h3>
                    <div className="grid grid-cols-2 gap-3 text-xs text-txt-secondary">
                      <div className="p-3" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        <p className="text-txt-secondary font-semibold">Total Defects</p>
                        <p className="text-txt-muted">Count of defects found</p>
                      </div>
                      <div className="p-3" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        <p className="text-txt-secondary font-semibold">Primary Defect</p>
                        <p className="text-txt-muted">Most serious defect type</p>
                      </div>
                      <div className="p-3" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        <p className="text-txt-secondary font-semibold">Confidence %</p>
                        <p className="text-txt-muted">How sure the AI is</p>
                      </div>
                      <div className="p-3" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        <p className="text-txt-secondary font-semibold">Severity</p>
                        <p className="text-txt-muted">How serious the defect is</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5: Batch Mode */}
              <section id="section-5" data-section="section-5" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  5. Tab 1 (Batch Mode) — Batch Processing
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    <strong className="text-txt-primary">How to Enable:</strong> Toggle "Batch Mode" switch in the top bar. Tab 1 will change to "Batch Processing".
                  </p>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-3 uppercase tracking-wide">Two Ways to Load Castings</h3>
                    <div className="space-y-3">
                      <div className="p-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <h4 className="text-sm font-semibold text-txt-primary mb-2">Option 1: Images from ERP</h4>
                        <p className="text-sm text-txt-secondary">System fetches images from the factory database automatically</p>
                      </div>
                      <div className="p-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <h4 className="text-sm font-semibold text-txt-primary mb-2">Option 2: Folder Upload</h4>
                        <p className="text-sm text-txt-secondary">Select a folder of casting photos from your computer</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-txt-secondary leading-relaxed">
                    System processes all castings in the batch automatically. You can see progress and results for each casting.
                  </p>
                </div>
              </section>

              {/* Section 6: Results & Report */}
              <section id="section-6" data-section="section-6" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  6. Tab 2 — Results & Report
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    View detailed results for any inspected casting.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-signal-warning mt-1">●</span>
                      <div>
                        <p className="text-sm font-semibold text-txt-primary">Annotated Images</p>
                        <p className="text-xs text-txt-secondary">See exactly where defects were found on the casting</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-signal-warning mt-1">●</span>
                      <div>
                        <p className="text-sm font-semibold text-txt-primary">Download Reports</p>
                        <p className="text-xs text-txt-secondary">Get PDF reports and Excel spreadsheets for records</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-signal-warning mt-1">●</span>
                      <div>
                        <p className="text-sm font-semibold text-txt-primary">Full Diagnosis</p>
                        <p className="text-xs text-txt-secondary">Review root cause and recommended corrective actions</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 7: Human Validation */}
              <section id="section-7" data-section="section-7" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  7. Tab 3 — Human Validation
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    When the system says <strong className="text-signal-warning">CHECK REQUIRED</strong>, the casting appears in this tab.
                  </p>

                  <div className="space-y-3 text-sm text-txt-secondary">
                    <p><strong className="text-txt-primary">Step 1:</strong> Senior inspector reviews the casting physically</p>
                    <p><strong className="text-txt-primary">Step 2:</strong> Fill in the validation form in the system</p>
                    <p><strong className="text-txt-primary">Step 3:</strong> Make final decision: Accept or Reject</p>
                  </div>

                  <div className="mt-4 p-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p className="text-xs text-txt-secondary">
                      <strong className="text-txt-primary">Why This Matters:</strong> This feedback helps the system learn and improve over time. The AI gets smarter with each validation.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 8: Analytics */}
              <section id="section-8" data-section="section-8" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  8. Tab 4 — Analytics
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    Available on all license levels. Shows quality trends and performance metrics.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-signal-warning mt-1">●</span>
                      <div>
                        <p className="text-sm font-semibold text-txt-primary">Monthly KPI Dashboard</p>
                        <p className="text-xs text-txt-secondary">See rejection rates, defect counts, trends over time</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-signal-warning mt-1">●</span>
                      <div>
                        <p className="text-sm font-semibold text-txt-primary">Defectograph</p>
                        <p className="text-xs text-txt-secondary">Visual grid showing which areas of castings have most defects</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-signal-warning mt-1">●</span>
                      <div>
                        <p className="text-sm font-semibold text-txt-primary">Trend Analysis</p>
                        <p className="text-xs text-txt-secondary">Charts showing if quality is improving or getting worse</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <h4 className="text-xs font-bold text-signal-warning mb-2 uppercase tracking-wide">Filters Available</h4>
                    <p className="text-xs text-txt-secondary">Filter by: Shift • Heat • Mould • Date Range</p>
                  </div>

                  <p className="text-sm text-txt-secondary leading-relaxed">
                    <strong className="text-txt-primary">Good For:</strong> Shift handovers, management reviews, tracking improvement initiatives
                  </p>
                </div>
              </section>

              {/* Section 9: Understanding Alerts */}
              <section id="section-9" data-section="section-9" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  9. Understanding Alerts
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    The system watches your rejection rate. <strong className="text-txt-primary">Default threshold: 15%</strong> (your plant may have different targets).
                  </p>

                  <div className="space-y-3">
                    <div className="p-4" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 text-xs font-bold" style={{ background: '#ef4444', color: '#fff' }}>HIGH</span>
                        <span className="text-sm font-semibold text-txt-primary">Red Alert</span>
                      </div>
                      <p className="text-sm text-txt-secondary">Act within 1 hour. Serious quality issue detected.</p>
                    </div>

                    <div className="p-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 text-xs font-bold" style={{ background: '#f59e0b', color: '#fff' }}>MEDIUM</span>
                        <span className="text-sm font-semibold text-txt-primary">Orange Alert</span>
                      </div>
                      <p className="text-sm text-txt-secondary">Act within 4 hours. Quality trending in wrong direction.</p>
                    </div>

                    <div className="p-4" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)' }}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 text-xs font-bold" style={{ background: '#eab308', color: '#000' }}>LOW</span>
                        <span className="text-sm font-semibold text-txt-primary">Yellow Alert</span>
                      </div>
                      <p className="text-sm text-txt-secondary">Monitor and act within 24 hours. Minor quality variation.</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4" style={{ background: 'rgba(168,168,180,0.05)', border: '1px solid rgba(168,168,180,0.1)' }}>
                    <p className="text-xs font-mono text-txt-secondary">
                      <strong className="text-txt-primary">Example Alert:</strong><br />
                      "Shift 1 rejection rate is 18.5% (threshold: 15%). Primary defect: Porosity. Recommended action: Check sand moisture and compaction."
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 10: Learning Module */}
              <section id="section-10" data-section="section-10" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  10. Tab 5 — Learning Module
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div className="p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p className="text-sm text-signal-warning font-semibold">Available with Standard or Full license</p>
                  </div>

                  <p className="text-sm text-txt-secondary leading-relaxed">
                    Contains <strong className="text-txt-primary">6 modules</strong> that help you understand patterns and prevent defects:
                  </p>

                  <div className="space-y-4">
                    <div className="p-4" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                      <h4 className="text-sm font-bold text-txt-primary mb-2">1. Heat Intelligence</h4>
                      <p className="text-sm text-txt-secondary">
                        Shows quality data for each heat (melt batch). See which heats had problems, compare heat performance, track heat-by-heat trends.
                      </p>
                    </div>

                    <div className="p-4" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                      <h4 className="text-sm font-bold text-txt-primary mb-2">2. Drift Alerts</h4>
                      <p className="text-sm text-txt-secondary">
                        System watches for changes in your defect patterns. If rejection rate suddenly increases or a new type of defect appears, you get an automatic alert. Shows overnight alerts for shift start review.
                      </p>
                    </div>

                    <div className="p-4" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                      <h4 className="text-sm font-bold text-txt-primary mb-2">3. Root Cause Analysis</h4>
                      <p className="text-sm text-txt-secondary">
                        Links defects back to specific process steps. Shows if problems come from furnace temperature, sand quality, pouring practice, or mould condition. Gives recommended corrective actions.
                      </p>
                    </div>

                    <div className="p-4" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                      <h4 className="text-sm font-bold text-txt-primary mb-2">4. Zone Insights</h4>
                      <p className="text-sm text-txt-secondary">
                        Shows which physical areas/zones of your castings have the most defects. Helps identify if a specific part of the mould is wearing out.
                      </p>
                    </div>

                    <div className="p-4" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                      <h4 className="text-sm font-bold text-txt-primary mb-2">5. Risk Monitoring</h4>
                      <p className="text-sm text-txt-secondary">
                        Tracks risk levels across your process. Shows which moulds, heats, or process conditions are at risk of producing defects. Early warning system.
                      </p>
                    </div>

                    <div className="p-4" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                      <h4 className="text-sm font-bold text-txt-primary mb-2">6. Process Failure Analysis</h4>
                      <p className="text-sm text-txt-secondary">
                        Identifies the most common failure modes and their causes. Helps focus improvement efforts on the biggest problems first.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 11: Plant Intelligence */}
              <section id="section-11" data-section="section-11" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  11. Tab 6 — Plant Intelligence
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div className="p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <p className="text-sm text-signal-warning font-semibold">Available with Full license only (PIRAS)</p>
                  </div>

                  <p className="text-sm text-txt-secondary leading-relaxed">
                    Opens a <strong className="text-txt-primary">separate dashboard</strong> in a new window with advanced analytics.
                  </p>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-3 uppercase tracking-wide">8 Pages in Plant Intelligence</h3>
                    <div className="space-y-2">
                      {[
                        { num: '1', title: 'Overview', desc: 'Plant-wide quality summary at a glance' },
                        { num: '2', title: 'Alerts', desc: 'All active operational alerts in one place' },
                        { num: '3', title: 'Cost of Quality', desc: 'See the financial impact of defects — how much scrap is costing' },
                        { num: '4', title: 'Decision Intelligence', desc: 'Track quality decisions and their outcomes' },
                        { num: '5', title: 'Process Intelligence', desc: 'Deep process analysis and correlations' },
                        { num: '6', title: 'Quality Frameworks', desc: 'FMEA, Pareto analysis, quality engineering tools' },
                        { num: '7', title: 'AI Query', desc: 'Ask questions in plain language about your factory data' },
                        { num: '8', title: 'SPC', desc: 'Statistical Process Control — control charts and process capability tracking' },
                      ].map((page) => (
                        <div key={page.num} className="flex items-start gap-3 p-3" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                          <span className="text-signal-warning font-bold">{page.num}</span>
                          <div>
                            <p className="text-sm font-semibold text-txt-primary">{page.title}</p>
                            <p className="text-xs text-txt-secondary">{page.desc}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        <span className="text-signal-warning font-bold">9</span>
                        <div>
                          <p className="text-sm font-semibold text-txt-primary">Reports</p>
                          <p className="text-xs text-txt-secondary">Generate and download plant-level quality reports</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 12: AI Query */}
              <section id="section-12" data-section="section-12" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  12. AI Query — Ask Questions in Plain Language
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <p className="text-sm text-txt-secondary leading-relaxed">
                    Found in <strong className="text-txt-primary">Plant Intelligence → AI Query page</strong> (Full license only)
                  </p>

                  <p className="text-sm text-txt-secondary leading-relaxed">
                    Type questions in plain English about your factory data. The system finds the best available answer and shows it as a table, chart, or summary.
                  </p>

                  <div className="mt-4 p-4" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <h4 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: '#10b981' }}>Example Questions</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-signal-warning">→</span>
                        <code className="text-xs text-txt-secondary font-mono">"show today heat"</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-signal-warning">→</span>
                        <code className="text-xs text-txt-secondary font-mono">"how many reject today"</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-signal-warning">→</span>
                        <code className="text-xs text-txt-secondary font-mono">"which shift is bad"</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-signal-warning">→</span>
                        <code className="text-xs text-txt-secondary font-mono">"heat CC391 status"</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-signal-warning">→</span>
                        <code className="text-xs text-txt-secondary font-mono">"compare shift 1 and shift 2"</code>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 13: Daily Usage Flow */}
              <section id="section-13" data-section="section-13" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  13. Daily Usage Flow
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-3 uppercase tracking-wide">Shift Start</h3>
                    <ul className="space-y-2 text-sm text-txt-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Open PIRAS system</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Check <strong>Tab 5 → Drift Alerts</strong> for overnight alerts (Standard/Full license)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Review flagged heats from previous shift</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Note any moulds with repeated defects</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-3 uppercase tracking-wide">During Production</h3>
                    <ul className="space-y-2 text-sm text-txt-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">1</span>
                        <span>Take surface photo of casting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">2</span>
                        <span>Go to <strong>Tab 1</strong> → Upload photo → Click "Run Inspection"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">3</span>
                        <span>See result banner (3-5 seconds)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400 mt-1">→</span>
                        <span><strong>If REJECT:</strong> Mark casting, move to scrap, note in shift log</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">→</span>
                        <span><strong>If CHECK REQUIRED:</strong> Hold casting, go to Tab 3, complete validation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span style={{ color: '#10b981' }} className="mt-1">→</span>
                        <span><strong>If ACCEPT:</strong> Send to next operation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">4</span>
                        <span>Check <strong>Tab 2 (Results & Report)</strong> to review detailed findings and download reports</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-3 uppercase tracking-wide">End of Shift</h3>
                    <ul className="space-y-2 text-sm text-txt-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Check <strong>Tab 4 (Analytics)</strong> for shift summary and rejection rate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Brief next shift on any active alerts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Close any open validation items in Tab 3</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 14: Best Practices */}
              <section id="section-14" data-section="section-14" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  14. Best Practices
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-2 uppercase tracking-wide">Photo Quality Tips</h3>
                    <ul className="space-y-2 text-sm text-txt-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Take photos in good lighting (natural light or bright shop light)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Keep camera at consistent distance from casting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Focus on the surface area being inspected</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Avoid shadows, glare, or obstructions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Accepted formats: <strong>JPG, JPEG, PNG</strong></span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-2 uppercase tracking-wide">Data Entry</h3>
                    <ul className="space-y-2 text-sm text-txt-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Always enter correct Casting ID</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Use Auto-Generate if your plant has that feature enabled</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Complete validation forms thoroughly — this data helps everyone</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-2 uppercase tracking-wide">System Hygiene</h3>
                    <ul className="space-y-2 text-sm text-txt-secondary">
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Don't close the system during inspections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>If system freezes, wait 30 seconds before restarting</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-signal-warning">•</span>
                        <span>Report any repeated errors to your supervisor</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 15: Troubleshooting */}
              <section id="section-15" data-section="section-15" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  15. Troubleshooting
                </h2>
                <div
                  className="p-6 space-y-3"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  {[
                    {
                      problem: 'System won\'t start',
                      solution: 'Wait 2 minutes and try again. If still stuck, restart your computer.',
                    },
                    {
                      problem: 'Red database dot (offline mode)',
                      solution: 'Contact IT. You can still use the system by uploading ERP CSV manually.',
                    },
                    {
                      problem: 'Photo upload fails',
                      solution: 'Check file format (must be JPG, JPEG, or PNG). Try a smaller file size.',
                    },
                    {
                      problem: 'Inspection is taking too long',
                      solution: 'Normal time is 3-5 seconds. If over 30 seconds, refresh the page and try again.',
                    },
                    {
                      problem: 'Can\'t see Tab 5 or Tab 6',
                      solution: 'Your license level may not include these tabs. Contact management to upgrade.',
                    },
                    {
                      problem: 'Results don\'t make sense',
                      solution: 'Use Tab 3 (Human Validation) to provide feedback. This helps the AI learn.',
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4"
                      style={{
                        background: 'rgba(168,168,180,0.03)',
                        border: '1px solid rgba(168,168,180,0.1)',
                      }}
                    >
                      <p className="text-sm font-semibold text-txt-primary mb-1">
                        Problem: {item.problem}
                      </p>
                      <p className="text-sm text-txt-secondary">
                        <strong className="text-signal-warning">Solution:</strong> {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 16: Understanding the Numbers */}
              <section id="section-16" data-section="section-16" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  16. Understanding the Numbers
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-txt-primary mb-2">Rejection Rate</h3>
                      <p className="text-sm text-txt-secondary">
                        Percentage of castings rejected. <strong>Default threshold: 15%</strong>, but your plant may have different targets. Lower is better.
                      </p>
                      <p className="text-xs text-txt-muted mt-2">
                        Example: If 100 castings inspected and 12 rejected → 12% rejection rate
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-txt-primary mb-2">Confidence Score</h3>
                      <p className="text-sm text-txt-secondary">
                        How sure the AI is about its decision (0-100%). Higher is better. If below 70%, system may flag for human validation.
                      </p>
                      <p className="text-xs text-txt-muted mt-2">
                        Example: 95% confidence = AI is very sure. 65% confidence = AI wants human to check.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-txt-primary mb-2">Severity</h3>
                      <p className="text-sm text-txt-secondary">
                        How serious the defect is. Shown on result cards. Scale: Low → Medium → High → Critical
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-txt-primary mb-2">Defect Count</h3>
                      <p className="text-sm text-txt-secondary">
                        Number of defect areas found on a single casting. A casting can have multiple defects.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 17: License Levels */}
              <section id="section-17" data-section="section-17" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  17. License Levels
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div className="space-y-4">
                    <div className="p-4" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.15)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 text-xs font-bold text-txt-primary" style={{ background: 'rgba(168,168,180,0.2)' }}>
                          TIER 1
                        </span>
                        <h3 className="text-sm font-bold text-txt-primary uppercase">Basic — RAS Core</h3>
                      </div>
                      <p className="text-sm text-txt-secondary mb-2">Tabs 1-4:</p>
                      <ul className="text-sm text-txt-secondary space-y-1">
                        <li>• Run Inspection (single castings only)</li>
                        <li>• Results & Report</li>
                        <li>• Human Validation</li>
                        <li>• Analytics</li>
                      </ul>
                    </div>

                    <div className="p-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 text-xs font-bold" style={{ background: '#f59e0b', color: '#000' }}>
                          TIER 2
                        </span>
                        <h3 className="text-sm font-bold text-txt-primary uppercase">Standard — RAS Enterprise</h3>
                      </div>
                      <p className="text-sm text-txt-secondary mb-2">Everything in Basic, plus:</p>
                      <ul className="text-sm text-txt-secondary space-y-1">
                        <li>• Tab 5 (Learning) — all 6 modules</li>
                        <li>• ERP/SQL integration</li>
                        <li>• Batch Processing</li>
                      </ul>
                    </div>

                    <div className="p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 text-xs font-bold" style={{ background: '#10b981', color: '#000' }}>
                          TIER 3
                        </span>
                        <h3 className="text-sm font-bold text-txt-primary uppercase">Full — PIRAS</h3>
                      </div>
                      <p className="text-sm text-txt-secondary mb-2">Everything in Standard, plus:</p>
                      <ul className="text-sm text-txt-secondary space-y-1">
                        <li>• Tab 6 (Plant Intelligence) — all 9 pages</li>
                        <li>• AI Query in plain language</li>
                        <li>• Cost of Quality tracking</li>
                        <li>• SPC and quality frameworks</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-4" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                    <p className="text-sm text-txt-secondary">
                      <strong className="text-txt-primary">Want to upgrade?</strong> Contact Tvastr at{' '}
                      <a href="mailto:support@tvastr.co" className="text-signal-warning underline">
                        support@tvastr.co
                      </a>
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 18: Quick Reference */}
              <section id="section-18" data-section="section-18" className="scroll-mt-20">
                <h2 className="text-2xl font-bold text-txt-primary mb-4 tracking-tight uppercase">
                  18. Quick Reference
                </h2>
                <div
                  className="p-6 space-y-4"
                  style={{
                    background: 'rgba(17,17,19,0.95)',
                    border: '1px solid rgba(168,168,180,0.08)',
                  }}
                >
                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-3 uppercase tracking-wide">Daily Checklist</h3>
                    <div className="space-y-2 text-sm text-txt-secondary">
                      <div className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Open system, check database connection status</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Review overnight alerts (Tab 5, if available)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Inspect castings using Tab 1</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Review detailed results in Tab 2</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Complete validations in Tab 3 for CHECK REQUIRED castings</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Check shift summary in Tab 4 at end of shift</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-signal-warning mt-1">☐</span>
                        <span>Brief next shift on any active quality issues</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-3 uppercase tracking-wide">Decision Guide</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        <div className="flex-shrink-0 w-20 px-2 py-1 text-center text-xs font-bold" style={{ background: '#10b981', color: '#000' }}>
                          ACCEPT
                        </div>
                        <p className="text-sm text-txt-secondary">Send to next operation. No further action needed.</p>
                      </div>

                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        <div className="flex-shrink-0 w-20 px-2 py-1 text-center text-xs font-bold" style={{ background: '#ef4444', color: '#fff' }}>
                          REJECT
                        </div>
                        <p className="text-sm text-txt-secondary">Mark casting, move to scrap. Note defect type and heat number in shift log.</p>
                      </div>

                      <div className="flex items-start gap-3 p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <div className="flex-shrink-0 w-20 px-2 py-1 text-center text-xs font-bold" style={{ background: '#f59e0b', color: '#000' }}>
                          CHECK
                        </div>
                        <p className="text-sm text-txt-secondary">Hold casting. Go to Tab 3, complete validation form. Senior inspector makes final call.</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-txt-primary mb-2 uppercase tracking-wide">6 Defect Types</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs text-txt-secondary">
                      <div className="p-2" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        1. Porosity
                      </div>
                      <div className="p-2" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        2. Shrinkage
                      </div>
                      <div className="p-2" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        3. Sand Inclusion
                      </div>
                      <div className="p-2" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        4. Sand & Slag Inclusion
                      </div>
                      <div className="p-2" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        5. Moulding Error
                      </div>
                      <div className="p-2" style={{ background: 'rgba(168,168,180,0.03)', border: '1px solid rgba(168,168,180,0.1)' }}>
                        6. Pouring Temperature Defect
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div
                className="mt-12 p-6 text-center"
                style={{
                  background: 'rgba(17,17,19,0.8)',
                  border: '1px solid rgba(168,168,180,0.06)',
                }}
              >
                <p className="text-sm text-txt-secondary mb-2">
                  <strong className="text-txt-primary">For Technical Support:</strong>
                </p>
                <a
                  href="mailto:support@tvastr.co"
                  className="text-signal-warning text-sm hover:underline"
                >
                  support@tvastr.co
                </a>
              </div>
            </div>

            {/* Back to dashboard */}
            <div className="mt-12 text-center">
              <Link
                to="/portal/dashboard"
                className="text-xs text-txt-muted hover:text-txt-secondary transition-colors duration-200 tracking-wider"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
