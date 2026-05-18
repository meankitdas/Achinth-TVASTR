/**
 * @file src/hooks/useSectionReveal.js
 * @description GSAP/ScrollTrigger-backed section reveal hook that replaces
 * the legacy CSS-class-based scroll reveal. Drives the heading → subheading
 * → grid-items cascade for every marketing/section component.
 *
 * Implements Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 18.3 and design.md
 * § Components and Interfaces > Animation infrastructure
 * (`src/hooks/useSectionReveal.js`); § Property 10 (FeatureGrid stagger
 * window bound):
 *   - Animates opacity 0 → 1 and y: offset → 0 the first time the section
 *     attains ~15 % viewport intersection, exactly once per page lifetime
 *     (Reqs 9.1, 9.2).
 *   - Clears inline `transform` and `opacity` styles 50 ms after the
 *     timeline completes (Req 9.3).
 *   - Staggers any element matching `itemsSelector` (FeatureGrid items),
 *     clamping the per-item delay to `[40, 120]` ms and the total window
 *     to `min(stagger × (N − 1), 1500)` ms (Req 9.4, Property 10).
 *   - Skips missing heading/subheading/items without erroring (Req 9.5).
 *   - On `reducedMotion`, snaps every target to the final visible state
 *     immediately and skips ScrollTrigger creation entirely (Req 9.6).
 *   - Multiplies the per-element duration by 0.7 for viewports in
 *     `[640, 1024]` px (Req 18.3).
 */

import { useEffect } from "react";

import { gsap, ScrollTrigger } from "../animation/gsap";
import { useReducedMotionContext } from "../animation/MotionConfig";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const TABLET_VIEWPORT_MIN_PX = 640;
const TABLET_VIEWPORT_MAX_PX = 1024;
const TABLET_DURATION_MULTIPLIER = 0.7;

const DURATION_MIN_MS = 400;
const DURATION_MAX_MS = 900;
const OFFSET_MIN_PX = 16;
const OFFSET_MAX_PX = 48;
const STAGGER_MIN_MS = 40;
const STAGGER_MAX_MS = 120;
const STAGGER_WINDOW_MAX_MS = 1500;
const CLEAR_PROPS_DELAY_MS = 50;

/**
 * Resolve the tablet duration multiplier for the current viewport (Req 18.3).
 *
 * @returns {number} `0.7` when the viewport width is in `[640, 1024]` px,
 * `1` otherwise (or `1` when `window` is unavailable, e.g. SSR).
 */
function tabletDurationMultiplier() {
  if (typeof window === "undefined") return 1;
  const width = window.innerWidth;
  return width >= TABLET_VIEWPORT_MIN_PX && width <= TABLET_VIEWPORT_MAX_PX
    ? TABLET_DURATION_MULTIPLIER
    : 1;
}

/**
 * Compute the effective per-item stagger (in seconds) so the total window
 * never exceeds `STAGGER_WINDOW_MAX_MS` ms (Property 10 / Req 9.4).
 *
 * @param {number} clampedStaggerMs - Per-item delay clamped to `[40, 120]` ms.
 * @param {number} itemCount - Number of grid items (`N`).
 * @returns {number} Stagger in seconds for `gsap.to({ stagger })`.
 */
function effectiveItemStaggerSeconds(clampedStaggerMs, itemCount) {
  if (itemCount <= 1) return clampedStaggerMs / 1000;
  const cappedMs = Math.min(
    clampedStaggerMs,
    STAGGER_WINDOW_MAX_MS / (itemCount - 1),
  );
  return cappedMs / 1000;
}

/**
 * Scroll-linked section reveal. Attach the returned hook to a section's
 * root ref; the hook queries the section's heading, subheading, and grid
 * items, then animates them on first viewport entry exactly once.
 *
 * @param {React.RefObject<HTMLElement>} ref - Ref to the section root.
 * @param {{
 *   headingSelector?: string,
 *   subheadingSelector?: string,
 *   itemsSelector?: string,
 *   threshold?: number,
 *   duration?: number,
 *   offset?: number,
 *   stagger?: number,
 * }} [options]
 * @returns {void}
 */
