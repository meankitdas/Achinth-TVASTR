import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { DiagramFlow } from "@/components/primitives/DiagramFlow";
import { cognitionRuntimeContent } from "@/content/technology/cognition-runtime";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function CognitionRuntimeSection() {
  const {
    title,
    subtitle,
    body,
    runtimeComponents,
    executionFlow,
    keyMessage,
  } = cognitionRuntimeContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="cognition-runtime">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Runtime Layer"
      />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Runtime components — stacked stone cards */}
      <div className="space-y-4 mb-16">
        {runtimeComponents.map((comp, i) => (
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
                  {comp.name}
                </h4>
                <p className="text-sm text-txt-secondary leading-relaxed mt-2">
                  {comp.description}
                </p>
              </div>
            </div>

            {/* Render characteristics, states, logs, or interfaces */}
            {comp.characteristics && (
              <div className="flex flex-wrap gap-2 ml-10 md:ml-12">
                {comp.characteristics.map((item, j) => (
                  <span
                    key={j}
                    className="inline-block px-2.5 py-1 text-[11px] text-txt-secondary bg-bg-primary border border-border-subtle rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
            {comp.states && (
              <div className="space-y-2 ml-10 md:ml-12">
                {comp.states.map((s, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm">
                    <span
                      className="font-mono text-[11px] tracking-[0.18em] uppercase"
                      style={{
                        color:
                          s.state === "OK"
                            ? "var(--process-primary)"
                            : s.state === "DEGRADED"
                              ? "var(--signal-warning)"
                              : "var(--signal-danger)",
                      }}
                    >
                      {s.state}
                    </span>
                    <span className="text-txt-secondary">{s.description}</span>
                  </div>
                ))}
              </div>
            )}
            {comp.logs && (
              <div className="space-y-1.5 ml-10 md:ml-12">
                {comp.logs.map((log, j) => (
                  <p
                    key={j}
                    className="text-[12px] text-txt-secondary font-mono"
                  >
                    {log}
                  </p>
                ))}
              </div>
            )}
            {comp.interfaces && (
              <div className="flex flex-wrap gap-2 ml-10 md:ml-12">
                {comp.interfaces.map((iface, j) => (
                  <span
                    key={j}
                    className="inline-block px-2.5 py-1 text-[11px] text-txt-secondary bg-bg-primary border border-border-subtle rounded"
                  >
                    {iface}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Execution flow diagram */}
      <div className="mb-12">
        <h3 className="text-2xl font-medium text-txt-primary mb-6 text-center">
          Execution Pipeline
        </h3>
        <DiagramFlow steps={executionFlow} description="" />
      </div>

      {/* Key message */}
      <p className="text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
