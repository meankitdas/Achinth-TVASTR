import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { deploymentContent } from "@/content/homepage/deployment";
import { useSectionReveal } from "../../hooks/useSectionReveal";
import RulerTickDivider from "../decor/RulerTickDivider";

export function DeploymentSection() {
  const { id, title, subtitle, body, principles, keyMessage } =
    deploymentContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id={id}>
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Deployment" />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6">
        {body}
      </p>

      {/* Divider between the narrative zone and the architectural-principles zone */}
      <RulerTickDivider className="my-16" />

      <div className="grid sm:grid-cols-2 gap-px bg-border-subtle border border-border-subtle">
        {principles.map((principle, i) => (
          <div key={i} data-reveal-item className="p-8 bg-bg-primary">
            <p
              className="font-mono text-[11px] tracking-[0.24em] uppercase mb-4"
              style={{ color: "var(--signal-glow)" }}
            >
              Principle {String(i + 1).padStart(2, "0")}
            </p>
            <h4 className="text-lg font-medium text-txt-primary leading-tight mb-3">
              {principle.name}
            </h4>
            <p className="text-sm text-txt-secondary leading-relaxed">
              {principle.description}
            </p>
          </div>
        ))}
      </div>

      {/* Divider between the architectural-principles zone and the closing summary zone */}
      <RulerTickDivider className="my-16" />

      <p className="text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
