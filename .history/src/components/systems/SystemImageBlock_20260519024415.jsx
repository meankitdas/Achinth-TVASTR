import { useRef } from "react";

import { useSectionReveal } from "../../hooks/useSectionReveal";

/**
 * SystemImageBlock — Centered screenshot with caption.
 *
 * Drives a single reveal of the image when ≥ 10 % of the block enters the
 * viewport (Req 14.4; design.md § Components and Interfaces > Animation
 * infrastructure (`useSectionReveal`)). Default 600 ms duration sits within
 * the [400, 900] ms window enforced by the hook.
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
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-4 text-center">
          {label}
        </p>
      )}
      <div
        className="w-full overflow-hidden"
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
          border: "1px solid #e5e7eb",
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          data-reveal-item
          className="w-full"
          style={{ border: "1px solid #e5e7eb" }}
        />
      </div>
      {caption && (
        <p className="text-sm text-slate-500 text-center mt-3 italic">
          {caption}
        </p>
      )}
    </div>
  );
}
