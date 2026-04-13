import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLicense } from '../context/LicenseContext'
import { LockedScreen } from './LockedScreen'
import { ForgeLoader } from './ForgeLoader'

/**
 * ProtectedRoute — Wraps routes that require authentication and optionally tier-based capabilities.
 *
 * Props:
 *   children             — Route content
 *   requiredCapability   — Optional capability name (e.g., 'plant_intelligence')
 *   adminOnly            — If true, only admin users can access (redirects others to /portal/dashboard)
 *
 * Behavior:
 *   - While loading session: shows a minimal loading indicator
 *   - If no session: redirects to /portal (login page)
 *   - If session exists but license loading: shows loader
 *   - Errors only show after 15 seconds (prevents premature error display on slow networks)
 *   - If adminOnly and not admin: redirects to /portal/dashboard
 *   - If requiredCapability specified and not met: shows LockedScreen
 *   - Otherwise: renders children
 */
export function ProtectedRoute({ children, requiredCapability, adminOnly }) {
  const { session, loading: authLoading } = useAuth()
  const { capabilities, isAdmin, loading: licenseLoading, error: licenseError } = useLicense()
  const [showError, setShowError] = useState(false)

  const loading = authLoading || licenseLoading

  // 15-second timeout before showing error card
  useEffect(() => {
    if (licenseError && !loading) {
      const timer = setTimeout(() => {
        setShowError(true)
      }, 15000)

      return () => clearTimeout(timer)
    } else {
      setShowError(false)
    }
  }, [licenseError, loading])

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0a0b' }}
      >
        <ForgeLoader message="Verifying access..." />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/portal" replace />
  }

  // If adminOnly route and user is not admin, redirect to regular dashboard
  if (adminOnly && !isAdmin) {
    return <Navigate to="/portal/dashboard" replace />
  }

  // Show license error only after 15-second timeout
  if (licenseError && showError) {
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
