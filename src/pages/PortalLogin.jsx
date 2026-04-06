import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Logo } from '../components/Logo'
import { CONFIG, generateMailtoLink } from '../lib/config'
import { useDocumentHead } from '../hooks/useDocumentHead'

/**
 * PortalLogin — Customer portal login page.
 *
 * Industrial dark theme consistent with the main site.
 * Redirects to /portal/dashboard on successful login.
 * Redirects away if already authenticated.
 */
export function PortalLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const { signIn, session } = useAuth()
  const navigate = useNavigate()

  useDocumentHead(
    'Client Portal Login | Tvastr',
    'Access your Tvastr client portal for system downloads, documentation, and support.',
    'https://tvastr.co/portal'
  )

  // Redirect if already logged in
  useEffect(() => {
    if (session) navigate('/portal/dashboard', { replace: true })
  }, [session, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    setError('')

    const { error: authError } = await signIn(email, password)

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Invalid email or password. Contact your administrator if you need access.'
          : authError.message
      )
      setLoading(false)
    }
    // On success, the useEffect above handles redirect via session state change
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: '#0a0a0b' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(245,158,11,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Back to main site */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-metallic-500 hover:text-metallic-200 transition-colors duration-200 tracking-widest uppercase"
      >
        ← Back to Site
      </Link>

      {/* Card */}
      <div
        className="relative w-full max-w-md"
        style={{
          background: 'rgba(17,17,19,0.95)',
          border: '1px solid rgba(168,168,180,0.08)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Top amber accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.5), transparent)',
          }}
        />

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="mb-10">
            {/* Logo */}
            <div className="mb-8">
              <Logo size="sm" />
            </div>

            <h1
              className="text-2xl font-black tracking-tight mb-2"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Customer Portal
            </h1>
            <p className="text-sm text-metallic-400">
              Secure access for verified Tvastr customers.
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold tracking-widest uppercase text-metallic-500 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full px-4 py-3 text-sm text-metallic-100 placeholder-metallic-600 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(10,10,11,0.8)',
                  border:
                    focusedField === 'email'
                      ? '1px solid rgba(245,158,11,0.4)'
                      : '1px solid rgba(168,168,180,0.1)',
                  boxShadow:
                    focusedField === 'email'
                      ? '0 0 0 2px rgba(245,158,11,0.06)'
                      : 'none',
                }}
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold tracking-widest uppercase text-metallic-500 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm text-metallic-100 placeholder-metallic-600 outline-none transition-all duration-200"
                style={{
                  background: 'rgba(10,10,11,0.8)',
                  border:
                    focusedField === 'password'
                      ? '1px solid rgba(245,158,11,0.4)'
                      : '1px solid rgba(168,168,180,0.1)',
                  boxShadow:
                    focusedField === 'password'
                      ? '0 0 0 2px rgba(245,158,11,0.06)'
                      : 'none',
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div
                className="px-4 py-3 text-sm text-amber-forge"
                style={{
                  background: 'rgba(245,158,11,0.06)',
                  border: '1px solid rgba(245,158,11,0.15)',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full py-3.5 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200 relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? 'rgba(245,158,11,0.1)'
                  : 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.35)',
                color: '#fbbf24',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = 'rgba(245,158,11,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.12)'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-3 h-3 border border-amber-forge border-t-transparent rounded-full"
                    style={{ animation: 'spin 0.6s linear infinite' }}
                  />
                  Authenticating...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(168,168,180,0.08)' }} />
            <span className="text-xs text-metallic-600">or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(168,168,180,0.08)' }} />
          </div>

          {/* Request Access */}
          <div className="text-center">
            <p className="text-xs text-metallic-500 mb-2">Don't have access yet?</p>
            <a
              href={generateMailtoLink(CONFIG.emails.support, CONFIG.emailTemplates.portalAccess.subject, CONFIG.emailTemplates.portalAccess.body)}
              className="text-sm font-medium text-metallic-300 hover:text-amber-glow transition-colors duration-200 underline underline-offset-4"
              style={{ textDecorationColor: 'rgba(245,158,11,0.3)' }}
            >
              Request Access →
            </a>
          </div>
        </div>

        {/* Bottom security notice */}
        <div
          className="px-8 md:px-10 py-4 flex items-center gap-2"
          style={{ borderTop: '1px solid rgba(168,168,180,0.06)' }}
        >
          <span className="text-xs text-metallic-600">
            🔒 Secured by Supabase Auth · Authorized users only
          </span>
        </div>
      </div>
    </div>
  )
}
