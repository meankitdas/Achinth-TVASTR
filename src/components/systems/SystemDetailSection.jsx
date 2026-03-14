import { useEffect, useRef } from 'react'

/**
 * SystemDetailSection — Light-theme section block for system detail pages.
 *
 * Props:
 *   label    — small eyebrow label (e.g. "01 / The Problem")
 *   title    — section heading (h2)
 *   body     — paragraph text (string or JSX)
 *   bullets  — optional string[] for bullet list
 *   children — optional additional content (e.g. SystemWorkflow, images)
 *   noDivider — suppress top divider on first section
 */
export function SystemDetailSection({ label, title, body, bullets, children, noDivider }) {
  const ref = useRef(null)

  // Fade-in on scroll using IntersectionObserver
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; observer.unobserve(el) } },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="w-full">
      {!noDivider && <div className="border-t border-gray-200 w-full" />}
      <div
        ref={ref}
        className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20"
        style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
      >
        {label && (
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-400 mb-4">
            {label}
          </p>
        )}
        {title && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5 leading-tight">
            {title}
          </h2>
        )}
        {body && (
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 max-w-[720px]">
            {body}
          </p>
        )}
        {bullets && bullets.length > 0 && (
          <ul className="space-y-2 mb-6">
            {bullets.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-600 text-base">
                <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
                {item}
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    </section>
  )
}
