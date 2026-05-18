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
 * Navbar — Three-zone fixed top navigation, Cohere-style.
 *
 * Layout (desktop):
 *   ┌──────────┬─────────────────────────┬──────────────┐
 *   │  Logo    │   centered nav links    │  Portal CTA  │
 *   └──────────┴─────────────────────────┴──────────────┘
 *
 * Behavior:
 *   - Transparent at the top of page (< 16 px scroll), surfaces with
 *     `colors.background.primary` α 0.9 + 1 px `colors.border.subtle`
 *     bottom border at ≥ 16 px (Req 12.1, 12.2, 12.5, 12.6).
 *   - Backdrop blur applied only when surfaced.
 *   - Active link gets a thin 1 px deep-green underline pinned to the
 *     baseline — matches the hero's "Explore the platform" treatment.
 *   - Mobile: hamburger menu with slide-down drawer.
 *   - Shows "Dashboard" link when user is logged in.
 *   - Conditionally renders Plant Intelligence link based on tier.
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

  // Magnetic hover for the primary "Portal" / "Dashboard" CTAs (Req 11.1,
  // 11.2). Two refs so each variant (signed-out vs. signed-in) gets its
  // own bound element. The hook gracefully no-ops on coarse-pointer
  // devices, narrow viewports, and under reduced-motion (Reqs 11.7,
  // 11.8, 11.9, 18.2).
  const portalCtaRef = useRef(null);
  const dashboardCtaRef = useRef(null);
  useMagnetic(portalCtaRef);
  useMagnetic(dashboardCtaRef);

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

  // Active-link helper. Hash links never own a route so they're never
  // active (Req 12.4).
  const isActive = (href) => Boolean(href) && href === location.pathname;

  // Shared utility chains.
  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary";

  // Desktop link styling — uppercase mono-ish weight at 11/12 px with
  // wide tracking, plus a thin deep-green underline pinned to the
  // baseline when active.
  const navLinkClass = (active) =>
    [
      "relative inline-flex items-center text-[11px] font-medium tracking-[0.18em] uppercase transition-colors duration-200 py-1.5",
      active
        ? "text-process-primary"
        : "text-txt-primary hover:text-process-primary",
      focusRing,
      "rounded-sm",
    ].join(" ");

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#hero"
        className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:tracking-widest focus:uppercase focus:transition-all ${focusRing}`}
        style={{
          background: "var(--process-primary)",
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
            ? "rgba(255, 255, 255, 0.92)"
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
          backdropFilter: surfaced ? "blur(14px)" : "none",
          WebkitBackdropFilter: surfaced ? "blur(14px)" : "none",
        }}
      >
        <div className="px-6 md:px-10 lg:px-14">
          {/* Three-zone grid: logo left, centered nav, CTA right. The
              center column is `justify-self-center` so the link cluster
              stays optically centered regardless of left/right widths. */}
          <div className="grid grid-cols-[auto_1fr_auto] items-center h-16 md:h-18 gap-6 md:gap-12">
            {/* ── ZONE 1 · Logo ─────────────────────────────────────── */}
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

            {/* ── ZONE 2 · Centered nav (desktop only) ──────────────── */}
            <div className="hidden md:flex items-center justify-center gap-7 lg:gap-10">
              {mainNavItems.map((item) => {
                if (item.children) {
                  // Dropdown menu — Cohere-style white panel with thin
                  // border, mono group label, and stacked links.
                  const childActive = item.children.some((c) =>
                    isActive(c.href),
                  );
                  return (
                    <div key={item.label} className="relative group">
                      <button
                        className={`${navLinkClass(childActive)} inline-flex items-center gap-1.5`}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-60 transition-transform duration-200 group-hover:rotate-180"
                          aria-hidden="true"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        {childActive && (
                          <span
                            className="absolute left-0 right-0 -bottom-px h-px"
                            style={{ background: "var(--process-primary)" }}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                      <div
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 rounded-lg opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 overflow-hidden"
                        style={{
                          background: "var(--bg-primary)",
                          border: "1px solid var(--border-default)",
                          boxShadow:
                            "0 12px 32px -16px rgba(0,0,0,0.18), 0 4px 12px -8px rgba(0,0,0,0.10)",
                        }}
                      >
                        <p className="px-5 pt-4 pb-2 font-mono text-[10px] tracking-[0.24em] uppercase text-txt-muted">
                          {item.label}
                        </p>
                        <div className="pb-2">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.href}
                              onClick={() =>
                                child.href.startsWith("#") &&
                                handleNavClick(child)
                              }
                              className={`block px-5 py-2.5 text-[13px] transition-colors ${focusRing} ${
                                isActive(child.href)
                                  ? "text-process-primary"
                                  : "text-txt-primary hover:bg-bg-panel"
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                const active = isActive(item.href);
                const linkInner = (
                  <>
                    <span>{item.label}</span>
                    {active && (
                      <span
                        className="absolute left-0 right-0 -bottom-px h-px"
                        style={{ background: "var(--process-primary)" }}
                        aria-hidden="true"
                      />
                    )}
                  </>
                );

                return item.href.startsWith("#") ? (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item)}
                    className={navLinkClass(active)}
                  >
                    {linkInner}
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
                    className={navLinkClass(active)}
                  >
                    {linkInner}
                  </Link>
                );
              })}
            </div>

            {/* ── ZONE 3 · Right CTA ────────────────────────────────── */}
            <div className="hidden md:flex items-center gap-5 justify-self-end">
              {user ? (
                <>
                  <button
                    onClick={signOut}
                    className="text-[11px] font-medium tracking-[0.18em] uppercase text-txt-secondary hover:text-txt-primary transition-colors duration-200 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                  >
                    Logout
                  </button>
                  <Link
                    ref={dashboardCtaRef}
                    to="/portal/dashboard"
                    className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-medium tracking-wide transition-colors duration-200 ${focusRing}`}
                    style={{
                      background: "var(--process-primary)",
                      color: "var(--bg-primary)",
                    }}
                  >
                    <span>Dashboard</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                </>
              ) : (
                <Link
                  ref={portalCtaRef}
                  to="/portal"
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[12px] font-medium tracking-wide transition-colors duration-200 ${focusRing}`}
                  style={{
                    background: "var(--text-primary)",
                    color: "var(--bg-primary)",
                  }}
                >
                  <span>Portal</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>

            {/* Mobile hamburger — replaces zones 2+3 on narrow viewports */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 text-txt-primary hover:text-process-primary transition-colors rounded-sm justify-self-end ${focusRing}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="7" x2="21" y2="7" />
                    <line x1="3" y1="17" x2="21" y2="17" />
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
                    <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-txt-muted mb-2">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.href}
                        onClick={() =>
                          child.href.startsWith("#") && handleNavClick(child)
                        }
                        className={`block py-2 pl-4 text-sm ${focusRing} ${
                          isActive(child.href)
                            ? "text-process-primary"
                            : "text-txt-primary"
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
                  className={`block w-full text-left px-6 py-3 text-sm font-medium tracking-[0.18em] uppercase transition-colors ${focusRing} ${
                    isActive(item.href)
                      ? "text-process-primary"
                      : "text-txt-primary"
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
                  className={`block px-6 py-3 text-sm font-medium tracking-[0.18em] uppercase transition-colors ${focusRing} ${
                    isActive(item.href)
                      ? "text-process-primary"
                      : "text-txt-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Portal/Dashboard CTA */}
            <div className="px-6 pt-4 mt-2 border-t border-border-subtle">
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <Link
                    to="/portal/dashboard"
                    className={`flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-medium tracking-wide ${focusRing}`}
                    style={{
                      background: "var(--text-primary)",
                      color: "var(--bg-primary)",
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={signOut}
                    className="text-[11px] font-medium tracking-[0.18em] uppercase text-txt-secondary"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/portal"
                  className={`block w-full text-center px-5 py-2.5 rounded-full text-[12px] font-medium tracking-wide ${focusRing}`}
                  style={{
                    background: "var(--text-primary)",
                    color: "var(--bg-primary)",
                  }}
                >
                  Portal →
                </Link>
              )}
            </div>
          </div>
        )}
      </motion.nav>
    </>
  );
}
