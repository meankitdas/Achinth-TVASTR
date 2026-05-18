import { heroContent } from "@/content/homepage/hero";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { ForgeCore } from "@/three/ForgeCore";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Subtle telemetry radial backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(79,140,255,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />

      {/* Forge_Core — Three.js icosahedron centerpiece. Sits behind the
          headline so its silhouette frames (not occludes) the copy. */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[min(82vw,640px)] aspect-square">
          <ForgeCore />
        </div>
      </div>

      {/* Content layer — centered */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 text-center">
        <SectionHeader
          title={heroContent.title}
          subtitle={heroContent.subtitle}
        />
      </div>

      {/* Bottom gradient fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--bg-primary) 100%)",
        }}
      />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div
          className="w-px h-12"
          style={{
            background: "var(--text-muted)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}
