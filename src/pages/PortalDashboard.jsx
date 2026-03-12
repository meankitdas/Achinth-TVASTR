import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Logo } from '../components/Logo'

/**
 * Update package definitions.
 *
 * Each package has a `storagePath` which maps to a file in Supabase Storage
 * (bucket: "updates"). Download URLs are generated as signed URLs so only
 * authenticated users can access them.
 *
 * To add a new package:
 *   1. Upload the file to Supabase Storage → bucket "updates"
 *   2. Add an entry here with the correct storagePath
 */
const UPDATE_PACKAGES = [
  {
    id: 1,
    product: 'Rejection Analysis System',
    tag: 'Vision AI',
    version: 'v1.3.0',
    releaseDate: '2025-03-01',
    description:
      'Improved defect classification accuracy. Added support for new casting geometries. Enhanced root cause analysis reports with confidence scoring.',
    size: '~42 MB',
    storagePath: 'rejection-analysis/RAS_v1.3.0_installer.zip',
    changelog: ['Defect classifier accuracy +8%', 'New geometry profiles', 'Confidence scoring in reports'],
  },
  {
    id: 2,
    product: 'Plant Intelligence',
    tag: 'Plant AI',
    version: 'v1.0.2',
    releaseDate: '2025-02-15',
    description:
      'Initial stable release. Natural language query engine, ERP connector, RAG knowledge base. Bugfixes for SQL adapter edge cases.',
    size: '~28 MB',
    storagePath: 'plant-intelligence/PI_v1.0.2_installer.zip',
    changelog: ['Initial stable release', 'NLQ engine v1', 'ERP connector', 'SQL adapter bugfixes'],
  },
]

/**
 * PackageCard — A single downloadable update card.
 *
 * Download flow:
 *   1. Call Supabase Storage to create a signed URL (60-second expiry)
 *   2. Programmatically trigger browser download
 *   3. On error: show inline error message
 *
 * This ensures files are never publicly accessible — only authenticated
 * users with a valid session can generate a download link.
 */
function PackageCard({ pkg }) {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')

  const handleDownload = async () => {
    setDownloading(true)
    setDownloadError('')

    try {
      // Generate a short-lived signed URL from Supabase Storage
      const { data, error } = await supabase.storage
        .from('updates')
        .createSignedUrl(pkg.storagePath, 60) // 60 second expiry

      if (error) throw error
      if (!data?.signedUrl) throw new Error('Could not generate download link.')

      // Trigger file download via a temporary anchor element
      const anchor = document.createElement('a')
      anchor.href = data.signedUrl
      anchor.download = pkg.storagePath.split('/').pop()
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
    } catch (err) {
      setDownloadError(err.message || 'Download failed. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div
      className="group relative flex flex-col transition-all duration-300"
      style={{
        background: 'rgba(17,17,19,0.95)',
        border: '1px solid rgba(168,168,180,0.08)',
        backdropFilter: 'blur(10px)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(168,168,180,0.08)'
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.4), transparent)',
        }}
      />

      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-semibold tracking-[0.15em] uppercase px-2.5 py-1"
                style={{
                  color: '#f59e0b',
                  background: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.15)',
                }}
              >
                {pkg.tag}
              </span>
            </div>
            <h3
              className="text-lg font-bold text-metallic-100 tracking-tight leading-tight"
            >
              {pkg.product}
            </h3>
          </div>

          {/* Version badge */}
          <div
            className="flex-shrink-0 px-3 py-1.5 text-center"
            style={{
              background: 'rgba(168,168,180,0.04)',
              border: '1px solid rgba(168,168,180,0.1)',
            }}
          >
            <div className="text-xs font-mono font-bold text-metallic-100">{pkg.version}</div>
            <div className="text-xs font-mono text-metallic-500">{formatDate(pkg.releaseDate)}</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-metallic-400 leading-relaxed mb-5 flex-1">
          {pkg.description}
        </p>

        {/* Changelog bullets */}
        <div className="mb-5">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-metallic-600 mb-2">
            Changes
          </p>
          <ul className="space-y-1">
            {pkg.changelog.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-metallic-500">
                <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* File size */}
        <div className="flex items-center gap-2 mb-5 text-xs text-metallic-600">
          <span>📦</span>
          <span className="font-mono">{pkg.size}</span>
          <span className="text-metallic-700">·</span>
          <span className="font-mono">.zip</span>
        </div>

        {/* Error */}
        {downloadError && (
          <div
            className="px-3 py-2 text-xs text-amber-forge mb-3"
            style={{
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.15)',
            }}
          >
            {downloadError}
          </div>
        )}

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full py-3 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#fbbf24',
          }}
          onMouseEnter={(e) => {
            if (!downloading) e.currentTarget.style.background = 'rgba(245,158,11,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(245,158,11,0.08)'
          }}
        >
          {downloading ? (
            <>
              <span
                className="w-3 h-3 border border-amber-forge border-t-transparent rounded-full"
                style={{ animation: 'spin 0.6s linear infinite' }}
              />
              Preparing...
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1v7M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M1 10h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              Download Package
            </>
          )}
        </button>
      </div>
    </div>
  )
}

/**
 * PortalDashboard — Authenticated customer dashboard.
 *
 * Shows downloadable update packages. Downloads are signed via Supabase
 * Storage and only accessible to authenticated users.
 */
export function PortalDashboard() {
  const { user, signOut } = useAuth()

  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#0a0a0b' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Top nav bar */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: 'rgba(10,10,11,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(168,168,180,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <Logo size="sm" />
            <span className="text-metallic-600 text-xs">/ Customer Portal</span>
          </Link>

          {/* User info + logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.5)' }}
              />
              <span className="text-xs text-metallic-400 font-mono">
                {user?.email}
              </span>
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
              Secure Vault
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
            Customer Updates
          </h1>
          <p className="text-sm text-metallic-400 max-w-lg">
            Download the latest software packages for your licensed Tvastr systems.
            All downloads are authenticated and time-limited.
          </p>
        </div>

        {/* Package grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {UPDATE_PACKAGES.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* Support note */}
        <div
          className="mt-12 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background: 'rgba(17,17,19,0.8)',
            border: '1px solid rgba(168,168,180,0.06)',
          }}
        >
          <div>
            <p className="text-sm font-medium text-metallic-300 mb-1">Need installation support?</p>
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
