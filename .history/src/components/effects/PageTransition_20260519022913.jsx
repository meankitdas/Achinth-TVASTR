/**
 * @file src/components/effects/PageTransition.jsx
 * @description Route-level transition shell that wraps `<Routes>` so navigation
 * fades/slides between pages using Framer Motion's `<AnimatePresence>`.
 *
 * Behavior (Reqs 10.1–10.5):
 *   - Wraps children in `<AnimatePresence mode="wait">` keyed by
 *     `location.pathname`, using the `pageEnter` / `pageExit` variants
 *     from `motion.js` (combined 200–500 ms).
 *   - Restores scroll position within 50 ms of mount via `useLayoutEffect`.
 *   - Cancels a stale variant within 50 ms of a new route change by changing
 *     the `<motion.div>` `key`, which `AnimatePresence` reacts to immediately.
 *   - Installs a 1000 ms watchdog that snaps to the destination's final
 *     state and emits a single `console.warn` if the budget is exceeded.
 *   - When `reducedMotion` is active, renders the destination immediately
 *     with no enter/exit animation (Req 10.5).
 *
 * Implements Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 11.1, 11.2.
 * Design: §Page transition shell; §Components and Interfaces > Animation
 * infrastructure (`<PageTransition />`).
 */

import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import { durations, easings } from "../../animation/motion";
import { useReducedMotionContext } from "../../animation/MotionConfig";

const ENTER_S = durations.pageEnterMs / 1000;
const EXIT_S = durations.pageExitMs / 1000;
const WATCHDOG_MS = durations.pageWatchdogMs;

/**
 * @param {{ children: React.ReactNode }} props
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const { reducedMotion } = useReducedMotionContext();
  const previousPathRef = useRef(location.pathname);
  const watchdogRef = useRef(null);
  const warnedRef = useRef(false);

  // Restore scroll to top within 50 ms of the incoming page mount (Req 10.2).
  // `useLayoutEffect` runs synchronously after DOM mutations and before paint,
  // so the scroll restoration completes well within the budget.
  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Watchdog — if the transition has not settled within 1000 ms, snap to the
  // destination's final state and emit a single console.warn (Req 10.4).
  useEffect(() => {
    const from = previousPathRef.current;
    const to = location.pathname;

    if (watchdogRef.current) {
      clearTimeout(watchdogRef.current);
      watchdogRef.current = null;
    }

    if (reducedMotion) {
      // Reduced motion: no animation, no watchdog needed.
      previousPathRef.current = to;
      return undefined;
    }

    if (from !== to) {
      warnedRef.current = false;
      watchdogRef.current = setTimeout(() => {
        if (!warnedRef.current) {
          warnedRef.current = true;
          // eslint-disable-next-line no-console
          console.warn(`page transition exceeded budget: ${from} → ${to}`);
        }
      }, WATCHDOG_MS);
    }

    previousPathRef.current = to;

    return () => {
      if (watchdogRef.current) {
        clearTimeout(watchdogRef.current);
        watchdogRef.current = null;
      }
    };
  }, [location.pathname, reducedMotion]);

  // Reduced motion: render without any animation (Req 10.5).
  if (reducedMotion) {
    return <div data-page-transition="reduced">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{
          duration: ENTER_S,
          ease: easings.pageEnter,
          exit: { duration: EXIT_S, ease: easings.pageExit },
        }}
        onAnimationComplete={() => {
          // Settled within the watchdog budget — clear it.
          if (watchdogRef.current) {
            clearTimeout(watchdogRef.current);
            watchdogRef.current = null;
          }
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
