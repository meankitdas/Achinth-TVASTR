import { colors } from "../../design/colors";

/**
 * SystemWorkflow — Horizontal step diagram.
 *
 * Props:
 *   steps — string[] of step labels
 *   outputs — optional string[] shown after an arrow at the end
 *
 * Per Requirement 14.5: connector lines render with `colors.border.strong`
 * and stroke width ∈ [1, 3] px; node labels render with
 * `colors.text.primary`.
 */
export function SystemWorkflow({ steps, outputs }) {
  return (
    <div className="mt-6 mb-2">
      {/* Steps row — wraps on mobile */}
      <div className="flex flex-wrap items-center gap-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div
              className="flex flex-col items-center text-center px-4 py-3 min-w-[110px]"
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
              }}
            >
              <span
                className="text-xs font-mono font-semibold mb-1"
                style={{ color: colors.text.primary }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="text-sm font-medium leading-snug"
                style={{ color: colors.text.primary }}
              >
                {step}
              </span>
            </div>
            {/* Arrow between steps */}
            {i < steps.length - 1 && (
              <svg
                className="mx-1 flex-shrink-0"
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
              >
                <path
                  d="M0 8h16M12 4l4 4-4 4"
                  stroke={colors.border.strong}
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
            >
              <path
                d="M0 8h20M16 4l4 4-4 4"
                stroke={colors.border.strong}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="px-4 py-3"
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "6px",
              }}
            >
              <p className="text-xs font-semibold text-green-700 mb-2 tracking-wide uppercase">
                Output
              </p>
              <ul className="space-y-1">
                {outputs.map((out, i) => (
                  <li key={i} className="text-sm font-medium text-green-800">
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
