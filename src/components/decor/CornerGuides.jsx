/**
 * @file src/components/decor/CornerGuides.jsx
 * @description Four absolutely-positioned SVG corner brackets that frame the
 * primary marketing routes (`/`, `/technology`, `/about`, `/research`) and,
 * conditionally, system detail routes on viewports > 1024 px.
 *
 * Per Requirements 6.2/6.3, 14.2/14.3, 18.1, and design.md § Industrial decor
 * layer: each guide is two perpendicular line segments 32 px long (50 % below
 * 640 px), offset 16 px from the viewport edge, 1 px stroke `colors.border.default`.
 * `pointer-events: none` (Property 13). Resize is debounced to 200 ms.
 */

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { colors } from "../../design/colors";

const ALLOWED_PATHS = ["/", "/technology", "/about", "/research"];

function shouldRender(pathname, viewportWidth) {
  if (ALLOWED_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/systems/") && viewportWidth > 1024) return true;
  return false;
}

export default function CornerGuides() {
  const location = useLocation();
  const [vw, setVw] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280,
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    let timeout = null;
    const handler = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => setVw(window.innerWidth), 100);
    };
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  if (!shouldRender(location.pathname, vw)) return null;

  const length = vw < 640 ? 16 : 32;
  const offset = 16;
  const stroke = colors.border.default;

  // Each guide describes which corner it occupies. `h` tells us which vertical
  // edge holds the perpendicular line ('l' = left, 'r' = right) and `v` tells
  // us which horizontal edge holds the parallel line ('t' = top, 'b' = bottom).
  const guides = [
    { key: "tl", top: offset, left: offset, h: "l", v: "t" },
    { key: "tr", top: offset, right: offset, h: "r", v: "t" },
    { key: "bl", bottom: offset, left: offset, h: "l", v: "b" },
    { key: "br", bottom: offset, right: offset, h: "r", v: "b" },
  ];

  return (
    <div
      aria-hidden="true"
      data-testid="corner-guides"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {guides.map((g) => {
        const horizY = g.v === "t" ? 0.5 : length - 0.5;
        const vertX = g.h === "l" ? 0.5 : length - 0.5;
        return (
          <svg
            key={g.key}
            width={length}
            height={length}
            style={{
              position: "absolute",
              top: g.top,
              bottom: g.bottom,
              left: g.left,
              right: g.right,
              pointerEvents: "none",
            }}
          >
            <line
              x1={0}
              y1={horizY}
              x2={length}
              y2={horizY}
              stroke={stroke}
              strokeWidth={1}
            />
            <line
              x1={vertX}
              y1={0}
              x2={vertX}
              y2={length}
              stroke={stroke}
              strokeWidth={1}
            />
          </svg>
        );
      })}
    </div>
  );
}
