import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLicense } from "../context/LicenseContext";
import { supabase } from "../lib/supabaseClient";
import { Logo } from "../components/Logo";
import { LockedProductCard } from "../components/LockedProductCard";
import { UpgradeBanner } from "../components/UpgradeBanner";
import { RollbackVersionCard } from "../components/RollbackVersionCard";
import { ProductDownloadCard } from "../components/ProductDownloadCard";
import { ForgeLoader } from "../components/ForgeLoader";
import { TIER_ORDER, TIER_LABELS, isAllowed } from "../lib/capabilities";
import { CONFIG, openContact } from "../lib/config";
import { colors } from "../design/colors";

const UPDATE_SERVER_URL = import.meta.env.VITE_UPDATE_SERVER_URL;

// Styles extracted to constants for performance
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
  loadingBox: {
    background: "rgba(245,158,11,0.1)",
    border: "1px solid rgba(245,158,11,0.3)",
    borderRadius: "0.375rem",
    transform: "rotate(45deg)",
    animation: "pulse 1.5s ease-in-out infinite",
    boxShadow: "0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)",
  },
  card: {
    background: "rgba(17,17,19,0.95)",
    border: "1px solid rgba(168,168,180,0.08)",
    borderRadius: "0.75rem",
    boxShadow: "0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)",
  },
  cardHoverAccent: {
    background:
      "linear-gradient(to right, transparent, rgba(245,158,11,0.4), transparent)",
  },
  tagVision: {
    color: colors.signal.warning,
    background: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.15)",
    borderRadius: "0.375rem",
  },
  downloadButton: {
    background: "rgba(245,158,11,0.08)",
    border: "1px solid rgba(245,158,11,0.25)",
    color: colors.signal.warning,
    borderRadius: "0.5rem",
  },
  supportCard: {
    background: "rgba(17,17,19,0.8)",
    border: "1px solid rgba(168,168,180,0.06)",
    borderRadius: "0.75rem",
    boxShadow: "0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)",
  },
  supportButton: {
    color: colors.signal.warning,
    border: "1px solid rgba(245,158,11,0.2)",
    background: "rgba(245,158,11,0.05)",
    borderRadius: "0.5rem",
  },
};

const STATUS_COLORS = {
  included: {
    bg: "rgba(168,168,180,0.08)",
    border: "rgba(168,168,180,0.2)",
    text: colors.text.muted,
  },
  active: {
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    text: colors.process.primary,
  },
};

// Product definitions - moved outside component to prevent recreation
const PRODUCTS = [
  {
    id: "ras_core",
    name: "RAS Core",
    description:
      "An AI-driven casting inspection and defect diagnosis platform that transforms raw inspection images into actionable quality intelligence.",
    tag: "Vision AI",
    capability: "ras_core",
    requiredTier: "TIER_1",
  },
  {
    id: "ras_enterprise",
    name: "RAS Enterprise",
    description:
      "Integrated build with advanced process integration, ERP connectivity, and extended quality engineering frameworks.",
    tag: "Vision AI",
    capability: "ras_enterprise",
    requiredTier: "TIER_2",
    upgradeFeatures: [
      "ERP and SQL integration",
      "batch processing and traceability",
      "process intelligence",
    ],
  },
  {
    id: "plant_intelligence",
    name: "PIRAS",
    description:
      "The complete integrated system: AI-driven casting inspection (RAS) combined with plant-level intelligence (PI) for end-to-end manufacturing quality intelligence.",
    tag: "Integrated System",
    capability: "plant_intelligence",
    requiredTier: "TIER_3",
    upgradeFeatures: [
      "RAS inspection + Plant Intelligence analytics",
      "end-to-end quality intelligence pipeline",
      "FMEA, Pareto, SPC, decision tracking",
    ],
  },
];

/**
 * PortalDashboard — Authenticated customer dashboard.
 *
 * Shows 3 product cards based on user's license tier:
 *   - RAS Core (active for all)
 *   - RAS Enterprise (active for ras_enterprise & full_stack, locked for ras_core)
 *   - Plant Intelligence (active for full_stack, locked for others)
 *
 * UI is fully tier-driven — no hardcoded logic.
 * Download functionality is inline — no redirect to separate downloads page.
 */
