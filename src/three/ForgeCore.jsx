import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { semantic, colors } from "../design/colors";
import { useReducedMotionContext } from "../animation/MotionConfig";
import { gsap } from "../animation/gsap";
import { durations } from "../animation/motion";

/**
 * Module-level latch backing the "exactly one `console.warn` per page load"
 * contract for WebGL context loss (Req 7.7, 21.5; design.md § Error Handling
 * table — "Forge_Core WebGL context lost"). Multiple `<ForgeCore />` mounts,
 * remounts under React Strict_Mode, or repeated `webglcontextlost` events
 * within a single page load all share this latch so the warning fires at
 * most once.
 */
let warnedContextLoss = false;

/**
 * ForgeCore — central icosahedron artifact rendered behind the hero copy.
 *
 * Light_Theme adaptation (task 5.1):
 *   • Base material is sourced from `colors.text.primary` (a deep graphite,
 *     CIE relative luminance ≈ 0.012) so any sampled silhouette edge pixel
 *     against the new `colors.background.primary` (luminance ≈ 1.0)
 *     clears Contrast_Ratio ≥ 1.4 with substantial headroom (Req 7.1).
 *   • Specular contribution on the inner solid is suppressed
 *     (`metalness: 0.2`, `roughness: 0.85`) so silhouettes stay near the
 *     base color regardless of view angle.
 *   • Emissive accent is read from `semantic.brand` (which equals
 *     `colors.telemetry.primary`) at mount (Req 7.2). The orbital ring
 *     uses `MeshBasicMaterial` against the brand color so the only
 *     "warm" cue on the artifact is the brand cue.
 *   • The renderer's clearColor references `colors.background.primary`
 *     so this layer never composites against a dark surface; alpha 0
 *     lets the underlying hero radial / grid overlay show through.
 *
 * Light_Theme adaptation (task 5.2):
 *   • Mobile pixel-ratio cap — `renderer.setPixelRatio` is clamped to
 *     `Math.min(window.devicePixelRatio, viewportWidth < 768 ? 1.5 : 2)`
 *     so high-DPR phones do not pay for retina-grade WebGL fill at the
 *     viewport size where Req 7.3 caps us at 1.5×, and desktops still
 *     cap at 2× (Req 7.3, 7.4).
 *   • Off-screen pause — an `IntersectionObserver` watches the canvas
 *     container; when the container is fully off-screen the render loop
 *     is paused (`cancelAnimationFrame`, no further `requestAnimationFrame`
 *     scheduled). When any portion re-enters the viewport the loop is
 *     restarted on the next animation frame, well within the 200 ms
 *     budget required by Req 7.6 (Req 7.5, 7.6).
 *   • Cleanup — the `useEffect` teardown cancels any in-flight RAF
 *     handle and disconnects the observer so no callbacks survive
 *     unmount or React Strict_Mode double-invocation.
 *
 * Light_Theme adaptation (task 5.3):
 *   • WebGL context-loss SVG fallback — a `webglcontextlost` listener on
 *     the canvas calls `event.preventDefault()` to keep the context
 *     restorable, flips local state so the component renders a static
 *     `<svg>` icosahedron silhouette in `colors.text.primary` with
 *     `semantic.brand` accents inside the same layout box, and emits
 *     exactly one `console.warn('Forge_Core WebGL context lost')` per
 *     page load via the module-level `warnedContextLoss` latch
 *     (Req 7.7, 21.5; design.md § Error Handling table).
 *   • Reduced-motion final pose — when `reducedMotion` is true (read via
 *     `useReducedMotionContext` so Motion_Layer and GSAP_Layer share a
 *     single source of truth, design.md § Animation infrastructure), the
 *     render loop is suppressed entirely. Instead, the component snaps
 *     each mesh to a deterministic final pose and renders one frame so
 *     the silhouette is present without any continuous rotation
 *     (Req 5.4, 5.5).
 *
 * Light_Theme adaptation (task 5.4):
 *   • Ambient idle pulse — the GSAP_Layer drives a subtle scale pulse on
 *     the canvas wrapper after 8 s without a `pointermove`, `scroll`,
 *     `keydown`, or `touchstart` event at the document level
 *     (`durations.forgeIdleAfterMs`, Req 11.6). The timeline runs with
 *     `repeat: -1, yoyo: true` between scale 1.0 and `forgeIdleScaleMax`
 *     (1.02), with a half-period equal to `forgeIdlePeriodMinMs / 2`
 *     so the full pulse cycle stays within the [2 s, 4 s] band Req 11.6
 *     specifies.
 *   • The next user event kills the active timeline, springs the
 *     wrapper back to scale 1, and re-arms the 8 s timer so the pulse
 *     reappears only after another idle window.
 *   • Suppressed entirely when `reducedMotion` is true (Req 11.9, 5.5).
 *     The shared `useReducedMotionContext` boolean is the single source
 *     of truth for both this gate and the rotation-loop suppression
 *     above, so a runtime toggle of the OS preference reaches both
 *     paths through a single re-mount of this effect.
 */
