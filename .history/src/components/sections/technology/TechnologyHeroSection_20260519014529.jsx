import { SectionShell } from "../../primitives/SectionShell";
import { technologyHeroContent } from "@/content/technology/index";
import { colors } from "../../../design/colors";

export function TechnologyHeroSection() {
  const { title, subtitle, body } = technologyHeroContent;

  return (
    <SectionShell
      id="technology-hero"
      className="min-h-[60vh] flex items-center justify-center"
      style={{
        background: `linear-gradient(to bottom, ${colors.background.primary} 0%, ${colors.background.secondary} 100%)`,
      }}
    >
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <p className="text-telemetry-primary text-xs tracking-[0.2em] uppercase font-semibold">
          Technology
        </p>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-metallic-50">
          {title}
        </h1>

        <p className="text-xl md:text-2xl text-txt-secondary font-light">
          {subtitle}
        </p>

        <p className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-3xl mx-auto">
          {body}
        </p>
      </div>
    </SectionShell>
  );
}
