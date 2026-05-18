import { useState } from "react";
import { useLicense } from "../context/LicenseContext";
import { getVersionLabel } from "../lib/capabilities";
import { cardClipPath } from "../design/clipPaths";

const UPDATE_SERVER_URL = import.meta.env.VITE_UPDATE_SERVER_URL;

/**
 * RollbackVersionCard — Compact card for older version downloads.
 *
 * Props:
 *   product  — { id, name, description }
 *   version  — { version_number, release_date, changelog, file_path, checksum, required_tier }
 */
export function RollbackVersionCard({ product, version }) {
  const { licenseKey } = useLicense();
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    if (!version?.version_number || !product?.name) {
      setError("No file available for this version.");
      return;
    }

    if (!licenseKey) {
      setError("License key not found. Please contact support.");
      return;
    }

    if (!UPDATE_SERVER_URL) {
      setError("Update server URL not configured.");
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      const response = await fetch(
        `${UPDATE_SERVER_URL}/api/download/${encodeURIComponent(product.name)}/${encodeURIComponent(version.version_number)}?license_key=${encodeURIComponent(licenseKey)}`,
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Download request failed");
      }

      const data = await response.json();
      window.open(data.download_url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(
        err.message || "Download failed. Please try again or contact support.",
      );
      console.error("[Download]", err);
    } finally {
      setDownloading(false);
    }
  };

  const formattedDate = version?.release_date
    ? new Date(version.release_date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
      })
    : "—";

  const tierLabel = version?.required_tier
    ? getVersionLabel(version)
    : "Unknown";

  return (
    <div className="liquid-glass p-6 rounded-xl">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Version info */}
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-4">
            <p className="text-xl font-black text-signal-warning font-mono">
              v{version.version_number}
            </p>
            <span className="text-xs text-txt-muted">•</span>
            <p className="text-xs text-txt-muted tracking-wider uppercase">
              {formattedDate}
            </p>
            <span className="text-xs text-txt-muted">•</span>
            <p className="text-xs text-txt-muted font-semibold tracking-wider uppercase">
              {tierLabel}
            </p>
          </div>

          {version.changelog && (
            <p className="text-sm text-txt-secondary leading-relaxed">
              {version.changelog}
            </p>
          )}
        </div>

        {/* Download button */}
        <div className="flex flex-col items-start md:items-end gap-2 min-w-[200px]">
          {error && <p className="text-xs text-red-400 text-right">{error}</p>}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-6 py-3 text-xs font-semibold tracking-widest uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden group"
            style={{
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#fbbf24",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "rgba(245,158,11,0.12)" }}
            />
            <span className="relative">
              {downloading ? "Generating..." : "Download"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
