import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { signalReasoningContent } from "@/content/technology/signal-reasoning";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function SignalReasoningSection() {
  const {
    title,
    subtitle,
    body,
    signalChannels,
    fusionArchitecture,
    classificationRequirement,
    explainability,
    keyMessage,
  } = signalReasoningContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="signal-reasoning">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Reasoning Layer"
      />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Signal channels — weight-annotated cards in hairline grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle border border-border-subtle mb-16">
        {signalChannels.map((ch, i) => (
          <div key={i} data-reveal-item className="p-7 bg-bg-primary">
            <div className="flex items-center justify-between mb-3">
              <p
                className="font-mono text-[11px] tracking-[0.24em] uppercase"
                style={{ color: "var(--signal-glow)" }}
              >
                Signal {String(i + 1).padStart(2, "0")}
              </p>
              <span
                className="font-mono text-[11px] tracking-[0.18em] px-2 py-0.5 rounded"
                style={{
                  background: "rgba(0,60,51,0.08)",
                  color: "var(--process-primary)",
                }}
              >
                {ch.weight}
              </span>
            </div>
            <h4 className="text-lg font-medium text-txt-primary leading-tight mb-2">
              {ch.name}
            </h4>
            <p className="text-sm text-txt-secondary leading-relaxed mb-3">
              {ch.description}
            </p>
            <p className="text-[12px] text-txt-muted italic">
              {ch.interpretation}
            </p>
          </div>
        ))}
      </div>

      {/* Fusion architecture — stone card */}
      <div
        className="p-8 md:p-10 rounded-lg mb-12"
        style={{ background: "var(--bg-panel)" }}
      >
        <h3 className="text-2xl font-medium text-txt-primary mb-2">
          {fusionArchitecture.title}
        </h3>
        <p className="text-sm text-txt-secondary mb-6">
          {fusionArchitecture.description}
        </p>

        <div className="space-y-3">
          {fusionArchitecture.weights.map((w, i) => (
            <div key={i} className="flex items-center gap-4">
              <span
                className="font-mono text-[13px] w-12 text-right tabular-nums"
                style={{ color: "var(--process-primary)" }}
              >
                {w.weight}
              </span>
              <div className="flex-1 h-px bg-border-default" />
              <span className="text-sm text-txt-primary font-medium">
                {w.source}
              </span>
              <span className="text-[12px] text-txt-muted hidden sm:inline">
                — {w.role}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-txt-secondary italic">
          {fusionArchitecture.principle}
        </p>
      </div>

      {/* Classification requirement — deep green band */}
      <div
        className="p-8 md:p-10 rounded-2xl mb-12"
        style={{
          background: "var(--process-primary)",
          color: "var(--bg-primary)",
        }}
      >
        <p className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto text-center">
          {classificationRequirement}
        </p>
      </div>

      {/* Explainability */}
      <div className="grid sm:grid-cols-2 gap-4">
        {explainability.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
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
            <span className="text-sm text-txt-secondary">{item}</span>
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
