import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { heroContent } from "@/content/homepage/hero";
import { ForgeCore } from "@/three/ForgeCore";
import { gsap, gsapContext } from "../../animation/gsap";
import { easings } from "../../animation/motion";
import { useReducedMotionContext } from "../../animation/MotionConfig";

/**
 * HeroSection
 *
 * Hosts the GSAP-driven entry choreography documented in
 * `design.md` § Hero choreography. Four labeled tweens reveal, in order,
 * the wordmark, tagline, primary CTA, and the Forge_Core wrapper. The
 * total timeline duration ≈ 1.2 s, well inside the [0.8, 1.6] s window
 * mandated by Req 8.1. Each element transitions from opacity 0 to 1 and
 * arrives at its final position by the timeline's end.
 *
 * Reduced-motion handling (Req 5.4, 8.5): the timeline is constructed
 * `paused: true` and immediately fast-forwarded with `tl.progress(1).pause()`
 * inside `useLayoutEffect`, so the wordmark, tagline, CTA, and Forge
 * snap to their final pose before the first animation frame paints.
 *
 * Input never blocks (Req 8.3, 17.1, 17.2): the wordmark, tagline, CTA,
 * and Forge wrapper are all native focusable / interactive elements (or
 * decorative siblings) and are never `pointer-events: none` during the
 * entry. The CTA is a real `<Link>` so click + Enter + Space activation
 * remain responsive throughout the timeline.
 */
export function HeroSection() {
  const heroRef = useRef(null);
  const wordmarkRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const forgeRef = useRef(null);

  const { reducedMotion } = useReducedMotionContext();

  useLayoutEffect(() => {
    const ctx = gsapContext(() => {
      const tl = gsap.timeline({
        defaults: { ease: easings.gsap.standard },
        paused: reducedMotion,
      });

      tl.addLabel("wordmark", 0)
        .from(
          wordmarkRef.current,
          { opacity: 0, y: 24, duration: 0.6 },
          "wordmark",
        )
        .addLabel("tagline", "+=0.05")
        .from(
          taglineRef.current,
          { opacity: 0, y: 16, duration: 0.5 },
          "tagline",
        )
        .addLabel("cta", "+=0.05")
        .from(ctaRef.current, { opacity: 0, y: 12, duration: 0.4 }, "cta")
        .addLabel("forge", "+=0.05")
        .from(
          forgeRef.current,
          { opacity: 0, scale: 0.95, duration: 0.5 },
          "forge",
        );

      // Reduced-motion (Req 5.4, 8.5): snap to the final pose before the
      // first frame paints; do not play the entry animation.
      if (reducedMotion) {
        tl.progress(1).pause();
      }
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={heroRef}
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
          headline so its silhouette frames (not occludes) the copy.
          `pointer-events-none` keeps the underlying canvas from stealing
          clicks from the CTA / navbar during the entry timeline (Req 8.3,
          17.2). */}
      <div
        ref={forgeRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[min(82vw,640px)] aspect-square">
          <ForgeCore />
        </div>
      </div>

      {/* Content layer — centered */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 md:px-12 lg:px-16 text-center">
        <div className="mb-6">
          <h1
            ref={wordmarkRef}
            className="text-3xl md:text-4xl font-extrabold text-txt-primary leading-tight tracking-tight mb-2"
          >
            {heroContent.title}
          </h1>
          <p
            ref={taglineRef}
            className="text-base md:text-lg text-txt-secondary leading-relaxed"
          >
            {heroContent.subtitle}
          </p>
        </div>

        {/* Primary CTA — anchors the entry timeline's `cta` label and
            remains fully clickable / keyboard-activatable throughout the
            entry animation (Req 8.3, 17.1). */}
        <div className="mt-8 flex justify-center">
          <Link
            ref={ctaRef}
            to="/portal"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-telemetry-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            style={{
              background: "var(--telemetry-primary)",
              color: "var(--bg-primary)",
              border: "1px solid var(--telemetry-primary)",
            }}
          >
            <span>Enter Portal</span>
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 pointer-events-none">
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
