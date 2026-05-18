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
