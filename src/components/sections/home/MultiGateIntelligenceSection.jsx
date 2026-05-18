import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { multiGateIntelligenceContent } from "@/content/homepage/multi-gate-intelligence";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function MultiGateIntelligenceSection() {
  const { title, subtitle, body, stages, keyMessage } =
    multiGateIntelligenceContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="multi-gate-intelligence">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Production Flow"
      />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Stage flow — horizontal timeline on desktop, vertical on mobile */}
      <div className="relative">
        {/* Connecting line (desktop only) */}
        <div
          className="hidden lg:block absolute top-6 left-[8%] right-[8%] h-px"
          style={{ background: "var(--border-default)" }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          {stages.map((stage, i) => (
            <div
              key={i}
              data-reveal-item
              className="relative flex flex-col items-center text-center"
            >
              {/* Stage number node — Cohere mono technical label */}
              <div
                className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center mb-5"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-strong)",
                }}
              >
                <span className="font-mono text-[11px] tracking-[0.18em] text-txt-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <h4 className="text-base font-medium text-txt-primary mb-2 leading-tight">
                {stage.name}
              </h4>
              <p className="text-sm text-txt-secondary leading-relaxed mb-4">
                {stage.description}
              </p>

              {/* Intelligence capabilities */}
              <ul className="space-y-1.5 text-left w-full">
                {stage.intelligence.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-xs text-txt-secondary leading-snug"
                  >
                    <span
                      className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: "var(--process-primary)" }}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Key message */}
      <p className="mt-16 text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