export function useSectionReveal(ref, options = {}) {
  const { reducedMotion } = useReducedMotionContext();

  const {
    headingSelector = "h1, h2",
    subheadingSelector = "[data-subheading]",
    itemsSelector = "[data-reveal-item]",
    threshold = 0.15,
    duration: durationRaw = 600,
    offset: offsetRaw = 32,
    stagger: staggerRaw = 80,
  } = options;

  useEffect(() => {
    const root = ref?.current;
    if (!root) return undefined;

    // Query targets — Req 9.5: skip missing elements without erroring.
    const heading = root.querySelector(headingSelector);
    const subheading = root.querySelector(subheadingSelector);
    const items = Array.from(root.querySelectorAll(itemsSelector));
    const allTargets = [heading, subheading, ...items].filter(Boolean);
    if (allTargets.length === 0) return undefined;

    // Clamp inputs to documented bounds (Reqs 9.1, 9.4).
    const clampedDurationMs = clamp(
      durationRaw,
      DURATION_MIN_MS,
      DURATION_MAX_MS,
    );
    const clampedOffsetPx = clamp(offsetRaw, OFFSET_MIN_PX, OFFSET_MAX_PX);
    const clampedStaggerMs = clamp(staggerRaw, STAGGER_MIN_MS, STAGGER_MAX_MS);

    // Apply tablet multiplier (Req 18.3) to the duration only — offset and
    // stagger remain stable so the visual layout is unchanged.
    const durationSeconds =
      (clampedDurationMs * tabletDurationMultiplier()) / 1000;
    const itemStaggerSeconds = effectiveItemStaggerSeconds(
      clampedStaggerMs,
      items.length,
    );

    // Reduced-motion path (Req 9.6) — snap to final state, no ScrollTrigger.
    if (reducedMotion) {
      gsap.set(allTargets, {
        opacity: 1,
        y: 0,
        clearProps: "transform,opacity",
      });
      return undefined;
    }

    // Initial state — opacity 0, y: offset.
    gsap.set(allTargets, { opacity: 0, y: clampedOffsetPx });

    let clearTimeoutId = null;

    const clearInlineStyles = () => {
      gsap.set(allTargets, { clearProps: "transform,opacity" });
    };

    // ScrollTrigger threshold mapping: `top bottom-=${threshold*100}%` fires
    // when the section's top edge reaches (viewport bottom − threshold ×
    // viewport height) — i.e. ~`threshold` of viewport-height worth of the
    // section is visible. This is the canonical GSAP idiom for "section is
    // ~`threshold` in view" and aligns with the 15 % default in Req 9.1.
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: `top bottom-=${threshold * 100}%`,
      // Req 9.2 — fire exactly once per section instance.
      once: true,
      onEnter: () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            // Req 9.3 — clear inline transform/opacity 50 ms after completion.
            clearTimeoutId = setTimeout(() => {
              clearTimeoutId = null;
              clearInlineStyles();
            }, CLEAR_PROPS_DELAY_MS);
          },
        });

        if (heading) {
          timeline.to(
            heading,
            { opacity: 1, y: 0, duration: durationSeconds },
            0,
          );
        }
        if (subheading) {
          timeline.to(
            subheading,
            { opacity: 1, y: 0, duration: durationSeconds },
            // Tiny 50 ms lead so heading reads first; well within 9.1 budget.
            0.05,
          );
        }
        if (items.length > 0) {
          timeline.to(
            items,
            {
              opacity: 1,
              y: 0,
              duration: durationSeconds,
              stagger: itemStaggerSeconds,
            },
            0.1,
          );
        }
      },
    });

    return () => {
      if (clearTimeoutId !== null) {
        clearTimeout(clearTimeoutId);
        clearTimeoutId = null;
      }
      trigger.kill();
    };
  }, [
    ref,
    reducedMotion,
    headingSelector,
    subheadingSelector,
    itemsSelector,
    threshold,
    durationRaw,
    offsetRaw,
    staggerRaw,
  ]);
}

export default useSectionReveal;
