import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { intelligenceLayersContent } from "@/content/homepage/intelligence-layers";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function IntelligenceLayersSection() {
  const { title, subtitle, columns, keyMessage } = intelligenceLayersContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="intelligence-layers">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Architecture" />

      {/* Three-column intelligence layer diagram — soft stone capability cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-16">
        {columns.map((col, idx) => (
          <div
            key={col.id}
            data-reveal-item
            className="relative p-8 rounded-lg overflow-hidden"
            style={{
              background: "var(--bg-panel)",
            }}
          >
            {/* Layer indicator bar — coral brand accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{
                background: "var(--signal-glow)",
              }}
            />

            <p
              className="font-mono text-[11px] tracking-[0.24em] uppercase mt-4 mb-3"
              style={{ color: "var(--signal-glow)" }}
            >
              Layer {String(idx + 1).padStart(2, "0")}
            </p>
            <h3 className="text-2xl font-medium text-txt-primary leading-tight mb-3">
              {col.name}
            </h3>
            <p className="text-sm text-txt-secondary leading-relaxed mb-6">
              {col.description}
            </p>

            {/* Capability list — checkmark bullets, hairline divider above */}
            <div className="border-t border-border-default pt-4">
              <ul className="space-y-2.5">
                {col.capabilities.map((cap, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-txt-primary"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mt-1 flex-shrink-0"
                      style={{ color: "var(--signal-glow)" }}
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Connecting message */}
      <p className="mt-16 text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
