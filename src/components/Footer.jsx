import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { CONFIG } from '../lib/config'

/**
 * Footer — Global footer for the landing page.
 * Includes logo, links, copyright, and social links.
 */
export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      className="relative py-16 px-6 md:px-12 lg:px-16"
      style={{
        background: 'linear-gradient(to bottom, #0a0a0b 0%, #111113 100%)',
        borderTop: '1px solid rgba(168,168,180,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-metallic-400 leading-relaxed max-w-md">
              Industrial Intelligence, Forged. AI systems for heavy manufacturing environments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-metallic-300 mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/#hero' },
                { label: 'About', href: '/#about' },
                { label: 'Technology', href: '/#technology' },
                { label: 'Systems', href: '/#products' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-metallic-500 hover:text-metallic-200 transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-metallic-300 mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${CONFIG.emails.contact}`}
                  className="text-sm text-metallic-500 hover:text-metallic-200 transition-colors duration-200"
                >
                  Sales
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONFIG.emails.support}`}
                  className="text-sm text-metallic-500 hover:text-metallic-200 transition-colors duration-200"
                >
                  Support
                </a>
              </li>
              <li>
                <Link
                  to="/portal"
                  className="text-sm text-metallic-500 hover:text-metallic-200 transition-colors duration-200"
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-8"
          style={{ background: 'rgba(168,168,180,0.08)' }}
        />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-metallic-600">
            © {currentYear} Tvastr. All rights reserved.
          </p>

          {/* Social links - update with actual URLs */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/company/tvastr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-metallic-500 hover:text-metallic-200 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
