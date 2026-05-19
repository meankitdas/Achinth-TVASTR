import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { energyReasoningContent } from "@/content/technology/energy-reasoning";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function EnergyReasoningSection() {
  const {
    title,
    subtitle,
    body,
    concepts,
    decisionTiers,
    designPrinciple,
    keyMessage,
  } = energyReasoningContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="energy-reasoning">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Decision Architecture"
      />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Concepts — hairline grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle border border-border-subtle mb-16">
        {concepts.map((concept, i) => (
          <div key={i} data-reveal-item className="p-7 bg-bg-primary">
            <p
              className="font-mono text-[11px] tracking-[0.24em] uppercase mb-3"
              style={{ color: "var(--signal-glow)" }}
            >
              Concept {String(i + 1).padStart(2, "0")}
            </p>
            <h4 className="text-lg font-medium text-txt-primary leading-tight mb-3">
              {concept.name}
            </h4>
            <p className="text-sm text-txt-secondary leading-relaxed">
              {concept.description}
            </p>
          </div>
        ))}
      </div>

      {/* Decision tiers — three-column gauge */}
      <div
        className="p-8 md:p-10 rounded-lg mb-12"
        style={{ background: "var(--bg-panel)" }}
      >
        <h3 className="text-2xl font-medium text-txt-primary mb-6">
          Decision Tiers
        </h3>

        {/* Visual gauge */}
        <div className="relative h-10 rounded-lg overflow-hidden mb-8 flex border border-border-subtle">
          <div
            className="flex-1 flex items-center justify-center"
            style={{ background: "rgba(0,60,51,0.12)" }}
          >
            <span
              className="text-[11px] font-mono tracking-[0.18em] uppercase"
              style={{ color: "var(--process-primary)" }}
            >
              Accept
            </span>
          </div>
          <div
            className="flex-1 flex items-center justify-center border-x border-border-subtle"
            style={{ background: "rgba(245,158,11,0.10)" }}
          >
            <span
              className="text-[11px] font-mono tracking-[0.18em] uppercase"
              style={{ color: "var(--signal-warning)" }}
            >
              Review
            </span>
          </div>
          <div
            className="flex-1 flex items-center justify-center"
            style={{ background: "rgba(179,0,0,0.08)" }}
          >
            <span
              className="text-[11px] font-mono tracking-[0.18em] uppercase"
              style={{ color: "var(--signal-danger)" }}
            >
              Reject
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {decisionTiers.map((tier, i) => (
            <div key={i} className="flex items-start gap-4">
              <span
                className="font-mono text-[12px] w-24 flex-shrink-0 tabular-nums"
                style={{ color: "var(--process-primary)" }}
              >
                {tier.threshold}
              </span>
              <span className="text-sm text-txt-secondary">
                {tier.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Design principle — deep green band */}
      <div
        className="p-8 md:p-10 rounded-2xl mb-12"
        style={{
          background: "var(--process-primary)",
          color: "var(--bg-primary)",
        }}
      >
        <p className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-center">
          {designPrinciple}
        </p>
      </div>

      {/* Key message */}
      <p className="text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
