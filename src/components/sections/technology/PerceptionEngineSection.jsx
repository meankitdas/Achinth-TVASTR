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

      <p className="text-sm text-txt-secondary leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Pipeline flow diagram */}
      <DiagramFlow
        steps={stages.map((s) => s.name)}
        description="Each stage produces structured outputs that flow into the next. The final output is a feature vector — not a classification decision."
      />

      {/* Stage detail cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {stages.map((stage, i) => (
          <div
            key={i}
            data-reveal-item
            className="p-5 rounded-lg border border-border-subtle bg-bg-primary/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-telemetry-primary/10 flex items-center justify-center">
                <span className="text-[10px] font-bold text-telemetry-primary">
                  {i + 1}
                </span>
              </div>
              <h4 className="text-sm font-bold text-txt-primary">
                {stage.name}
              </h4>
            </div>
            <p className="text-xs text-txt-secondary leading-relaxed mb-3">
              {stage.description}
            </p>
            <div className="px-3 py-1.5 bg-charcoal-900/80 border border-border-subtle rounded text-[11px] text-txt-secondary">
              Output: {stage.output}
            </div>
          </div>
        ))}
      </div>

      {/* Design principle */}
      <div className="mt-10 p-4 rounded-lg border border-telemetry-primary/20 bg-telemetry-primary/5 text-center">
        <p className="text-sm text-txt-secondary leading-relaxed">
          {designPrinciple}
        </p>
      </div>

      {/* Key message */}
      <p className="mt-8 text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
