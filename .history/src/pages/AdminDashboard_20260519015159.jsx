import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";
import { useLicense } from "../context/LicenseContext";
import { supabase } from "../lib/supabaseClient";
import { Logo } from "../components/Logo";
import { TIER_LABELS } from "../lib/capabilities";
import { colors } from "../design/colors";

// Mobile-friendly section selector for docs
function MobileDocSelector({ manifest, selectedDoc, setSelectedDoc }) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDocTitle =
    manifest?.sections
      .flatMap((s) => s.docs)
      .find((d) => d.file === selectedDoc)?.title || "Select document";

  return (
    <div className="md:hidden mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm rounded"
        style={{
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.2)",
          color: colors.signal.warning,
        }}
      >
        <span>{selectedDocTitle}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="mt-2 rounded overflow-hidden"
          style={{
            background: "rgba(17,17,19,0.95)",
            border: "1px solid rgba(168,168,180,0.08)",
          }}
        >
          {manifest.sections.map((section) => (
            <div
              key={section.id}
              className="border-b border-border-subtle last:border-b-0"
            >
              <h3 className="text-xs font-semibold tracking-widest uppercase text-signal-warning px-4 py-3 bg-[rgba(10,10,11,0.6)]">
                {section.title}
              </h3>
              <div className="p-2">
                {section.docs.map((doc) => (
                  <button
                    key={doc.file}
                    onClick={() => {
                      setSelectedDoc(doc.file);
                      setIsOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded text-sm transition-colors duration-150"
                    style={{
                      color:
                        selectedDoc === doc.file
                          ? colors.signal.warning
                          : colors.text.muted,
                      background:
                        selectedDoc === doc.file
                          ? "rgba(245,158,11,0.08)"
                          : "transparent",
                    }}
                  >
                    {doc.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const STYLES = {
  background: { background: colors.background.primary },
  header: {
    background: "rgba(10,10,11,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(168,168,180,0.06)",
  },
  statusIndicator: {
    background: colors.process.primary,
    boxShadow: "0 0 6px rgba(16,185,129,0.5)",
  },
  titleGradient: {
    background: `linear-gradient(135deg, ${colors.background.primary} 0%, ${colors.text.muted} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  card: {
    background: "rgba(17,17,19,0.95)",
    border: "1px solid rgba(168,168,180,0.08)",
    borderRadius: "0.75rem",
    boxShadow: "0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)",
  },
  tab: {
    base: {
      padding: "0.75rem 1.5rem",
      fontSize: "0.75rem",
      fontWeight: "600",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      transition: "all 0.2s",
      cursor: "pointer",
      borderRadius: "0.5rem",
    },
    inactive: {
      color: colors.text.muted,
      background: "transparent",
    },
    active: {
      color: colors.signal.warning,
      background: "rgba(245,158,11,0.1)",
      border: "1px solid rgba(245,158,11,0.2)",
    },
  },
  table: {
    header: {
      background: "rgba(10,10,11,0.6)",
      color: colors.text.muted,
      fontSize: "0.625rem",
      fontWeight: "600",
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      padding: "1rem",
      borderBottom: "1px solid rgba(168,168,180,0.08)",
    },
    cell: {
      padding: "1rem",
      borderBottom: "1px solid rgba(168,168,180,0.05)",
      color: colors.text.primary,
      fontSize: "0.875rem",
    },
  },
};

/**
 * AdminDashboard — Admin-only dashboard.
 *
 * Two tabs:
 *   1. Customers — Lists all customers with their license info
 *   2. System Documentation — Renders markdown docs (placeholder for now)
 *
 * Only accessible to achintharya@gmail.com or TVASTR-ACHINTH license.
 */
export function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { isAdmin } = useLicense();
  const [activeTab, setActiveTab] = useState("customers");
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [error, setError] = useState(null);

  // Documentation state
  const [manifest, setManifest] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [docContent, setDocContent] = useState("");
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [docError, setDocError] = useState(null);

  // Fetch documentation manifest
  useEffect(() => {
    if (activeTab !== "docs") return;

    async function fetchManifest() {
      try {
        const response = await fetch("/docs/manifest.json");
        if (!response.ok)
          throw new Error("Failed to load documentation manifest");
        const data = await response.json();
        setManifest(data);

        // Auto-select first doc
        if (data.sections?.[0]?.docs?.[0]) {
          const firstDoc = data.sections[0].docs[0];
          setSelectedDoc(firstDoc.file);
        }
      } catch (err) {
        console.error("[AdminDashboard] Error loading manifest:", err);
        setDocError(err.message);
      }
    }

    fetchManifest();
  }, [activeTab]);

  // Fetch selected document content
  useEffect(() => {
    if (!selectedDoc) return;

    async function fetchDocContent() {
      setLoadingDoc(true);
      setDocError(null);

      try {
        const response = await fetch(`/docs/${selectedDoc}`);
        if (!response.ok) throw new Error("Failed to load document");
        const content = await response.text();
        setDocContent(content);
      } catch (err) {
        console.error("[AdminDashboard] Error loading document:", err);
        setDocError(err.message);
        setDocContent("");
      } finally {
        setLoadingDoc(false);
      }
    }

    fetchDocContent();
  }, [selectedDoc]);

  // Fetch all customers
  useEffect(() => {
    if (activeTab !== "customers") return;

    async function fetchCustomers() {
      setLoadingCustomers(true);
      setError(null);

      try {
        // Call the PostgreSQL function via RPC
        const { data, error: rpcError } = await supabase.rpc(
          "get_all_licenses_with_email",
        );

        if (rpcError) throw rpcError;

        setCustomers(data || []);
      } catch (err) {
        console.error("[AdminDashboard] Error fetching customers:", err);
        setError(err.message || "Failed to load customer data.");
      } finally {
        setLoadingCustomers(false);
      }
    }

    fetchCustomers();
  }, [activeTab]);

  // Safeguard: if not admin, don't render
  if (!isAdmin) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={STYLES.background}
      >
        <div className="text-center">
          <p className="text-txt-secondary text-sm">Access denied</p>
          <Link
            to="/portal/dashboard"
            className="text-signal-warning text-xs mt-4 inline-block"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={STYLES.background}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Top nav */}
      <header className="sticky top-0 z-40" style={STYLES.header}>
        <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
          >
            <Logo size="sm" />
            <span className="text-txt-muted text-xs hidden md:inline">
              / Admin Portal
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <Link
              to="/portal/dashboard"
              className="text-xs font-semibold tracking-wider md:tracking-widest uppercase transition-colors duration-200 text-txt-muted hover:text-txt-primary"
              title="Customer View"
            >
              <span className="hidden sm:inline">Customer View</span>
              <span className="sm:hidden">👤</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={STYLES.statusIndicator}
              />
              <span className="text-xs text-txt-secondary font-mono truncate max-w-[120px] md:max-w-none">
                {user?.email}
              </span>
            </div>
            <button
              onClick={signOut}
              className="text-xs font-medium tracking-wider md:tracking-widest uppercase text-txt-muted hover:text-txt-primary transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 w-full px-4 md:px-6 lg:px-8 xl:px-12 py-8 md:py-12 lg:py-16">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-signal-warning opacity-60" />
            <span className="text-xs font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase text-signal-warning opacity-60">
              Admin Portal
            </span>
          </div>
          <h1
            className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-3"
            style={STYLES.titleGradient}
          >
            System Administration
          </h1>
          <p className="text-xs md:text-sm text-txt-secondary">
            Manage customers, licenses, and system documentation.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 md:mb-8 flex flex-wrap gap-2 md:gap-3">
          <button
            onClick={() => setActiveTab("customers")}
            style={{
              ...STYLES.tab.base,
              ...(activeTab === "customers"
                ? STYLES.tab.active
                : STYLES.tab.inactive),
            }}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("docs")}
            style={{
              ...STYLES.tab.base,
              ...(activeTab === "docs"
                ? STYLES.tab.active
                : STYLES.tab.inactive),
            }}
          >
            <span className="hidden sm:inline">System Documentation</span>
            <span className="sm:hidden">Docs</span>
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "customers" && (
          <div style={STYLES.card}>
            {loadingCustomers ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="w-8 h-8"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.3)",
                      borderRadius: "0.375rem",
                      transform: "rotate(45deg)",
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                  <span className="text-xs text-txt-muted tracking-widest uppercase">
                    Loading customers...
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : customers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-txt-muted">No customers found.</p>
              </div>
            ) : (
              <>
                {/* Desktop table view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left" style={STYLES.table.header}>
                          Customer Name
                        </th>
                        <th className="text-left" style={STYLES.table.header}>
                          Email
                        </th>
                        <th className="text-left" style={STYLES.table.header}>
                          License Key
                        </th>
                        <th className="text-left" style={STYLES.table.header}>
                          Tier
                        </th>
                        <th className="text-left" style={STYLES.table.header}>
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr
                          key={customer.user_id}
                          className="hover:bg-[rgba(245,158,11,0.02)] transition-colors"
                        >
                          <td style={STYLES.table.cell}>
                            {customer.customer_name}
                          </td>
                          <td style={STYLES.table.cell}>
                            <span className="font-mono text-xs">
                              {customer.email || "N/A"}
                            </span>
                          </td>
                          <td style={STYLES.table.cell}>
                            <span className="font-mono text-xs text-signal-warning">
                              {customer.license_key}
                            </span>
                          </td>
                          <td style={STYLES.table.cell}>
                            <span
                              className="px-2 py-1 text-xs font-semibold rounded"
                              style={{
                                background: "rgba(16,185,129,0.1)",
                                color: "#10b981",
                                border: "1px solid rgba(16,185,129,0.2)",
                              }}
                            >
                              {TIER_LABELS[customer.tier] || customer.tier}
                            </span>
                          </td>
                          <td style={STYLES.table.cell}>
                            <span className="text-xs text-txt-muted">
                              {new Date(customer.created_at).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile card view */}
                <div className="md:hidden p-4 space-y-4">
                  {customers.map((customer) => (
                    <div
                      key={customer.user_id}
                      className="p-4 rounded-lg"
                      style={{
                        background: "rgba(10,10,11,0.6)",
                        border: "1px solid rgba(168,168,180,0.08)",
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-sm font-bold text-txt-primary">
                          {customer.customer_name}
                        </h3>
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded"
                          style={{
                            background: "rgba(16,185,129,0.1)",
                            color: "#10b981",
                            border: "1px solid rgba(16,185,129,0.2)",
                          }}
                        >
                          {TIER_LABELS[customer.tier] || customer.tier}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-txt-muted uppercase tracking-wider">
                            Email:
                          </span>
                          <span className="ml-2 font-mono text-txt-secondary">
                            {customer.email || "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-txt-muted uppercase tracking-wider">
                            License:
                          </span>
                          <span className="ml-2 font-mono text-signal-warning">
                            {customer.license_key}
                          </span>
                        </div>
                        <div>
                          <span className="text-txt-muted uppercase tracking-wider">
                            Created:
                          </span>
                          <span className="ml-2 text-txt-muted">
                            {new Date(customer.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "docs" && (
          <div style={STYLES.card}>
            <div className="md:flex">
              {/* Desktop sidebar */}
              <div
                className="hidden md:block w-1/5 min-w-[180px] max-w-[240px] shrink-0 border-r overflow-y-auto"
                style={{
                  borderColor: "rgba(168,168,180,0.08)",
                  maxHeight: "70vh",
                }}
              >
                {manifest ? (
                  <div className="p-4">
                    {manifest.sections.map((section) => (
                      <div key={section.id} className="mb-6">
                        <h3 className="text-xs font-semibold tracking-widest uppercase text-signal-warning mb-3 px-3">
                          {section.title}
                        </h3>
                        <div className="space-y-1">
                          {section.docs.map((doc) => (
                            <button
                              key={doc.file}
                              onClick={() => setSelectedDoc(doc.file)}
                              className="w-full text-left px-3 py-2 rounded text-sm transition-colors duration-150"
                              style={{
                                color:
                                  selectedDoc === doc.file
                                    ? "#fbbf24"
                                    : "#a8a8b4",
                                background:
                                  selectedDoc === doc.file
                                    ? "rgba(245,158,11,0.08)"
                                    : "transparent",
                                border:
                                  selectedDoc === doc.file
                                    ? "1px solid rgba(245,158,11,0.15)"
                                    : "1px solid transparent",
                              }}
                            >
                              {doc.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <span className="text-xs text-txt-muted">Loading...</span>
                  </div>
                )}
              </div>

              {/* Content area */}
              <div className="flex-1">
                {/* Mobile document selector */}
                {manifest && (
                  <MobileDocSelector
                    manifest={manifest}
                    selectedDoc={selectedDoc}
                    setSelectedDoc={setSelectedDoc}
                  />
                )}

                <div className="overflow-y-auto" style={{ maxHeight: "70vh" }}>
                  {loadingDoc ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="flex flex-col items-center gap-4">
                        <div
                          className="w-8 h-8"
                          style={{
                            background: "rgba(245,158,11,0.1)",
                            border: "1px solid rgba(245,158,11,0.3)",
                            borderRadius: "0.375rem",
                            transform: "rotate(45deg)",
                            animation: "pulse 1.5s ease-in-out infinite",
                          }}
                        />
                        <span className="text-xs text-txt-muted tracking-widest uppercase">
                          Loading document...
                        </span>
                      </div>
                    </div>
                  ) : docError ? (
                    <div className="p-4 md:p-8 text-center">
                      <p className="text-sm text-red-400">{docError}</p>
                    </div>
                  ) : docContent ? (
                    <div className="p-4 md:p-8 prose prose-invert prose-amber max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h1
                              className="text-xl md:text-2xl font-bold text-txt-primary mb-4 border-b border-border-default pb-3"
                              {...props}
                            />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2
                              className="text-lg md:text-xl font-bold text-txt-primary mb-3 mt-6 md:mt-8"
                              {...props}
                            />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-base md:text-lg font-semibold text-txt-secondary mb-2 mt-4 md:mt-6"
                              {...props}
                            />
                          ),
                          h4: ({ node, ...props }) => (
                            <h4
                              className="text-sm md:text-base font-semibold text-txt-secondary mb-2 mt-3 md:mt-4"
                              {...props}
                            />
                          ),
                          h5: ({ node, ...props }) => (
                            <h5
                              className="text-xs md:text-sm font-semibold text-txt-secondary mb-1 mt-2 md:mt-3"
                              {...props}
                            />
                          ),
                          h6: ({ node, ...props }) => (
                            <h6
                              className="text-xs font-semibold text-txt-muted mb-1 mt-2"
                              {...props}
                            />
                          ),
                          p: ({ node, ...props }) => (
                            <p
                              className="text-xs md:text-sm text-txt-secondary mb-4 leading-relaxed"
                              {...props}
                            />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul
                              className="text-xs md:text-sm text-txt-secondary mb-4 ml-4 md:ml-6 list-disc space-y-1"
                              {...props}
                            />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol
                              className="text-xs md:text-sm text-txt-secondary mb-4 ml-4 md:ml-6 list-decimal space-y-1"
                              {...props}
                            />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="leading-relaxed" {...props} />
                          ),
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code
                                className="px-1.5 py-0.5 rounded text-signal-warning font-mono text-xs"
                                style={{ background: "rgba(245,158,11,0.1)" }}
                                {...props}
                              />
                            ) : (
                              <code
                                className="block p-3 md:p-4 rounded font-mono text-xs text-txt-secondary overflow-x-auto"
                                style={{
                                  background: "rgba(10,10,11,0.6)",
                                  border: "1px solid rgba(168,168,180,0.08)",
                                }}
                                {...props}
                              />
                            ),
                          pre: ({ node, ...props }) => (
                            <pre className="mb-4" {...props} />
                          ),
                          strong: ({ node, ...props }) => (
                            <strong
                              className="font-bold text-signal-warning"
                              {...props}
                            />
                          ),
                          em: ({ node, ...props }) => (
                            <em
                              className="italic text-txt-secondary"
                              {...props}
                            />
                          ),
                          a: ({ node, href, ...props }) => {
                            // Inter-doc link handler
                            if (href && href.endsWith(".md")) {
                              return (
                                <button
                                  onClick={() => setSelectedDoc(href)}
                                  className="text-signal-warning hover:underline break-words cursor-pointer"
                                  {...props}
                                />
                              );
                            }
                            return (
                              <a
                                href={href}
                                className="text-signal-warning hover:underline break-words"
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                              />
                            );
                          },
                          hr: ({ node, ...props }) => (
                            <hr
                              className="my-6 md:my-8 border-border-default"
                              {...props}
                            />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="pl-4 md:pl-6 py-3 my-4 italic text-txt-secondary border-l-4"
                              style={{
                                borderColor: "#f59e0b",
                                background: "rgba(245,158,11,0.05)",
                              }}
                              {...props}
                            />
                          ),
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto mb-4">
                              <table
                                className="w-full text-xs md:text-sm border-collapse"
                                style={{
                                  border: "1px solid rgba(168,168,180,0.15)",
                                }}
                                {...props}
                              />
                            </div>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead
                              style={{ background: "rgba(245,158,11,0.1)" }}
                              {...props}
                            />
                          ),
                          tbody: ({ node, ...props }) => <tbody {...props} />,
                          tr: ({ node, ...props }) => (
                            <tr
                              style={{
                                borderBottom: "1px solid rgba(168,168,180,0.1)",
                              }}
                              {...props}
                            />
                          ),
                          th: ({ node, ...props }) => (
                            <th
                              className="px-3 md:px-4 py-2 text-left font-semibold tracking-wider uppercase text-signal-warning"
                              style={{
                                borderBottom: "2px solid rgba(245,158,11,0.3)",
                              }}
                              {...props}
                            />
                          ),
                          td: ({ node, ...props }) => (
                            <td
                              className="px-3 md:px-4 py-2 text-txt-secondary"
                              style={{
                                borderRight: "1px solid rgba(168,168,180,0.08)",
                              }}
                              {...props}
                            />
                          ),
                        }}
                      >
                        {docContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="p-4 md:p-8 text-center">
                      <p className="text-sm text-txt-muted">
                        Select a document to view
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Back to site */}
        <div className="mt-6 md:mt-8 text-center">
          <Link
            to="/"
            className="text-xs text-txt-muted hover:text-txt-secondary transition-colors duration-200 tracking-wider"
          >
            ← Return to tvastr.ai
          </Link>
        </div>
      </main>
    </div>
  );
}
