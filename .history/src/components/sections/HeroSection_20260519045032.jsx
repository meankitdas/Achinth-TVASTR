import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { heroContent } from "@/content/homepage/hero";
import { gsap, gsapContext, ScrollTrigger } from "../../animation/gsap";
import { easings } from "../../animation/motion";
import { useReducedMotionContext } from "../../animation/MotionConfig";
import { useMagnetic } from "../../hooks/useMagnetic";

/**
 * HeroSection
 *
 * Static Cohere editorial composition: a mono brand label, a monumental
 * display headline, a tagline, a near-black pill primary CTA paired with
 * an underlined secondary link, and a hairline capability strip that
 * anchors the page with product context. Four blueprint corner readouts
 * (mono coordinate-style annotations) frame the canvas at the viewport
 * corners — they are static decor, not animation.
 *
 * The previous Three.js Forge_Core icosahedron and its scroll-linked
 * parallax were removed in favor of this static frame. Per the user
 * directive, nothing rotates or translates behind the headline anymore.
 *
 * Entry choreography (design.md § Hero choreography, Req 8.1):
 *   The labeled GSAP entry timeline still reveals — in order — the
 *   wordmark, then the tagline, then the CTA, then the capability
 *   strip. Total duration ≈ 1.05 s, well inside the [0.8, 1.6] s
 *   window. Each element transitions from opacity 0 to 1 and reaches
 *   its final position by the timeline's end.
 *
 * Reduced-motion handling (Req 5.4, 8.5):
 *   The timeline is constructed `paused: true` and immediately
 *   fast-forwarded with `tl.progress(1).pause()` inside
 *   `useLayoutEffect`, so every element snaps to its final pose before
 *   the first animation frame paints.
 *
 * Input never blocks (Req 8.3, 17.1, 17.2):
 *   The wordmark, tagline, CTA, and capability strip are all native
 *   focusable / interactive elements (or decorative siblings) and are
 *   never `pointer-events: none` during the entry. The CTA is a real
 *   `<Link>` so click + Enter + Space activation remain responsive
 *   throughout the timeline.
 *
 * Cleanup (Req 8.4):
 *   `ctx.revert()` on unmount + an explicit ScrollTrigger sweep guard
 *   against any future ScrollTrigger added inside the hero. Today no
 *   ScrollTrigger is created here, but the cleanup remains so the
 *   contract is preserved if scroll-linked work is reintroduced.
 */