export function PortalDashboard() {
  const { user, signOut } = useAuth();
  const {
    tier,
    customerName,
    capabilities,
    loading: licenseLoading,
    licenseKey,
    isAdmin,
  } = useLicense();
  const [versions, setVersions] = useState({}); // { productId: { latest: version, older: [versions] } }
  const [loadingVersions, setLoadingVersions] = useState(true);
  const [downloadingVersion, setDownloadingVersion] = useState(null);
  const [downloadError, setDownloadError] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);

  // Fetch versions from Supabase
  useEffect(() => {
    if (!tier) return;

    async function fetchVersions() {
      setLoadingVersions(true);
      try {
        const { data: allVersions, error } = await supabase
          .from("versions")
          .select(
            `
            version_number,
            release_date,
            changelog,
            file_path,
            checksum,
            required_tier,
            includes_pi,
            product_id,
            is_stable_rollback,
            products (
              id,
              name,
              description
            )
          `,
          )
          .order("release_date", { ascending: false });

        if (error) throw error;

        // Filter by tier and organize by product
        const allowedVersions = allVersions.filter((v) => isAllowed(v, tier));
        const versionsByProduct = {};

        allowedVersions.forEach((version) => {
          const productId = version.products.id;
          if (!versionsByProduct[productId]) {
            versionsByProduct[productId] = {
              latest: null,
              stable: null,
              older: [],
            };
          }

          // Identify stable rollback version
          if (version.is_stable_rollback) {
            versionsByProduct[productId].stable = version;
          } else if (!versionsByProduct[productId].latest) {
            // Latest non-stable version
            versionsByProduct[productId].latest = version;
          } else {
            // Older versions (neither stable nor latest)
            versionsByProduct[productId].older.push(version);
          }
        });

        setVersions(versionsByProduct);
      } catch (err) {
        console.error("[Dashboard] Error fetching versions:", err);
      } finally {
        setLoadingVersions(false);
      }
    }

    fetchVersions();
  }, [tier]);

  // Handle download with bucket support
  const handleDownload = async (
    productName,
    versionNumber,
    bucket = "installers",
  ) => {
    if (!licenseKey) {
      setDownloadError("License key not found.");
      return;
    }
    if (!UPDATE_SERVER_URL) {
      setDownloadError("Update server not configured.");
      return;
    }

    setDownloadingVersion(`${productName}-${versionNumber}-${bucket}`);
    setDownloadError(null);

    try {
      const response = await fetch(
        `${UPDATE_SERVER_URL}/api/download/${encodeURIComponent(productName)}/${encodeURIComponent(versionNumber)}?license_key=${encodeURIComponent(licenseKey)}&bucket=${bucket}`,
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Download failed");
      }

      const data = await response.json();
      window.open(data.download_url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setDownloadError(err.message || "Download failed. Please try again.");
      console.error("[Download]", err);
    } finally {
      setDownloadingVersion(null);
    }
  };

  return (
    <div className="min-h-screen relative" style={STYLES.background}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Top nav */}
      <header className="sticky top-0 z-40" style={STYLES.header}>
        <div className="max-w-7xl mx-auto px-4 md:px-12 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
          >
            <Logo size="sm" />
            <span className="text-txt-muted text-xs hidden md:inline">
              / Customer Portal
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            {isAdmin && (
              <Link
                to="/portal/admin"
                className="text-xs font-semibold tracking-wider md:tracking-widest uppercase transition-colors duration-200 text-txt-muted hover:text-txt-primary"
              >
                <span className="hidden sm:inline">Admin Portal</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            )}
            <Link
              to="/system"
              className="text-xs font-semibold tracking-wider md:tracking-widest uppercase transition-colors duration-200 text-txt-muted hover:text-txt-primary"
            >
              <span className="hidden sm:inline">System</span>
              <span className="sm:hidden">Sys</span>
            </Link>
            <Link
              to="/portal/manual"
              className="text-xs font-semibold tracking-wider md:tracking-widest uppercase transition-colors duration-200 text-txt-muted hover:text-txt-primary"
            >
              <span className="hidden sm:inline">User Manual</span>
              <span className="sm:hidden">Manual</span>
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={STYLES.statusIndicator}
              />
              <span className="text-xs text-txt-secondary font-mono">
                {user?.email}
              </span>
            </div>
            <button
              onClick={signOut}
              className="text-xs font-medium tracking-widest uppercase text-txt-muted hover:text-txt-primary transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {/* Page header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-signal-warning opacity-60" />
            <span className="text-xs font-semibold tracking-[0.3em] uppercase text-signal-warning opacity-60">
              Customer Portal
            </span>
          </div>
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight mb-3"
            style={STYLES.titleGradient}
          >
            {customerName || "Dashboard"}
          </h1>
          <p className="text-sm text-txt-secondary">
            Welcome back. Your licensed Tvastr systems are listed below.
          </p>
          {tier && (
            <p className="text-xs text-txt-muted mt-2">
              License Tier:{" "}
              <span className="text-txt-secondary font-semibold">
                {TIER_LABELS[tier] || tier}
              </span>
            </p>
          )}
        </div>

        {/* Content */}
        {licenseLoading ? (
          <div className="flex items-center justify-center py-32">
            <ForgeLoader message="Loading systems…" />
          </div>
        ) : (
          <>
            {/* Upgrade Banner */}
            <UpgradeBanner />

            {/* Products - unified card showing product info + download */}
            <div className="mb-10">
              {PRODUCTS.filter((product) => {
                // For TIER_3, only show PIRAS (it includes RAS Core and Enterprise)
                if (tier === "TIER_3") {
                  return product.id === "plant_intelligence";
                }
                return true;
              }).map((product, i) => {
                const isActive = capabilities?.[product.capability];
                const isIncluded =
                  tier && TIER_ORDER[tier] > TIER_ORDER[product.requiredTier];
                const productVersions =
                  versions[product.id] || Object.values(versions)[0];

                if (isActive) {
                  // Unified active product card with download functionality
                  const statusBadge = isIncluded ? "INCLUDED" : "ACTIVE";
                  const statusColor = isIncluded
                    ? STATUS_COLORS.included
                    : STATUS_COLORS.active;

                  return (
                    <div
                      key={product.id}
                      className="group relative flex flex-col transition-all duration-300 mb-6"
                      style={STYLES.card}
                    >
                      {/* Hover top accent */}
                      <div
                        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={STYLES.cardHoverAccent}
                      />

                      <div className="p-5 md:p-8 flex flex-col gap-6">
                        {/* Header row with product info and status */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <span
                              className="text-xs font-semibold tracking-[0.15em] uppercase px-2.5 py-1 inline-block mb-3"
                              style={STYLES.tagVision}
                            >
                              {product.tag}
                            </span>
                            <h3 className="text-2xl font-bold text-txt-primary tracking-tight leading-tight mb-3">
                              {product.name}
                            </h3>
                            <p className="text-sm text-txt-secondary leading-relaxed">
                              {product.description}
                            </p>
                          </div>

                          {/* Status badge */}
                          <div
                            className="flex-shrink-0 px-3 py-1.5 text-center"
                            style={{
                              background: statusColor.bg,
                              border: `1px solid ${statusColor.border}`,
                              borderRadius: "0.375rem",
                            }}
                          >
                            <div
                              className="text-xs font-semibold"
                              style={{ color: statusColor.text }}
                            >
                              {statusBadge}
                            </div>
                          </div>
                        </div>

                        {/* Version and download section */}
                        {loadingVersions ? (
                          <div className="flex items-center justify-center py-8 text-xs text-txt-muted">
                            Loading versions...
                          </div>
                        ) : productVersions?.latest ||
                          productVersions?.stable ? (
                          <div className="space-y-4">
                            {/* Version info box - show latest or stable */}
                            <div
                              className="p-6 space-y-4"
                              style={{
                                background: "rgba(10,10,11,0.6)",
                                border: "1px solid rgba(168,168,180,0.06)",
                                borderRadius: "0.75rem",
                                boxShadow:
                                  "0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)",
                              }}
                            >
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                  <p className="text-xs text-txt-muted tracking-widest uppercase mb-1">
                                    {productVersions?.latest
                                      ? "Latest Version"
                                      : "Current Version"}
                                  </p>
                                  <p className="text-2xl font-black text-signal-warning font-mono">
                                    v
                                    {
                                      (
                                        productVersions?.latest ||
                                        productVersions?.stable
                                      )?.version_number
                                    }
                                  </p>
                                </div>
                                <div className="md:text-right">
                                  <p className="text-xs text-txt-muted tracking-widest uppercase mb-1">
                                    Released
                                  </p>
                                  <p className="text-sm text-txt-secondary">
                                    {new Date(
                                      (
                                        productVersions?.latest ||
                                        productVersions?.stable
                                      )?.release_date,
                                    ).toLocaleDateString("en-IN", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>

                              {(
                                productVersions?.latest ||
                                productVersions?.stable
                              )?.changelog && (
                                <div>
                                  <p className="text-xs text-txt-muted tracking-widest uppercase mb-2">
                                    Release Notes
                                  </p>
                                  <p className="text-sm text-txt-secondary leading-relaxed">
                                    {
                                      (
                                        productVersions?.latest ||
                                        productVersions?.stable
                                      )?.changelog
                                    }
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Download error */}
                            {downloadError && (
                              <p className="text-xs text-red-400">
                                {downloadError}
                              </p>
                            )}

                            {/* Dual download buttons or single button */}
                            {productVersions?.latest &&
                            productVersions?.stable ? (
                              // Both latest update and stable rollback exist - show dual buttons
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {/* Latest update button (updates bucket) */}
                                <button
                                  onClick={() =>
                                    handleDownload(
                                      productVersions.latest.products.name,
                                      productVersions.latest.version_number,
                                      "updates",
                                    )
                                  }
                                  disabled={
                                    downloadingVersion ===
                                    `${productVersions.latest.products.name}-${productVersions.latest.version_number}-updates`
                                  }
                                  className="flex items-center justify-center gap-2 py-4 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200 disabled:opacity-50 relative overflow-hidden group"
                                  style={STYLES.downloadButton}
                                >
                                  <span
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                      background: "rgba(245,158,11,0.08)",
                                    }}
                                  />
                                  <span className="relative flex items-center gap-2">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                    >
                                      <path
                                        d="M6 1v7M3 5l3 3 3-3"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M1 10h10"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    {downloadingVersion ===
                                    `${productVersions.latest.products.name}-${productVersions.latest.version_number}-updates`
                                      ? "Generating..."
                                      : `Download v${productVersions.latest.version_number}`}
                                  </span>
                                </button>

                                {/* Stable rollback button (installers bucket) */}
                                <button
                                  onClick={() =>
                                    handleDownload(
                                      productVersions.stable.products.name,
                                      productVersions.stable.version_number,
                                      "installers",
                                    )
                                  }
                                  disabled={
                                    downloadingVersion ===
                                    `${productVersions.stable.products.name}-${productVersions.stable.version_number}-installers`
                                  }
                                  className="flex items-center justify-center gap-2 py-4 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200 disabled:opacity-50 relative overflow-hidden group"
                                  style={{
                                    background: "rgba(168,168,180,0.06)",
                                    border: "1px solid rgba(168,168,180,0.15)",
                                    color: colors.text.muted,
                                    borderRadius: "0.5rem",
                                  }}
                                >
                                  <span
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                      background: "rgba(168,168,180,0.08)",
                                    }}
                                  />
                                  <span className="relative flex items-center gap-2">
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                    >
                                      <path
                                        d="M6 1v7M3 5l3 3 3-3"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                      />
                                      <path
                                        d="M1 10h10"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                      />
                                    </svg>
                                    {downloadingVersion ===
                                    `${productVersions.stable.products.name}-${productVersions.stable.version_number}-installers`
                                      ? "Generating..."
                                      : `Stable v${productVersions.stable.version_number}`}
                                  </span>
                                </button>
                              </div>
                            ) : productVersions?.stable ? (
                              // Only stable rollback exists (no newer version) - single button
                              <button
                                onClick={() =>
                                  handleDownload(
                                    productVersions.stable.products.name,
                                    productVersions.stable.version_number,
                                    "installers",
                                  )
                                }
                                disabled={
                                  downloadingVersion ===
                                  `${productVersions.stable.products.name}-${productVersions.stable.version_number}-installers`
                                }
                                className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200 disabled:opacity-50 relative overflow-hidden group"
                                style={STYLES.downloadButton}
                              >
                                <span
                                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  style={{
                                    background: "rgba(245,158,11,0.08)",
                                  }}
                                />
                                <span className="relative flex items-center gap-2">
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <path
                                      d="M6 1v7M3 5l3 3 3-3"
                                      stroke="currentColor"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M1 10h10"
                                      stroke="currentColor"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  {downloadingVersion ===
                                  `${productVersions.stable.products.name}-${productVersions.stable.version_number}-installers`
                                    ? "Generating link..."
                                    : `Download v${productVersions.stable.version_number}`}
                                </span>
                              </button>
                            ) : productVersions?.latest ? (
                              // Only latest version exists (no stable rollback) - single button
                              <button
                                onClick={() =>
                                  handleDownload(
                                    productVersions.latest.products.name,
                                    productVersions.latest.version_number,
                                    "installers",
                                  )
                                }
                                disabled={
                                  downloadingVersion ===
                                  `${productVersions.latest.products.name}-${productVersions.latest.version_number}-installers`
                                }
                                className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200 disabled:opacity-50 relative overflow-hidden group"
                                style={STYLES.downloadButton}
                              >
                                <span
                                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  style={{
                                    background: "rgba(245,158,11,0.08)",
                                  }}
                                />
                                <span className="relative flex items-center gap-2">
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <path
                                      d="M6 1v7M3 5l3 3 3-3"
                                      stroke="currentColor"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                    />
                                    <path
                                      d="M1 10h10"
                                      stroke="currentColor"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  {downloadingVersion ===
                                  `${productVersions.latest.products.name}-${productVersions.latest.version_number}-installers`
                                    ? "Generating link..."
                                    : `Download v${productVersions.latest.version_number}`}
                                </span>
                              </button>
                            ) : null}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center py-8 text-sm text-txt-muted">
                            No releases available yet.
                          </div>
                        )}
                      </div>
                    </div>
                  );
                } else {
                  // Locked product card
                  const requiredTierLabel =
                    product.requiredTier === "TIER_3" ? "PIRAS" : "Enterprise";
                  return (
                    <div key={product.id} className="mb-6">
                      <LockedProductCard
                        title={product.name}
                        description={product.description}
                        tag={product.tag}
                        index={i}
                        requiredTier={requiredTierLabel}
                        features={product.upgradeFeatures}
                      />
                    </div>
                  );
                }
              })}
            </div>

            {/* Support note */}
            <div
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={STYLES.supportCard}
            >
              <div>
                <p className="text-sm font-medium text-txt-secondary mb-1">
                  Need installation support?
                </p>
                <p className="text-xs text-txt-muted">
                  Contact your Tvastr account manager or reach out directly.
                </p>
              </div>
              <button
                onClick={() => {
                  const template = CONFIG.emailTemplates.installationSupport;
                  openContact(
                    CONFIG.emails.installationSupport,
                    template.subject,
                    template.body,
                  );
                }}
                className="flex-shrink-0 px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors duration-200"
                style={STYLES.supportButton}
              >
                Contact Support
              </button>
            </div>
          </>
        )}

        {/* Back to site */}
        <div className="mt-8 text-center">
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
