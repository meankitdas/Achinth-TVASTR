import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLicense } from '../context/LicenseContext'
import { Logo } from '../components/Logo'
import { LockedProductCard } from '../components/LockedProductCard'
import { UpgradeBanner } from '../components/UpgradeBanner'
import { TIER_ORDER } from '../lib/capabilities'
import { CONFIG, generateMailtoLink } from '../lib/config'

/**
 * PortalDashboard — Authenticated customer dashboard.
 *
 * Shows 3 product cards based on user's license tier:
 *   - RAS Core (active for all)
 *   - RAS Enterprise (active for ras_enterprise & full_stack, locked for ras_core)
 *   - Plant Intelligence (active for full_stack, locked for others)
 *
 * UI is fully tier-driven — no hardcoded logic.
 */
export function PortalDashboard() {
  const { user, signOut } = useAuth()
  const { tier, capabilities, loading: licenseLoading } = useLicense()

  // Define the 3 products with tier requirements and upgrade features
  const products = [
    {
      id: 'ras_core',
      name: 'RAS Core',
      description: 'An AI-driven casting inspection and defect diagnosis platform that transforms raw inspection images into actionable quality intelligence.',
      tag: 'Vision AI',
      capability: 'ras_core',
      requiredTier: 'ras_core',
    },
    {
      id: 'ras_enterprise',
      name: 'RAS Enterprise',
      description: 'Integrated build with advanced process integration, ERP connectivity, and extended quality engineering frameworks.',
      tag: 'Vision AI',
      capability: 'ras_enterprise',
      requiredTier: 'ras_enterprise',
      upgradeFeatures: [
        'ERP and SQL integration',
        'batch processing and traceability',
        'process intelligence',
      ],
    },
    {
      id: 'plant_intelligence',
      name: 'Plant Intelligence',
      description: 'A factory intelligence layer that reads ERP data, inspection databases, and production logs to answer operational questions and surface actionable insights.',
      tag: 'Plant AI',
      capability: 'plant_intelligence',
      requiredTier: 'full_stack',
      upgradeFeatures: [
        'plant-level analytics dashboards',
        'FMEA, Pareto, SPC',
        'decision intelligence and action tracking',
      ],
    },
  ]

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0b' }}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Top nav */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(10,10,11,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(168,168,180,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <Logo size="sm" />
            <span className="text-metallic-600 text-xs">/ Customer Portal</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/portal/downloads"
              className="text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
              style={{ color: '#f59e0b' }}
            >
              Downloads
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }}
              />
              <span className="text-xs text-metallic-400 font-mono">{user?.email}</span>
            </div>
            <button
              onClick={signOut}
              className="text-xs font-medium tracking-widest uppercase text-metallic-500 hover:text-metallic-200 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Page header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
              Customer Portal
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight mb-3"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Dashboard
          </h1>
          <p className="text-sm text-metallic-400">
            Welcome back. Your licensed Tvastr systems are listed below.
          </p>
          {tier && (
            <p className="text-xs text-metallic-500 mt-2">
              License Tier: <span className="text-metallic-300 font-semibold uppercase">{tier}</span>
            </p>
          )}
        </div>

        {/* Content */}
        {licenseLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-8 h-8"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.3)',
                  transform: 'rotate(45deg)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
              <span className="text-xs text-metallic-500 tracking-widest uppercase">
                Loading systems…
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Upgrade Banner */}
            <UpgradeBanner />

            {/* Products grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
              {products.map((product, i) => {
                const isActive = capabilities?.[product.capability]
                const isIncluded = tier && TIER_ORDER[tier] > TIER_ORDER[product.requiredTier]

                if (isActive) {
                  // Active or Included product card
                  const statusBadge = isIncluded ? 'INCLUDED' : 'ACTIVE'
                  const statusColor = isIncluded 
                    ? { bg: 'rgba(168,168,180,0.08)', border: 'rgba(168,168,180,0.2)', text: '#a8a8b4' }
                    : { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', text: '#10b981' }

                  return (
                    <div
                      key={product.id}
                      className="group relative flex flex-col transition-all duration-300"
                      style={{
                        background: 'rgba(17,17,19,0.95)',
                        border: '1px solid rgba(168,168,180,0.08)',
                      }}
                    >
                      {/* Hover top accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.4), transparent)',
                        }}
                      />

                      <div className="p-6 flex flex-col gap-4">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span
                              className="text-xs font-semibold tracking-[0.15em] uppercase px-2.5 py-1 inline-block mb-3"
                              style={{
                                color: '#f59e0b',
                                background: 'rgba(245,158,11,0.08)',
                                border: '1px solid rgba(245,158,11,0.15)',
                              }}
                            >
                              {product.tag}
                            </span>
                            <h3 className="text-lg font-bold text-metallic-100 tracking-tight leading-tight">
                              {product.name}
                            </h3>
                          </div>

                          {/* Status badge */}
                          <div
                            className="flex-shrink-0 px-3 py-1.5 text-center"
                            style={{
                              background: statusColor.bg,
                              border: `1px solid ${statusColor.border}`,
                            }}
                          >
                            <div className="text-xs font-semibold" style={{ color: statusColor.text }}>
                              {statusBadge}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-metallic-400 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Download CTA */}
                        <Link
                          to="/portal/downloads"
                          className="flex items-center justify-center gap-2 py-3 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200 mt-auto"
                          style={{
                            background: 'rgba(245,158,11,0.08)',
                            border: '1px solid rgba(245,158,11,0.25)',
                            color: '#fbbf24',
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1v7M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                            <path d="M1 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                          Download Latest
                        </Link>
                      </div>
                    </div>
                  )
                } else {
                  // Locked product card
                  const requiredTierLabel = product.requiredTier === 'full_stack' ? 'Full Stack' : 'Enterprise'
                  return (
                    <LockedProductCard
                      key={product.id}
                      title={product.name}
                      description={product.description}
                      tag={product.tag}
                      index={i}
                      requiredTier={requiredTierLabel}
                      features={product.upgradeFeatures}
                    />
                  )
                }
              })}
            </div>

            {/* Support note */}
            <div
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                background: 'rgba(17,17,19,0.8)',
                border: '1px solid rgba(168,168,180,0.06)',
              }}
            >
              <div>
                <p className="text-sm font-medium text-metallic-300 mb-1">
                  Need installation support?
                </p>
                <p className="text-xs text-metallic-500">
                  Contact your Tvastr account manager or reach out directly.
                </p>
              </div>
              <a
                href={generateMailtoLink(CONFIG.emails.installationSupport, CONFIG.emailTemplates.installationSupport.subject, CONFIG.emailTemplates.installationSupport.body)}
                className="flex-shrink-0 px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
                style={{
                  color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.2)',
                  background: 'rgba(245,158,11,0.05)',
                }}
              >
                Contact Support
              </a>
            </div>
          </>
        )}

        {/* Back to site */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-xs text-metallic-600 hover:text-metallic-300 transition-colors duration-200 tracking-wider"
          >
            ← Return to tvastr.ai
          </Link>
        </div>
      </main>
    </div>
  )
}