export function HeroSection() {
  const heroRef = useRef(null);
  const wordmarkRef = useRef(null);
  const taglineRef = useRef(null);
  const ctaRef = useRef(null);
  const stripRef = useRef(null);

  const { reducedMotion } = useReducedMotionContext();

  // Magnetic hover for the primary CTA (Req 11.1, 11.2). The hook
  // gracefully no-ops on coarse-pointer devices, narrow viewports, and
  // under reduced-motion (Reqs 11.7, 11.8, 11.9, 18.2).
  useMagnetic(ctaRef);

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
        .addLabel("strip", "+=0.05")
        .from(stripRef.current, { opacity: 0, y: 8, duration: 0.4 }, "strip");

      // Reduced-motion (Req 5.4, 8.5): snap to the final pose before the
      // first frame paints; do not play the entry animation.
      if (reducedMotion) {
        tl.progress(1).pause();
      }
    }, heroRef);

    return () => {
      // Primary cleanup: revert every tween + ScrollTrigger created inside
      // the gsapContext.
      ctx.revert();
      // Belt-and-suspenders (Req 8.4): explicitly kill any ScrollTrigger
      // whose trigger element is the hero (or is contained by it). This
      // preserves the contract if scroll-linked work is reintroduced.
      const heroEl = heroRef.current;
      if (heroEl) {
        ScrollTrigger.getAll()
          .filter(
            (t) =>
              t.trigger === heroEl || (t.trigger && heroEl.contains(t.trigger)),
          )
          .forEach((t) => t.kill());
      }
    };
  }, [reducedMotion]);

  // Hairline capability strip — three quiet product anchors that replace
  // the rotating Forge_Core as the visual centerpiece below the CTAs.
  const stripItems = [
    { label: "Perception", value: "Signal-first detection" },
    { label: "Process", value: "Reasoning across gates" },
    { label: "Memory", value: "Persistent industrial record" },
  ];

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background video — soft, looping, muted ambient layer. Honors
          Reduced_Motion (Req 5.5: no continuous ambient motion) by not
          rendering at all when the user has opted out. `preload="metadata"`
          keeps initial transfer cheap; `playsInline + muted + autoPlay`
          satisfies every browser's autoplay policy. The video is purely
          decorative (`aria-hidden`), and `pointer-events-none` keeps it
          from intercepting clicks. */}
      {!reducedMotion && (
        <video
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src="/intro.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          style={{ opacity: 0.45 }}
        />
      )}

      {/* Layered washes. The first is a top-down luminance gradient that
          keeps the navbar zone clearly readable against the video, fades
          gently through the headline area, and recedes near the bottom
          so the dark system rail (rendered last) gets a clean handoff.
          The second is a soft green tint anchoring our secondary brand
          color across the whole canvas. */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.62) 18%, rgba(255,255,255,0.40) 55%, rgba(255,255,255,0.20) 80%, rgba(255,255,255,0.0) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 50% 38%, rgba(0,60,51,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Hairline grid pattern — static decor inherited from the design system. */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-25" />

      {/* Right-edge coral spine — a single confident editorial mark that
          gives the warm brand color its own piece of real estate without
          sprinkling coral details across the green system. Think of it
          as a publisher's running spine: a short horizontal coral tick
          at top, a thin vertical coral hairline running down, a rotated
          mono label set against the line, and a closing tick at the
          bottom that lands right above the green rail. */}
      <div
        className="hidden md:flex absolute top-24 bottom-32 right-6 lg:right-10 z-10 flex-col items-center pointer-events-none select-none"
        aria-hidden="true"
      >
        {/* Top tick */}
        <span
          className="block w-3 h-px"
          style={{ background: "var(--signal-glow)" }}
        />
        {/* Vertical hairline */}
        <span
          className="block w-px flex-1 my-3"
          style={{
            background:
              "linear-gradient(to bottom, var(--signal-glow) 0%, var(--signal-glow) 60%, rgba(255,119,89,0.0) 100%)",
          }}
        />
        {/* Rotated spine label — sits beside the line in the middle */}
        <span
          className="absolute top-1/2 -translate-y-1/2 right-3 origin-right font-mono text-[10px] tracking-[0.5em] uppercase whitespace-nowrap"
          style={{
            color: "var(--signal-glow)",
            transform: "rotate(-90deg) translateX(50%)",
          }}
        >
          Industrial · Intelligence · MMXXVI
        </span>
        {/* Bottom tick */}
        <span
          className="block w-3 h-px mt-3"
          style={{ background: "var(--signal-glow)" }}
        />
      </div>

      {/* Content layer — centered */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 lg:px-16 text-center">
        {/* Brand pill — small outlined green capsule with a live dot.
            Sits on its own surface so it stays legible on any backdrop. */}
        <span
          className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase mb-8"
          style={{
            background: "rgba(255,255,255,0.85)",
            border: "1px solid var(--process-primary)",
            color: "var(--process-primary)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            {!reducedMotion && (
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping"
                style={{ background: "var(--process-primary)", opacity: 0.6 }}
              />
            )}
            <span
              className="relative inline-flex h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--process-primary)" }}
            />
          </span>
          <span>Tvastr · Manufacturing Intelligence</span>
        </span>
        <div className="mb-6">
          <h1
            ref={wordmarkRef}
            className="text-5xl md:text-7xl lg:text-[88px] font-medium text-txt-primary leading-[1.02] tracking-[-0.02em] mb-6"
          >
            {heroContent.title}
          </h1>
          <p
            ref={taglineRef}
            className="text-base md:text-lg text-txt-secondary leading-relaxed max-w-2xl mx-auto"
          >
            {heroContent.subtitle}
          </p>
        </div>

        {/* Primary CTA — anchors the entry timeline's `cta` label and
            remains fully clickable / keyboard-activatable throughout the
            entry animation (Req 8.3, 17.1). Cohere-style: near-black pill
            + underlined secondary text link companion. */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <Link
            ref={ctaRef}
            to="/portal"
            className="inline-flex items-center gap-2 px-7 py-3 text-sm font-medium tracking-wide rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
            style={{
              background: "var(--process-primary)",
              color: "var(--bg-primary)",
            }}
          >
            <span>Request a demo</span>
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
          <Link
            to="/technology"
            className="inline-flex items-center gap-2 text-sm text-process-primary border-b border-process-primary/40 pb-0.5 hover:border-process-primary transition-colors focus:outline-none focus-visible:border-process-primary focus-visible:text-process-primary"
          >
            Explore the platform
          </Link>
        </div>

        {/* Scroll indicator — a thin green hairline that draws itself
            downward on a slow loop, like a pen tracing a measurement.
            Replaces the muted mono "Scroll to explore" line that was
            illegible against the video. */}
        <div
          ref={stripRef}
          className="mt-16 md:mt-20 flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <span
            className="block font-mono text-[10px] tracking-[0.32em] uppercase"
            style={{ color: "var(--process-primary)" }}
          >
            Scroll
          </span>
          <span
            className="relative block w-px h-14 overflow-hidden"
            style={{ background: "rgba(0,60,51,0.18)" }}
          >
            {!reducedMotion && (
              <span
                className="absolute top-0 left-0 w-full hero-trace-line"
                style={{ background: "var(--process-primary)" }}
              />
            )}
          </span>
        </div>
      </div>

      {/* Full-bleed system rail — three-column control-room telemetry
          band on deep enterprise green. Each capability gets its own
          column with a large mono index numeral, a label, and a value,
          separated by thin green-on-green vertical dividers. */}
      <div
        className="absolute left-0 right-0 bottom-0 z-10 pointer-events-none"
        style={{ background: "var(--process-primary)" }}
      >
        {/* Three-column capability grid — each column shows a large mono
            index numeral, an uppercase label, and a sentence-case value.
            Vertical hairline dividers separate the columns. */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-3 text-white">
            {stripItems.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 md:gap-5 py-4 md:py-5 ${
                  i > 0 ? "pl-5 md:pl-8" : ""
                } ${i < stripItems.length - 1 ? "pr-5 md:pr-8" : ""}`}
                style={
                  i < stripItems.length - 1
                    ? { borderRight: "1px solid rgba(255,255,255,0.12)" }
                    : undefined
                }
              >
                <span
                  className="font-mono text-[18px] md:text-[22px] leading-none tabular-nums"
                  style={{ color: "var(--signal-glow)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-white leading-tight">
                    {item.label}
                  </p>
                  <p className="text-[12px] md:text-[13px] text-white/70 leading-snug mt-1.5 truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* The full-bleed green system rail above provides the section's
          handoff to the next section, so no bottom-fade gradient is
          needed here. */}
    </section>
  );
}
