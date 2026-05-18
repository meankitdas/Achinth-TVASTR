import { colors } from "../../design/colors";
import { tileClipPath } from "../../design/clipPaths";

/**
 * SystemImpactGrid — Two-column business impact layout.
 *
 * Props:
 *   operational — string[] bullet points for left column
 *   strategic   — string[] bullet points for right column
 *
 * Per Requirements 14.6 and 14.7:
 *   - Each tile gets a machined-corner clip via `tileClipPath`
 *     (16 px chamfer ∈ [8, 24] px).
 *   - When no impact data is supplied, an empty-state indicator is rendered
 *     in place of the tiles.
 */
export function SystemImpactGrid({ operational, strategic }) {
  const operationalItems = Array.isArray(operational) ? operational : [];
  const strategicItems = Array.isArray(strategic) ? strategic : [];
  const hasData = operationalItems.length > 0 || strategicItems.length > 0;

  if (!hasData) {
    return (
      <div
        data-empty-state="system-impact-grid"
        className="mt-6 px-6 py-8 text-center"
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          color: colors.text.muted,
          fontSize: "0.875rem",
        }}
      >
        No impact metrics available yet.
      </div>
    );
  }

  const tileStyle = {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 0,
    clipPath: tileClipPath,
  };

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {operationalItems.length > 0 && (
        <div className="p-6" style={tileStyle}>
          <h3
            className="text-sm font-bold tracking-wide uppercase mb-4"
            style={{ color: colors.text.primary }}
          >
            Operational Impact
          </h3>
          <ul className="space-y-3">
            {operationalItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm"
                style={{ color: colors.text.secondary }}
              >
                <span
                  className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: colors.text.muted }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {strategicItems.length > 0 && (
        <div className="p-6" style={tileStyle}>
          <h3
            className="text-sm font-bold tracking-wide uppercase mb-4"
            style={{ color: colors.text.primary }}
          >
            Strategic Impact
          </h3>
          <ul className="space-y-3">
            {strategicItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm"
                style={{ color: colors.text.secondary }}
              >
                <span
                  className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: colors.text.muted }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
