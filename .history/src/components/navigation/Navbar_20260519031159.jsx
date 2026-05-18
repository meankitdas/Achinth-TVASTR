import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useLicense } from "../../context/LicenseContext";
import { Logo } from "../Logo";
import { mainNavItems } from "@/config/navigation";
import { durations } from "../../animation/motion";
import { useReducedMotionContext } from "../../animation/MotionConfig";
import { useMagnetic } from "../../hooks/useMagnetic";
import { colors } from "../../design/colors";

/**
 * Navbar — Minimal fixed top navigation bar.
 *
 * Behavior:
 *   - Transparent at top of page (< 16 px scroll), surfaces with
 *     light-theme `colors.background.primary` α 0.9 + 1 px
 *     `colors.border.subtle` bottom border at ≥ 16 px.
 *   - Background and border transition over `durations.navbarSurfaceMs`
 *     (220 ms ∈ [150, 300]). Snaps with no animation when reduced-motion
 *     is active.
 *   - Mobile: hamburger menu with slide-down drawer
 *   - Shows "Dashboard" link when user is logged in to portal
 *   - Conditionally shows/hides Plant Intelligence link based on tier
 */
export function Navbar() {
  const [surfaced, setSurfaced] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { capabilities } = useLicense();
  const { reducedMotion } = useReducedMotionContext();
  const location = useLocation();
  const isPortalPage = location.pathname.startsWith("/portal");
  const isSystemPage =
    location.pathname.startsWith("/systems") || location.pathname === "/system";

  // Detect scroll position to toggle the surfaced state at the 16 px
  // threshold. Throttled to once per animation frame via
  // requestAnimationFrame, with a passive listener so scroll performance
  // is unaffected.
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setSurfaced(window.scrollY >= 16);
        raf = null;
      });
    };
    // Seed initial state in case the page loads already scrolled.
    setSurfaced(window.scrollY >= 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  // Hide main navbar on portal and system detail pages (they have their own navigation)
  if (isPortalPage || isSystemPage) return null;

  // Smooth scroll to section (only on home page)
  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      // Navigate to home then scroll
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleNavClick = (item) => {
    if (item.href && item.href.startsWith("#")) {
      scrollTo(item.href.slice(1));
    }
  };

  // Active-link helper: a link is active when its target equals the current
  // pathname (Req 12.4). Hash links (e.g. `#about`) are never treated as
  // active because they do not own a route.
  const isActive = (href) => Boolean(href) && href === location.pathname;

  // Shared utility chains. The focus-visible chain renders a 2 px ring in
  // `colors.telemetry.primary` with a 2 px offset against
  // `colors.background.primary` so the ring contrast against the page
  // background stays ≥ 3.0 (Req 12.3).
  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-telemetry-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";
  const linkBase = `text-xs font-medium tracking-widest uppercase transition-colors duration-200 ${focusRing}`;
  const linkActive = "text-telemetry-primary";
  const linkInactive = "text-txt-primary hover:text-txt-secondary";
  const linkClass = (href) =>
    `${linkBase} ${isActive(href) ? linkActive : linkInactive}`;

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#hero"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:tracking-widest focus:uppercase focus:transition-all ${focusRing}`}
        style={{
          background: "var(--telemetry-primary)",
          color: "var(--bg-primary)",
        }}
      >
        Skip to main content
      </a>

      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        initial={false}
        animate={{
          backgroundColor: surfaced
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(255, 255, 255, 0)",
          borderBottomColor: surfaced ? colors.border.subtle : "rgba(0,0,0,0)",
        }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: durations.navbarSurfaceMs / 1000,
                ease: [0.4, 0, 0.2, 1],
              }
        }
        style={{
          borderBottomWidth: "1px",
          borderBottomStyle: "solid",
          backdropFilter: surfaced ? "blur(12px)" : "none",
          WebkitBackdropFilter: surfaced ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Logo mark */}
            <Link
              to="/"
              onClick={(e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className={`group transition-opacity duration-200 hover:opacity-80 rounded-sm ${focusRing}`}
              aria-label="Tvastr Home"
            >
              <Logo size="sm" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {mainNavItems.map((item) => {
                if (item.children) {
                  // Dropdown menu
                  return (
                    <div key={item.label} className="relative group">
                      <button className={`${linkBase} ${linkInactive}`}>
                        {item.label}
                      </button>
                      <div
                        className="absolute top-full left-0 mt-2 w-48 border rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                        style={{
                          background: "var(--bg-primary)",
                          borderColor: "var(--border-default)",
                        }}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            to={child.href}
                            onClick={() =>
                              child.href.startsWith("#") &&
                              handleNavClick(child)
                            }
                            className={`block px-4 py-2 text-xs transition-colors ${focusRing} ${
                              isActive(child.href) ? linkActive : linkInactive
                            }`}
                            style={{
                              ":hover": { background: "var(--bg-elevated)" },
                            }}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                return item.href.startsWith("#") ? (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className={linkClass(item.href)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={(e) => {
                      if (item.href === "/" && location.pathname === "/") {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={linkClass(item.href)}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Portal entry point — changes based on auth state */}
              {user ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/portal/dashboard"
                    className={`text-xs font-medium tracking-widest uppercase text-telemetry-primary hover:text-telemetry-secondary transition-colors duration-200 ${focusRing}`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className={`${linkBase} ${linkInactive}`}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/portal"
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200 ${focusRing}`}
                  style={{
                    color: "var(--telemetry-primary)",
                    border: "1px solid rgba(79,140,255,0.3)",
                    background: "rgba(79,140,255,0.05)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(79,140,255,0.1)";
                    e.currentTarget.style.borderColor = "rgba(79,140,255,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(79,140,255,0.05)";
                    e.currentTarget.style.borderColor = "rgba(79,140,255,0.3)";
                  }}
                >
                  <span>Portal</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 text-txt-primary hover:text-txt-secondary transition-colors rounded-sm ${focusRing}`}
              aria-label="Toggle menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {menuOpen && (
          <div
            className="md:hidden py-4"
            style={{
              background: "var(--bg-primary)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            {mainNavItems.map((item) => {
              if (item.children) {
                return (
                  <div key={item.label} className="px-6 py-2">
                    <p className="text-xs font-semibold tracking-widest uppercase text-txt-muted mb-2">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        onClick={() =>
                          child.href.startsWith("#") && handleNavClick(child)
                        }
                        className={`block py-2 pl-4 text-xs ${focusRing} ${
                          isActive(child.href) ? linkActive : linkInactive
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                );
              }

              return item.href.startsWith("#") ? (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`block w-full text-left px-6 py-3 text-sm font-medium tracking-widest uppercase transition-colors ${focusRing} ${
                    isActive(item.href) ? linkActive : linkInactive
                  }`}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => {
                    if (item.href === "/" && location.pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setMenuOpen(false);
                    }
                  }}
                  className={`block px-6 py-3 text-sm font-medium tracking-widest uppercase transition-colors ${focusRing} ${
                    isActive(item.href) ? linkActive : linkInactive
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </motion.nav>
    </>
  );
}
