import { useEffect, useRef } from "react";
import * as THREE from "three";
import { semantic, colors } from "../design/colors";

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
 * This task explicitly defers IntersectionObserver pause/resume, the
 * mobile pixel-ratio cap, the WebGL context-loss SVG fallback, the
 * reduced-motion final pose, and the GSAP-driven idle pulse — those are
 * tasks 5.2, 5.3, and 5.4.
 */
export function ForgeCore() {
  const containerRef = useRef(null);

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
    renderer.setPixelRatio(window.devicePixelRatio);
    // Reference the new background token explicitly. Alpha 0 keeps the
    // canvas transparent so the hero's underlying decor composes cleanly.
    renderer.setClearColor(new THREE.Color(colors.background.primary), 0);
    container.appendChild(renderer.domElement);

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

    // --- render loop ---------------------------------------------------
    let raf = 0;
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
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
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
  }, []);

  return (
    <div ref={containerRef} aria-hidden="true" className="w-full h-full" />
  );
}
