import { useEffect, useRef } from 'react'

/**
 * Custom hook that adds scroll-triggered reveal animations.
 * Attaches an IntersectionObserver to elements with the .reveal class
 * inside the referenced container, adding .visible when they enter the viewport.
 *
 * @returns {React.RefObject} ref - attach to the section wrapper element
 */
export function useScrollReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const elements = container.querySelectorAll('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            // Once visible, stop observing to save performance
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return ref
}
