import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LicenseProvider } from './context/LicenseContext'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useDocumentHead } from './hooks/useDocumentHead'

// Landing page sections — loaded eagerly (above the fold)
import { HeroSection } from './components/HeroSection'
import { AboutSection } from './components/AboutSection'
import { EcosystemSection } from './components/EcosystemSection'
import { ProductSlider } from './components/ProductSlider'
import { ContactSection } from './components/ContactSection'

// System detail pages — lazy loaded
const RejectionAnalysisSystem = lazy(() =>
  import('./pages/systems/RejectionAnalysisSystem').then((m) => ({ default: m.RejectionAnalysisSystem }))
)
const PlantIntelligence = lazy(() =>
  import('./pages/systems/PlantIntelligence').then((m) => ({ default: m.PlantIntelligence }))
)

// Portal pages — lazy loaded to keep initial bundle small
const PortalLogin = lazy(() =>
  import('./pages/PortalLogin').then((m) => ({ default: m.PortalLogin }))
)
const PortalDashboard = lazy(() =>
  import('./pages/PortalDashboard').then((m) => ({ default: m.PortalDashboard }))
)
const PortalManual = lazy(() =>
  import('./pages/PortalManual').then((m) => ({ default: m.PortalManual }))
)

/** Main landing page — all sections stacked for infinite scroll */
function HomePage() {
  useDocumentHead(
    'Tvastr Industrial Intelligence — AI Systems for Heavy Manufacturing',
    'Tvastr Industrial Intelligence builds AI systems for heavy manufacturing. Vision AI inspection, defect detection, root cause analysis, and process intelligence for industrial environments.',
    'https://tvastr.co/'
  )

  return (
    <>
      <HeroSection />
      <AboutSection />
      <EcosystemSection />
      <ProductSlider />
      <ContactSection />
    </>
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

/** 404 Not Found page */
function NotFoundPage() {
  useDocumentHead(
    'Page Not Found | Tvastr',
    'The page you are looking for does not exist.',
    'https://tvastr.co/404'
  )

  return (
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
        <LicenseProvider>
          <Navbar />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/systems/rejection-analysis-system" element={<RejectionAnalysisSystem />} />
              <Route path="/systems/plant-intelligence" element={<PlantIntelligence />} />

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
                path="/portal/manual"
                element={
                  <ProtectedRoute>
                    <PortalManual />
                  </ProtectedRoute>
                }
              />

              {/* Plant Intelligence route — requires full_stack tier */}
              <Route
                path="/portal/pi"
                element={
                  <ProtectedRoute requiredCapability="plant_intelligence">
                    <PlantIntelligence />
                  </ProtectedRoute>
                }
              />

              {/* 404 fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </LicenseProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
