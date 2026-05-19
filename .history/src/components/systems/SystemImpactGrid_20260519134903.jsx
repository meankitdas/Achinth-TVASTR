import { colors } from "../../design/colors";
import { tileClipPath } from "../../design/clipPaths";

/**
 * SystemImpactGrid — Two-column business impact layout.
 *
 * Stone-background tiles with machined corners and coral bullet markers,
 * matching the home page's card patterns.
 *
 * Props:
 *   operational — string[] bullet points for left column
 *   strategic   — string[] bullet points for right column
 */
export function SystemImpactGrid({ operational, strategic }) {
  const operationalItems = Array.isArray(operational) ? operational : [];
  const strategicItems = Array.isArray(strategic) ? strategic : [];
  const hasData = operationalItems.length > 0 || strategicItems.length > 0;

  if (!hasData) {
    return (
      <div
        data-empty-state="system-impact-grid"
        className="mt-8 px-6 py-8 text-center rounded-lg"
        style={{
          background: "var(--bg-panel)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-muted)",
        }}
      >
        No impact metrics available yet.
      </div>
    );
  }

  const tileStyle = {
    background: "var(--bg-panel)",
    border: "1px solid var(--border-subtle)",
    borderRadius: 0,
    clipPath: tileClipPath,
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {operationalItems.length > 0 && (
        <div className="p-7" style={tileStyle}>
          <p
            className="font-mono text-[11px] tracking-[0.28em] uppercase mb-5"
            style={{ color: "var(--signal-glow)" }}
          >
            Operational Impact
          </p>
          <ul className="space-y-3">
            {operationalItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-txt-secondary"
              >
                <span
                  className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--signal-glow)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {strategicItems.length > 0 && (
        <div className="p-7" style={tileStyle}>
          <p
            className="font-mono text-[11px] tracking-[0.28em] uppercase mb-5"
            style={{ color: "var(--process-primary)" }}
          >
            Strategic Impact
          </p>
          <ul className="space-y-3">
            {strategicItems.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm text-txt-secondary"
              >
                <span
                  className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--process-primary)" }}
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
