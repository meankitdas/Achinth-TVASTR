/**
 * @file src/animation/gsap.js
 * @description Canonical GSAP entrypoint for the Light_Theme Industrial redesign.
 *
 * Side-effect module imported once from `src/main.jsx` (before `<App />` mounts).
 * Registers the `ScrollTrigger` plugin exactly once via a module-level guard so
 * Vite HMR re-imports of this module cannot double-register the plugin.
 *
 * Exports:
 *   - `gsap`            — the canonical `gsap` instance shared by the app
 *   - `ScrollTrigger`   — the `ScrollTrigger` plugin
 *   - `gsapContext()`   — thin wrapper around `gsap.context(fn, scope)`
 *   - `killAll(scope?)` — releases every active timeline and ScrollTrigger
 *                         inside `scope`, or all of them when `scope` is
 *                         `undefined`. Used at route-change cleanup so no
 *                         animation callbacks survive a route exit (Req 8.4).
 *   - `RegistrationError` — thrown when `gsap.registerPlugin(ScrollTrigger)`
 *                           fails. Also emits a single `console.warn` so the
 *                           failure surfaces in dev tools.
 *
 * Requirements: 4.2, 4.3, 8.4
 * Design: §Components and Interfaces > Animation infrastructure
 *         (`src/animation/gsap.js`); §Hero choreography > Mount + scroll +
 *         route-exit sequence.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Error thrown when the ScrollTrigger plugin fails to register.
 * Preserves the underlying cause for diagnostics.
 */
export class RegistrationError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = "RegistrationError";
    if (cause !== undefined) {
      this.cause = cause;
    }
  }
}

// Module-level guard. HMR may re-evaluate this module, but ES module bindings
// are cached per-graph and `registered` will already be `true` on subsequent
// imports within the same session. The explicit `let` makes the intent obvious
// and lets us reason about HMR safety locally.
let registered = false;

if (!registered) {
  try {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  } catch (err) {
    // Surface the failure in dev tools, then re-throw a typed error so callers
    // (and the watchdog in PageTransition / hero timeline) can react.
    // eslint-disable-next-line no-console
    console.warn("GSAP ScrollTrigger registration failed", err);
    throw new RegistrationError("GSAP ScrollTrigger registration failed", err);
  }
}

/**
 * Thin wrapper around `gsap.context(fn, scope)` so consumers can import a
 * single canonical symbol instead of reaching into the `gsap` namespace.
 *
 * @param {Function} fn - Setup function that creates timelines / ScrollTriggers.
 * @param {Element | string | object} [scope] - DOM scope passed to gsap.context.
 * @returns {gsap.Context} The GSAP context (call `.revert()` to clean up).
 */
export function gsapContext(fn, scope) {
  return gsap.context(fn, scope);
}

/**
 * Kill every active timeline and ScrollTrigger inside `scope`. When `scope` is
 * `undefined`, kills every active animation in the GSAP graph.
 *
 * - For ScrollTriggers, a trigger is considered "inside scope" when its
 *   `trigger` element is contained by the scope element.
 * - For tweens, scoped killing targets every descendant element of `scope`;
 *   the global path uses `gsap.killTweensOf('*')`.
 *
 * @param {Element} [scope] - Optional DOM element used to bound the cleanup.
 */
export function killAll(scope) {
  const triggers = ScrollTrigger.getAll();
  triggers.forEach((t) => {
    if (!scope || (t.trigger && scope.contains(t.trigger))) {
      t.kill();
    }
  });

  if (scope) {
    gsap
      .getTweensOf(scope.querySelectorAll("*"))
      .forEach((tween) => tween.kill());
  } else {
    gsap.killTweensOf("*");
  }
}

export { gsap, ScrollTrigger };
