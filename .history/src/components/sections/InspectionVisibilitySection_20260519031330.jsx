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
        />

        <p className="text-lg text-txt-secondary leading-relaxed mb-12 text-center max-w-3xl mx-auto">
          {inspectionVisibilityContent.body}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {inspectionVisibilityContent.screenshots.map((screenshot) => (
            <div
              key={screenshot.id}
              data-reveal-item
              className="rounded-lg overflow-hidden transition-all duration-300"
              style={{
                background: "rgba(17,17,19,0.6)",
                border: "1px solid rgba(168,168,180,0.08)",
              }}
            >
              <div className="aspect-video bg-charcoal-900 flex items-center justify-center">
                <img
                  src={screenshot.imagePath}
                  alt={screenshot.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold mb-2 text-white">
                  {screenshot.title}
                </h3>
                <p className="text-sm text-txt-secondary leading-relaxed">
                  {screenshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-txt-secondary mt-12 max-w-2xl mx-auto">
          {inspectionVisibilityContent.keyMessage}
        </p>
      </div>
    </SectionShell>
  );
}
