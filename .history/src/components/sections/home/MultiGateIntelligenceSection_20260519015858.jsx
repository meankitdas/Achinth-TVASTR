import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { multiGateIntelligenceContent } from "@/content/homepage/multi-gate-intelligence";

export function MultiGateIntelligenceSection() {
  const { title, subtitle, body, stages, keyMessage } =
    multiGateIntelligenceContent;

  return (
    <SectionShell id="multi-gate-intelligence">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Production Flow"
      />

      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Stage flow — horizontal timeline on desktop, vertical on mobile */}
      <div className="relative">
        {/* Connecting line (desktop only) */}
        <div
          className="hidden lg:block absolute top-8 left-0 right-0 h-[1px]"
          style={{
            background:
              "linear-gradient(90deg, var(--border-subtle) 0%, rgba(79,140,255,0.25) 50%, var(--border-subtle) 100%)",
          }}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {stages.map((stage, i) => (
            <div
              key={i}
              className="relative flex flex-col items-center text-center"
            >
              {/* Stage number node */}
              <div
                className="relative z-10 w-10 h-10 rounded-full border border-telemetry-primary/50 flex items-center justify-center mb-4"
                style={{ background: "var(--bg-primary)" }}
              >
                <span className="text-xs font-bold text-telemetry-primary">
                  {i + 1}
                </span>
              </div>

              <h4 className="text-sm font-bold text-txt-primary mb-1">
                {stage.name}
              </h4>
              <p className="text-xs text-txt-secondary leading-relaxed mb-3">
                {stage.description}
              </p>

              {/* Intelligence capabilities */}
              <ul className="space-y-1 text-left w-full">
                {stage.intelligence.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-1.5 text-xs text-txt-secondary"
                  >
                    <span className="text-telemetry-primary/60 mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Key message */}
      <p className="mt-12 text-center text-base text-txt-muted leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
