import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { cognitionRuntimeContent } from "@/content/technology/cognition-runtime";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

const STEP_ICONS = [
  // 01 Request received
  <path
    key="p"
    d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
  />,
  // 02 Quality validation
  <>
    <path key="p1" d="M9 11l3 3L22 4" />
    <path key="p2" d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
  </>,
  // 03 Object detection
  <>
    <rect key="r" x="3" y="3" width="18" height="18" rx="2" />
    <circle key="c" cx="8.5" cy="8.5" r="1.5" />
    <path key="p" d="M21 15l-5-5L5 21" />
  </>,
  // 04 Signal feature extraction
  <path key="p1" d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  // 05 Multi-signal classification
  <>
    <path key="p1" d="M18 20V10" />
    <path key="p2" d="M12 20V4" />
    <path key="p3" d="M6 20v-6" />
  </>,
  // 06 Energy-based reasoning
  <>
    <circle key="c" cx="12" cy="12" r="10" />
    <path key="p1" d="M12 6v6l4 2" />
  </>,
  // 07 Decision generation
  <>
    <path key="p1" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle key="c" cx="9" cy="7" r="4" />
    <path key="p2" d="M22 21v-2a4 4 0 00-3-3.87" />
  </>,
  // 08 Memory persistence
  <>
    <path key="p1" d="M12 2L2 7l10 5 10-5-10-5z" />
    <path key="p2" d="M2 17l10 5 10-5" />
    <path key="p3" d="M2 12l10 5 10-5" />
  </>,
  // 09 Report generation
  <>
    <path key="p1" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path key="p2" d="M14 2v6h6" />
    <path key="p3" d="M16 13H8" />
    <path key="p4" d="M16 17H8" />
  </>,
  // 10 Response returned
  <>
    <path key="p1" d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <path key="p2" d="M22 4L12 14.01l-3-3" />
  </>,
];

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
      <div className="space-y-4 mb-20">
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

      {/* Execution Pipeline — 5-column grid of icon cards with hover lift */}
      <div className="mb-12">
        <div className="text-center mb-12">
          <p
            className="font-mono text-[11px] md:text-[12px] tracking-[0.28em] uppercase mb-3"
            style={{ color: "var(--signal-glow)" }}
          >
            Execution Pipeline
          </p>
          <h3 className="text-2xl md:text-3xl font-medium text-txt-primary leading-tight max-w-2xl mx-auto">
            Ten deterministic stages, sub-200 ms total
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {executionFlow.map((step, i) => (
            <div
              key={i}
              data-reveal-item
              className="group relative p-5 md:p-6 rounded-xl border bg-bg-primary transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: "var(--border-subtle)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--process-primary)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px -16px rgba(0,60,51,0.3), 0 4px 12px -8px rgba(0,60,51,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-subtle)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Step number — top-right corner */}
              <span
                className="absolute top-3 right-4 font-mono text-[10px] tracking-[0.18em] tabular-nums"
                style={{ color: "var(--signal-glow)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon node */}
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105"
                style={{
                  background: "rgba(0,60,51,0.06)",
                  border: "1px solid rgba(0,60,51,0.18)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--process-primary)" }}
                  aria-hidden="true"
                >
                  {STEP_ICONS[i]}
                </svg>
              </div>

              {/* Step text */}
              <p className="text-[13px] text-txt-primary leading-snug font-medium">
                {step}
              </p>

              {/* Bottom green hairline accent — appears on hover */}
              <span
                className="absolute left-5 right-5 bottom-3 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "var(--process-primary)" }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Footer summary chip — total latency */}
        <div className="mt-10 flex justify-center">
          <span
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-mono text-[11px] tracking-[0.24em] uppercase"
            style={{
              background: "rgba(0,60,51,0.06)",
              color: "var(--process-primary)",
              border: "1px solid rgba(0,60,51,0.18)",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: "var(--process-primary)" }}
              aria-hidden="true"
            />
            <span>Total Latency · Sub-200 ms</span>
          </span>
        </div>
      </div>

      {/* Key message */}
      <p className="text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
