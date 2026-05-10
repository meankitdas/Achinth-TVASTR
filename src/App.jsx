import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LicenseProvider } from './context/LicenseContext'
import { Navbar } from './components/Navbar'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ForgeLoader } from './components/ForgeLoader'
import { useDocumentHead } from './hooks/useDocumentHead'

// Landing page sections — loaded eagerly (above the fold)
import { HeroSection } from './components/HeroSection'
import { AboutSection } from './components/AboutSection'
import { TechnologySection } from './components/TechnologySection'
import { ProductSlider } from './components/ProductSlider'
import { SEOContentSection } from './components/SEOContentSection'
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
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
)
const SystemDocs = lazy(() =>
  import('./pages/SystemDocs').then((m) => ({ default: m.SystemDocs }))
)

  /** Main landing page — all sections stacked for infinite scroll */
  function HomePage() {
    useDocumentHead(
      'Tvastr Industrial Intelligence | AI for Foundry Defect Detection and Process Intelligence',
      'AI-powered defect detection and rejection analysis system for foundries. Identify root causes, reduce scrap, and improve production with PIRAS - Plant Intelligence and Rejection Analysis System.',
      'https://tvastr.co/'
    )

  return (
    <>
      <HeroSection />
      <AboutSection />
      <TechnologySection />
      <SEOContentSection />
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
      <ForgeLoader message="Loading..." />
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

              {/* Public system documentation */}
              <Route path="/system" element={<SystemDocs />} />

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

              <Route
                path="/portal/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
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
