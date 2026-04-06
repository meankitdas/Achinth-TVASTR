/**
 * Admin detection utilities.
 *
 * The admin user is identified by either:
 *   - Email: achintharya@gmail.com (DEVELOPER)
 *   - License Key: TVASTR-ACHINTH
 *
 * This allows the developer/admin to access special admin features
 * while maintaining a regular customer license experience for testing.
 */

const ADMIN_EMAIL = 'achintharya@gmail.com'
const ADMIN_LICENSE_KEY = 'TVASTR-ACHINTH'

/**
 * Check if a user is an admin.
 * @param {Object} user - Supabase user object
 * @param {string} licenseKey - User's license key
 * @returns {boolean}
 */
export function isAdmin(user, licenseKey) {
  if (!user) return false
  
  // Check if email matches admin email
  if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true
  }
  
  // Check if license key matches admin license
  if (licenseKey === ADMIN_LICENSE_KEY) {
    return true
  }
  
  return false
}

/**
 * Admin identifiers — exported for reference
 */
export const ADMIN_IDENTIFIERS = {
  email: ADMIN_EMAIL,
  licenseKey: ADMIN_LICENSE_KEY,
}
