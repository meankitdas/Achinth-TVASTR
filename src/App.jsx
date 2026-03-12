import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'

// Main landing page sections — imported directly (above the fold sections load instantly)
import { HeroSection } from './components/HeroSection'
import { AboutSection } from './components/AboutSection'
import { ProductSlider } from './components/ProductSlider'
import { TechnologyPhilosophy } from './components/TechnologyPhilosophy'
import { ContactSection } from './components/ContactSection'

// Portal pages — lazy loaded to keep initial bundle small
// They are only needed when users navigate to /portal routes
const PortalLogin = lazy(() =>
  import('./pages/PortalLogin').then((m) => ({ default: m.PortalLogin }))
)
const PortalDashboard = lazy(() =>
  import('./pages/PortalDashboard').then((m) => ({ default: m.PortalDashboard }))
)

/**
 * HomePage — The main single-page marketing site.
 * All sections stacked vertically for infinite scroll experience.
 */
function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProductSlider />
      <TechnologyPhilosophy />
      <ContactSection />
    </main>
  )
}

/**
 * PageLoader — Minimal loading state for lazy-loaded portal pages.
 */
function PageLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0a0a0b' }}
    >
      <div
        className="w-8 h-8"
        style={{
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.3)',
          transform: 'rotate(45deg)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    </div>
  )
}

/**
 * App — Root component.
 *
 * Structure:
 *   BrowserRouter  — client-side routing
 *   └── AuthProvider  — session context for entire app
 *       ├── Navbar   — fixed top nav (present on all routes)
 *       └── Routes
 *           ├── /                    → HomePage (marketing site)
 *           ├── /portal              → PortalLogin (lazy)
 *           └── /portal/dashboard   → PortalDashboard (lazy + protected)
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Navbar is rendered on all routes */}
        <Navbar />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Main landing page */}
            <Route path="/" element={<HomePage />} />

            {/* Customer portal login */}
            <Route path="/portal" element={<PortalLogin />} />

            {/* Protected customer dashboard — requires active session */}
            <Route
              path="/portal/dashboard"
              element={
                <ProtectedRoute>
                  <PortalDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all: redirect to home */}
            <Route
              path="*"
              element={
                <div
                  className="min-h-screen flex flex-col items-center justify-center gap-6"
                  style={{ background: '#0a0a0b' }}
                >
                  <p className="text-metallic-400 text-sm tracking-widest uppercase">
                    Page not found
                  </p>
                  <a
                    href="/"
                    className="text-amber-forge text-xs tracking-widest uppercase underline underline-offset-4"
                  >
                    Return Home
                  </a>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
