import { CONFIG, openContact } from '../lib/config'

/**
 * LockedFeatureBlock — Reusable locked feature component.
 *
 * Props:
 *   title         — Feature name
 *   description   — Short explanation
 *   requiredTier  — Which tier unlocks this feature (e.g., "Full Stack", "Enterprise")
 *   features      — Optional array of bullet points to show
 */
export function LockedFeatureBlock({ title, description, requiredTier, features }) {
  const handleUpgrade = () => {
    const template = CONFIG.emailTemplates.licenseUpgrade(requiredTier)
    openContact(CONFIG.emails.support, template.subject, template.body)
  }

  return (
    <div
      className="p-6 md:p-8 rounded-xl"
      style={{
        background: 'rgba(17,17,19,0.8)',
        border: '1px solid rgba(168,168,180,0.12)',
        opacity: 0.9,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Lock icon */}
        <div
          className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg"
          style={{
            background: 'rgba(168,168,180,0.06)',
            border: '1px solid rgba(168,168,180,0.15)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 10V7a5 5 0 0110 0v3M5 10h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
              stroke="#686878"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-metallic-100 mb-2">
            {title}
          </h3>
          <p className="text-sm text-metallic-400 mb-4">
            {description}
          </p>

          {features && features.length > 0 && (
            <ul className="space-y-2 mb-6">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-metallic-300">
                  <span
                    className="flex-shrink-0 w-1 h-1 rounded-full"
                    style={{ background: '#888896' }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={handleUpgrade}
            className="px-5 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200 rounded-lg"
            style={{
              background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.35)',
              color: '#fbbf24',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(245,158,11,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(245,158,11,0.12)'
            }}
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  )
}
