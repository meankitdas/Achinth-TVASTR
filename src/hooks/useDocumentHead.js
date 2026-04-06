import { useEffect } from 'react'

/**
 * useDocumentHead — Sets page title and meta description dynamically.
 * Call this in any page component to update the document head.
 *
 * @param {string} title - The page title (e.g., "Rejection Analysis System | Tvastr")
 * @param {string} description - The meta description for the page
 * @param {string} [canonical] - Optional canonical URL (defaults to current path)
 */
export function useDocumentHead(title, description, canonical) {
  useEffect(() => {
    // Set title
    if (title) {
      document.title = title
    }

    // Update meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.name = 'description'
        document.head.appendChild(metaDescription)
      }
      metaDescription.content = description
    }

    // Update canonical URL if provided
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]')
      if (!linkCanonical) {
        linkCanonical = document.createElement('link')
        linkCanonical.rel = 'canonical'
        document.head.appendChild(linkCanonical)
      }
      linkCanonical.href = canonical
    }

    // Update Open Graph tags
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]')
      if (ogTitle) ogTitle.content = title
    }

    if (description) {
      let ogDescription = document.querySelector('meta[property="og:description"]')
      if (ogDescription) ogDescription.content = description
    }

    if (canonical) {
      let ogUrl = document.querySelector('meta[property="og:url"]')
      if (ogUrl) ogUrl.content = canonical
    }

    // Update Twitter Card tags
    if (title) {
      let twitterTitle = document.querySelector('meta[name="twitter:title"]')
      if (twitterTitle) twitterTitle.content = title
    }

    if (description) {
      let twitterDescription = document.querySelector('meta[name="twitter:description"]')
      if (twitterDescription) twitterDescription.content = description
    }

    if (canonical) {
      let twitterUrl = document.querySelector('meta[name="twitter:url"]')
      if (twitterUrl) twitterUrl.content = canonical
    }
  }, [title, description, canonical])
}
