import { forwardRef } from "react";

/**
 * SectionShell — root `<section>` wrapper for every marketing/home/
 * technology section.
 *
 * Forwards a ref to the underlying `<section>` element so consumers can
 * attach `useSectionReveal` (Reqs 9.1–9.6, 18.3; design.md § Components
 * and Interfaces > Animation infrastructure (`useSectionReveal`)).
 */
export const SectionShell = forwardRef(function SectionShell(
  { children, id, className, style },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      className={`relative py-20 md:py-36 overflow-hidden ${className || ""}`}
      style={style}
    >
      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {children}
      </div>
    </section>
  );
});
