/**
 * @file src/components/effects/CursorFollower.jsx
 * @description Single-instance cursor follower that trails the pointer with
 * a small motion.div halo on fine-pointer, large-viewport devices.
 *
 * Behavior (Reqs 11.3–11.5, 11.7, 11.9, 18.2):
 *   - Renders one root `<motion.div>` (max radius 24 px, opacity ∈ [0.20, 0.35]).
 *   - Fades to opacity 0 over 200–600 ms after 2 s of pointer inactivity.
 *   - Re-fades back to visible opacity within 200 ms on the next `pointermove`.
 *   - Returns `null` when `(pointer: coarse)` matches, viewport < 640 px,
 *     or `Reduced_Motion` is active.
 *
 * Implements Requirements 4.4, 4.5, 5.1, 11.3, 11.4, 11.5, 11.7, 11.8,
 * 11.9, 18.2. Design: §Components and Interfaces > Animation infrastructure
 * (`<CursorFollower />`).
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { durations } from "../../animation/motion";
import { useReducedMotionContext } from "../../animation/MotionConfig";

const RADIUS_PX = durations.cursorFollowerMaxRadiusPx; // 24
const OPACITY_VISIBLE = durations.cursorFollowerOpacityMax; // 0.35
const IDLE_AFTER_MS = durations.cursorFollowerIdleAfterMs; // 2000
const FADE_OUT_MS = durations.cursorFollowerFadeOutMs; // 400 ∈ [200, 600]
const FADE_IN_MS = durations.cursorFollowerFadeInMs; // 180 ≤ 200

function shouldDisable(reducedMotion) {
  if (typeof window === "undefined") return true;
  if (reducedMotion) return true;
  const width =
    typeof window.innerWidth === "number" ? window.innerWidth : 1024;
  if (width < 640) return true;
  if (typeof window.matchMedia === "function") {
    try {
      const mql = window.matchMedia("(pointer: coarse)");
      if (mql && mql.matches) return true;
    } catch {
      // fall through
    }
  }
  return false;
}

export default function CursorFollower() {
  const { reducedMotion } = useReducedMotionContext();
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  // Re-evaluate gating on mount and on viewport / pointer-capability changes.
  useEffect(() => {
    const evaluate = () => setEnabled(!shouldDisable(reducedMotion));
    evaluate();
    if (typeof window === "undefined") return undefined;

    window.addEventListener("resize", evaluate);
    let coarseMql = null;
    let coarseChange = null;
    if (typeof window.matchMedia === "function") {
      try {
        coarseMql = window.matchMedia("(pointer: coarse)");
        coarseChange = () => evaluate();
        if (typeof coarseMql.addEventListener === "function") {
          coarseMql.addEventListener("change", coarseChange);
        } else if (typeof coarseMql.addListener === "function") {
          coarseMql.addListener(coarseChange);
        }
      } catch {
        coarseMql = null;
      }
    }

    return () => {
      window.removeEventListener("resize", evaluate);
      if (coarseMql && coarseChange) {
        if (typeof coarseMql.removeEventListener === "function") {
          coarseMql.removeEventListener("change", coarseChange);
        } else if (typeof coarseMql.removeListener === "function") {
          coarseMql.removeListener(coarseChange);
        }
      }
    };
  }, [reducedMotion]);

  // Track pointer movement and idle fade.
  useEffect(() => {
    if (!enabled) return undefined;
    if (typeof window === "undefined") return undefined;

    let idleTimer = 0;

    const handleMove = (event) => {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
      if (idleTimer !== 0) {
        clearTimeout(idleTimer);
      }
      idleTimer = window.setTimeout(() => {
        setVisible(false);
      }, IDLE_AFTER_MS);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (idleTimer !== 0) clearTimeout(idleTimer);
    };
  }, [enabled]);

  if (!enabled) return null;

  const fadeDurationSeconds = (visible ? FADE_IN_MS : FADE_OUT_MS) / 1000;

  return (
    <motion.div
      aria-hidden="true"
      data-testid="cursor-follower"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: RADIUS_PX * 2,
        height: RADIUS_PX * 2,
        marginLeft: -RADIUS_PX,
        marginTop: -RADIUS_PX,
        borderRadius: "50%",
        background: "rgba(0, 60, 51, 0.32)",
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform, opacity",
      }}
      animate={{
        x: position.x,
        y: position.y,
        opacity: visible ? OPACITY_VISIBLE : 0,
      }}
      transition={{
        x: { duration: 0.05, ease: "linear" },
        y: { duration: 0.05, ease: "linear" },
        opacity: { duration: fadeDurationSeconds, ease: "easeOut" },
      }}
    />
  );
}
