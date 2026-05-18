/**
 * @file src/animation/MotionConfig.jsx
 * @description Application-wide Motion provider that wires Framer Motion's
 * `<MotionConfig reducedMotion="user">` and broadcasts a single
 * reduced-motion boolean (sourced from `useReducedMotion`) to both the
 * Motion_Layer and GSAP_Layer via React context.
 *
 * Implements Requirements 5.1, 5.2, 5.6 and design.md
 * § Components and Interfaces > Animation infrastructure
 * (`src/animation/MotionConfig.jsx`):
 *   - Wraps children with `<MotionConfig reducedMotion="user">` so Framer
 *     Motion delegates reduced-motion to the OS preference (Req 5.1).
 *   - Exposes `<ReducedMotionContext.Provider>` whose value is the result
 *     of `useReducedMotion()` so both Motion_Layer and GSAP_Layer hooks
 *     read the same boolean from a single source (Req 5.1, 5.2).
 *   - Re-evaluation within 500 ms of an OS preference change is delegated
 *     to `useReducedMotion`, which subscribes to the
 *     `prefers-reduced-motion` MediaQueryList's `change` event (Req 5.6).
 *   - In development, calls `validatePresets()` once at first mount so a
 *     numeric-bound regression in `motion.js` surfaces in the console at
 *     boot.
 */

import { createContext, useContext, useEffect } from "react";
import { MotionConfig } from "framer-motion";

import { useReducedMotion } from "../hooks/useReducedMotion";
import { validatePresets } from "./motion";

/**
 * @typedef {{ reducedMotion: boolean, detectionFailed: boolean }} ReducedMotionState
 */

/**
 * Context broadcast of the resolved reduced-motion state. Both
 * Motion_Layer and GSAP_Layer hooks read from this single source so the
 * two libraries can never drift on the user's preference.
 *
 * Default value matches the shape returned by `useReducedMotion` so
 * components rendered outside the provider (e.g. isolated tests) get a
 * safe `{ reducedMotion: false, detectionFailed: false }` rather than
 * `undefined`.
 *
 * @type {React.Context<ReducedMotionState>}
 */
export const ReducedMotionContext = createContext({
  reducedMotion: false,
  detectionFailed: false,
});

/**
 * Read the broadcast reduced-motion state inside the Motion_Layer or
 * GSAP_Layer. Equivalent to `useContext(ReducedMotionContext)` but exposes
 * a stable hook name for consumers.
 *
 * @returns {ReducedMotionState}
 */
export function useReducedMotionContext() {
  return useContext(ReducedMotionContext);
}

/**
 * Application-wide Motion provider. Mount once at the application root
 * (inside `<BrowserRouter>` and outside `<Routes>`).
 *
 * @param {{ children: React.ReactNode }} props
 */
export default function MotionProvider({ children }) {
  const value = useReducedMotion();

  // Dev-time preset validator — fires once per page load on first mount so
  // a numeric-bound regression in `motion.js` surfaces in the console at
  // boot. Guarded by a `typeof process` check because Vite replaces
  // `process.env.NODE_ENV` in client builds but does not provide `process`
  // itself, so accessing it without the guard would throw in the browser
  // when `process` happens to be undefined (e.g. tests, certain bundlers).
  useEffect(() => {
    if (
      typeof process !== "undefined" &&
      process.env &&
      process.env.NODE_ENV !== "production"
    ) {
      try {
        validatePresets();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ReducedMotionContext.Provider value={value}>
        {children}
      </ReducedMotionContext.Provider>
    </MotionConfig>
  );
}
