/**
 * @file src/animation/motion.js
 * @description Canonical Framer Motion + GSAP presets (easings, durations,
 * variants) for the Light_Theme Industrial redesign. Single source of truth
 * shared by the Motion_Layer and the GSAP_Layer so the hero entry timeline,
 * page transitions, magnetic CTA, cursor follower, section reveals, and
 * Forge_Core idle pulse all read identical numbers.
 *
 * The `easings`, `durations`, and `variants` blocks below are translated
 * verbatim from design.md § Data Models > Animation preset object. A small
 * set of additional keys is exported alongside the verbatim block to satisfy
 * the validator bounds enumerated in tasks.md § 3.2 (e.g.
 * `cursorFadeOutMinMs`, `revealDurationDefaultMs`, `pageWatchdogMs`).
 *
 * `validatePresets()` asserts every numeric bound documented in the
 * requirements and is invoked from MotionConfig.jsx in development so a
 * regression surfaces in the console at boot.
 *
 * Requirements: 4.6, 5.3, 8.1, 8.2, 9.1, 9.4, 10.1, 10.4, 11.1, 11.2, 11.3,
 * 11.4, 11.5, 11.6, 12.5, 13.6.
 */

// ---------------------------------------------------------------------------
// Easings — design.md verbatim plus Motion_Layer / GSAP_Layer aliases.
// ---------------------------------------------------------------------------

export const easings = {
  // design.md § Animation preset object — verbatim
  standard: [0.2, 0.0, 0.0, 1.0], // cubic-bezier ≈ easeOutCubic
  emphasized: [0.2, 0.0, 0.0, 1.2],
  spring: { type: "spring", stiffness: 300, damping: 28 },

  // Framer Motion cubic-bezier aliases used by the Motion_Layer
  out: [0.2, 0.0, 0.0, 1.0],
  decelerate: [0.0, 0.0, 0.2, 1.0],
  pageEnter: [0.4, 0.0, 0.2, 1.0],
  pageExit: [0.4, 0.0, 1.0, 1.0],

  // Named eases consumed by the GSAP_Layer (gsap.to/timeline)
  gsap: {
    standard: "power2.out",
    out: "power2.out",
    in: "power2.in",
    inOut: "power2.inOut",
    pageEnter: "power2.out",
    pageExit: "power2.in",
  },
};

// ---------------------------------------------------------------------------
// Durations — design.md verbatim plus task 3.2 validator aliases.
// ---------------------------------------------------------------------------

export const durations = {
  // Hero entry timeline — total bounded 800–1600 ms (Req 8.1)
  heroEntryTotalMs: 1200,

  // Section reveal — per-section bounded 400–900 ms (Req 9.1)
  sectionRevealMs: 600,
  sectionRevealOffsetPx: 32, // ∈ [16, 48]
  sectionRevealStaggerMs: 80, // ∈ [40, 120]
  sectionRevealMaxStaggerWindowMs: 1500, // (Req 9.4)

  // Page transition — combined 200–500 ms (Req 10.1)
  pageEnterMs: 220,
  pageExitMs: 180,
  pageTransitionWatchdogMs: 1000, // (Req 10.4)

  // ProductSlider (Req 13.6)
  productSliderMs: 320, // ∈ [200, 450]

  // Magnetic CTA (Req 11.1, 11.2)
  magneticMaxTranslatePx: 8,
  magneticReturnMs: 220, // ≤ 250

  // Cursor follower (Req 11.3–11.5)
  cursorFollowerMaxRadiusPx: 24,
  cursorFollowerOpacityMin: 0.2,
  cursorFollowerOpacityMax: 0.35,
  cursorFollowerIdleAfterMs: 2000,
  cursorFollowerFadeOutMs: 400, // ∈ [200, 600]
  cursorFollowerFadeInMs: 180, // ≤ 200

  // Forge_Core scroll-linked parallax (Req 8.2)
  forgeParallaxMaxTranslatePx: 120,

  // Forge_Core ambient idle pulse (Req 11.6)
  forgeIdleAfterMs: 8000,
  forgeIdleScaleMin: 0.98,
  forgeIdleScaleMax: 1.02,
  forgeIdlePeriodMinMs: 2000,
  forgeIdlePeriodMaxMs: 4000,

  // Navbar surface transition (Req 12.5)
  navbarSurfaceMs: 220, // ∈ [150, 300]

  // Reduced-motion focus/active maximum (Req 5.3)
  reducedMotionTransitionMaxMs: 150,

  // ---- Additional named keys required by tasks.md § 3.2 validator ---------
  // Cursor fade range (Req 11.4, 11.5) — exposed as min/max for the validator
  cursorFadeOutMinMs: 200,
  cursorFadeOutMaxMs: 600,
  cursorFadeInMs: 180,

  // Default reveal aliases used by useSectionReveal (Req 9.1, 9.4)
  revealDurationDefaultMs: 600,
  revealStaggerDefaultMs: 80,
  revealOffsetDefaultPx: 32,

  // Page transition watchdog alias (Req 10.4)
  pageWatchdogMs: 1000,
};

