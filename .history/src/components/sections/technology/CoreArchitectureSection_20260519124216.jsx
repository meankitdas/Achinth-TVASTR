import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { coreArchitectureContent } from "@/content/technology/core-architecture";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function CoreArchitectureSection() {
  const { title, subtitle, body, layers, keyMessage } = coreArchitectureContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="core-architecture">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="System Architecture"
      />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Layered architecture — stacked with hairline dividers */}
      <div className="space-y-px border border-border-subtle bg-border-subtle">
        {layers.map((layer, i) => (
          <div
            key={layer.id}
            data-reveal-item
            className="flex flex-col md:flex-row items-stretch gap-6 p-7 md:p-8 bg-bg-primary"
          >
            {/* Layer label */}
            <div className="flex-shrink-0 md:w-52 flex items-start gap-4">
              <span
                className="font-mono text-[18px] md:text-[22px] leading-none tabular-nums"
                style={{ color: "var(--signal-glow)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h4 className="text-lg font-medium text-txt-primary leading-tight">
                {layer.name}
              </h4>
            </div>

            {/* Description + responsibilities */}
            <div className="flex-1">
              <p className="text-sm text-txt-secondary leading-relaxed mb-4">
                {layer.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {layer.responsibilities.map((resp, j) => (
                  <span
                    key={j}
                    className="inline-block px-2.5 py-1 text-[11px] text-txt-secondary bg-bg-panel border border-border-subtle rounded"
                  >
                    {resp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Key message */}
      <p className="mt-16 text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
