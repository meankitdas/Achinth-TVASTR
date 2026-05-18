/**
 * RuntimeLoader — Minimal industrial pulse animation.
 * 
 * Three pulsing dots in telemetry blue. Operational, not theatrical.
 * Replaces the previous ForgeLoader (molten metal animation).
 */
export function RuntimeLoader({ message = 'Loading...' }) {
  return (
    <div className="runtime-loader">
      <div className="runtime-loader-dots">
        <div className="runtime-loader-dot" />
        <div className="runtime-loader-dot" />
        <div className="runtime-loader-dot" />
      </div>
      {message && <p className="runtime-loader-text">{message}</p>}
    </div>
  )
}
