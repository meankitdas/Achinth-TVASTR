import { useRef } from "react";

import { SectionShell } from "../../primitives/SectionShell";
import { SectionHeader } from "../../primitives/SectionHeader";
import { processIntelligenceContent } from "@/content/technology/index";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function ProcessIntelligenceSection() {
  const { title, subtitle, body, capabilities, architecture, keyMessage } =
    processIntelligenceContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="process-intelligence">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Process Layer"
      />
      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Capabilities — stacked stone cards */}
      <div className="space-y-4 mb-16">
        {capabilities.map((cap, i) => (
          <div
            key={i}
            data-reveal-item
            className="p-7 md:p-8 rounded-lg"
            style={{ background: "var(--bg-panel)" }}
          >
            <div className="flex items-start gap-4 mb-4">
              <span
                className="font-mono text-[18px] md:text-[22px] leading-none tabular-nums"
                style={{ color: "var(--signal-glow)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="text-xl font-medium text-txt-primary leading-tight">
                  {cap.name}
                </h4>
                <p className="text-sm text-txt-secondary leading-relaxed mt-2 mb-4">
                  {cap.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {cap.features.map((feat, j) => (
                    <span
                      key={j}
                      className="inline-block px-2.5 py-1 text-[11px] text-txt-secondary bg-bg-primary border border-border-subtle rounded"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture summary — deep green band */}
      <div
        className="p-8 md:p-10 rounded-2xl mb-12"
        style={{
          background: "var(--process-primary)",
          color: "var(--bg-primary)",
        }}
      >
        <p
          className="font-mono text-[11px] tracking-[0.28em] uppercase mb-6"
          style={{ color: "var(--signal-glow)" }}
        >
          Architecture
        </p>
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-4">
          {Object.entries(architecture).map(([key, value]) => (
            <div key={key} className="flex items-start gap-3">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-1 flex-shrink-0 opacity-80"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-base leading-relaxed">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
