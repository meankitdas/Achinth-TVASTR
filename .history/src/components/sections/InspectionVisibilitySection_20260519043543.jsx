import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SectionShell } from "@/components/primitives/SectionShell";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { inspectionVisibilityContent } from "@/content/homepage/inspection-visibility";
import { useSectionReveal } from "../../hooks/useSectionReveal";
import { durations } from "../../animation/motion";
import { useReducedMotionContext } from "../../animation/MotionConfig";

/**
 * InspectionVisibilitySection — Operational Visibility
 *
 * One single section, no sub-headers, no scroll-jacking. The viewer is
 * a large featured screenshot with a tab rail underneath. The tabs
 * auto-advance every ~5 s while the section is in view, with a thin
 * deep-green progress bar filling on the active tab. Hovering the tab
 * rail pauses auto-advance so the user can read at their own pace.
 *
 * UX intent:
 *   - Image stays big — full content width on desktop.
 *   - Cross-fade transitions, never sliding, so the eye stays anchored.
 *   - The active tab's caption appears beneath the image as a quiet
 *     line, keeping each frame's context visible without crowding.
 *   - All seven tabs (one per surface) are reachable in one click.
 *
 * Reduced-motion (Req 5.2, 13.10): cross-fades shorten to 50 ms and the
 * auto-advance interval is suppressed. Users navigate by clicking tabs
 * only.
 */
export function InspectionVisibilitySection() {
  const sectionRef = useRef(null);
  const viewerRef = useRef(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const { reducedMotion } = useReducedMotionContext();

  const { id, title, subtitle, body, screenshots, keyMessage } =
    inspectionVisibilityContent;
  const total = screenshots.length;

  useSectionReveal(sectionRef);

  // Auto-advance interval (ms) — short enough to feel responsive,
  // long enough to read the caption.
  const AUTO_ADVANCE_MS = 2800;

  // Pause auto-advance when the section is off-screen so the carousel
  // doesn't burn cycles when nobody is looking. IntersectionObserver
  // gives us a low-cost in-view signal.
  useEffect(() => {
    const el = viewerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // Fallback: assume in-view.
      setInView(true);
      return undefined;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setInView(e.isIntersecting));
      },
      { threshold: 0.25 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-advance timer. Suppressed under reduced-motion (Req 5.5: no
  // continuous ambient motion), when paused (hover/focus), or when the
  // viewer is off-screen.
  useEffect(() => {
    if (reducedMotion || paused || !inView) return undefined;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [reducedMotion, paused, inView, total]);

  const goTo = (i) => {
    setActive(i);
    // Clicking a tab restarts the dwell-time on the new tab by briefly
    // pausing then resuming. We just rely on the effect's dependency on
    // `active` re-mounting the interval below.
  };

  const transitionMs = reducedMotion ? 50 : durations.productSliderMs; // 320 ms ∈ [200, 450]

  const current = screenshots[active];

  return (
    <SectionShell ref={sectionRef} id={id}>
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          eyebrow="Operational Surfaces"
        />

        <p className="text-base md:text-lg text-txt-secondary leading-relaxed mb-12 md:mb-16 max-w-3xl mt-6">
          {body}
        </p>

        {/* ─────────── Featured viewer ─────────── */}
        <div
          ref={viewerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Large image frame */}
          <div
            className="relative w-full rounded-xl overflow-hidden border border-border-default"
            style={{ background: "var(--bg-panel)" }}
            aria-live="polite"
          >
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.id}
                  src={current.imagePath}
                  alt={current.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain"
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.995 }}
                  transition={{
                    duration: transitionMs / 1000,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              </AnimatePresence>
            </div>
          </div>

          {/* Caption row directly under the image */}
          <div className="mt-5 md:mt-6 flex items-baseline justify-between gap-6">
            <div className="min-w-0">
              <p
                className="font-mono text-[11px] tracking-[0.28em] uppercase mb-1.5"
                style={{ color: "var(--signal-glow)" }}
              >
                Surface · {String(active + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{
                    duration: transitionMs / 1000,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <h3 className="text-2xl md:text-3xl font-medium text-txt-primary leading-tight tracking-[-0.01em] mb-2">
                    {current.title}
                  </h3>
                  <p className="text-sm md:text-base text-txt-secondary leading-relaxed max-w-2xl">
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Prev / next nudge controls — small mono pair on the right */}
            <div className="hidden sm:flex items-center gap-1 shrink-0 pt-1">
              <button
                type="button"
                onClick={() => goTo((active - 1 + total) % total)}
                aria-label="Previous surface"
                className="w-9 h-9 rounded-full flex items-center justify-center text-txt-secondary hover:text-process-primary hover:bg-bg-panel transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
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
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => goTo((active + 1) % total)}
                aria-label="Next surface"
                className="w-9 h-9 rounded-full flex items-center justify-center text-txt-secondary hover:text-process-primary hover:bg-bg-panel transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
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
              </button>
            </div>
          </div>

          {/* ── Tab rail ── */}
          <div
            className="mt-8 md:mt-10 grid gap-px overflow-hidden rounded-md border border-border-subtle"
            style={{
              gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`,
              background: "var(--border-subtle)",
            }}
            role="tablist"
            aria-label="Operational surfaces"
          >
            {screenshots.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`surface-${s.id}`}
                  onClick={() => goTo(i)}
                  className="relative bg-bg-primary px-3 md:px-4 py-3 md:py-4 text-left transition-colors duration-200 hover:bg-bg-panel focus:outline-none focus-visible:bg-bg-panel focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-process-primary"
                >
                  <span
                    className="block font-mono text-[10px] md:text-[11px] tracking-[0.28em] uppercase mb-1 transition-colors duration-200"
                    style={{
                      color: isActive
                        ? "var(--process-primary)"
                        : "var(--text-muted)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`block text-[12px] md:text-[13px] leading-tight truncate transition-colors duration-200 ${
                      isActive
                        ? "text-txt-primary font-medium"
                        : "text-txt-secondary"
                    }`}
                  >
                    {s.title}
                  </span>

                  {/* Active progress bar — fills L→R while this tab is
                      active and auto-advance is running. Restart the
                      animation by remounting on `active` change. */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: "var(--border-default)" }}
                      aria-hidden="true"
                    >
                      {!reducedMotion && !paused && inView ? (
                        <motion.span
                          key={`bar-${active}`}
                          className="block h-full origin-left"
                          style={{ background: "var(--process-primary)" }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: AUTO_ADVANCE_MS / 1000,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        <span
                          className="block h-full"
                          style={{ background: "var(--process-primary)" }}
                        />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Pause-state hint — quiet mono microcopy */}
          <p
            className={`mt-3 font-mono text-[10px] tracking-[0.28em] uppercase text-txt-muted transition-opacity duration-200 ${
              paused && !reducedMotion ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!paused}
          >
            Paused · move pointer away to resume
          </p>
        </div>

        {/* Closing key message */}
        <p className="text-center text-base text-txt-secondary mt-16 md:mt-20 max-w-3xl mx-auto leading-relaxed">
          {keyMessage}
        </p>
      </div>
    </SectionShell>
  );
}
