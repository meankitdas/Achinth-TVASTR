import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LicenseProvider } from "./context/LicenseContext";
import { Navbar } from "./components/navigation/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RuntimeLoader } from "./components/RuntimeLoader";
import { useDocumentHead } from "./hooks/useDocumentHead";
import MotionProvider from "./animation/MotionConfig";
import CursorFollower from "./components/effects/CursorFollower";
import PageTransition from "./components/effects/PageTransition";
import BackgroundGrid from "./components/decor/BackgroundGrid";
import CornerGuides from "./components/decor/CornerGuides";

// Landing page sections — loaded eagerly (above the fold)
import { HomePage } from "./components/layout/HomePage";

// System detail pages — lazy loaded
const RejectionAnalysisSystem = lazy(() =>
  import("./pages/systems/RejectionAnalysisSystem").then((m) => ({
    default: m.RejectionAnalysisSystem,
  })),
);
const PlantIntelligence = lazy(() =>
  import("./pages/systems/PlantIntelligence").then((m) => ({
    default: m.PlantIntelligence,
  })),
);

// Marketing pages — lazy loaded
const TechnologyPage = lazy(() =>
  import("./pages/TechnologyPage").then((m) => ({ default: m.TechnologyPage })),
);
const AboutPage = lazy(() =>
  import("./pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const ResearchPage = lazy(() =>
  import("./pages/ResearchPage").then((m) => ({ default: m.ResearchPage })),
);

// Portal pages — lazy loaded to keep initial bundle small
const PortalLogin = lazy(() =>
  import("./pages/PortalLogin").then((m) => ({ default: m.PortalLogin })),
);
const PortalDashboard = lazy(() =>
  import("./pages/PortalDashboard").then((m) => ({
    default: m.PortalDashboard,
  })),
);
const PortalManual = lazy(() =>
  import("./pages/PortalManual").then((m) => ({ default: m.PortalManual })),
);
const AdminDashboard = lazy(() =>
  import("./pages/AdminDashboard").then((m) => ({ default: m.AdminDashboard })),
);

/** Main landing page — all sections stacked for infinite scroll */
function HomePageWrapper() {
  useDocumentHead(
    "Tvastr | Manufacturing Intelligence Infrastructure",
    "Industrial intelligence platform for foundries. Signal-first defect detection, process reasoning, and manufacturing memory across every quality gate.",
    "https://tvastr.co/",
  );

  return <HomePage />;
}

/** Minimal loader shown while lazy portal pages are fetching */
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <RuntimeLoader message="Loading..." />
    </div>
  );
}

/** 404 Not Found page */
function NotFoundPage() {
  useDocumentHead(
    "Page Not Found | Tvastr",
    "The page you are looking for does not exist.",
    "https://tvastr.co/404",
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-bg-primary">
      <p className="text-txt-muted text-sm tracking-widest uppercase">
        Page not found
      </p>
      <a
        href="/"
        className="text-telemetry-primary text-xs tracking-widest uppercase underline underline-offset-4"
      >
        Return Home
      </a>
    </div>
  );
}

/**
 * App — Root component.
 *
 * Provider tree (design.md §Page transition shell):
 *   BrowserRouter
 *     AuthProvider
 *       LicenseProvider
 *         MotionProvider              ← wraps Framer's <MotionConfig>
 *           BackgroundGrid            ← fixed full-viewport grid (Property 13)
 *           CornerGuides              ← route-aware corner brackets
 *           CursorFollower            ← single instance above <Navbar />
 *           Navbar
 *           Suspense
 *             PageTransition          ← <AnimatePresence> keyed by pathname
 *               Routes
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LicenseProvider>
          <MotionProvider>
            <BackgroundGrid />
            <CornerGuides />
            <CursorFollower />
            <Navbar />
            <Suspense fallback={<PageLoader />}>
              <PageTransition>
                <Routes>
                  <Route path="/" element={<HomePageWrapper />} />

                  {/* Marketing pages */}
                  <Route path="/technology" element={<TechnologyPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/research" element={<ResearchPage />} />

                  <Route
                    path="/systems/rejection-analysis-system"
                    element={<RejectionAnalysisSystem />}
                  />
                  <Route
                    path="/systems/plant-intelligence"
                    element={<PlantIntelligence />}
                  />

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
              </PageTransition>
            </Suspense>
          </MotionProvider>
        </LicenseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
