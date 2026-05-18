/**
 * @file src/hooks/useMagnetic.js
 * @description Subtle magnetic hover for primary CTAs (Hero, Navbar Portal,
 * Upgrade banners). Translates a target ref toward the cursor while
 * clamping the displacement.
 *
 * Subsequent tasks (see `tasks.md` § 3.6) will:
 *   - Translate the target so `max(|dx|, |dy|) ≤ 8 px` (Property 8).
 *   - Spring back to origin within 250 ms on pointer-leave.
 *   - No-op when `(pointer: coarse)` matches, viewport < 640 px, or
 *     `reducedMotion` is true.
 *
 * This file is a deliberate placeholder — see Requirements 5.1, 5.2, 11.1,
 * 11.3, 18.2 and design.md § Components and Interfaces > Animation
 * infrastructure (`useMagnetic`); § Property 8.
 */
