/**
 * @file src/hooks/useReducedMotion.js
 * @description Single source of truth for `prefers-reduced-motion: reduce`
 * detection. Consumed by `MotionConfig.jsx`, hero choreography, page
 * transitions, magnetic hover, and Forge_Core idle pulses.
 *
 * Subsequent tasks (see `tasks.md` § 3.3) will:
 *   - Subscribe via `window.matchMedia('(prefers-reduced-motion: reduce)')`
 *     and re-render on `change`.
 *   - Evaluate synchronously during the initial render via
 *     `useSyncExternalStore` so the value is correct before the first
 *     animation frame is scheduled.
 *   - Return `{ reducedMotion: true, detectionFailed: true }` and emit a
 *     single `console.warn` when `matchMedia` is unavailable or throws.
 *   - Reflect OS-preference changes within 500 ms.
 *
 * This file is a deliberate placeholder — see Requirements 5.2, 5.6, 5.7,
 * 5.8 and design.md § Components and Interfaces > Animation infrastructure
 * (`src/hooks/useReducedMotion.js`).
 */