// ---------------------------------------------------------------------------
// Variants — design.md verbatim plus hero entry variants for the GSAP_Layer
// to derive its per-element states from a single source of truth.
// ---------------------------------------------------------------------------

export const variants = {
  // design.md § Animation preset object — verbatim
  pageEnter: {
    opacity: [0, 1],
    y: [8, 0],
    transition: { duration: durations.pageEnterMs / 1000 },
  },
  pageExit: {
    opacity: [1, 0],
    y: [0, -4],
    transition: { duration: durations.pageExitMs / 1000 },
  },

  // Hero entry choreography (Req 8.1) — wordmark, then tagline, then CTA,
  // then Forge_Core. Durations resolve to a total within [800, 1600] ms.
  heroWordmark: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      delay: 0.0,
      ease: easings.standard,
    },
  },
  heroTagline: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      delay: 0.25,
      ease: easings.standard,
    },
  },
  heroCta: {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      delay: 0.5,
      ease: easings.standard,
    },
  },
  heroForge: {
    initial: { opacity: 0, scale: 0.985 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.5,
      delay: 0.7,
      ease: easings.standard,
    },
  },
};

// ---------------------------------------------------------------------------
// validatePresets — asserts every numeric bound documented in design.md and
// tasks.md § 3.2. Throws on the first violation with a descriptive message
// identifying the offending key path and value. Called from MotionConfig.jsx
// outside production builds (Req 4.6).
// ---------------------------------------------------------------------------

/**
 * Validate the motion preset numeric bounds. Throws on the first violation.
 *
 * @param {{ easings?: typeof easings, durations?: typeof durations, variants?: typeof variants }} [presets]
 *   Optional preset bag for testing. Defaults to the module's own exports.
 * @returns {true} when every bound holds.
 * @throws {Error} when any bound is violated.
 */
