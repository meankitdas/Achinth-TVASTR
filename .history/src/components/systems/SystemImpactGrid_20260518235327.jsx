/**
 * SystemImpactGrid — Two-column business impact layout.
 *
 * Props:
 *   operational — string[] bullet points for left column
 *   strategic   — string[] bullet points for right column
 */
export function SystemImpactGrid({ operational, strategic }) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left — Operational */}
      <div
        className="p-6"
        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
      >
        <h3 className="text-sm font-bold text-gray-800 tracking-wide uppercase mb-4">
          Operational Impact
        </h3>
        <ul className="space-y-3">
          {operational.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
              <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Right — Strategic */}
      <div
        className="p-6"
        style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
      >
        <h3 className="text-sm font-bold text-gray-800 tracking-wide uppercase mb-4">
          Strategic Impact
        </h3>
        <ul className="space-y-3">
          {strategic.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
              <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-400" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
