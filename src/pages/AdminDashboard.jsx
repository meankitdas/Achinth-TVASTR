import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLicense } from '../context/LicenseContext'
import { supabase } from '../lib/supabaseClient'
import { Logo } from '../components/Logo'
import { TIER_LABELS } from '../lib/capabilities'

const STYLES = {
  background: { background: '#0a0a0b' },
  header: {
    background: 'rgba(10,10,11,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(168,168,180,0.06)',
  },
  statusIndicator: { background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' },
  titleGradient: {
    background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  card: {
    background: 'rgba(17,17,19,0.95)',
    border: '1px solid rgba(168,168,180,0.08)',
    borderRadius: '0.75rem',
    boxShadow: '0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)',
  },
  tab: {
    base: {
      padding: '0.75rem 1.5rem',
      fontSize: '0.75rem',
      fontWeight: '600',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      transition: 'all 0.2s',
      cursor: 'pointer',
      borderRadius: '0.5rem',
    },
    inactive: {
      color: '#a8a8b4',
      background: 'transparent',
    },
    active: {
      color: '#fbbf24',
      background: 'rgba(245,158,11,0.1)',
      border: '1px solid rgba(245,158,11,0.2)',
    },
  },
  table: {
    header: {
      background: 'rgba(10,10,11,0.6)',
      color: '#a8a8b4',
      fontSize: '0.625rem',
      fontWeight: '600',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      padding: '1rem',
      borderBottom: '1px solid rgba(168,168,180,0.08)',
    },
    cell: {
      padding: '1rem',
      borderBottom: '1px solid rgba(168,168,180,0.05)',
      color: '#e5e5e7',
      fontSize: '0.875rem',
    },
  },
}

/**
 * AdminDashboard — Admin-only dashboard.
 *
 * Two tabs:
 *   1. Customers — Lists all customers with their license info
 *   2. System Documentation — Renders markdown docs (placeholder for now)
 *
 * Only accessible to achintharya@gmail.com or TVASTR-ACHINTH license.
 */
export function AdminDashboard() {
  const { user, signOut } = useAuth()
  const { isAdmin } = useLicense()
  const [activeTab, setActiveTab] = useState('customers')
  const [customers, setCustomers] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all customers
  useEffect(() => {
    if (activeTab !== 'customers') return

    async function fetchCustomers() {
      setLoadingCustomers(true)
      setError(null)

      try {
        // Call the PostgreSQL function via RPC
        const { data, error: rpcError } = await supabase
          .rpc('get_all_licenses_with_email')

        if (rpcError) throw rpcError

        setCustomers(data || [])
      } catch (err) {
        console.error('[AdminDashboard] Error fetching customers:', err)
        setError(err.message || 'Failed to load customer data.')
      } finally {
        setLoadingCustomers(false)
      }
    }

    fetchCustomers()
  }, [activeTab])

  // Safeguard: if not admin, don't render
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={STYLES.background}>
        <div className="text-center">
          <p className="text-metallic-400 text-sm">Access denied</p>
          <Link to="/portal/dashboard" className="text-amber-forge text-xs mt-4 inline-block">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative" style={STYLES.background}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Top nav */}
      <header className="sticky top-0 z-40" style={STYLES.header}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <Logo size="sm" />
            <span className="text-metallic-600 text-xs hidden md:inline">/ Admin Portal</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/portal/dashboard"
              className="text-xs font-semibold tracking-widest uppercase transition-colors duration-200 text-metallic-500 hover:text-metallic-200"
            >
              Customer View
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={STYLES.statusIndicator} />
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
              Admin Portal
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3" style={STYLES.titleGradient}>
            System Administration
          </h1>
          <p className="text-sm text-metallic-400">
            Manage customers, licenses, and system documentation.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setActiveTab('customers')}
            style={{
              ...STYLES.tab.base,
              ...(activeTab === 'customers' ? STYLES.tab.active : STYLES.tab.inactive),
            }}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            style={{
              ...STYLES.tab.base,
              ...(activeTab === 'docs' ? STYLES.tab.active : STYLES.tab.inactive),
            }}
          >
            System Documentation
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'customers' && (
          <div style={STYLES.card}>
            {loadingCustomers ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-8 h-8"
                    style={{
                      background: 'rgba(245,158,11,0.1)',
                      border: '1px solid rgba(245,158,11,0.3)',
                      borderRadius: '0.375rem',
                      transform: 'rotate(45deg)',
                      animation: 'pulse 1.5s ease-in-out infinite',
                    }}
                  />
                  <span className="text-xs text-metallic-500 tracking-widest uppercase">
                    Loading customers...
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : customers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-metallic-500">No customers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left" style={STYLES.table.header}>Customer Name</th>
                      <th className="text-left" style={STYLES.table.header}>Email</th>
                      <th className="text-left" style={STYLES.table.header}>License Key</th>
                      <th className="text-left" style={STYLES.table.header}>Tier</th>
                      <th className="text-left" style={STYLES.table.header}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.user_id} className="hover:bg-[rgba(245,158,11,0.02)] transition-colors">
                        <td style={STYLES.table.cell}>{customer.customer_name}</td>
                        <td style={STYLES.table.cell}>
                          <span className="font-mono text-xs">{customer.email || 'N/A'}</span>
                        </td>
                        <td style={STYLES.table.cell}>
                          <span className="font-mono text-xs text-amber-forge">{customer.license_key}</span>
                        </td>
                        <td style={STYLES.table.cell}>
                          <span
                            className="px-2 py-1 text-xs font-semibold rounded"
                            style={{
                              background: 'rgba(16,185,129,0.1)',
                              color: '#10b981',
                              border: '1px solid rgba(16,185,129,0.2)',
                            }}
                          >
                            {TIER_LABELS[customer.tier] || customer.tier}
                          </span>
                        </td>
                        <td style={STYLES.table.cell}>
                          <span className="text-xs text-metallic-500">
                            {new Date(customer.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'docs' && (
          <div style={STYLES.card} className="p-8">
            <div className="text-center py-16">
              <div className="mb-6">
                <svg
                  className="mx-auto"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  style={{ color: '#a8a8b4', opacity: 0.4 }}
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-metallic-300 mb-3">
                System Documentation
              </h3>
              <p className="text-sm text-metallic-500 max-w-md mx-auto mb-6">
                This section will display comprehensive system documentation as Markdown files.
                Upload your documentation files to <code className="text-amber-forge">public/docs/</code> to get started.
              </p>
              <div className="inline-block px-4 py-2 text-xs font-mono text-metallic-600" style={{
                background: 'rgba(10,10,11,0.6)',
                border: '1px solid rgba(168,168,180,0.06)',
                borderRadius: '0.375rem',
              }}>
                Feature placeholder — Coming soon
              </div>
            </div>
          </div>
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
