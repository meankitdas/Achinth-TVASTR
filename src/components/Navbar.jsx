import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLicense } from '../context/LicenseContext'
import { Logo } from './Logo'

/**
 * Navbar — Minimal fixed top navigation bar.
 *
 * Behavior:
 *   - Transparent at top of page, gains dark background on scroll
 *   - Smooth background transition
 *   - Mobile: hamburger menu with slide-down drawer
 *   - Shows "Dashboard" link when user is logged in to portal
 *   - Conditionally shows/hides Plant Intelligence link based on tier
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, signOut } = useAuth()
  const { capabilities } = useLicense()
  const location = useLocation()
  const isPortalPage = location.pathname.startsWith('/portal')

  // Detect scroll position to toggle background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname])

  // Hide main navbar on portal pages (they have their own navigation)
  if (isPortalPage) return null

  // Smooth scroll to section (only on home page)
  const scrollTo = (id) => {
    if (location.pathname !== '/') {
      // Navigate to home then scroll
      window.location.href = `/#${id}`
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  // Base nav links - Plant Intelligence removed from global navbar
  // (it's only accessible from within the portal at /portal/pi)
  const navLinks = [
    { label: 'Home', action: () => scrollTo('hero') },
    { label: 'Systems', action: () => scrollTo('products') },
    { label: 'Technology', action: () => scrollTo('technology') },
  ]

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled || isPortalPage
          ? 'rgba(10,10,11,0.92)'
          : 'transparent',
        backdropFilter: scrolled || isPortalPage ? 'blur(12px)' : 'none',
        borderBottom: scrolled || isPortalPage
          ? '1px solid rgba(168,168,180,0.06)'
          : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo mark */}
          <Link
            to="/"
            className="group transition-opacity duration-200 hover:opacity-80"
            aria-label="Tvastr Home"
          >
            <Logo size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={link.action}
                className="text-xs font-medium tracking-widest uppercase text-metallic-400 hover:text-metallic-100 transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}

            {/* Portal entry point — changes based on auth state */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/portal/dashboard"
                  className="text-xs font-medium tracking-widest uppercase text-amber-forge hover:text-amber-glow transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="text-xs font-medium tracking-widest uppercase text-metallic-500 hover:text-metallic-200 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/portal"
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-200"
                style={{
                  color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.3)',
                  background: 'rgba(245,158,11,0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(245,158,11,0.5)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.05)'
                  e.currentTarget.style.borderColor = 'rgba(245,158,11,0.3)'
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#f59e0b' }}
                />
                Customer Portal
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-px bg-metallic-300 transition-all duration-200"
              style={{ transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block w-5 h-px bg-metallic-300 transition-all duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="block w-5 h-px bg-metallic-300 transition-all duration-200"
              style={{ transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: menuOpen ? '300px' : '0',
          background: 'rgba(10,10,11,0.96)',
          borderTop: menuOpen ? '1px solid rgba(168,168,180,0.06)' : 'none',
        }}
      >
        <div className="px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={link.action}
              className="text-left text-sm font-medium tracking-widest uppercase text-metallic-400 hover:text-metallic-100 transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}
          {user ? (
            <>
              <Link
                to="/portal/dashboard"
                className="text-sm font-medium tracking-widest uppercase text-amber-forge"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="text-left text-sm font-medium tracking-widest uppercase text-metallic-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/portal"
              className="text-sm font-semibold tracking-widest uppercase text-amber-forge"
            >
              Customer Portal →
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
