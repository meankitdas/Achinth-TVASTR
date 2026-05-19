import { useRef } from "react";

import { SectionShell } from "../../primitives/SectionShell";
import { technologyHeroContent } from "@/content/technology/index";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function TechnologyHeroSection() {
  const { title, subtitle, body } = technologyHeroContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell
      ref={sectionRef}
      id="technology-hero"
      className="min-h-[60vh] flex items-center justify-center"
    >
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <p
          className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase"
          style={{ color: "var(--signal-glow)" }}
        >
          Technology
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-[72px] font-medium tracking-[-0.02em] text-txt-primary leading-[1.05]">
          {title}
        </h1>

        <p
          data-subheading
          className="text-lg md:text-xl text-txt-secondary leading-relaxed max-w-3xl mx-auto"
        >
          {subtitle}
        </p>

        <p className="text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
          {body}
        </p>
      </div>
    </SectionShell>
  );
}
