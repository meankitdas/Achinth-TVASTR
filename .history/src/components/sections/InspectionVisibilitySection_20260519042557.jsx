import { useLayoutEffect, useRef, useState } from "react";

import { SectionHeader } from "@/components/primitives/SectionHeader";
import { inspectionVisibilityContent } from "@/content/homepage/inspection-visibility";
import { useSectionReveal } from "../../hooks/useSectionReveal";
import { gsap, gsapContext, ScrollTrigger } from "../../animation/gsap";
import { useReducedMotionContext } from "../../animation/MotionConfig";

/**
 * InspectionVisibilitySection
 *
 * Pinned scroll-scrubbed surface viewer. Defeats habituation by
 * promoting each operational surface into a full discrete event:
 *
 *   - The whole inner stage pins for `surfaces × ~viewport` of scroll.
 *   - The active row in the index (left) blows up to display type while
 *     the rest collapse to muted mono labels — a strong size delta.
 *   - The screenshot (right) cross-fades + nudges scale, never sliding,
 *     so the eye lands on a fresh image rather than tracking a card.
 *   - A deep-green progress meter runs across the top, filling with
 *     scroll progress so the user always knows where they are.
 *
 * NOTE: This section deliberately does NOT use `SectionShell`. SectionShell
 * applies `overflow-hidden`, which breaks ScrollTrigger pinning. We render
 * our own `<section>` and mirror the shell's framing manually.
 *
 * Reduced-motion (Req 5.1, 5.2): pinning and scrubbing are skipped; the
 * section falls back to a clean stacked grid that scrolls naturally.
 */
