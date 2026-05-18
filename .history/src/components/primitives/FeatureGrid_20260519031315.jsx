import { IconResolver } from "./IconResolver";

/**
 * FeatureGrid — vertical list of icon + heading + description rows.
 *
 * Each row carries `data-reveal-item` so `useSectionReveal` (Property 10
 * / Req 9.4) staggers them after the section heading and subheading.
 * The hook caps the total stagger window to
 * `min(stagger × (N − 1), 1500) ms`.
 */
export function FeatureGrid({ features }) {
  return (
    <div className="space-y-6">
      {features.map((feature) => (
        <div
          key={feature.id}
          data-reveal-item
          className="flex items-start gap-4"
        >
          <div
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md"
            style={{
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
            }}
          >
            <IconResolver iconId={feature.icon} />
          </div>
          <div>
            <h4 className="text-base font-bold text-metallic-100 mb-1">
              {feature.name}
            </h4>
            <p className="text-sm text-metallic-400 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
