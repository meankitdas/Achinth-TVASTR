export function DiagramFlow({ steps, description }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-4">
            <div
              className="px-6 py-3 rounded-lg border text-center"
              style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-default)' }}
            >
              <p className="text-sm font-semibold text-txt-primary">{step}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="text-telemetry-primary text-2xl">→</div>
            )}
          </div>
        ))}
      </div>
      
      {description && (
        <p className="text-base text-txt-secondary leading-relaxed text-center max-w-4xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}
