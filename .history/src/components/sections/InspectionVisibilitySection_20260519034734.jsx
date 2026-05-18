import { useRef } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { inspectionVisibilityContent } from "@/content/homepage/inspection-visibility";
import { useSectionReveal } from "../../hooks/useSectionReveal";

export function InspectionVisibilitySection() {
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id={inspectionVisibilityContent.id}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title={inspectionVisibilityContent.title}
          subtitle={inspectionVisibilityContent.subtitle}
          eyebrow="Operational Surfaces"
        />

        <p className="text-base md:text-lg text-txt-secondary leading-relaxed mb-16 max-w-3xl mt-6">
          {inspectionVisibilityContent.body}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {inspectionVisibilityContent.screenshots.map((screenshot, idx) => (
            <div
              key={screenshot.id}
              data-reveal-item
              className="rounded-lg overflow-hidden bg-bg-primary border border-border-subtle"
            >
              <div
                className="aspect-video flex items-center justify-center overflow-hidden"
                style={{ background: "var(--bg-panel)" }}
              >
                <img
                  src={screenshot.imagePath}
                  alt={screenshot.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-7">
                <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-2">
                  Surface {String(idx + 1).padStart(2, "0")}
                </p>
                <h3 className="text-xl font-medium mb-2 text-txt-primary leading-tight">
                  {screenshot.title}
                </h3>
                <p className="text-sm text-txt-secondary leading-relaxed">
                  {screenshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-base text-txt-secondary mt-16 max-w-3xl mx-auto leading-relaxed">
          {inspectionVisibilityContent.keyMessage}
        </p>
      </div>
    </SectionShell>
  );
}
