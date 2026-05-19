import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
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

      {/* Execution flow — horizontal scrollable pipeline with icons */}
      <div className="mb-12">
        <h3 className="text-2xl font-medium text-txt-primary mb-10 text-center">
          Execution Pipeline
        </h3>

        <div className="overflow-x-auto pb-4 -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16">
          <div className="relative flex items-start min-w-max">
            {/* Horizontal connecting line */}
            <div
              className="absolute top-5 md:top-6 left-5 right-5 h-px"
              style={{ background: "var(--process-primary)", opacity: 0.25 }}
              aria-hidden="true"
            />

            {executionFlow.map((step, i) => {
              const icons = [
                <path
                  key="p"
                  d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                />,
                <>
                  <path key="p1" d="M9 11l3 3L22 4" />
                  <path
                    key="p2"
                    d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                  />
                </>,
                <>
                  <rect key="r" x="3" y="3" width="18" height="18" rx="2" />
                  <circle key="c" cx="8.5" cy="8.5" r="1.5" />
                  <path key="p" d="M21 15l-5-5L5 21" />
                </>,
                <path key="p1" d="M22 12h-4l-3 9L9 3l-3 9H2" />,
                <>
                  <path key="p1" d="M18 20V10" />
                  <path key="p2" d="M12 20V4" />
                  <path key="p3" d="M6 20v-6" />
                </>,
                <>
                  <circle key="c" cx="12" cy="12" r="10" />
                  <path key="p1" d="M12 6v6l4 2" />
                </>,
                <>
                  <path key="p1" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                  <circle key="c" cx="9" cy="7" r="4" />
                  <path key="p2" d="M22 21v-2a4 4 0 00-3-3.87" />
                </>,
                <>
                  <path key="p1" d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path key="p2" d="M2 17l10 5 10-5" />
                  <path key="p3" d="M2 12l10 5 10-5" />
                </>,
                <>
                  <path
                    key="p1"
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                  />
                  <path key="p2" d="M14 2v6h6" />
                  <path key="p3" d="M16 13H8" />
                  <path key="p4" d="M16 17H8" />
                </>,
                <>
                  <path key="p1" d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path key="p2" d="M22 4L12 14.01l-3-3" />
                </>,
              ];

              return (
                <div
                  key={i}
                  data-reveal-item
                  className="relative flex flex-col items-center text-center w-28 md:w-32 flex-shrink-0"
                >
                  {/* Icon node */}
                  <div
                    className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center mb-3"
                    style={{
                      background: "var(--bg-panel)",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: "var(--process-primary)" }}
                      aria-hidden="true"
                    >
                      {icons[i]}
                    </svg>
                  </div>

                  {/* Step label */}
                  <p
                    className="font-mono text-[9px] md:text-[10px] tracking-[0.28em] uppercase mb-1.5"
                    style={{ color: "var(--signal-glow)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-[11px] md:text-[12px] text-txt-secondary leading-tight px-1">
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key message */}
      <p className="text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
