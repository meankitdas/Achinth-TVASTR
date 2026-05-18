import { useLayoutEffect, useRef, useState } from "react";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { inspectionVisibilityContent } from "@/content/homepage/inspection-visibility";
import { useSectionReveal } from "../../hooks/useSectionReveal";
import { gsap, gsapContext, ScrollTrigger } from "../../animation/gsap";
import { useReducedMotionContext } from "../../animation/MotionConfig";

/**
 * InspectionVisibilitySection
 *
 * Pinned scroll-scrubbed surface viewer. Defeats habituation by promoting
 * each operational surface into a full discrete event:
 *
 *   - The whole inner frame pins for `surfaces × ~viewport` of scroll.
 *   - The active row in the index (left) blows up to display type while
 *     the rest collapse to muted mono labels — a strong size delta.
 *   - The screenshot (right) cross-fades + nudges scale, never sliding,
 *     so the eye lands on a fresh image rather than tracking a card.
 *   - A deep-green progress meter runs across the top, filling with
 *     scroll progress so the user always knows where they are.
 *
 * Reduced-motion: pinning and scrubbing are skipped; the section falls
 * back to a clean stacked grid.
 */
export function InspectionVisibilitySection() {
  const sectionRef = useRef(null);
  const pinTrackRef = useRef(null);
  const stageRef = useRef(null);
  const progressRef = useRef(null);
  const slideRefs = useRef([]);
  const indexRowRefs = useRef([]);

  const { reducedMotion } = useReducedMotionContext();
  const { id, title, subtitle, body, screenshots, keyMessage } =
    inspectionVisibilityContent;
  const total = screenshots.length;

  // Active index drives the index list's "expand the active row" behavior
  // off of React state so it can be styled with normal Tailwind classes.
  const [active, setActive] = useState(0);

  useSectionReveal(sectionRef);

  useLayoutEffect(() => {
    // Reduced motion → no pinning, no scrub. Fall back to the static
    // first surface and let the document scroll past naturally.
    if (reducedMotion) return undefined;

    const ctx = gsapContext(() => {
      // Initial paint: only the first slide visible.
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, {
          autoAlpha: i === 0 ? 1 : 0,
          scale: i === 0 ? 1 : 0.985,
        });
      });

      // Single ScrollTrigger that pins the stage for `total` viewports
      // worth of scroll and emits an integer step on snap. We compute the
      // active index on each onUpdate from `progress` so the cross-fade
      // logic stays in one place.
      const scrubLength = total; // 1 viewport per surface
      let lastIdx = 0;

      const trigger = ScrollTrigger.create({
        trigger: pinTrackRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * scrubLength}`,
        pin: stageRef.current,
        pinSpacing: true,
        scrub: 0.4,
        onUpdate: (self) => {
          // Progress meter (linear, monotonic in [0, 1]).
          if (progressRef.current) {
            gsap.set(progressRef.current, {
              scaleX: self.progress,
              transformOrigin: "left center",
            });
          }

          // Active surface index: divide [0,1) into `total` equal bins.
          // Clamp at total - 1 so progress == 1 doesn't overflow.
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          if (idx !== lastIdx) {
            // Cross-fade slides.
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

      // Recompute end on resize so the pin distance scales with viewport.
      const onResize = () => trigger.refresh();
      window.addEventListener("resize", onResize, { passive: true });

      return () => {
        window.removeEventListener("resize", onResize);
      };
    }, sectionRef);

    return () => {
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

  return (
    <SectionShell ref={sectionRef} id={id}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          eyebrow="Operational Surfaces"
        />

        <p className="text-base md:text-lg text-txt-secondary leading-relaxed mb-12 max-w-3xl mt-6">
          {body}
        </p>
      </div>

      {/* ─────────── Pinned scroll-scrubbed surface viewer ─────────── */}
      {!reducedMotion ? (
        <div ref={pinTrackRef} className="relative">
          {/* The actual stage that gets pinned. min-h-screen so it fills
              the viewport while the user scrolls through the surfaces. */}
          <div
            ref={stageRef}
            className="relative min-h-screen flex flex-col justify-center"
          >
            {/* Top progress meter — deep-green bar that fills L→R as
                you scroll through the section. */}
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
              {/* Section meta-row — current surface number + total */}
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

              {/* Two-column layout: index list (left) + screenshot stack (right) */}
              <div className="grid lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-center">
                {/* ─── Index list ─── */}
                <ol className="space-y-2 md:space-y-3" role="list">
                  {screenshots.map((s, i) => {
                    const isActive = i === active;
                    return (
                      <li
                        key={s.id}
                        ref={(el) => (indexRowRefs.current[i] = el)}
                        className="relative"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            // Click jumps the page scroll to the right
                            // bin so the user can navigate non-linearly.
                            const trigger = ScrollTrigger.getAll().find(
                              (t) => t.trigger === pinTrackRef.current,
                            );
                            if (trigger) {
                              const target =
                                trigger.start +
                                ((i + 0.5) / total) *
                                  (trigger.end - trigger.start);
                              window.scrollTo({
                                top: target,
                                behavior: "smooth",
                              });
                            }
                          }}
                          className={`group w-full text-left flex items-baseline gap-4 md:gap-5 py-2 md:py-2.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded-sm`}
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

                          {/* Right-edge active marker — thin green bar */}
                          <span
                            className={`shrink-0 self-stretch w-px transition-colors duration-300 ${
                              isActive ? "" : ""
                            }`}
                            style={{
                              background: isActive
                                ? "var(--process-primary)"
                                : "transparent",
                            }}
                            aria-hidden="true"
                          />
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {/* ─── Screenshot stack ─── */}
                <div className="relative">
                  {/* Soft stone backdrop frame */}
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

                    {/* Stacked slides — exactly one is visible, others are
                        autoAlpha 0. GSAP handles the cross-fade. */}
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

                  {/* Tiny scroll hint, only on first slide */}
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
      )}

      <div className="max-w-6xl mx-auto">
        <p className="text-center text-base text-txt-secondary mt-16 max-w-3xl mx-auto leading-relaxed">
          {keyMessage}
        </p>
      </div>
    </SectionShell>
  );
}
