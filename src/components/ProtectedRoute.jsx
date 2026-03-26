import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLicense } from '../context/LicenseContext'
import { LockedScreen } from './LockedScreen'

/**
 * ProtectedRoute — Wraps routes that require authentication and optionally tier-based capabilities.
 *
 * Props:
 *   children             — Route content
 *   requiredCapability   — Optional capability name (e.g., 'plant_intelligence')
 *
 * Behavior:
 *   - While loading session: shows a minimal loading indicator
 *   - If no session: redirects to /portal (login page)
 *   - If session exists but license loading: shows loader
 *   - If requiredCapability specified and not met: shows LockedScreen
 *   - Otherwise: renders children
 */
export function ProtectedRoute({ children, requiredCapability }) {
  const { session, loading: authLoading } = useAuth()
  const { capabilities, loading: licenseLoading, error: licenseError } = useLicense()

  const loading = authLoading || licenseLoading

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

  // Show license error if present
  if (licenseError) {
    return (
      <LockedScreen
        title="License Error"
        message={licenseError}
      />
    )
  }

  // Check tier-based capability if required
  if (requiredCapability && capabilities && !capabilities[requiredCapability]) {
    const config = {
      plant_intelligence: {
        title: 'PIRAS not enabled',
        message: 'This feature is available in PIRAS deployments.',
      },
      ras_enterprise: {
        title: 'RAS Enterprise not enabled',
        message: 'This feature is available in Enterprise and PIRAS deployments.',
      },
    }

    const lockedConfig = config[requiredCapability] || {
      title: 'Feature Locked',
      message: 'This feature requires a higher license tier.',
    }

    return (
      <LockedScreen
        title={lockedConfig.title}
        message={lockedConfig.message}
      />
    )
  }

  return children
}
