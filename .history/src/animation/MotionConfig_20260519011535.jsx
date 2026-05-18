/**
 * @file src/animation/MotionConfig.jsx
 * @description Application-wide Motion provider that wires Framer Motion's
 * `<MotionConfig reducedMotion="user">` and broadcasts a single
 * reduced-motion boolean (sourced from `useReducedMotion`) to both the
 * Motion_Layer and GSAP_Layer via React context.
 *
 * Subsequent tasks (see `tasks.md` § 3.4) will:
 *   - Wrap children in `<MotionConfig reducedMotion="user">`.
 *   - Expose `<ReducedMotionContext.Provider>` so all animation hooks read
 *     a single source of truth.
 *   - Re-evaluate within 500 ms of an OS preference change.
 *   - Call `validatePresets()` from `motion.js` outside production builds.
 *
 * This file is a deliberate placeholder — see Requirements 5.1, 5.2, 5.6
 * and design.md § Components and Interfaces > Animation infrastructure.
 */
