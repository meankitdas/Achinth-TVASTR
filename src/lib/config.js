/**
 * Application Configuration
 * 
 * Centralized configuration for contact emails and other app-wide settings.
 * Update these values to change contact information across the entire application.
 */

export const CONFIG = {
  // Contact Emails
  emails: {
    // Support email for license upgrades and general assistance
    support: 'achintharya@gmail.com',
    
    // Sales/general contact email (used in contact forms)
    contact: 'achintharya@gmail.com',
    
    // Installation support email (used in dashboard)
    installationSupport: 'achintharya@gmail.com',
  },

  // Email Templates
  emailTemplates: {
    licenseUpgrade: (tier) => ({
      subject: 'License Upgrade Request',
      body: `Hello,\n\nI would like to upgrade my license to ${tier}.\n\nThank you.`
    }),
    
    portalAccess: {
      subject: 'Portal Access Request',
      body: 'Hello, I would like to request access to the Tvastr Customer Portal.'
    },
    
    installationSupport: {
      subject: 'Installation Support',
      body: 'Hello, I need assistance with installation.'
    },
  },
}

/**
 * Helper function to generate mailto links
 * @param {string} email - Email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {string} Formatted mailto URL
 */
export function generateMailtoLink(email, subject, body) {
  const parts = []
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`)
  if (body) parts.push(`body=${encodeURIComponent(body)}`)
  return `mailto:${email}${parts.length ? '?' + parts.join('&') : ''}`
}

/**
 * Reliable cross-browser mailto opener using hidden anchor click.
 * This bypasses popup blockers and navigation cancellation issues.
 * 
 * @param {string} email - Email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 */
export function openMailto(email, subject, body) {
  const link = document.createElement('a')
  link.href = generateMailtoLink(email, subject, body)
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
