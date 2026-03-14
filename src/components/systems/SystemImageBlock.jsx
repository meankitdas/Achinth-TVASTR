/**
 * SystemImageBlock — Centered screenshot with caption.
 *
 * Props:
 *   src     — image path (relative to /public)
 *   alt     — alt text
 *   caption — caption text shown below image
 *   label   — optional eyebrow label above image
 */
export function SystemImageBlock({ src, alt, caption, label }) {
  return (
    <div className="w-full mt-8 mb-2">
      {label && (
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-4 text-center">
          {label}
        </p>
      )}
      <div
        className="w-full overflow-hidden"
        style={{
          borderRadius: '8px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
          border: '1px solid #e5e7eb',
        }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto block"
          loading="lazy"
        />
      </div>
      {caption && (
        <p className="text-sm text-slate-500 text-center mt-3 italic">
          {caption}
        </p>
      )}
    </div>
  )
}