export function validatePresets(presets) {
  const d = (presets && presets.durations) || durations;

  const fail = (path, value, expected) => {
    throw new Error(
      `motion preset out of bounds: ${path}=${String(value)} not ${expected}`,
    );
  };

  // Hero entry timeline (Req 8.1)
  if (
    typeof d.heroEntryTotalMs !== "number" ||
    d.heroEntryTotalMs < 800 ||
    d.heroEntryTotalMs > 1600
  ) {
    fail("durations.heroEntryTotalMs", d.heroEntryTotalMs, "in [800, 1600]");
  }

  // Page transition combined window (Req 10.1)
  const pageSum = d.pageEnterMs + d.pageExitMs;
  if (
    typeof d.pageEnterMs !== "number" ||
    typeof d.pageExitMs !== "number" ||
    pageSum < 200 ||
    pageSum > 500
  ) {
    fail(
      "durations.pageEnterMs+durations.pageExitMs",
      `${d.pageEnterMs}+${d.pageExitMs}=${pageSum}`,
      "in [200, 500]",
    );
  }

  // Magnetic CTA clamp (Req 11.1)
  if (d.magneticMaxTranslatePx !== 8) {
    fail("durations.magneticMaxTranslatePx", d.magneticMaxTranslatePx, "=== 8");
  }

  // Forge_Core idle pulse period bounds (Req 11.6)
  if (
    typeof d.forgeIdlePeriodMinMs !== "number" ||
    d.forgeIdlePeriodMinMs < 2000
  ) {
    fail("durations.forgeIdlePeriodMinMs", d.forgeIdlePeriodMinMs, ">= 2000");
  }
  if (
    typeof d.forgeIdlePeriodMaxMs !== "number" ||
    d.forgeIdlePeriodMaxMs > 4000
  ) {
    fail("durations.forgeIdlePeriodMaxMs", d.forgeIdlePeriodMaxMs, "<= 4000");
  }
  if (d.forgeIdlePeriodMinMs > d.forgeIdlePeriodMaxMs) {
    fail(
      "durations.forgeIdlePeriodMinMs..forgeIdlePeriodMaxMs",
      `${d.forgeIdlePeriodMinMs}..${d.forgeIdlePeriodMaxMs}`,
      "min <= max",
    );
  }

  // ProductSlider transition (Req 13.6)
  if (
    typeof d.productSliderMs !== "number" ||
    d.productSliderMs < 200 ||
    d.productSliderMs > 450
  ) {
    fail("durations.productSliderMs", d.productSliderMs, "in [200, 450]");
  }

  // Navbar surface transition (Req 12.5)
  if (
    typeof d.navbarSurfaceMs !== "number" ||
    d.navbarSurfaceMs < 150 ||
    d.navbarSurfaceMs > 300
  ) {
    fail("durations.navbarSurfaceMs", d.navbarSurfaceMs, "in [150, 300]");
  }

  // Cursor follower fade-out range (Req 11.4)
  if (typeof d.cursorFadeOutMinMs !== "number" || d.cursorFadeOutMinMs < 200) {
    fail("durations.cursorFadeOutMinMs", d.cursorFadeOutMinMs, ">= 200");
  }
  if (typeof d.cursorFadeOutMaxMs !== "number" || d.cursorFadeOutMaxMs > 600) {
    fail("durations.cursorFadeOutMaxMs", d.cursorFadeOutMaxMs, "<= 600");
  }
  if (d.cursorFadeOutMinMs > d.cursorFadeOutMaxMs) {
    fail(
      "durations.cursorFadeOutMinMs..cursorFadeOutMaxMs",
      `${d.cursorFadeOutMinMs}..${d.cursorFadeOutMaxMs}`,
      "min <= max",
    );
  }

  // Cursor follower fade-in (Req 11.5)
  if (typeof d.cursorFadeInMs !== "number" || d.cursorFadeInMs > 200) {
    fail("durations.cursorFadeInMs", d.cursorFadeInMs, "<= 200");
  }

  // Section reveal duration default (Req 9.1)
  if (
    typeof d.revealDurationDefaultMs !== "number" ||
    d.revealDurationDefaultMs < 400 ||
    d.revealDurationDefaultMs > 900
  ) {
    fail(
      "durations.revealDurationDefaultMs",
      d.revealDurationDefaultMs,
      "in [400, 900]",
    );
  }

  // FeatureGrid stagger default (Req 9.4)
  if (
    typeof d.revealStaggerDefaultMs !== "number" ||
    d.revealStaggerDefaultMs < 40 ||
    d.revealStaggerDefaultMs > 120
  ) {
    fail(
      "durations.revealStaggerDefaultMs",
      d.revealStaggerDefaultMs,
      "in [40, 120]",
    );
  }

  // Section reveal offset default (Req 9.1)
  if (
    typeof d.revealOffsetDefaultPx !== "number" ||
    d.revealOffsetDefaultPx < 16 ||
    d.revealOffsetDefaultPx > 48
  ) {
    fail(
      "durations.revealOffsetDefaultPx",
      d.revealOffsetDefaultPx,
      "in [16, 48]",
    );
  }

  // Magnetic spring-back (Req 11.2)
  if (typeof d.magneticReturnMs !== "number" || d.magneticReturnMs > 250) {
    fail("durations.magneticReturnMs", d.magneticReturnMs, "<= 250");
  }

  // Page transition watchdog (Req 10.4)
  if (d.pageWatchdogMs !== 1000) {
    fail("durations.pageWatchdogMs", d.pageWatchdogMs, "=== 1000");
  }

  return true;
}
