import { useState } from "react";
import { Link } from "react-router-dom";
import { cardClipPath } from "../design/clipPaths";

/**
 * DefectGrid — Animated visual for the Rejection Analysis System card.
 * A CSS grid with cells that randomly flicker to simulate defect detection scanning.
 */
function DefectGrid() {
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
                    ? "rgba(245,158,11,0.25)"
                    : isScanning
                      ? "rgba(245,158,11,0.08)"
                      : "rgba(168,168,180,0.06)",
                  border: isDefect
                    ? "1px solid rgba(245,158,11,0.5)"
                    : "1px solid rgba(168,168,180,0.08)",
                  animation: isDefect
                    ? `defectPulse ${1.5 + (i % 3) * 0.4}s ease-in-out infinite`
                    : "none",
                }}
              />
            );
          })}
        </div>

        {/* Scanning line */}
        <div
          className="absolute left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(245,158,11,0.6), transparent)",
            animation: "scanLine 3s linear infinite",
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
 */
function DataFlowNetwork() {
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
              stroke="rgba(168,168,180,0.12)"
              strokeWidth="0.5"
            />
            {/* Animated flow dot */}
            <circle r="0.8" fill="#f59e0b" opacity="0.7">
              <animateMotion
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
                  fill="rgba(245,158,11,0.1)"
                  stroke="rgba(245,158,11,0.5)"
                  strokeWidth="0.8"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="4"
                  fill="rgba(245,158,11,0.3)"
                />
              </>
            ) : (
              <circle
                cx={node.x}
                cy={node.y}
                r="5"
                fill="rgba(26,26,30,0.9)"
                stroke="rgba(168,168,180,0.2)"
                strokeWidth="0.6"
              />
            )}
            <text
              x={node.x}
              y={node.y + 0.5}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={node.center ? "#f59e0b" : "#888896"}
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
 * Props:
 *   product — { title, subtitle, description, capabilities, tag, badge, note }
 *   visual — 'defect' | 'dataflow'
 *   index — card position (for accent color variation)
 */
export function ProductCard({ product, visual, index }) {
  const [hovered, setHovered] = useState(false);
  const isAdvanced = product.badge === "Full Stack Only"; // Slightly dimmed for PI

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full h-full cursor-default select-none"
    >
      <div
        className="relative h-full flex flex-col lg:flex-row overflow-hidden transition-all duration-300 ease-out rounded-2xl"
        style={{
          background: "rgba(17,17,19,0.85)",
          border: hovered
            ? "1px solid rgba(245,158,11,0.3)"
            : "1px solid rgba(168,168,180,0.08)",
          boxShadow: hovered
            ? "0 0 60px rgba(245,158,11,0.08), 0 40px 80px rgba(0,0,0,0.6)"
            : "0 20px 60px rgba(0,0,0,0.4)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Top amber accent strip */}
        <div
          className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(245,158,11,0.6), transparent)",
            opacity: hovered ? 1 : 0.3,
          }}
        />

        {/* Content side */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-between">
          {/* Product number + tag + badge */}
          <div>
            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <span
                className="text-xs font-mono tracking-widest opacity-40"
                style={{ color: "#888896" }}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="w-px h-4 bg-metallic-600 opacity-40" />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase px-3 py-1"
                style={{
                  color: "#f59e0b",
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.15)",
                }}
              >
                {product.tag}
              </span>
              {product.badge && (
                <>
                  <div className="w-px h-4 bg-metallic-600 opacity-20" />
                  <span
                    className="text-xs font-medium tracking-wider uppercase px-2.5 py-1"
                    style={{
                      color: isAdvanced ? "#a8a8b4" : "#888896",
                      background: isAdvanced
                        ? "rgba(168,168,180,0.06)"
                        : "rgba(168,168,180,0.04)",
                      border: isAdvanced
                        ? "1px solid rgba(168,168,180,0.15)"
                        : "1px solid rgba(168,168,180,0.08)",
                    }}
                  >
                    {product.badge}
                  </span>
                </>
              )}
            </div>

            <h2
              className="text-2xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
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
                    style={{ background: "#f59e0b" }}
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
                style={{ color: "#f59e0b" }}
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
            background: "rgba(10,10,11,0.6)",
            borderLeft: "1px solid rgba(168,168,180,0.06)",
            opacity: isAdvanced ? 0.92 : 1,
          }}
        >
          {visual === "defect" ? <DefectGrid /> : <DataFlowNetwork />}
        </div>
      </div>
    </div>
  );
}
