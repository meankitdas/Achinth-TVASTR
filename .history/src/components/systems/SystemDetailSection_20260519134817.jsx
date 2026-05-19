import { useEffect, useRef } from "react";

/**
 * SystemDetailSection — Editorial section block for system detail pages.
 *
 * Matches the home page's Cohere-inspired design: coral mono eyebrow,
 * editorial display heading, generous whitespace, hairline dividers.
 *
 * Props:
 *   label    — small eyebrow label (e.g. "01 / The Problem")
 *   title    — section heading (h2)
 *   body     — paragraph text (string or JSX)
 *   bullets  — optional string[] for bullet list
 *   children — optional additional content (e.g. SystemWorkflow, images)
 *   noDivider — suppress top divider on first section
 */
export function SystemDetailSection({
  label,
  title,
  body,
  bullets,
  children,
  noDivider,
}) {
  const ref = useRef(null);

  // Fade-in on scroll using IntersectionObserver
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="presentation-slide w-full">
      {!noDivider && (
        <div
          className="w-full h-px"
          style={{ background: "var(--border-subtle)" }}
        />
      )}
      <div
        ref={ref}
        className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-24 w-full"
        style={{
          opacity: 0,
          transform: "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {label && (
          <p
            className="font-mono text-[11px] tracking-[0.28em] uppercase mb-4"
            style={{ color: "var(--signal-glow)" }}
          >
            {label}
          </p>
        )}
        {title && (
          <h2 className="text-2xl md:text-4xl font-medium text-txt-primary mb-5 leading-tight tracking-[-0.01em]">
            {title}
          </h2>
        )}
        {body && (
          <p className="text-base md:text-lg text-txt-secondary leading-relaxed mb-8 max-w-[720px]">
            {body}
          </p>
        )}
        {bullets && bullets.length > 0 && (
          <ul className="space-y-3 mb-8">
            {bullets.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-txt-secondary text-base"
              >
                <span
                  className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--signal-glow)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>

      {/* Slide footer — populated with page numbers by DownloadPresentationButton */}
      <div className="slide-footer">
        <span>Tvastr</span>
        <span />
        <span className="slide-number" />
      </div>
    </section>
  );
}
