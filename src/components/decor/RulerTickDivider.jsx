/**
 * @file src/components/decor/RulerTickDivider.jsx
 * @description Horizontal divider rendered as a sequence of ruler-tick marks
 * used between architectural zones (e.g., on-prem ↔ cloud ↔ telemetry).
 *
 * Per Requirements 6.6/6.7 and design.md § Industrial decor layer: 6 px ticks
 * spaced 12 px apart, in `colors.border.default`. `pointer-events: none`
 * (Property 13).
 */

import { colors } from "../../design/colors";

export default function RulerTickDivider({ className = "", style = {} }) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      data-testid="ruler-tick-divider"
      className={className}
      style={{
        pointerEvents: "none",
        height: 6,
        width: "100%",
        backgroundImage: `linear-gradient(to right, ${colors.border.default} 1px, transparent 1px)`,
        backgroundSize: "12px 6px",
        backgroundRepeat: "repeat-x",
        backgroundPosition: "left bottom",
        ...style,
      }}
    />
  );
}
