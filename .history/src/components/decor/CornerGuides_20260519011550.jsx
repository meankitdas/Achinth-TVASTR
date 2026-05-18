/**
 * @file src/components/decor/CornerGuides.jsx
 * @description Four absolutely-positioned SVG corner brackets that frame the
 * primary marketing routes (`/`, `/technology`, `/about`, `/research`) and,
 * conditionally, system detail routes on viewports > 1024 px.
 *
 * Subsequent tasks (see `tasks.md` § 4.3) will:
 *   - Read `useLocation` and gate rendering on the pathname allow-list.
 *   - Draw two perpendicular 32 px line segments (50 % below 640 px) per
 *     corner, offset 16 px from the edge, 1 px stroke `colors.border.default`.
 *   - Re-evaluate length on `resize` within 200 ms.
 *   - `pointer-events: none`.
 *
 * This file is a deliberate placeholder — see Requirements 6.2, 6.6, 6.7,
 * 14.2, 14.3 and design.md § Components and Interfaces > Industrial decor
 * layer; § Property 13.
 */
