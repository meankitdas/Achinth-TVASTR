import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { DiagramFlow } from "@/components/primitives/DiagramFlow";
import { perceptionEngineContent } from "@/content/technology/perception-engine";
import { useSectionReveal } from "../../../hooks/useSectionReveal";

export function PerceptionEngineSection() {
  const { title, subtitle, body, stages, designPrinciple, keyMessage } =
    perceptionEngineContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id="perception-engine">
      <SectionHeader
        title={title}
        subtitle={subtitle}
        eyebrow="Perception Layer"
      />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      {/* Pipeline flow diagram */}
      <DiagramFlow
        steps={stages.map((s) => s.name)}
        description="Each stage produces structured outputs that flow into the next. The final output is a feature vector — not a classification decision."
      />

      {/* Stage detail cards — hairline grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border-subtle border border-border-subtle mt-12">
        {stages.map((stage, i) => (
          <div
            key={i}
            data-reveal-item
            className={`p-7 bg-bg-primary flex flex-col ${
              i === stages.length - 1 ? "md:col-span-2 lg:col-span-2" : ""
            }`}
          >
            <div
              className={`flex flex-col flex-1 ${i === stages.length - 1 ? "max-w-[380px]" : ""}`}
            >
              <p
                className="font-mono text-[11px] tracking-[0.24em] uppercase mb-3"
                style={{ color: "var(--signal-glow)" }}
              >
                Stage {String(i + 1).padStart(2, "0")}
              </p>
              <h4 className="text-lg font-medium text-txt-primary leading-tight mb-3">
                {stage.name}
              </h4>
              <p className="text-sm text-txt-secondary leading-relaxed mb-4 flex-1">
                {stage.description}
              </p>
              <div className="px-3 py-2 bg-bg-panel border border-border-subtle rounded text-[12px] text-txt-secondary mt-auto">
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-txt-muted mr-2">
                  Output:
                </span>
                {stage.output}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Design principle — deep green band */}
      <div
        className="mt-16 p-8 md:p-10 rounded-2xl text-center"
        style={{
          background: "var(--process-primary)",
          color: "var(--bg-primary)",
        }}
      >
        <p className="text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
          {designPrinciple}
        </p>
      </div>

      {/* Key message */}
      <p className="mt-12 text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
