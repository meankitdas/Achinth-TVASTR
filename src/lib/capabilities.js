/**
 * Tier-based capability system for Tvastr customer portal.
 *
 * Tiers:
 *   - TIER_1 (RAS Core)       — Basic RAS standalone
 *   - TIER_2 (RAS Enterprise) — RAS integrated build
 *   - TIER_3 (PIRAS)          — RAS + Plant Intelligence
 *
 * All UI and routing logic should derive from getCapabilities(tier).
 */

/**
 * Tier constants
 */
export const TIERS = {
  TIER_1: "TIER_1", // RAS Core
  TIER_2: "TIER_2", // RAS Enterprise
  TIER_3: "TIER_3", // PIRAS (Plant Intelligence + RAS)
};

/**
 * Tier hierarchy map (lower number = lower tier)
 */
export const TIER_ORDER = {
  TIER_1: 1,
  TIER_2: 2,
  TIER_3: 3,
  // Legacy aliases (used in old database seed data)
  ras_core: 1,
  ras_enterprise: 2,
  full_stack: 3,
};

/**
 * Display labels for tiers (used in UI)
 */
export const TIER_LABELS = {
  TIER_1: "RAS Core",
  TIER_2: "RAS Enterprise",
  TIER_3: "PIRAS",
};

/**
 * normalizeTierName — Converts legacy tier names to new format
 * @param {string} tier — Tier name (legacy or new format)
 * @returns {string} — Normalized tier name
 */
function normalizeTierName(tier) {
  const legacyMapping = {
    ras_core: TIERS.TIER_1,
    ras_enterprise: TIERS.TIER_2,
    full_stack: TIERS.TIER_3,
  };

  return legacyMapping[tier] || tier;
}

/**
 * Convert a tier string into a capabilities object.
 * This is the single source of truth for what each tier can access.
 *
 * @param {string} tier - User's license tier
 * @returns {Object} Capability flags
 */
export function getCapabilities(tier) {
  const normalized = normalizeTierName(tier);

  return {
    ras_core: true, // All tiers have RAS Core
    ras_enterprise: normalized !== TIERS.TIER_1,
    plant_intelligence: normalized === TIERS.TIER_3,
  };
}

/**
 * Check if a version is allowed for a given tier.
 * Used to filter downloads based on required_tier.
 *
 * @param {Object} version - Version object with required_tier field
 * @param {string} tier - User's license tier
 * @returns {boolean} True if user can access this version
 */
export function isAllowed(version, tier) {
  if (!version?.required_tier) return false;
  const normalizedTier = normalizeTierName(tier);
  const normalizedRequired = normalizeTierName(version.required_tier);
  return TIER_ORDER[normalizedTier] >= TIER_ORDER[normalizedRequired];
}

/**
 * Get the display label for a version based on its required_tier.
 *
 * @param {Object} version - Version object with required_tier field
 * @returns {string} Human-readable label
 */
export function getVersionLabel(version) {
  const normalized = normalizeTierName(version.required_tier);
  return TIER_LABELS[normalized] || "Unknown";
}

/**
 * tierToBadgeState — Pure mapper from (tier, productId) to a Tier_Badge state.
 *
 * Encodes the canonical mapping table from
 * `light-theme-industrial-redesign/design.md` § "Tier-gating UX in the portal"
 * (Reqs 15.5, 15.6, 15.7, 15.10) and is exhaustively validated by Property 11.
 *
 * | Tier                       | ras_core | ras_enterprise | plant_intelligence |
 * | -------------------------- | -------- | -------------- | ------------------ |
 * | ras_core / TIER_1          | ACTIVE   | LOCKED         | LOCKED             |
 * | ras_enterprise / TIER_2    | ACTIVE   | ACTIVE         | LOCKED             |
 * | full_stack / TIER_3        | ACTIVE   | INCLUDED       | ACTIVE             |
 * | unrecognized / undefined   | LOCKED   | LOCKED         | LOCKED             |
 *
 * Implementation invariants:
 *   - Normalizes legacy tier aliases (ras_core, ras_enterprise, full_stack)
 *     via the existing `normalizeTierName` helper.
 *   - Unrecognized or undefined tiers always return 'LOCKED'.
 *   - Unknown productIds always return 'LOCKED'.
 *
 * @param {string} tier — License tier (TIER_1/2/3 or legacy alias).
 * @param {string} productId — One of 'ras_core', 'ras_enterprise', 'plant_intelligence'.
 * @returns {'ACTIVE'|'INCLUDED'|'LOCKED'} Badge state for the given pair.
 */
export function tierToBadgeState(tier, productId) {
  const normalizedTier = normalizeTierName(tier);

  // Unrecognized / undefined tier => LOCKED for every product (Req 15.10).
  if (
    normalizedTier !== TIERS.TIER_1 &&
    normalizedTier !== TIERS.TIER_2 &&
    normalizedTier !== TIERS.TIER_3
  ) {
    return "LOCKED";
  }

  switch (productId) {
    case "ras_core":
      // RAS Core is granted by every recognized tier (Reqs 15.5, 15.6, 15.7).
      return "ACTIVE";

    case "ras_enterprise":
      if (normalizedTier === TIERS.TIER_1) return "LOCKED"; // Req 15.5
      if (normalizedTier === TIERS.TIER_2) return "ACTIVE"; // Req 15.6
      // TIER_3 / full_stack: RAS Enterprise is bundled into PIRAS.       (Req 15.7)
      return "INCLUDED";

    case "plant_intelligence":
      if (normalizedTier === TIERS.TIER_3) return "ACTIVE"; // Req 15.7
      // TIER_1 / TIER_2: Plant Intelligence is gated.                    (Reqs 15.5, 15.6)
      return "LOCKED";

    default:
      // Unknown product => LOCKED.
      return "LOCKED";
  }
}
