/**
 * @file src/animation/gsap.js
 * @description Canonical GSAP entrypoint for the Light_Theme Industrial redesign.
 *
 * Subsequent tasks (see `tasks.md` § 3.1) will:
 *   - Import `gsap` and `ScrollTrigger`.
 *   - Register `ScrollTrigger` exactly once via a module-level guard so HMR
 *     cannot double-register the plugin.
 *   - Export `gsap`, `ScrollTrigger`, `gsapContext()` (a thin wrapper around
 *     `gsap.context`), and `killAll(scope?)` for deterministic teardown.
 *   - Throw a `RegistrationError` (and emit a single `console.warn`) if
 *     plugin registration fails.
 *
 * This file is a deliberate placeholder — see Requirements 4.2, 4.3, 8.4 and
 * design.md § Components and Interfaces > Animation infrastructure.
 */
