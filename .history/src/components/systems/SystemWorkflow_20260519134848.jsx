import { colors } from "../../design/colors";

/**
 * SystemWorkflow — Horizontal step diagram.
 *
 * Matches the home page's MultiGate stage-flow pattern: green-bordered
 * nodes with mono numerals, connected by green arrows.
 *
 * Props:
 *   steps — string[] of step labels
 *   outputs — optional string[] shown after an arrow at the end
 */
export function SystemWorkflow({ steps, outputs }) {
  return (
    <div className="mt-8 mb-4">
      {/* Steps row — wraps on mobile */}
      <div className="flex flex-wrap items-center gap-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div
              className="flex flex-col items-center text-center px-4 py-3 min-w-[110px] rounded-lg"
              style={{
                background: "var(--bg-panel)",
                border: "1px solid var(--border-default)",
              }}
            >
              <span
                className="font-mono text-[10px] tracking-[0.24em] uppercase mb-1"
                style={{ color: "var(--signal-glow)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-medium leading-snug text-txt-primary">
                {step}
              </span>
            </div>
            {/* Arrow between steps */}
            {i < steps.length - 1 && (
              <svg
                className="mx-1.5 flex-shrink-0"
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M0 8h16M12 4l4 4-4 4"
                  stroke={colors.process.primary}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}

        {/* Outputs section */}
        {outputs && outputs.length > 0 && (
          <>
            <svg
              className="mx-2 flex-shrink-0"
              width="24"
              height="16"
              viewBox="0 0 24 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0 8h20M16 4l4 4-4 4"
                stroke={colors.process.primary}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="px-5 py-3 rounded-lg"
              style={{
                background: "rgba(0,60,51,0.06)",
                border: "1px solid rgba(0,60,51,0.18)",
              }}
            >
              <p
                className="font-mono text-[10px] tracking-[0.24em] uppercase mb-2"
                style={{ color: "var(--process-primary)" }}
              >
                Output
              </p>
              <ul className="space-y-1">
                {outputs.map((out, i) => (
                  <li
                    key={i}
                    className="text-sm font-medium"
                    style={{ color: "var(--process-primary)" }}
                  >
                    {out}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
