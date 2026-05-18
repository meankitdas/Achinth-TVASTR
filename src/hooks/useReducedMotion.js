/**
 * @file src/hooks/useReducedMotion.js
 * @description Single source of truth for `prefers-reduced-motion: reduce`
 * detection. Consumed by `MotionConfig.jsx`, hero choreography, page
 * transitions, magnetic hover, and Forge_Core idle pulses.
 *
 * Implements Requirements 5.2, 5.6, 5.7, 5.8 and design.md
 * § Components and Interfaces > Animation infrastructure
 * (`src/hooks/useReducedMotion.js`):
 *   - Subscribes to `window.matchMedia('(prefers-reduced-motion: reduce)')`
 *     and re-renders on the `change` event so OS-level toggles propagate
 *     within 500 ms.
 *   - Evaluates synchronously during the initial render via
 *     `useSyncExternalStore` so the value is correct before the first
 *     animation frame is scheduled (Req 5.7).
 *   - On detection failure (`matchMedia` is undefined or throws), returns
 *     `{ reducedMotion: true, detectionFailed: true }` and emits a single
 *     `console.warn` per page load (Req 5.8).
 */

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// Encoded snapshots so `useSyncExternalStore`'s referential-equality check
// remains stable across re-renders.
const SNAPSHOT_REDUCED = "reduced:true";
const SNAPSHOT_NOT_REDUCED = "reduced:false";
const SNAPSHOT_DETECTION_FAILED = "reduced:detection-failed";

// Module-level latch so the detection-failure warning fires at most once per
// page load, no matter how many components consume the hook.
let warnedDetectionFailed = false;

/**
 * Resolve the `MediaQueryList` for the reduced-motion query, returning
 * `null` when `window.matchMedia` is unavailable or throws.
 */
function getMediaQueryList() {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return null;
  }
  try {
    return window.matchMedia(QUERY);
  } catch {
    return null;
  }
}

function getSnapshot() {
  const mql = getMediaQueryList();
  if (!mql) return SNAPSHOT_DETECTION_FAILED;
  try {
    return mql.matches ? SNAPSHOT_REDUCED : SNAPSHOT_NOT_REDUCED;
  } catch {
    return SNAPSHOT_DETECTION_FAILED;
  }
}

/**
 * Server snapshot — assume reduced motion on the server so SSR markup
 * matches the safest visual state and any subsequent client snapshot
 * change is the user's actual preference.
 */
function getServerSnapshot() {
  return SNAPSHOT_REDUCED;
}

function subscribe(callback) {
  const mql = getMediaQueryList();
  if (!mql) return () => {};

  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", callback);
    return () => {
      mql.removeEventListener("change", callback);
    };
  }

  // Older Safari (< 14) only exposes the deprecated addListener API.
  if (typeof mql.addListener === "function") {
    mql.addListener(callback);
    return () => {
      mql.removeListener(callback);
    };
  }

  return () => {};
}

/**
 * @returns {{ reducedMotion: boolean, detectionFailed: boolean }}
 */
export function useReducedMotion() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (snapshot === SNAPSHOT_DETECTION_FAILED) {
    if (!warnedDetectionFailed) {
      warnedDetectionFailed = true;
      // Non-blocking surface — Req 5.8.
      // eslint-disable-next-line no-console
      console.warn("Reduced motion preference detection failed");
    }
    return { reducedMotion: true, detectionFailed: true };
  }

  return {
    reducedMotion: snapshot === SNAPSHOT_REDUCED,
    detectionFailed: false,
  };
}

export default useReducedMotion;
