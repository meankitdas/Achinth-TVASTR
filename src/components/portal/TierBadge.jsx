/**
 * @file src/components/portal/TierBadge.jsx
 * @description Single source of truth for the portal Tier_Badge visual
 * contract (Reqs 15.2, 15.3, 15.4; design.md § "Tier-gating UX in the
 * portal"). Renders one of three states next to gated controls in the
 * customer portal:
 *
 *   - 'ACTIVE'   — literal text 'ACTIVE', foreground colors.signal.warning,
 *                  1 px border colors.signal.warning at α ∈ [0.3, 0.5].
 *   - 'INCLUDED' — literal text 'INCLUDED', foreground colors.text.muted,
 *                  1 px border colors.text.muted at α ∈ [0.3, 0.5].
 *   - 'LOCKED'   — foreground colors.text.muted, the existing lock icon
 *                  used by LockedProductCard / LockedScreen, and an upgrade
 *                  CTA whose accent is colors.signal.warning. Activating
 *                  the CTA navigates to the upgrade flow (Req 15.4).
 *
 * Every color is sourced from Theme_Tokens via src/design/colors.js — the
 * file deliberately contains zero hard-coded hex literals (Property 15).
 */

import { CONFIG, openContact } from "../../lib/config";
import { colors } from "../../design/colors";

/**
 * Convert a 6-digit hex into an rgba() string at the requested alpha so
 * Theme_Token hex values can be used as semi-transparent borders / fills
 * without introducing a new hex literal in this file.
 *
 * @param {string} hex 6-digit `#RRGGBB`
 * @param {number} alpha 0..1
 * @returns {string} `rgba(r, g, b, alpha)`
 */
function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Border alpha sits inside the [0.3, 0.5] range mandated by Reqs 15.2 / 15.3.
const BORDER_ALPHA = 0.4;
// Background fill is intentionally lighter so the badge reads as a chip.
const ACTIVE_BG_ALPHA = 0.08;

const BASE_BADGE_CLASSES =
  "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold tracking-[0.15em] uppercase rounded-md";

/**
 * Lock glyph reused (visually) from LockedProductCard / LockedScreen so the
 * LOCKED badge presents the same iconography as the rest of the portal
 * locked-state UI (Req 15.4; design.md § Tier-gating UX in the portal).
 */
function LockGlyph({ size = 12, color }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 10V7a5 5 0 0110 0v3M5 10h14a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a2 2 0 012-2z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Tier_Badge — Renders the badge for a single (state, productId) pair.
 *
 * @param {object} props
 * @param {'ACTIVE'|'INCLUDED'|'LOCKED'} props.state Badge state.
 * @param {string} [props.productId] Product the badge is rendered for; used
 *   in the upgrade flow message when state is LOCKED.
 */
export function TierBadge({ state, productId }) {
  if (state === "ACTIVE") {
    return (
      <span
        data-tier-badge="ACTIVE"
        className={BASE_BADGE_CLASSES}
        style={{
          color: colors.signal.warning,
          background: hexToRgba(colors.signal.warning, ACTIVE_BG_ALPHA),
          border: `1px solid ${hexToRgba(colors.signal.warning, BORDER_ALPHA)}`,
        }}
      >
        ACTIVE
      </span>
    );
  }

  if (state === "INCLUDED") {
    return (
      <span
        data-tier-badge="INCLUDED"
        className={BASE_BADGE_CLASSES}
        style={{
          color: colors.text.muted,
          background: "transparent",
          border: `1px solid ${hexToRgba(colors.text.muted, BORDER_ALPHA)}`,
        }}
      >
        INCLUDED
      </span>
    );
  }

  // LOCKED — render lock icon + upgrade CTA. Activating the CTA navigates
  // to the upgrade flow (Req 15.4); the rest of the portal currently
  // surfaces the upgrade flow through the support email template, so we
  // reuse that path for behavioural consistency with LockedProductCard /
  // LockedScreen / UpgradeBanner.
  const handleUpgrade = () => {
    const template = CONFIG.emailTemplates.licenseUpgrade(
      productId || "a higher tier",
    );
    openContact(CONFIG.emails.support, template.subject, template.body);
  };

  return (
    <span data-tier-badge="LOCKED" className="inline-flex items-center gap-2">
      <span
        className={BASE_BADGE_CLASSES}
        style={{
          color: colors.text.muted,
          background: "transparent",
          border: `1px solid ${hexToRgba(colors.text.muted, BORDER_ALPHA)}`,
        }}
      >
        <LockGlyph color={colors.text.muted} />
        LOCKED
      </span>
      <button
        type="button"
        onClick={handleUpgrade}
        data-tier-badge-cta="UPGRADE"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold tracking-[0.15em] uppercase rounded-md transition-colors duration-200"
        style={{
          color: colors.signal.warning,
          background: hexToRgba(colors.signal.warning, ACTIVE_BG_ALPHA),
          border: `1px solid ${hexToRgba(colors.signal.warning, BORDER_ALPHA)}`,
        }}
      >
        Upgrade
      </button>
    </span>
  );
}

export default TierBadge;
