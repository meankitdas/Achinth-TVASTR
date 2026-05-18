import { Component } from 'react'
import { Logo } from './Logo'

/**
 * ErrorBoundary — Catches React errors and shows a fallback UI.
 * Prevents the entire app from white-screening if a component crashes.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.state = { hasError: true, error, errorInfo }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-4"
          style={{ background: '#0a0a0b' }}
        >
          <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
          
          <div className="relative z-10 max-w-xl text-center">
            <div className="mb-8 flex justify-center">
              <Logo size="md" />
            </div>

            <h1
              className="text-2xl font-black tracking-tight mb-4"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Something went wrong
            </h1>

            <p className="text-base text-txt-secondary mb-8 leading-relaxed">
              An unexpected error occurred. Please try refreshing the page.
              If the problem persists, contact support.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 text-sm font-semibold tracking-widest uppercase transition-all duration-200"
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.35)',
                  color: '#fbbf24',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245,158,11,0.12)'
                }}
              >
                Reload Page
              </button>

              <a
                href="/"
                className="px-6 py-3 text-sm font-semibold tracking-widest uppercase text-txt-secondary hover:text-txt-primary transition-colors duration-200"
              >
                Go Home
              </a>
            </div>

            {/* Error details in dev mode */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="text-xs text-txt-muted cursor-pointer uppercase tracking-wide">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-4 p-4 text-xs text-red-400 overflow-auto max-h-64"
                  style={{ background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.2)' }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
