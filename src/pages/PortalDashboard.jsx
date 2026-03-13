import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { Logo } from '../components/Logo'

/**
 * PortalDashboard — Authenticated customer dashboard.
 *
 * Fetches live data from Supabase:
 *   - products table: product names + descriptions
 *   - versions table: latest version per product (ordered by release_date desc)
 *
 * Downloads are handled on the /portal/downloads page via
 * signed Supabase Storage URLs.
 */
export function PortalDashboard() {
  const { user, signOut } = useAuth()
  const [products, setProducts] = useState([])
  const [latestVersions, setLatestVersions] = useState({}) // productId → version row
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Fetch all products
        const { data: prods, error: prodErr } = await supabase
          .from('products')
          .select('id, name, description, created_at')
          .order('created_at', { ascending: true })

        if (prodErr) throw prodErr

        // Fetch latest version for each product in parallel
        const versionMap = {}
        await Promise.all(
          prods.map(async (product) => {
            const { data, error: verErr } = await supabase
              .from('versions')
              .select('version_number, release_date, changelog')
              .eq('product_id', product.id)
              .order('release_date', { ascending: false })
              .limit(1)

            if (verErr) throw verErr
            versionMap[product.id] = data?.[0] ?? null
          })
        )

        setProducts(prods)
        setLatestVersions(versionMap)
      } catch (err) {
        console.error('[PortalDashboard]', err)
        setError('Failed to load dashboard data. Please refresh.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const productTags = ['Vision AI', 'Plant AI']

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
        </div>

        {/* Content */}
        {loading ? (
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
        ) : error ? (
          <div
            className="p-6 text-center"
            style={{ border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}
          >
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 text-xs tracking-widest uppercase text-amber-forge underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Products grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
              {products.map((product, i) => {
                const version = latestVersions[product.id]
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
                            {productTags[i] ?? 'System'}
                          </span>
                          <h3 className="text-lg font-bold text-metallic-100 tracking-tight leading-tight">
                            {product.name}
                          </h3>
                        </div>

                        {/* Version badge */}
                        {version && (
                          <div
                            className="flex-shrink-0 px-3 py-1.5 text-center"
                            style={{
                              background: 'rgba(168,168,180,0.04)',
                              border: '1px solid rgba(168,168,180,0.1)',
                            }}
                          >
                            <div className="text-xs font-mono font-bold text-metallic-100">
                              v{version.version_number}
                            </div>
                            <div className="text-xs font-mono text-metallic-500">
                              {formatDate(version.release_date)}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-metallic-400 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Latest changelog */}
                      {version?.changelog && (
                        <div
                          className="p-4"
                          style={{
                            background: 'rgba(10,10,11,0.6)',
                            border: '1px solid rgba(168,168,180,0.06)',
                          }}
                        >
                          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-metallic-600 mb-2">
                            Latest Release Notes
                          </p>
                          <p className="text-xs text-metallic-400 leading-relaxed">
                            {version.changelog}
                          </p>
                        </div>
                      )}

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
                href="mailto:placeholder@email.com?subject=Installation Support"
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
