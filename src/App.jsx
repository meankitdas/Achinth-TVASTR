import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'

// Landing page sections — loaded eagerly (above the fold)
import { HeroSection } from './components/HeroSection'
import { AboutSection } from './components/AboutSection'
import { ProductSlider } from './components/ProductSlider'
import { TechnologyPhilosophy } from './components/TechnologyPhilosophy'
import { ContactSection } from './components/ContactSection'

// Portal pages — lazy loaded to keep initial bundle small
const PortalLogin = lazy(() =>
  import('./pages/PortalLogin').then((m) => ({ default: m.PortalLogin }))
)
const PortalDashboard = lazy(() =>
  import('./pages/PortalDashboard').then((m) => ({ default: m.PortalDashboard }))
)
const PortalDownloads = lazy(() =>
  import('./pages/PortalDownloads').then((m) => ({ default: m.PortalDownloads }))
)

/** Main landing page — all sections stacked for infinite scroll */
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

/** Minimal loader shown while lazy portal pages are fetching */
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
 * Routes:
 *   /                      → HomePage (marketing site)
 *   /portal                → PortalLogin
 *   /portal/dashboard      → PortalDashboard (protected)
 *   /portal/downloads      → PortalDownloads (protected)
 *   *                      → 404 fallback
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/portal" element={<PortalLogin />} />

            <Route
              path="/portal/dashboard"
              element={
                <ProtectedRoute>
                  <PortalDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/portal/downloads"
              element={
                <ProtectedRoute>
                  <PortalDownloads />
                </ProtectedRoute>
              }
            />

            {/* 404 fallback */}
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
