/**
 * @file src/components/decor/BackgroundGrid.jsx
 * @description Fixed full-viewport industrial grid rendered once at the App
 * root and persisted across routes.
 *
 * Renders a single `<div>` with two `linear-gradient` background images (no
 * SVG) drawing 1 px lines on a 32 px × 32 px lattice in `colors.border.subtle`.
 * The root is `position: fixed; inset: 0; pointer-events: none; z-index: 0`
 * so the grid sits behind page content and never intercepts pointer events
 * (Property 13).
 *
 * Mounted once near the application root in `App.jsx` so the grid persists
 * across route transitions; the legacy `body` `background-image` declaration
 * in `src/index.css` is removed in the same change.
 *
 * See Requirements 6.1, 6.7 and design.md § Components and Interfaces >
 * Industrial decor layer; § Property 13.
 */

import { colors } from "../../design/colors";

/**
 * Renders the fixed full-viewport industrial grid.
 *
 * @returns {JSX.Element}
 */
export default function BackgroundGrid() {
  const lineColor = colors.border.subtle;

  return (
    <div
      aria-hidden="true"
      data-testid="background-grid"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
        backgroundSize: "32px 32px",
      }}
    />
  );
}
