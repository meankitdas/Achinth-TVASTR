import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLicense } from "../context/LicenseContext";
import { Logo } from "../components/Logo";
import { CONFIG, generateMailtoLink } from "../lib/config";
import { useDocumentHead } from "../hooks/useDocumentHead";

/**
 * PortalLogin — Customer portal login page.
 *
 * Light-theme editorial design matching the rest of the site:
 * white canvas, green CTAs, coral accents, mono labels, stone card.
 * Redirects to /portal/dashboard on successful login.
 * Redirects away if already authenticated.
 */
export function PortalLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, session } = useAuth();
  const { isAdmin, loading: licenseLoading } = useLicense();
  const navigate = useNavigate();

  useDocumentHead(
    "Client Portal Login | Tvastr Industrial Intelligence",
    "Access your Tvastr Industrial Intelligence client portal for system downloads, documentation, and support.",
    "https://tvastr.co/portal",
  );

  // Redirect if already logged in
  useEffect(() => {
    if (session && !licenseLoading) {
      const destination = isAdmin ? "/portal/admin" : "/portal/dashboard";
      navigate(destination, { replace: true });
    }
  }, [session, isAdmin, licenseLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const { error: authError } = await signIn(email, password);

    if (authError) {
      setError(
        authError.message === "Invalid login credentials"
          ? "Invalid email or password. Contact your administrator if you need access."
          : authError.message,
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 bg-bg-primary">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Back to main site */}
      <Link
        to="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm text-txt-secondary hover:text-process-primary transition-colors duration-200"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to site
      </Link>

      {/* Login card */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-primary)",
          border: "1px solid var(--border-default)",
          boxShadow:
            "0 20px 60px -20px rgba(0,0,0,0.12), 0 8px 24px -12px rgba(0,0,0,0.08)",
        }}
      >
        {/* Top green accent bar */}
        <div
          className="h-1"
          style={{ background: "var(--process-primary)" }}
          aria-hidden="true"
        />

        <div className="p-8 md:p-10">
          {/* Header */}
          <div className="mb-10">
            <div className="mb-6">
              <Logo size="sm" />
            </div>

            <p
              className="font-mono text-[11px] tracking-[0.28em] uppercase mb-3"
              style={{ color: "var(--signal-glow)" }}
            >
              Client Portal
            </p>
            <h1 className="text-3xl md:text-4xl font-medium text-txt-primary leading-tight tracking-[-0.01em] mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-txt-secondary">
              Secure access for verified Tvastr customers.
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-lg text-sm text-txt-primary placeholder:text-txt-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary transition-shadow duration-200"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-default)",
                }}
              />
            </div>

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="block font-mono text-[11px] tracking-[0.24em] uppercase text-txt-muted mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-sm text-txt-primary placeholder:text-txt-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary transition-shadow duration-200"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-default)",
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm"
                style={{
                  background: "rgba(179,0,0,0.06)",
                  border: "1px solid rgba(179,0,0,0.15)",
                  color: "var(--signal-danger)",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              style={{
                background: "var(--process-primary)",
                color: "var(--bg-primary)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full"
                    style={{ animation: "spin 0.6s linear infinite" }}
                  />
                  Authenticating...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border-subtle" />
            <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-txt-muted">
              or
            </span>
            <div className="flex-1 h-px bg-border-subtle" />
          </div>

          {/* Request Access */}
          <div className="text-center">
            <p className="text-sm text-txt-muted mb-2">
              Don't have access yet?
            </p>
            <a
              href={generateMailtoLink(
                CONFIG.emails.support,
                CONFIG.emailTemplates.portalAccess.subject,
                CONFIG.emailTemplates.portalAccess.body,
              )}
              className="text-sm font-medium text-process-primary hover:text-process-secondary transition-colors duration-200 border-b border-process-primary/40 pb-0.5"
            >
              Request Access →
            </a>
          </div>
        </div>

        {/* Bottom security notice */}
        <div
          className="px-8 md:px-10 py-4 flex items-center gap-2"
          style={{
            borderTop: "1px solid var(--border-subtle)",
            background: "var(--bg-panel)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-txt-muted flex-shrink-0"
            aria-hidden="true"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span className="text-[11px] text-txt-muted">
            Secured by Supabase Auth · Authorized users only
          </span>
        </div>
      </div>
    </div>
  );
}
