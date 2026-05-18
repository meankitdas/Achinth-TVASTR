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

      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4">
        {body}
      </p>

      {/* Divider between the narrative zone and the architectural-principles zone */}
      <RulerTickDivider className="my-12" />

      <div className="grid sm:grid-cols-2 gap-4">
        {principles.map((principle, i) => (
          <div
            key={i}
            data-reveal-item
            className="p-5 rounded-lg border border-border-subtle bg-bg-primary/50"
          >
            <h4 className="text-sm font-bold text-txt-primary mb-2">
              {principle.name}
            </h4>
            <p className="text-xs text-txt-secondary leading-relaxed">
              {principle.description}
            </p>
          </div>
        ))}
      </div>

      {/* Divider between the architectural-principles zone and the closing summary zone */}
      <RulerTickDivider className="my-10" />

      <p className="text-center text-sm text-txt-secondary max-w-2xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
