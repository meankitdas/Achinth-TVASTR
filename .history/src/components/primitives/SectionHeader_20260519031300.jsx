import { TERMS } from "@/constants/terminology";

/**
 * SectionHeader — eyebrow + `<h2>` heading + optional subtitle.
 *
 * The subtitle paragraph is annotated with `data-subheading` so
 * `useSectionReveal` (Reqs 9.1–9.6) can target it as the section's
 * subheading and animate it after the heading.
 */
export function SectionHeader({ title, subtitle, eyebrow }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-telemetry-primary opacity-60 mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold text-txt-primary leading-tight tracking-tight mb-2">
        {title}
      </h2>
      {subtitle && (
        <p
          data-subheading
          className="text-base md:text-lg text-txt-secondary leading-relaxed"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
