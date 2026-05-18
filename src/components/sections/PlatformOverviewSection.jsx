import { useRef } from "react";
import { Link } from "react-router-dom";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { platformOverviewContent } from "@/content/homepage/platform-overview";
import { useSectionReveal } from "../../hooks/useSectionReveal";

export function PlatformOverviewSection() {
  const { id, title, subtitle, body, systems, keyMessage } =
    platformOverviewContent;
  const sectionRef = useRef(null);
  useSectionReveal(sectionRef);

  return (
    <SectionShell ref={sectionRef} id={id}>
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Platform" />

      <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mt-6 mb-16">
        {body}
      </p>

      <div className="grid lg:grid-cols-2 gap-8 mb-16">
        {systems.map((system, idx) => (
          <div
            key={system.id}
            data-reveal-item
            className="flex flex-col p-8 md:p-10 rounded-lg"
            style={{ background: "var(--bg-panel)" }}
          >
            <p className="font-mono text-[11px] tracking-[0.24em] uppercase mb-4 inline-flex items-center gap-2">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--process-primary)" }}
                aria-hidden="true"
              />
              <span style={{ color: "var(--process-primary)" }}>
                System {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="text-txt-muted">— {system.tagline}</span>
            </p>
            <h3 className="text-3xl md:text-4xl font-medium text-txt-primary leading-[1.1] tracking-[-0.01em] mb-6">
              {system.name}
            </h3>

            <div className="border-t border-border-default mb-6" />

            <p className="text-base text-txt-secondary leading-relaxed mb-8 flex-1">
              {system.description}
            </p>

            <Link
              to={system.route}
              className="inline-flex items-center gap-2 self-start px-5 py-2.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
              style={{
                background: "var(--process-primary)",
                color: "var(--bg-primary)",
              }}
            >
              <span>Explore {system.id.toUpperCase()}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="miter"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ))}
      </div>

      <p className="text-center text-base text-txt-secondary leading-relaxed max-w-3xl mx-auto">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