export function InspectionVisibilitySection() {
  const sectionRef = useRef(null);
  const pinTrackRef = useRef(null);
  const stageRef = useRef(null);
  const progressRef = useRef(null);
  const slideRefs = useRef([]);

  const { reducedMotion } = useReducedMotionContext();
  const { id, title, subtitle, body, screenshots, keyMessage } =
    inspectionVisibilityContent;
  const total = screenshots.length;

  // Active index drives the index list's "expand the active row" behavior
  // off of React state so it can be styled with normal Tailwind classes.
  const [active, setActive] = useState(0);

  useSectionReveal(sectionRef);

  useLayoutEffect(() => {
    // Reduced motion → no pin, no scrub. Fall back to the static stacked
    // grid rendered below.
    if (reducedMotion) return undefined;

    let cleanupResize = null;

    const ctx = gsapContext(() => {
      // Initial paint: only the first slide visible.
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          autoAlpha: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 0.985,
        });
      });

      let lastIdx = 0;

      const trigger = ScrollTrigger.create({
        trigger: pinTrackRef.current,
        start: "top top",
        // One viewport of scroll per surface — gives each surface a clean
        // discrete dwell-time before the next swap.
        end: () => `+=${window.innerHeight * total}`,
        pin: stageRef.current,
        pinSpacing: true,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Progress meter — linear, monotonic in [0, 1].
          if (progressRef.current) {
            gsap.set(progressRef.current, {
              scaleX: self.progress,
              transformOrigin: "left center",
            });
          }

          // Active surface index: divide [0, 1) into `total` equal bins.
          // Clamp at total-1 so progress == 1 doesn't overflow.
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          if (idx !== lastIdx) {
            slideRefs.current.forEach((el, i) => {
              if (!el) return;
              gsap.to(el, {
                autoAlpha: i === idx ? 1 : 0,
                scale: i === idx ? 1 : 0.985,
                duration: 0.45,
                ease: "power2.out",
                overwrite: true,
              });
            });
            lastIdx = idx;
            setActive(idx);
          }
        },
      });

      const onResize = () => trigger.refresh();
      window.addEventListener("resize", onResize, { passive: true });
      cleanupResize = () => window.removeEventListener("resize", onResize);
    }, sectionRef);

    return () => {
      if (cleanupResize) cleanupResize();
      ctx.revert();
      // Belt-and-suspenders cleanup — kill any ScrollTrigger whose
      // trigger lives inside this section so route changes never leak.
      const sec = sectionRef.current;
      if (sec) {
        ScrollTrigger.getAll()
          .filter((t) => t.trigger && sec.contains(t.trigger))
          .forEach((t) => t.kill());
      }
    };
  }, [reducedMotion, total]);

  const jumpToSurface = (i) => {
    const trigger = ScrollTrigger.getAll().find(
      (t) => t.trigger === pinTrackRef.current,
    );
    if (!trigger) return;
    const target =
      trigger.start + ((i + 0.5) / total) * (trigger.end - trigger.start);
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Section intro — copy lives outside the pinned stage so it scrolls
          past normally before the pin engages. */}
      <div className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title={title}
              subtitle={subtitle}
              eyebrow="Operational Surfaces"
            />
            <p className="text-base md:text-lg text-txt-secondary leading-relaxed mb-4 max-w-3xl mt-6">
              {body}
            </p>
          </div>
        </div>
      </div>

      {!reducedMotion ? (
        // ─────────────── Pinned scroll-scrubbed surface viewer ──────────
        <div ref={pinTrackRef} className="relative">
          <div
            ref={stageRef}
            className="relative min-h-screen flex flex-col justify-center"
            style={{ background: "var(--bg-primary)" }}
          >
            {/* Top progress meter — deep-green bar, fills L→R with scroll */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: "var(--border-subtle)" }}
            >
              <div
                ref={progressRef}
                className="h-full origin-left"
                style={{
                  background: "var(--process-primary)",
                  transform: "scaleX(0)",
                }}
                aria-hidden="true"
              />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full py-16 md:py-20">
              {/* Section meta-row — telemetry-style header */}
              <div className="flex items-center justify-between mb-8 md:mb-10">
                <div className="flex items-center gap-3 font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-txt-muted">
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--process-primary)" }}
                    aria-hidden="true"
                  />
                  <span>Operational Surfaces</span>
                </div>
                <div className="font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase tabular-nums">
                  <span style={{ color: "var(--process-primary)" }}>
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <span className="text-txt-muted">
                    {" "}
                    / {String(total).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Two-column layout: index list (left) + screenshot (right) */}
              <div className="grid lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-center">
                {/* ── Index list ── */}
                <ol className="space-y-2 md:space-y-3">
                  {screenshots.map((s, i) => {
                    const isActive = i === active;
                    return (
                      <li key={s.id} className="relative">
                        <button
                          type="button"
                          onClick={() => jumpToSurface(i)}
                          className="group w-full text-left flex items-baseline gap-4 md:gap-5 py-2 md:py-2.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded-sm"
                          aria-current={isActive ? "true" : undefined}
                        >
                          <span
                            className="font-mono text-[11px] tracking-[0.28em] tabular-nums shrink-0 transition-colors duration-300"
                            style={{
                              color: isActive
                                ? "var(--process-primary)"
                                : "var(--text-muted)",
                            }}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>

                          <div className="flex-1 min-w-0">
                            <span
                              className={`block transition-all duration-500 ease-out ${
                                isActive
                                  ? "text-2xl md:text-4xl lg:text-[44px] leading-[1.1] tracking-[-0.01em] text-txt-primary font-medium"
                                  : "text-base md:text-lg leading-tight text-txt-muted font-normal"
                              }`}
                            >
                              {s.title}
                            </span>

                            {/* Description appears only for the active row */}
                            <span
                              className={`block overflow-hidden transition-all duration-500 ease-out ${
                                isActive
                                  ? "max-h-32 opacity-100 mt-3"
                                  : "max-h-0 opacity-0 mt-0"
                              }`}
                              aria-hidden={!isActive}
                            >
                              <span className="block text-sm md:text-base text-txt-secondary leading-relaxed max-w-md">
                                {s.description}
                              </span>
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {/* ── Screenshot stack ── */}
                <div className="relative">
                  <div
                    className="relative rounded-lg overflow-hidden border border-border-subtle"
                    style={{ background: "var(--bg-panel)" }}
                  >
                    {/* Mono caption row above the image */}
                    <div className="flex items-center justify-between px-4 md:px-5 py-2.5 border-b border-border-subtle">
                      <span className="font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-txt-muted">
                        Surface · {String(active + 1).padStart(2, "0")}
                      </span>
                      <span className="font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase text-txt-muted truncate max-w-[60%] text-right">
                        {screenshots[active]?.title}
                      </span>
                    </div>

                    {/* Stacked slides — exactly one is visible at a time */}
                    <div className="relative aspect-video">
                      {screenshots.map((s, i) => (
                        <div
                          key={s.id}
                          ref={(el) => (slideRefs.current[i] = el)}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ visibility: "hidden", opacity: 0 }}
                        >
                          <img
                            src={s.imagePath}
                            alt={s.title}
                            className="w-full h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tiny scroll hint, only on the first slide */}
                  <p
                    className={`absolute -bottom-8 right-0 font-mono text-[10px] tracking-[0.32em] uppercase text-txt-muted transition-opacity duration-300 ${
                      active === 0 ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  >
                    Scroll ↓
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Reduced-motion fallback — clean static stacked grid.
        <div className="relative py-12 md:py-16">
          <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />
          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {screenshots.map((s, i) => (
                  <div
                    key={s.id}
                    className="rounded-lg overflow-hidden bg-bg-primary border border-border-subtle"
                  >
                    <div
                      className="aspect-video flex items-center justify-center overflow-hidden"
                      style={{ background: "var(--bg-panel)" }}
                    >
                      <img
                        src={s.imagePath}
                        alt={s.title}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 md:p-7">
                      <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-2">
                        Surface {String(i + 1).padStart(2, "0")}
                      </p>
                      <h3 className="text-xl font-medium mb-2 text-txt-primary leading-tight">
                        {s.title}
                      </h3>
                      <p className="text-sm text-txt-secondary leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section outro — keyMessage scrolls past after the pin releases. */}
      <div className="relative py-20 md:py-28">
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-40" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <p className="text-center text-base text-txt-secondary max-w-3xl mx-auto leading-relaxed">
            {keyMessage}
          </p>
        </div>
      </div>
    </section>
  );
}
