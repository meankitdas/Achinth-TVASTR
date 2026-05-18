import { CONFIG, openContact } from "../lib/config";
import { cardClipPath } from "../design/clipPaths";
import { TierBadge } from "./portal/TierBadge";

/**
 * LockedProductCard — Greyed-out product card for dashboard.
 * Used to show products that are available in a higher tier.
 *
 * Props:
 *   title         — Product name
 *   description   — Product description
 *   tag           — Badge label (e.g., "Vision AI", "Plant AI")
 *   index         — Card position (for styling variation)
 *   requiredTier  — Which tier unlocks this (e.g., "Enterprise", "Full Stack")
 *   features      — Array of feature bullets specific to this tier
 */
export function LockedProductCard({
  title,
  description,
  tag,
  index,
  requiredTier,
  features,
}) {
  return (
    <div
      className="surface-panel group relative flex flex-col transition-all duration-300 opacity-60 hover:opacity-75"
      style={{
        clipPath: cardClipPath,
        borderRadius: 0,
        filter: "grayscale(0.5)",
      }}
    >
      {/* Muted top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-20 z-10"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(168,168,180,0.3), transparent)",
        }}
      />

      <div className="relative z-10 p-6 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span
              className="text-xs font-semibold tracking-[0.15em] uppercase px-2.5 py-1 inline-block mb-3"
              style={{
                color: "#888896",
                background: "rgba(168,168,180,0.06)",
                border: "1px solid rgba(168,168,180,0.12)",
              }}
            >
              {tag}
            </span>
            <h3 className="text-lg font-bold text-txt-secondary tracking-tight leading-tight">
              {title}
            </h3>
          </div>

          {/* Lock icon badge */}
          <div
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg"
            style={{
              background: "rgba(168,168,180,0.04)",
              border: "1px solid rgba(168,168,180,0.1)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 10V7a5 5 0 0110 0v3M5 10h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
                stroke="#686878"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-txt-muted leading-relaxed">{description}</p>

        {/* Locked notice with features */}
        <div
          className="p-4 rounded-lg"
          style={{
            background: "rgba(168,168,180,0.03)",
            border: "1px solid rgba(168,168,180,0.06)",
          }}
        >
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-txt-muted mb-3">
            Available in {requiredTier}
          </p>

          {features && features.length > 0 && (
            <ul className="space-y-2 mb-4">
              {features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-txt-muted"
                >
                  <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full bg-metallic-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Upgrade CTA */}
        <button
          onClick={() => {
            const template = CONFIG.emailTemplates.licenseUpgrade(requiredTier);
            openContact(CONFIG.emails.support, template.subject, template.body);
          }}
          className="flex items-center justify-center gap-2 py-3 text-xs font-semibold tracking-[0.15em] uppercase transition-all duration-200 mt-auto rounded-lg"
          style={{
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.35)",
            color: "#fbbf24",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(245,158,11,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(245,158,11,0.12)";
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 10V7a5 5 0 0110 0v3M5 10h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Upgrade to {requiredTier}
        </button>
      </div>
    </div>
  );
}
