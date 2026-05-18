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

      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Runtime components */}
      <div className="space-y-4 mb-12">
        {runtimeComponents.map((comp, i) => (
          <div
            key={i}
            data-reveal-item
            className="p-5 rounded-lg border border-border-subtle bg-bg-primary/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-md bg-telemetry-primary/10 border border-telemetry-primary/30 flex items-center justify-center">
                <span className="text-xs font-bold text-telemetry-primary">
                  {i + 1}
                </span>
              </div>
              <h4 className="text-base font-bold text-txt-primary">
                {comp.name}
              </h4>
            </div>
            <p className="text-xs text-txt-secondary leading-relaxed mb-3">
              {comp.description}
            </p>

            {/* Render characteristics, states, logs, or interfaces depending on component */}
            {comp.characteristics && (
              <div className="flex flex-wrap gap-2">
                {comp.characteristics.map((item, j) => (
                  <span
                    key={j}
                    className="inline-block px-2 py-1 text-[11px] text-txt-secondary bg-charcoal-900/80 border border-border-subtle rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
            {comp.states && (
              <div className="space-y-1">
                {comp.states.map((s, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs">
                    <span
                      className={`font-mono font-bold ${
                        s.state === "OK"
                          ? "text-green-400"
                          : s.state === "DEGRADED"
                            ? "text-yellow-400"
                            : "text-red-400"
                      }`}
                    >
                      {s.state}
                    </span>
                    <span className="text-txt-secondary">{s.description}</span>
                  </div>
                ))}
              </div>
            )}
            {comp.logs && (
              <div className="space-y-1">
                {comp.logs.map((log, j) => (
                  <p
                    key={j}
                    className="text-[11px] text-txt-secondary font-mono"
                  >
                    {log}
                  </p>
                ))}
              </div>
            )}
            {comp.interfaces && (
              <div className="flex flex-wrap gap-2">
                {comp.interfaces.map((iface, j) => (
                  <span
                    key={j}
                    className="inline-block px-2 py-1 text-[11px] text-txt-secondary bg-charcoal-900/80 border border-border-subtle rounded"
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
      <div className="mb-8">
        <h3 className="text-base font-bold text-txt-primary mb-4 text-center">
          Execution Pipeline
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-2">
          {executionFlow.map((step, i) => (
            <div key={i} className="relative flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-bg-primary rounded border border-border-default text-center">
                <span className="text-[10px] text-telemetry-primary/60 block">
                  {i + 1}
                </span>
                <span className="text-[11px] text-txt-secondary leading-tight">
                  {step}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key message */}
      <p className="mt-8 text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