export function ForgeCore() {
  const containerRef = useRef(null);
  const [contextLost, setContextLost] = useState(false);
  const { reducedMotion } = useReducedMotionContext();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    // Req 7.3 — clamp DPR on viewports < 768 px to 1.5; desktops cap at 2.
    // `window.devicePixelRatio` may be `undefined` in non-browser test envs;
    // fall back to 1 in that case so the multiplication still yields a
    // sensible scalar.
    const dpr =
      typeof window !== "undefined" && window.devicePixelRatio
        ? window.devicePixelRatio
        : 1;
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1024;
    const dprCap = viewportWidth < 768 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(dpr, dprCap));
    // Reference the new background token explicitly. Alpha 0 keeps the
    // canvas transparent so the hero's underlying decor composes cleanly.
    renderer.setClearColor(new THREE.Color(colors.background.primary), 0);
    container.appendChild(renderer.domElement);

    // --- WebGL context-loss handler (task 5.3, Req 7.7, 21.5) ----------
    // `preventDefault()` allows the browser to restore the context later;
    // it does not change our fallback rendering, but keeps the platform
    // contract consistent for any consumer that listens for restore.
    const canvas = renderer.domElement;
    const onContextLost = (event) => {
      event.preventDefault();
      if (!warnedContextLoss) {
        warnedContextLoss = true;
        // eslint-disable-next-line no-console
        console.warn("Forge_Core WebGL context lost");
      }
      setContextLost(true);
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    // --- materials -----------------------------------------------------
    const brand = new THREE.Color(semantic.brand);
    const baseColor = new THREE.Color(colors.text.primary);

    const outerGeom = new THREE.IcosahedronGeometry(1.4, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.35,
      roughness: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      emissive: brand,
      emissiveIntensity: 0.08,
    });

    const innerGeom = new THREE.IcosahedronGeometry(0.9, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: baseColor,
      metalness: 0.2,
      roughness: 0.85,
      emissive: brand,
      emissiveIntensity: 0.18,
    });

    const ringGeom = new THREE.TorusGeometry(1.8, 0.022, 8, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: brand,
      transparent: true,
      opacity: 0.78,
    });

    const outer = new THREE.Mesh(outerGeom, outerMat);
    const inner = new THREE.Mesh(innerGeom, innerMat);
    const ring = new THREE.Mesh(ringGeom, ringMat);
    scene.add(outer, inner, ring);

    // --- lighting ------------------------------------------------------
    // Low-intensity neutral lights keep the silhouette dark even with
    // a glancing rim hit; brand-tinted point light sells the accent
    // without lifting silhouette luminance above the contrast budget.
    const ambient = new THREE.AmbientLight(0xffffff, 0.32);
    const key = new THREE.DirectionalLight(0xffffff, 0.55);
    key.position.set(2, 3, 4);
    const rim = new THREE.PointLight(brand, 0.7, 8);
    rim.position.set(-2, -1, 1.5);
    scene.add(ambient, key, rim);

    // --- sizing --------------------------------------------------------
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // --- reduced-motion final pose (task 5.3, Req 5.4, 5.5) ------------
    // Snap meshes to a deterministic final pose, render one frame, and
    // skip the RAF loop entirely. The pose is stable across mounts so the
    // silhouette never shifts between renders for a reduced-motion user.
    if (reducedMotion) {
      outer.rotation.set(0.4, 0.7, 0.0);
      inner.rotation.set(-0.3, 0.5, 0.2);
      ring.rotation.set(0.6, 0.0, 0.3);
      renderer.render(scene, camera);
      return () => {
        canvas.removeEventListener("webglcontextlost", onContextLost, false);
        ro.disconnect();
        outerGeom.dispose();
        innerGeom.dispose();
        ringGeom.dispose();
        outerMat.dispose();
        innerMat.dispose();
        ringMat.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    }

    // --- render loop ---------------------------------------------------
    // `paused` is flipped by the IntersectionObserver below. While paused
    // we stop scheduling further frames entirely (rather than ticking a
    // no-op render) so the browser can fully idle the WebGL backbuffer.
    let raf = 0;
    let paused = false;
    let last = performance.now();
    const tick = (now) => {
      const delta = (now - last) / 1000;
      last = now;

      outer.rotation.y += delta * 0.28;
      outer.rotation.x += delta * 0.12;

      inner.rotation.y -= delta * 0.45;
      inner.rotation.z += delta * 0.18;

      ring.rotation.x += delta * 0.35;
      ring.rotation.z -= delta * 0.22;

      renderer.render(scene, camera);
      if (!paused) {
        raf = requestAnimationFrame(tick);
      }
    };
    const startLoop = () => {
      // Reset the timestamp baseline so the first post-resume frame
      // doesn't apply a giant accumulated delta to the rotations.
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    startLoop();

    // --- off-screen pause (Req 7.5, 7.6) -------------------------------
    // We observe the canvas container itself. When `intersectionRatio`
    // drops to 0 the hero is fully off-screen and we cancel the next
    // animation frame; on re-entry we restart the loop synchronously,
    // which the browser will dispatch on the next animation frame —
    // well inside the 200 ms budget.
    let observer = null;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const offscreen =
              !entry.isIntersecting || entry.intersectionRatio === 0;
            if (offscreen && !paused) {
              paused = true;
              cancelAnimationFrame(raf);
              raf = 0;
            } else if (!offscreen && paused) {
              paused = false;
              startLoop();
            }
          }
        },
        { threshold: [0, 0.01] },
      );
      observer.observe(container);
    }

    // --- ambient idle pulse (task 5.4, Req 11.6, 11.9, 5.5) ------------
    // Track document-level user activity. After
    // `durations.forgeIdleAfterMs` (8 s) without a `pointermove`,
    // `scroll`, `keydown`, or `touchstart` event we kick off a GSAP
    // timeline that yo-yos the wrapper between scale 1 and
    // `durations.forgeIdleScaleMax` (1.02). Half-period equals
    // `durations.forgeIdlePeriodMinMs / 2`, so the full A→B→A cycle is
    // exactly `forgeIdlePeriodMinMs` (2 s) — comfortably inside the
    // [2 s, 4 s] band Req 11.6 specifies and at the calmest end of it.
    //
    // The next activity event kills the timeline, springs the wrapper
    // back to scale 1 over a short transition, and re-arms the 8 s
    // timer. Reduced-motion users see no listeners, no timer, and no
    // timeline (Req 11.9, 5.5).
    let idleTimer = 0;
    let idlePulseTl = null;
    const FORGE_IDLE_AFTER_MS = durations.forgeIdleAfterMs;
    const FORGE_IDLE_SCALE_MAX = durations.forgeIdleScaleMax;
    const FORGE_IDLE_HALF_PERIOD_S = durations.forgeIdlePeriodMinMs / 2 / 1000;

    const startIdlePulse = () => {
      // Guard against the rare case where the wrapper was unmounted
      // between the timer firing and this callback running (e.g. fast
      // unmount inside StrictMode); GSAP would otherwise warn about a
      // missing target.
      if (!container.isConnected) return;
      if (idlePulseTl) {
        idlePulseTl.kill();
      }
      idlePulseTl = gsap.timeline({ repeat: -1, yoyo: true });
      idlePulseTl.to(container, {
        scale: FORGE_IDLE_SCALE_MAX,
        duration: FORGE_IDLE_HALF_PERIOD_S,
        ease: "sine.inOut",
      });
    };

    const armIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      idleTimer = setTimeout(startIdlePulse, FORGE_IDLE_AFTER_MS);
    };

    const onActivity = () => {
      if (idlePulseTl) {
        idlePulseTl.kill();
        idlePulseTl = null;
        // Snap back to the resting scale so a long user interaction
        // never leaves the wrapper at the pulse's apex (1.02×).
        gsap.to(container, {
          scale: 1,
          duration: 0.2,
          ease: "sine.out",
          overwrite: true,
        });
      }
      armIdleTimer();
    };

    // Reduced-motion users skip the entire pulse path — no listeners
    // attached, no timer scheduled, no timeline ever created (Req 11.9).
    const idlePulseEnabled = !reducedMotion;
    const idleListenerOpts = { passive: true };
    if (idlePulseEnabled) {
      armIdleTimer();
      document.addEventListener("pointermove", onActivity, idleListenerOpts);
      document.addEventListener("scroll", onActivity, idleListenerOpts);
      document.addEventListener("keydown", onActivity, idleListenerOpts);
      document.addEventListener("touchstart", onActivity, idleListenerOpts);
    }

    return () => {
      cancelAnimationFrame(raf);
      raf = 0;
      paused = true;
      canvas.removeEventListener("webglcontextlost", onContextLost, false);
      if (observer) observer.disconnect();
      ro.disconnect();
      if (idlePulseEnabled) {
        document.removeEventListener(
          "pointermove",
          onActivity,
          idleListenerOpts,
        );
        document.removeEventListener("scroll", onActivity, idleListenerOpts);
        document.removeEventListener("keydown", onActivity, idleListenerOpts);
        document.removeEventListener(
          "touchstart",
          onActivity,
          idleListenerOpts,
        );
      }
      if (idleTimer) {
        clearTimeout(idleTimer);
        idleTimer = 0;
      }
      if (idlePulseTl) {
        idlePulseTl.kill();
        idlePulseTl = null;
      }
      // Drop any in-flight scale tween started by `onActivity` so the
      // teardown leaves no GSAP callbacks scheduled against `container`.
      gsap.killTweensOf(container);
      outerGeom.dispose();
      innerGeom.dispose();
      ringGeom.dispose();
      outerMat.dispose();
      innerMat.dispose();
      ringMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  // SVG fallback rendered on context loss (task 5.3, Req 7.7, 21.5).
  // Layout box: same `w-full h-full` wrapper as the canvas container so
  // the hero composition's bounding rect is preserved exactly. The
  // canvas wrapper stays in the tree (with `display: none`) so the
  // `useEffect` cleanup can still reach the renderer's parentNode and
  // dispose without surprises if context loss is followed by unmount.
  return (
    <>
      {contextLost && (
        <svg
          aria-hidden="true"
          className="w-full h-full"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Outer icosahedron silhouette — six-vertex projected hex outline
              with internal struts, drawn in `colors.text.primary` to match
              the silhouette contrast tier of the live WebGL render. */}
          <g
            fill="none"
            stroke={colors.text.primary}
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0.78"
          >
            <polygon points="100,28 152,58 152,118 100,148 48,118 48,58" />
            <polygon points="100,52 134,70 134,110 100,128 66,110 66,70" />
            <line x1="100" y1="28" x2="100" y2="148" />
            <line x1="48" y1="58" x2="152" y2="118" />
            <line x1="152" y1="58" x2="48" y2="118" />
            <line x1="48" y1="58" x2="100" y2="128" />
            <line x1="152" y1="58" x2="100" y2="128" />
            <line x1="48" y1="118" x2="100" y2="52" />
            <line x1="152" y1="118" x2="100" y2="52" />
          </g>
          {/* Brand-accent orbital ring — mirrors the live torus's role as
              the only "warm" cue against the silhouette. */}
          <circle
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke={semantic.brand}
            strokeWidth="1.4"
            opacity="0.85"
          />
          {/* Brand-accent core dot — picks up the inner mesh's emissive cue. */}
          <circle cx="100" cy="100" r="3.2" fill={semantic.brand} />
        </svg>
      )}
      <div
        ref={containerRef}
        aria-hidden="true"
        className="w-full h-full"
        style={contextLost ? { display: "none" } : undefined}
      />
    </>
  );
}
