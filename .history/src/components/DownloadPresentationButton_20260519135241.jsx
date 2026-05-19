import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * DownloadPresentationButton — Exports the product page as a consulting-style PDF.
 *
 * Captures each .presentation-slide element, injects slide numbers,
 * and generates one A4 PDF page per slide.
 *
 * Props:
 *   productName — used in the filename, e.g. "Rejection_Analysis_System"
 *   contactName — displayed on the final slide (default: "Achintharya Patil")
 *   contactEmail — displayed on the final slide
 */
export function DownloadPresentationButton({
  productName,
  contactName = "Achintharya Patil",
  contactEmail = "support@tvastr.co",
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const downloadPDF = async () => {
    setLoading(true);
    setProgress(0);

    const root = document.getElementById("presentation-root");

    try {
      if (root) root.classList.add("pdf-export-mode");

      await new Promise((resolve) => requestAnimationFrame(resolve));

      const slides = document.querySelectorAll(".presentation-slide");
      const totalSlides = slides.length;

      if (totalSlides === 0) {
        console.warn("[PDF] No .presentation-slide elements found.");
        return;
      }

      slides.forEach((slide, i) => {
        const numEl = slide.querySelector(".slide-number");
        if (numEl) numEl.textContent = `${i + 1} / ${totalSlides}`;
      });

      const A4_W = 210;
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];

        const canvas = await html2canvas(slide, {
          scale: 1.0,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          imageTimeout: 0,
          removeContainer: true,
          windowWidth: slide.scrollWidth,
          windowHeight: slide.scrollHeight,
        });

        const imgHeight = (canvas.height * A4_W) / canvas.width;

        if (i > 0) pdf.addPage();

        pdf.addImage(canvas, "JPEG", 0, 0, A4_W, imgHeight, undefined, "FAST");

        setProgress(Math.round(((i + 1) / totalSlides) * 100));
      }

      pdf.save(`Tvastr_${productName}.pdf`);
    } catch (err) {
      console.error("[PDF export error]", err);
    } finally {
      if (root) root.classList.remove("pdf-export-mode");
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <>
      {/* ── CONTACT SLIDE — appears in the PDF as the final slide ── */}
      <section
        className="presentation-slide"
        style={{ background: "var(--bg-primary)" }}
      >
        {/* Full-height centered contact card */}
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20 text-center">
          {/* Green top accent bar */}
          <div
            className="w-16 h-1 rounded-full mb-10"
            style={{ background: "var(--process-primary)" }}
            aria-hidden="true"
          />

          <p
            className="font-mono text-[11px] tracking-[0.28em] uppercase mb-6"
            style={{ color: "var(--signal-glow)" }}
          >
            Contact
          </p>

          <h2 className="text-3xl md:text-4xl font-medium text-txt-primary leading-tight tracking-[-0.01em] mb-3">
            {contactName}
          </h2>

          <a
            href={`mailto:${contactEmail}`}
            className="text-base md:text-lg text-process-primary border-b border-process-primary/40 pb-0.5 hover:border-process-primary transition-colors"
            style={{ textDecoration: "none" }}
          >
            {contactEmail}
          </a>

          <div
            className="mt-12 pt-8 w-full max-w-xs"
            style={{ borderTop: "1px solid var(--border-subtle)" }}
          >
            <p className="font-mono text-[10px] tracking-[0.32em] uppercase text-txt-muted">
              Tvastr · Industrial AI Systems
            </p>
          </div>
        </div>

        {/* Slide footer */}
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>{productName.replace(/_/g, " ")}</span>
          <span className="slide-number" />
        </div>
      </section>

      {/* ── DOWNLOAD UI — visible on website only ── */}
      <div
        className="no-pdf-export"
        style={{
          background: "var(--bg-panel)",
          borderTop: "1px solid var(--border-subtle)",
          padding: "56px 32px",
          textAlign: "center",
        }}
      >
        <p
          className="font-mono text-[11px] tracking-[0.28em] uppercase mb-4"
          style={{ color: "var(--signal-glow)" }}
        >
          Download Presentation
        </p>
        <h2 className="text-xl md:text-2xl font-medium text-txt-primary mb-2">
          System Overview Document
        </h2>
        <p className="text-sm text-txt-secondary mb-8 max-w-sm mx-auto">
          Export this technical briefing as a structured PDF presentation.
        </p>

        <button
          onClick={downloadPDF}
          disabled={loading}
          className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-process-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-panel"
          style={{
            background: loading
              ? "var(--border-default)"
              : "var(--process-primary)",
            color: loading ? "var(--text-secondary)" : "var(--bg-primary)",
          }}
        >
          {loading ? (
            <>
              <span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                style={{ animation: "spin 0.7s linear infinite" }}
              />
              Generating PDF… {progress}%
            </>
          ) : (
            <>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 1v9M5 7l3 3 3-3M2 12v2h12v-2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download PDF
            </>
          )}
        </button>

        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-txt-muted mt-6">
          Tvastr · {productName.replace(/_/g, " ")}
        </p>
      </div>
    </>
  );
}
