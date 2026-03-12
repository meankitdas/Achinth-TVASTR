import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute — Wraps routes that require authentication.
 *
 * Behavior:
 *   - While loading session: shows a minimal loading indicator
 *   - If no session: redirects to /portal (login page)
 *   - If session exists: renders children
 */
export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0a0b' }}
      >
        <div className="flex flex-col items-center gap-4">
          {/* Pulsing forge diamond loader */}
          <div
            className="w-8 h-8"
            style={{
              background: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.3)',
              transform: 'rotate(45deg)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <span className="text-xs text-metallic-500 tracking-widest uppercase">
            Verifying access...
          </span>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/portal" replace />
  }

  return children
}
