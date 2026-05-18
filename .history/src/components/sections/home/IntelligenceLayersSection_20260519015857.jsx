import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { intelligenceLayersContent } from "@/content/homepage/intelligence-layers";

export function IntelligenceLayersSection() {
  const { title, subtitle, columns, keyMessage } = intelligenceLayersContent;

  return (
    <SectionShell id="intelligence-layers">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Architecture" />

      {/* Three-column intelligence layer diagram */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {columns.map((col) => (
          <div
            key={col.id}
            className="relative p-6 rounded-xl border backdrop-blur-sm"
            style={{
              borderColor: "var(--border-default)",
              background: "rgba(10,10,11,0.6)",
            }}
          >
            {/* Layer indicator bar */}
            <div
              className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(79,140,255,0.6) 0%, transparent 100%)",
              }}
            />

            <h3 className="text-lg font-bold text-txt-primary mt-3 mb-2">
              {col.name}
            </h3>
            <p className="text-sm text-txt-secondary leading-relaxed mb-4">
              {col.description}
            </p>

            {/* Capability list */}
            <ul className="space-y-2">
              {col.capabilities.map((cap, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-txt-secondary"
                >
                  <span className="text-telemetry-primary/70 mt-0.5 flex-shrink-0">
                    ▪
                  </span>
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Connecting message */}
      <p className="mt-10 text-center text-base text-txt-muted leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  );
}
