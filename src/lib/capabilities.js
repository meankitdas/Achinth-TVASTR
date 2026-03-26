/**
 * Tier-based capability system for Tvastr customer portal.
 *
 * Tiers:
 *   - ras_core       (Tier 1) — Basic RAS standalone
 *   - ras_enterprise (Tier 2) — RAS integrated build
 *   - full_stack     (Tier 3) — RAS + Plant Intelligence
 *
 * All UI and routing logic should derive from getCapabilities(tier).
 */

/**
 * Tier hierarchy map (lower number = lower tier)
 */
export const TIER_ORDER = {
  TIER_1: 1,
  TIER_2: 2,
  TIER_3: 3,
}

/**
 * Display labels for tiers (used in UI)
 */
export const TIER_LABELS = {
  TIER_1: 'RAS Core',
  TIER_2: 'RAS Enterprise',
  TIER_3: 'Full Stack',
}

/**
 * Convert a tier string into a capabilities object.
 * This is the single source of truth for what each tier can access.
 *
 * @param {string} tier - User's license tier
 * @returns {Object} Capability flags
 */
export function getCapabilities(tier) {
  return {
    ras_core: true, // All tiers have RAS Core
    ras_enterprise: tier !== 'TIER_1',
    plant_intelligence: tier === 'TIER_3',
  }
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
  if (!version?.required_tier) return false
  return TIER_ORDER[tier] >= TIER_ORDER[version.required_tier]
}

/**
 * Get the display label for a version based on its required_tier.
 *
 * @param {Object} version - Version object with required_tier field
 * @returns {string} Human-readable label
 */
export function getVersionLabel(version) {
  return TIER_LABELS[version.required_tier] || 'Unknown'
}
