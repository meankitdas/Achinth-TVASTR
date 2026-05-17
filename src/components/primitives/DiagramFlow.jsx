export function DiagramFlow({ steps, description }) {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-4">
            <div
              className="px-6 py-3 bg-charcoal-950 rounded-lg border border-metallic-800/30 text-center"
            >
              <p className="text-sm font-semibold text-metallic-100">{step}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="text-amber-forge text-2xl">→</div>
            )}
          </div>
        ))}
      </div>
      
      {description && (
        <p className="text-base text-metallic-400 leading-relaxed text-center max-w-4xl mx-auto">
          {description}
        </p>
      )}
    </div>
  )
}