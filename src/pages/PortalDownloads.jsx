import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLicense } from '../context/LicenseContext'
import { supabase } from '../lib/supabaseClient'
import { isAllowed, TIER_LABELS } from '../lib/capabilities'
import { ProductDownloadCard } from '../components/ProductDownloadCard'
import { Logo } from '../components/Logo'
import { LockedFeatureBlock } from '../components/LockedFeatureBlock'
import { CONFIG, generateMailtoLink } from '../lib/config'

/**
 * PortalDownloads — Protected page showing latest versions filtered by tier.
 *
 * Data flow:
 *   1. Fetch all versions from Supabase
 *   2. Filter using isAllowed(version, tier) based on required_tier
 *   3. Group by product and select latest allowed version per product
 *   4. Render ProductDownloadCard for each
 *
 * Access: Authenticated users only (content filtered by tier)
 */
export function PortalDownloads() {
  const { user, signOut } = useAuth()
  const { tier, loading: licenseLoading } = useLicense()
  const [items, setItems] = useState([])   // [{ product, version }]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!tier) return // Wait for tier to load

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Fetch all versions with product info
        const { data: versions, error: verErr } = await supabase
          .from('versions')
          .select(`
            version_number,
            release_date,
            changelog,
            file_path,
            checksum,
            required_tier,
            includes_pi,
            product_id,
            products (
              id,
              name,
              description
            )
          `)
          .order('release_date', { ascending: false })

        if (verErr) throw verErr

        // Filter by tier access
        const allowedVersions = versions.filter((v) => isAllowed(v, tier))

        // For TIER_3, show only the PIRAS package (includes_pi = true)
        if (tier === 'TIER_3') {
          const pirasVersion = allowedVersions.find((v) => v.includes_pi === true)
          if (pirasVersion) {
            // Create a merged PIRAS product
            const pirasProduct = {
              id: 'piras',
              name: 'PIRAS',
              description: 'Complete integrated system: RAS inspection + Plant Intelligence analytics',
            }
            setItems([{ product: pirasProduct, version: pirasVersion }])
          } else {
            setItems([])
          }
        } else {
          // For other tiers, group by product and pick latest per product
          const productMap = new Map()
          allowedVersions.forEach((version) => {
            const product = version.products
            const productId = product.id

            if (!productMap.has(productId)) {
              productMap.set(productId, { product, version })
            }
          })

          setItems(Array.from(productMap.values()))
        }
      } catch (err) {
        console.error('[PortalDownloads]', err)
        setError('Failed to load product data. Please refresh.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tier])

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0b' }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{ background: 'rgba(10,10,11,0.95)', borderBottom: '1px solid rgba(168,168,180,0.08)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-4">
          <Link to="/portal/dashboard" className="flex items-center gap-3">
            <Logo size="sm" />
            <span
              className="text-xs font-semibold tracking-[0.25em] uppercase"
              style={{ color: '#888896' }}
            >
              Customer Portal
            </span>
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            to="/portal/dashboard"
            className="text-xs tracking-widest uppercase transition-colors duration-200"
            style={{ color: '#686878' }}
          >
            Dashboard
          </Link>
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: '#f59e0b' }}
          >
            Downloads
          </span>
          <button
            onClick={signOut}
            className="text-xs tracking-widest uppercase transition-colors duration-200"
            style={{ color: '#686878' }}
          >
            Sign Out
          </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Page header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60">
              Software Downloads
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight mb-3"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #a8a8b4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Latest Releases
          </h1>
          <p className="text-sm text-metallic-400">
            Download the latest versions of your licensed Tvastr systems.
          </p>
          {user && (
            <p className="text-xs text-metallic-500 mt-2">
              Signed in as <span className="text-metallic-300">{user.email}</span>
            </p>
          )}
          {tier && (
            <p className="text-xs text-metallic-500 mt-1">
              License Tier: <span className="text-metallic-300 font-semibold">{TIER_LABELS[tier] || tier}</span>
            </p>
          )}
        </div>

        {/* Content */}
        {loading || licenseLoading ? (
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
                Loading releases…
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
        ) : items.length === 0 ? (
          <div
            className="p-8 text-center"
            style={{ border: '1px solid rgba(168,168,180,0.08)', background: 'rgba(17,17,19,0.5)' }}
          >
            <p className="text-sm text-metallic-400">
              No downloads available for your current license tier.
            </p>
            <a
              href={generateMailtoLink(CONFIG.emails.support, CONFIG.emailTemplates.licenseUpgrade('Full Stack').subject, CONFIG.emailTemplates.licenseUpgrade('Full Stack').body)}
              className="mt-4 inline-block text-xs tracking-widest uppercase text-amber-forge underline underline-offset-4"
            >
              Upgrade License
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {items.map(({ product, version }, i) => (
                <ProductDownloadCard
                  key={product.id}
                  product={product}
                  version={version}
                  index={i}
                />
              ))}
            </div>

            {/* Upgrade prompt for non-TIER_3 users */}
            {tier && tier !== 'TIER_3' && (
              <LockedFeatureBlock
                title="Looking for the complete integrated system?"
                description="PIRAS combines RAS inspection and Plant Intelligence into a unified quality intelligence platform."
                requiredTier="PIRAS"
                features={[
                  'RAS inspection + Plant Intelligence analytics',
                  'end-to-end quality intelligence pipeline',
                  'FMEA, SPC, decision tracking, cost of quality',
                ]}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}
