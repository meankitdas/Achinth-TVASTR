import { useState } from 'react'
import { useLicense } from '../context/LicenseContext'
import { getVersionLabel } from '../lib/capabilities'

const UPDATE_SERVER_URL = import.meta.env.VITE_UPDATE_SERVER_URL

/**
 * ProductDownloadCard — Shows a product's latest version with a download button.
 *
 * Props:
 *   product  — { id, name, description }
 *   version  — { version_number, release_date, changelog, file_path, checksum, required_tier }
 *   index    — card position (0-based, for subtle styling variation)
 *
 * Download flow:
 *   1. User clicks Download
 *   2. Client calls update server API to get S3 pre-signed URL
 *   3. Browser opens the signed URL in a new tab
 */
export function ProductDownloadCard({ product, version, index }) {
  const { licenseKey } = useLicense()
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  const handleDownload = async () => {
    if (!version?.version_number || !product?.name) {
      setError('No file available for this version.')
      return
    }

    if (!licenseKey) {
      setError('License key not found. Please contact support.')
      return
    }

    if (!UPDATE_SERVER_URL) {
      setError('Update server URL not configured.')
      return
    }

    setDownloading(true)
    setError(null)

    try {
      // Call update server API to get S3 pre-signed URL
      const response = await fetch(
        `${UPDATE_SERVER_URL}/api/download/${encodeURIComponent(product.name)}/${encodeURIComponent(version.version_number)}?license_key=${encodeURIComponent(licenseKey)}`
      )

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || 'Download request failed')
      }

      const data = await response.json()

      // Open the S3 pre-signed URL — triggers browser download
      window.open(data.download_url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setError(err.message || 'Download failed. Please try again or contact support.')
      console.error('[Download]', err)
    } finally {
      setDownloading(false)
    }
  }

  const formattedDate = version?.release_date
    ? new Date(version.release_date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'

  // Determine card tag based on version tier
  const tierLabel = version?.required_tier ? getVersionLabel(version) : 'Unknown'
  const cardTag = version?.includes_pi ? 'Plant AI' : 'Vision AI'

  return (
    <div className="liquid-glass rounded-xl flex flex-col h-full">
      {/* Top amber accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-10"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)',
        }}
      />

      <div className="relative z-10 p-8 flex flex-col gap-6 h-full">
        {/* Header */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <span
              className="text-xs font-mono tracking-widest opacity-40"
              style={{ color: '#888896' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="w-px h-4 bg-metallic-600 opacity-40" />
            <span
              className="text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1"
              style={{
                color: '#f59e0b',
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.15)',
              }}
            >
              {cardTag}
            </span>
          </div>

          <h3
            className="text-2xl md:text-3xl font-black tracking-tight mb-3"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {product.name}
          </h3>

          <p className="text-sm text-metallic-400 leading-relaxed">
            {product.description}
          </p>

          {/* Tier label */}
          <div className="mt-3">
            <span className="text-xs text-metallic-500 font-semibold tracking-wider uppercase">
              {tierLabel}
            </span>
          </div>
        </div>

        {/* Version info */}
        {version ? (
          <div
            className="flex-1 p-5 space-y-4"
            style={{
              background: 'rgba(10,10,11,0.6)',
              border: '1px solid rgba(168,168,180,0.06)',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-metallic-500 tracking-widest uppercase mb-1">
                  Latest Version
                </p>
                <p className="text-2xl font-black text-amber-forge font-mono">
                  v{version.version_number}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-metallic-500 tracking-widest uppercase mb-1">
                  Released
                </p>
                <p className="text-sm text-metallic-300">{formattedDate}</p>
              </div>
            </div>

            {version.changelog && (
              <div>
                <p className="text-xs text-metallic-500 tracking-widest uppercase mb-2">
                  Release Notes
                </p>
                <p className="text-sm text-metallic-300 leading-relaxed">
                  {version.changelog}
                </p>
              </div>
            )}

            {version.checksum && (
              <div>
                <p className="text-xs text-metallic-500 tracking-widest uppercase mb-1">
                  SHA-256
                </p>
                <p className="text-xs text-metallic-500 font-mono break-all opacity-60">
                  {version.checksum}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            className="flex-1 flex items-center justify-center p-8"
            style={{ border: '1px solid rgba(168,168,180,0.06)' }}
          >
            <p className="text-sm text-metallic-500 text-center">
              No releases available yet.
            </p>
          </div>
        )}

        {/* Download button */}
        <div className="space-y-3">
          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}
          <button
            onClick={handleDownload}
            disabled={!version || downloading}
            className="w-full py-4 text-sm font-semibold tracking-widest uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
              border: '1px solid rgba(245,158,11,0.4)',
              color: '#fbbf24',
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'rgba(245,158,11,0.08)' }}
            />
            <span className="relative">
              {downloading ? 'Generating link…' : `Download v${version?.version_number ?? '—'}`}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
