import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { industryProblemContent } from "@/content/homepage/industry-problem";
import { useSectionReveal } from "../../hooks/useSectionReveal";

export function IndustryProblemSection() {
  const { id, title, subtitle, body, problems } = industryProblemContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id={id}>
      <SectionHeader title={title} subtitle={subtitle} eyebrow="The Problem" />

      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Problem cards — 2x3 grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {problems.map((problem, i) => (
          <div
            key={i}
            data-reveal-item
            className="p-5 rounded-lg border border-border-subtle bg-bg-primary/50"
          >
            <h4 className="text-sm font-bold text-txt-primary mb-2">
              {problem.title}
            </h4>
            <p className="text-xs text-txt-secondary leading-relaxed">
              {problem.description}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
