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
        <p
          className="font-mono text-[11px] md:text-[12px] font-normal tracking-[0.28em] uppercase mb-4"
          style={{ color: "var(--signal-glow)" }}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-5xl lg:text-[56px] font-medium text-txt-primary leading-[1.05] tracking-[-0.02em] mb-3 max-w-4xl">
        {title}
      </h2>
      {subtitle && (
        <p
          data-subheading
          className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
