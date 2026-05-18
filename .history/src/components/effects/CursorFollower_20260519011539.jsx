/**
 * @file src/components/effects/CursorFollower.jsx
 * @description Single-instance cursor follower that trails the pointer with
 * a small motion.div halo on fine-pointer, large-viewport devices.
 *
 * Subsequent tasks (see `tasks.md` § 3.6) will:
 *   - Render one root `<motion.div>` (max radius 24 px, opacity ∈ [0.20, 0.35]).
 *   - Fade to 0 over 200–600 ms after 2 s of pointer inactivity, fade back in
 *     within 200 ms of the next `pointermove`.
 *   - Return `null` when `(pointer: coarse)` matches, viewport < 640 px, or
 *     `reducedMotion` is true.
 *
 * This file is a deliberate placeholder — see Requirements 4.4, 4.5, 5.1,
 * 11.1, 11.2, 11.7, 11.8, 11.9, 18.2 and design.md § Components and
 * Interfaces > Animation infrastructure.
 */
