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
  TIER_1: 'TIER_1', // RAS Core
  TIER_2: 'TIER_2', // RAS Enterprise
  TIER_3: 'TIER_3', // PIRAS (Plant Intelligence + RAS)
}

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
}

/**
 * Display labels for tiers (used in UI)
 */
export const TIER_LABELS = {
  TIER_1: 'RAS Core',
  TIER_2: 'RAS Enterprise',
  TIER_3: 'PIRAS',
}

/**
 * normalizeTierName — Converts legacy tier names to new format
 * @param {string} tier — Tier name (legacy or new format)
 * @returns {string} — Normalized tier name
 */
function normalizeTierName(tier) {
  const legacyMapping = {
    'ras_core': TIERS.TIER_1,
    'ras_enterprise': TIERS.TIER_2,
    'full_stack': TIERS.TIER_3,
  }

  return legacyMapping[tier] || tier
}

/**
 * Convert a tier string into a capabilities object.
 * This is the single source of truth for what each tier can access.
 *
 * @param {string} tier - User's license tier
 * @returns {Object} Capability flags
 */
export function getCapabilities(tier) {
  const normalized = normalizeTierName(tier)
  
  return {
    ras_core: true, // All tiers have RAS Core
    ras_enterprise: normalized !== TIERS.TIER_1,
    plant_intelligence: normalized === TIERS.TIER_3,
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
  const normalizedTier = normalizeTierName(tier)
  const normalizedRequired = normalizeTierName(version.required_tier)
  return TIER_ORDER[normalizedTier] >= TIER_ORDER[normalizedRequired]
}

/**
 * Get the display label for a version based on its required_tier.
 *
 * @param {Object} version - Version object with required_tier field
 * @returns {string} Human-readable label
 */
export function getVersionLabel(version) {
  const normalized = normalizeTierName(version.required_tier)
  return TIER_LABELS[normalized] || 'Unknown'
}
