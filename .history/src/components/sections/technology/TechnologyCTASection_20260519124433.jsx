import { useRef } from "react";
import { Link } from "react-router-dom";

import { SectionShell } from "../../primitives/SectionShell";
import { technologyCTAContent } from "@/content/technology/index";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function TechnologyCTASection() {
  const { title, subtitle, buttons } = technologyCTAContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="technology-cta" className="text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <p
          className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase"
          style={{ color: "var(--signal-glow)" }}
        >
          Next Steps
        </p>

        <h2 className="text-3xl md:text-5xl lg:text-[56px] font-medium text-txt-primary leading-[1.05] tracking-[-0.02em]">
          {title}
        </h2>

        <p
          data-subheading
          className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mx-auto"
        >
          {subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {buttons.map((button, idx) => (
            <Link
              key={idx}
              data-reveal-item
              to={button.href.startsWith("#") ? `/${button.href}` : button.href}
              className={
                button.variant === "primary"
                  ? "inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
                  : "inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              }
              style={
                button.variant === "primary"
                  ? {
                      background: "var(--process-primary)",
                      color: "var(--bg-primary)",
                    }
                  : {
                      borderColor: "var(--border-default)",
                      color: "var(--text-primary)",
                    }
              }
            >
              {button.label}
            </Link>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
