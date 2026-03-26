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
 * Open contact: Copy email to clipboard and open Gmail compose.
 * This is more reliable than mailto: protocol which gets blocked by browsers.
 * 
 * @param {string} email - Email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 */
export function openContact(email, subject, body) {
  // Copy email to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(email).catch(err => console.warn('Failed to copy email:', err))
  }
  
  // Open Gmail compose with prefilled fields
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(gmailUrl, '_blank')
}
