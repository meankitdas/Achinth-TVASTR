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

      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Concepts — visual flow */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {concepts.map((concept, i) => (
          <div
            key={i}
            data-reveal-item
            className="p-5 rounded-lg border border-border-subtle bg-bg-primary/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-forge/70" />
              <h4 className="text-sm font-bold text-txt-primary">
                {concept.name}
              </h4>
            </div>
            <p className="text-xs text-txt-secondary leading-relaxed">
              {concept.description}
            </p>
          </div>
        ))}
      </div>

      {/* Decision tiers — horizontal gauge visualization */}
      <div className="p-6 rounded-xl border border-border-default bg-bg-primary/60 mb-8">
        <h3 className="text-base font-bold text-txt-primary mb-4">
          Decision Tiers
        </h3>

        {/* Visual gauge */}
        <div className="relative h-8 rounded-full overflow-hidden mb-6 flex">
          <div className="flex-1 bg-green-900/40 flex items-center justify-center border-r border-border-default">
            <span className="text-[11px] font-bold text-green-400">ACCEPT</span>
          </div>
          <div className="flex-1 bg-yellow-900/30 flex items-center justify-center border-r border-border-default">
            <span className="text-[11px] font-bold text-yellow-400">
              REVIEW
            </span>
          </div>
          <div className="flex-1 bg-red-900/30 flex items-center justify-center">
            <span className="text-[11px] font-bold text-red-400">REJECT</span>
          </div>
        </div>

        <div className="space-y-3">
          {decisionTiers.map((tier, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xs font-mono text-txt-primary w-20 flex-shrink-0">
                {tier.threshold}
              </span>
              <span className="text-xs text-txt-secondary">
                {tier.description}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Design principle */}
      <div className="p-4 rounded-lg border border-telemetry-primary/20 bg-telemetry-primary/5 text-center mb-8">
        <p className="text-sm text-txt-secondary leading-relaxed">
          {designPrinciple}
        </p>
      </div>

      {/* Key message */}
      <p className="mt-4 text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
