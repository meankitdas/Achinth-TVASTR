/**
 * @file src/hooks/useMagnetic.js
 * @description Subtle magnetic hover for primary CTAs (Hero, Navbar Portal,
 * Upgrade banners). Translates a target ref toward the cursor while
 * clamping the displacement so `max(|tx|, |ty|) ≤ 8 px` (Property 8,
 * Req 11.1). Springs back to origin within 250 ms on pointer-leave
 * (Req 11.2). No-ops when the device reports `(pointer: coarse)`,
 * the viewport is narrower than 640 px, or `Reduced_Motion` is active
 * (Reqs 11.7, 11.8, 11.9, 18.2).
 *
 * Implements Requirements 5.1, 5.2, 11.1, 11.2, 11.3, 11.7, 11.8, 11.9, 18.2.
 * Design: §Components and Interfaces > Animation infrastructure
 *         (`src/hooks/useMagnetic.js`); §Property 8.
 */

import { useEffect } from "react";

import { durations } from "../animation/motion";
import { useReducedMotionContext } from "../animation/MotionConfig";

/**
 * Pure clamp that guarantees Property 8: for any real pointer offset
 * `(dx, dy)`, the returned translation `(tx, ty)` satisfies
 * `|tx| ≤ MAX` and `|ty| ≤ MAX` regardless of input magnitude. Exported
 * so the property test can call the clamp directly without mounting
 * a component.
 *
 * The mapping uses a `strength` factor that scales the raw offset toward
 * the cursor and a final hard clamp that enforces the invariant even when
 * `strength * d` exceeds the bound. Non-finite inputs (`NaN`, `±Infinity`)
 * resolve to `0` so callers never write a non-finite transform.
 *
 * @param {number} dx - Horizontal pointer offset from the element center (px).
 * @param {number} dy - Vertical pointer offset from the element center (px).
 * @param {object} [options]
 * @param {number} [options.max=8] - Maximum |tx|, |ty| in px (Property 8).
 * @param {number} [options.strength=0.25] - Linear scaling factor.
 * @returns {{ tx: number, ty: number }}
 */
export function clampMagneticTranslation(dx, dy, options) {
  const max =
    (options && typeof options.max === "number"
      ? options.max
      : durations.magneticMaxTranslatePx) || 8;
  const strength =
    options && typeof options.strength === "number" ? options.strength : 0.25;

  const safeDx = Number.isFinite(dx) ? dx : 0;
  const safeDy = Number.isFinite(dy) ? dy : 0;

  const tx = Math.max(-max, Math.min(max, safeDx * strength));
  const ty = Math.max(-max, Math.min(max, safeDy * strength));

  return { tx, ty };
}

/**
 * Resolve the no-op gating flags. Extracted so tests and the cursor
 * follower can share the same logic without duplicating the matchMedia
 * checks.
 */
function shouldDisable(reducedMotion) {
  if (typeof window === "undefined") return true;
  if (reducedMotion) return true;

  // Viewport gate (Req 18.2).
  const width =
    typeof window.innerWidth === "number" ? window.innerWidth : 1024;
  if (width < 640) return true;

  // Coarse-pointer gate (Reqs 11.7, 11.8).
  if (typeof window.matchMedia === "function") {
    try {
      const mql = window.matchMedia("(pointer: coarse)");
      if (mql && mql.matches) return true;
    } catch {
      // matchMedia threw — fall through and assume fine pointer is fine.
    }
  }

  return false;
}

/**
 * Attach a magnetic hover effect to the element referenced by `ref`.
 * The element follows the cursor (clamped to ±8 px on each axis) while
 * the pointer is over it, and springs back to the origin within 250 ms
 * on pointer-leave.
 *
 * @param {React.RefObject<HTMLElement>} ref
 */
export function useMagnetic(ref) {
  const { reducedMotion } = useReducedMotionContext();

  useEffect(() => {
    const el = ref && ref.current;
    if (!el) return undefined;
    if (shouldDisable(reducedMotion)) return undefined;

    let rafId = 0;
    let lastEvent = null;

    const apply = () => {
      rafId = 0;
      if (!lastEvent) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const { tx, ty } = clampMagneticTranslation(
        lastEvent.clientX - cx,
        lastEvent.clientY - cy,
      );
      // Smooth follow — short transition keeps the motion fluid without
      // overriding the longer spring-back transition installed in
      // `handleLeave`.
      el.style.transition = "transform 80ms linear";
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    };

    const handleMove = (event) => {
      lastEvent = event;
      if (rafId === 0) {
        rafId = requestAnimationFrame(apply);
      }
    };

    const handleLeave = () => {
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      // Spring back to origin within 250 ms (Req 11.2).
      el.style.transition = `transform ${durations.magneticReturnMs}ms cubic-bezier(0.2, 0, 0, 1)`;
      el.style.transform = "translate3d(0, 0, 0)";
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    el.addEventListener("pointercancel", handleLeave);

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
      el.removeEventListener("pointercancel", handleLeave);
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [ref, reducedMotion]);
}

export default useMagnetic;
