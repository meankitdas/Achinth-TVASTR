import { useRef } from "react";

import { useSectionReveal } from "../../hooks/useSectionReveal";

/**
 * SystemImageBlock — Centered screenshot with caption.
 *
 * Stone-background frame with hairline border matching the home page's
 * InspectionVisibility screenshot cards.
 *
 * Props:
 *   src     — image path (relative to /public)
 *   alt     — alt text
 *   caption — caption text shown below image
 *   label   — optional eyebrow label above image
 */
export function SystemImageBlock({ src, alt, caption, label }) {
  const rootRef = useRef(null);
  useSectionReveal(rootRef, { threshold: 0.1 });

  return (
    <div ref={rootRef} className="w-full mt-8 mb-2">
      {label && (
        <p
          className="font-mono text-[11px] tracking-[0.28em] uppercase mb-4 text-center"
          style={{ color: "var(--signal-glow)" }}
        >
          {label}
        </p>
      )}
      <div
        className="w-full overflow-hidden rounded-xl border"
        style={{
          background: "var(--bg-panel)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          data-reveal-item
          className="w-full"
        />
      </div>
      {caption && (
        <p className="text-sm text-txt-muted text-center mt-3">{caption}</p>
      )}
    </div>
  );
}
