import { IconResolver } from './IconResolver'

export function FeatureGrid({ features }) {
  return (
    <div className="space-y-6">
      {features.map((feature) => (
        <div key={feature.id} className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-md"
            style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
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
  )
}