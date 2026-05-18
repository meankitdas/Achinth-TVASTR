import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { cardClipPath } from "../design/clipPaths";
import { colors } from "../design/colors";
import { useReducedMotionContext } from "../animation/MotionConfig";

/**
 * Convert a 6-digit hex into an `rgba()` string at the requested alpha.
 * Used so the defect grid can derive transparent overlays from the
 * `colors.signal.warning` Theme_Token without hard-coding any hex literal
 * outside of `src/design/` import lines (Property 15).
 *
 * @param {string} hex 6-digit `#RRGGBB`
 * @param {number} alpha 0..1
 * @returns {string} `rgba(r, g, b, alpha)`
 */
function hexToRgba(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Parse an `rgba(r, g, b, a)` string into its components. Tolerant of the
 * extra whitespace / variable digit counts emitted from `src/design/colors.js`
 * so border tokens can be sampled at a different alpha for hover treatments.
 *
 * @param {string} rgba
 * @returns {{ r: number, g: number, b: number, a: number }}
 */
function parseRgba(rgba) {
  const match = rgba.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/i,
  );
  if (!match) return { r: 0, g: 0, b: 0, a: 1 };
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
}

function rgbaWithAlpha(rgba, alpha) {
  const { r, g, b } = parseRgba(rgba);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const SIGNAL_WARNING = colors.signal.warning;
const SURFACE_LIGHT = colors.background.primary;
const SURFACE_MUTED = colors.background.secondary;
const SURFACE_CARD = colors.background.elevated;
const TEXT_PRIMARY = colors.text.primary;
const TEXT_MUTED = colors.text.muted;
const BORDER_SUBTLE = colors.border.subtle;

/**
 * DefectGrid — Animated visual for the Rejection Analysis System card.
 * A CSS grid with cells that randomly flicker to simulate defect detection
 * scanning. Cell colors are sourced from `colors.signal.warning` and
 * `colors.background.primary` so the grid reads against the new light
 * surface (Reqs 13.1, 13.7).
 *
 * The `paused` prop pauses the cell + scan-line animations and retains the
 * last rendered frame (Req 13.8). Animations resume when `paused` flips
 * back to false.
 *
 * @param {{ paused?: boolean }} props
 */
function DefectGrid({ paused = false }) {
  const playState = paused ? "paused" : "running";
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <div className="relative">
        {/* Detection frame corners */}
        <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-telemetry-primary opacity-70" />
        <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-telemetry-primary opacity-70" />
        <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-telemetry-primary opacity-70" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-telemetry-primary opacity-70" />

        {/* Inspection grid — 7x5 cells */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: "repeat(7, 1fr)" }}
        >
          {Array.from({ length: 35 }).map((_, i) => {
            // Deterministic "defect" cells based on index
            const isDefect = [3, 10, 17, 22, 28].includes(i);
            const isScanning = [7, 14, 21].includes(i);
            return (
              <div
                key={i}
                className="w-7 h-7 md:w-8 md:h-8 transition-all duration-300"
                style={{
                  background: isDefect
                    ? hexToRgba(SIGNAL_WARNING, 0.25)
                    : isScanning
                      ? hexToRgba(SIGNAL_WARNING, 0.08)
                      : SURFACE_LIGHT,
                  border: isDefect
                    ? `1px solid ${hexToRgba(SIGNAL_WARNING, 0.5)}`
                    : `1px solid ${BORDER_SUBTLE}`,
                  animation: isDefect
                    ? `defectPulse ${1.5 + (i % 3) * 0.4}s ease-in-out infinite`
                    : "none",
                  animationPlayState: playState,
                }}
              />
            );
          })}
        </div>

        {/* Scanning line */}
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${hexToRgba(SIGNAL_WARNING, 0.6)}, transparent)`,
            animation: "scanLine 3s linear infinite",
            animationPlayState: playState,
            top: "40%",
          }}
        />
      </div>

      {/* Status readout */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <span className="text-xs text-telemetry-primary font-mono opacity-60">
          SCAN ACTIVE
        </span>
        <span className="text-xs text-txt-secondary font-mono opacity-40">
          5 DEFECTS / 35
        </span>
      </div>
    </div>
  );
}

/**
 * DataFlowNetwork — Animated visual for Plant Intelligence card.
 * Nodes connected by animated flowing lines simulating data flow.
 *
 * The `paused` prop freezes the SVG `<animateMotion>` elements so the dots
 * retain their last rendered position when the card is mostly out of view
 * (Req 13.8).
 *
 * @param {{ paused?: boolean }} props
 */
function DataFlowNetwork({ paused = false }) {
  const nodes = [
    { x: 50, y: 20, label: "ERP" },
    { x: 20, y: 55, label: "SQL" },
    { x: 80, y: 55, label: "RAG" },
    { x: 50, y: 80, label: "NLQ" },
    { x: 50, y: 50, label: "AI", center: true },
  ];

  const connections = [
    { x1: 50, y1: 20, x2: 50, y2: 50 },
    { x1: 20, y1: 55, x2: 50, y2: 50 },
    { x1: 80, y1: 55, x2: 50, y2: 50 },
    { x1: 50, y1: 50, x2: 50, y2: 80 },
  ];

  // Refs to every <animateMotion> so we can pause/resume the SVG SMIL
  // timeline manually when the card crosses the 50 % / 10 % viewport gate.
  const motionRefs = useRef([]);
  motionRefs.current = [];

  useEffect(() => {
    motionRefs.current.forEach((el) => {
      if (!el) return;
      try {
        if (paused) {
          el.pauseAnimations?.();
        } else {
          el.unpauseAnimations?.();
        }
      } catch {
        // jsdom and some browsers do not implement SMIL controls; the
        // visual either runs or it doesn't, but it must not throw.
      }
    });
  }, [paused]);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <svg
        viewBox="0 0 100 100"
        className="w-full max-w-[240px] max-h-[240px]"
        style={{ overflow: "visible" }}
      >
        {/* Connection lines */}
        {connections.map((c, i) => (
          <g key={i}>
            <line
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke={BORDER_SUBTLE}
              strokeWidth="0.5"
            />
            {/* Animated flow dot */}
            <circle r="0.8" fill={SIGNAL_WARNING} opacity="0.7">
              <animateMotion
                ref={(el) => {
                  if (el) motionRefs.current.push(el);
                }}
                dur={`${1.8 + i * 0.4}s`}
                repeatCount="indefinite"
                path={`M${c.x1},${c.y1} L${c.x2},${c.y2}`}
              />
            </circle>
          </g>
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i}>
            {node.center ? (
              <>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill={hexToRgba(SIGNAL_WARNING, 0.1)}
                  stroke={hexToRgba(SIGNAL_WARNING, 0.5)}
                  strokeWidth="0.8"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  fill={hexToRgba(SIGNAL_WARNING, 0.3)}
                />
              </>
            ) : (
              <circle
                cx={node.x}
                cy={node.y}
                r="5"
                fill={SURFACE_LIGHT}
                stroke={BORDER_SUBTLE}
                strokeWidth="0.6"
              />
            )}
            <text
              x={node.x}
              y={node.y + 0.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={node.center ? SIGNAL_WARNING : TEXT_MUTED}
              fontSize={node.center ? "3.5" : "3"}
              fontFamily="Inter, sans-serif"
              fontWeight={node.center ? "700" : "400"}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Status readout */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
        <span className="text-xs text-telemetry-primary font-mono opacity-60">
          QUERYING
        </span>
        <span className="text-xs text-txt-secondary font-mono opacity-40">
          4 SOURCES
        </span>
      </div>
    </div>
  );
}

/**
 * ProductCard — Large interactive product card with 3D perspective tilt on hover.
 *
 * Implements the 50 % viewport-area gate from Reqs 13.7 and 13.8: an
 * `IntersectionObserver` with thresholds `[0.1, 0.5]` drives an `inView`
 * state. When ≥ 50 % of the card is in view the animated visual runs;
 * when < 10 % is in view the visual is paused and retains its last
 * rendered frame.
 *
 * Props:
 *   product — { title, subtitle, description, capabilities, tag, badge, note }
 *   visual — 'defect' | 'dataflow'
 *   index — card position (for accent color variation)
 */
export function ProductCard({ product, visual, index }) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(true);
  const cardRef = useRef(null);
  const { reducedMotion } = useReducedMotionContext();
  const isAdvanced = product.badge === "Full Stack Only"; // Slightly dimmed for PI

  // 50 %-in-view gate (Reqs 13.7, 13.8). Thresholds at 0.1 and 0.5 so the
  // observer fires when the card crosses either boundary; ratios in
  // between are treated as a hold (no flip). The animated visual runs only
  // when at least 50 % of the card area is in view, and pauses (retaining
  // the last frame) when less than 10 % is in view.
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.intersectionRatio >= 0.5) {
          setInView(true);
        } else if (entry.intersectionRatio < 0.1) {
          setInView(false);
        }
      },
      { threshold: [0.1, 0.5] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const animationsActive = inView && !reducedMotion;
  const visualPaused = !animationsActive;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full h-full cursor-default select-none"
    >
      <div
        className="relative h-full flex flex-col lg:flex-row overflow-hidden transition-all duration-300 ease-out"
        style={{
          clipPath: cardClipPath,
          background: SURFACE_CARD,
          border: hovered
            ? `1px solid ${hexToRgba(SIGNAL_WARNING, 0.3)}`
            : `1px solid ${BORDER_SUBTLE}`,
          boxShadow: hovered
            ? `0 0 60px ${hexToRgba(SIGNAL_WARNING, 0.08)}, 0 40px 80px ${rgbaWithAlpha(
                colors.border.strong,
                0.18,
              )}`
            : `0 20px 60px ${rgbaWithAlpha(colors.border.default, 0.18)}`,
        }}
      >
        {/* Top warning accent strip */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, transparent, ${hexToRgba(SIGNAL_WARNING, 0.6)}, transparent)`,
            opacity: hovered ? 1 : 0.3,
          }}
        />

        {/* Content side */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          {/* Product number + tag + badge */}
          <div>
            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <span
                className="text-xs font-mono tracking-widest opacity-60"
                style={{ color: TEXT_MUTED }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div
                className="w-px h-4 opacity-60"
                style={{ background: BORDER_SUBTLE }}
              />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1"
                style={{
                  color: SIGNAL_WARNING,
                  background: hexToRgba(SIGNAL_WARNING, 0.08),
                  border: `1px solid ${hexToRgba(SIGNAL_WARNING, 0.2)}`,
                }}
              >
                {product.tag}
              </span>
              {product.badge && (
                <>
                  <div
                    className="w-px h-4 opacity-40"
                    style={{ background: BORDER_SUBTLE }}
                  />
                  <span
                    className="text-xs font-medium tracking-wider uppercase px-2.5 py-1"
                    style={{
                      color: isAdvanced ? colors.text.secondary : TEXT_MUTED,
                      background: SURFACE_MUTED,
                      border: `1px solid ${BORDER_SUBTLE}`,
                    }}
                  >
                    {product.badge}
                  </span>
                </>
              )}
            </div>

            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4"
              style={{ color: TEXT_PRIMARY }}
            >
              {product.title}
            </h2>

            <p className="text-base text-txt-secondary leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          {/* Capabilities list + Learn More */}
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-txt-muted mb-3">
              Capabilities
            </p>
            <ul className="space-y-2 mb-6">
              {product.capabilities.map((cap, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-sm text-txt-secondary"
                >
                  <span
                    className="flex-shrink-0 w-1 h-1 rounded-full"
                    style={{ background: SIGNAL_WARNING }}
                  />
                  {cap}
                </li>
              ))}
            </ul>

            {/* Learn More — only renders if product has a route */}
            {product.route && (
              <Link
                to={product.route}
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200"
                style={{ color: SIGNAL_WARNING }}
              >
                Learn More
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path
                    d="M0 5h11M8 2l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Visual side */}
        <div
          className="lg:w-[320px] xl:w-[360px] flex-shrink-0 min-h-[200px] lg:min-h-0 relative"
          style={{
            background: SURFACE_MUTED,
            borderLeft: `1px solid ${BORDER_SUBTLE}`,
            opacity: isAdvanced ? 0.92 : 1,
          }}
        >
          {visual === "defect" ? (
            <DefectGrid paused={visualPaused} />
          ) : (
            <DataFlowNetwork paused={visualPaused} />
          )}
        </div>
      </div>
    </div>
  );
}
