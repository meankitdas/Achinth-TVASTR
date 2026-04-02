import { CONFIG, openContact } from '../lib/config'
import { useLicense } from '../context/LicenseContext'

/**
 * LockedScreen — Full-page locked state for tier-restricted features.
 *
 * Props:
 *   title   — Feature name (e.g., "Plant Intelligence not enabled")
 *   message — Explanation text (e.g., "This feature is available in Full Stack deployments.")
 */
export function LockedScreen({ title = 'Feature Locked', message = 'This feature requires a higher license tier.' }) {
  const { tier } = useLicense()
  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{ background: '#0a0a0b' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto px-6 text-center">
        {/* Lock icon */}
        <div
          className="w-16 h-16 mx-auto mb-6 flex items-center justify-center"
          style={{
            background: 'rgba(168,168,180,0.06)',
            border: '1px solid rgba(168,168,180,0.12)',
            borderRadius: '8px',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 10V7a5 5 0 0110 0v3M5 10h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
              stroke="#686878"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Title */}
        <h1
          className="text-2xl md:text-3xl font-black tracking-tight mb-4"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #a8a8b4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </h1>

        {/* Message */}
        <p className="text-base text-metallic-400 leading-relaxed mb-8">
          {message}
        </p>

        {/* Upgrade CTA - Only show for TIER_1 and TIER_2 */}
        {tier !== 'TIER_3' && (
          <button
            onClick={() => {
              const template = CONFIG.emailTemplates.licenseUpgrade('a higher tier')
              openContact(CONFIG.emails.support, template.subject, template.body)
            }}
            className="inline-block px-8 py-3.5 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200"
            style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.35)',
              color: '#fbbf24',
              borderRadius: '4px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(245,158,11,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(245,158,11,0.12)'
            }}
          >
            Upgrade License
          </button>
        )}

        {/* Back link */}
        <div className="mt-10">
          <a
            href="/portal/dashboard"
            className="text-xs text-metallic-600 hover:text-metallic-300 transition-colors duration-200 tracking-wider"
          >
            ← Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
