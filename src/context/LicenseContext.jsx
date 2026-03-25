import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabaseClient'
import { getCapabilities } from '../lib/capabilities'

/**
 * LicenseContext — Provides license tier and capability information.
 *
 * Exposes:
 *   tier          — User's license tier ('ras_core', 'ras_enterprise', 'full_stack', or null)
 *   capabilities  — Capability flags derived from tier
 *   loading       — True while fetching license data
 *   error         — Error message if license fetch fails
 */
const LicenseContext = createContext(null)

export function LicenseProvider({ children }) {
  const { user } = useAuth()
  const [tier, setTier] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      // Not logged in → reset
      setTier(null)
      setLoading(false)
      setError(null)
      return
    }

    // Fetch user's license tier from Supabase
    async function fetchLicense() {
      setLoading(true)
      setError(null)

      try {
        const { data, error: fetchError } = await supabase
          .from('licenses')
          .select('tier')
          .eq('user_id', user.id)
          .single()

        if (fetchError) {
          // If no license found, treat as error
          if (fetchError.code === 'PGRST116') {
            throw new Error('No license found for your account. Contact support.')
          }
          throw fetchError
        }

        setTier(data.tier)
      } catch (err) {
        console.error('[LicenseContext] Failed to fetch license:', err)
        setError(err.message || 'Failed to load license information.')
        setTier(null)
      } finally {
        setLoading(false)
      }
    }

    fetchLicense()
  }, [user])

  const capabilities = tier ? getCapabilities(tier) : null

  return (
    <LicenseContext.Provider value={{ tier, capabilities, loading, error }}>
      {children}
    </LicenseContext.Provider>
  )
}

/**
 * useLicense — Convenience hook for consuming LicenseContext.
 * Must be used inside <LicenseProvider>.
 */
export function useLicense() {
  const ctx = useContext(LicenseContext)
  if (!ctx) throw new Error('useLicense must be used within LicenseProvider')
  return ctx
}
