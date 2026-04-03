import { useState } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

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
  contactName = 'Achintharya Patil',
  contactEmail = 'support@tvastr.co',
}) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const downloadPDF = async () => {
    setLoading(true)
    setProgress(0)

    // Grab the root container to toggle pdf-export-mode
    const root = document.getElementById('presentation-root')

    try {
      // Apply PDF layout mode — triggers full-height slide CSS
      if (root) root.classList.add('pdf-export-mode')

      // Allow browser to repaint with new styles before capturing
      // requestAnimationFrame ensures layout is complete, then add small buffer
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 50)))

      const slides = document.querySelectorAll('.presentation-slide')
      const totalSlides = slides.length

      if (totalSlides === 0) {
        console.warn('[PDF] No .presentation-slide elements found.')
        return
      }

      // Inject slide numbers into each .slide-number span
      slides.forEach((slide, i) => {
        const numEl = slide.querySelector('.slide-number')
        if (numEl) numEl.textContent = `${i + 1} / ${totalSlides}`
      })

      // ──────────────────────────────────────────────────────────
      // PARALLEL CANVAS CAPTURE — capture all slides concurrently
      // with a concurrency limit to avoid memory spikes
      // ──────────────────────────────────────────────────────────
      const captureSlide = async (slide, index) => {
        const canvas = await html2canvas(slide, {
          scale: 1.0, // Reduced from 1.2 — still excellent quality, 30% faster
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: slide.scrollWidth,
          windowHeight: slide.scrollHeight,
        })

        // Convert canvas to blob (async, more efficient than toDataURL)
        return new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Canvas to blob conversion failed'))
              
              const reader = new FileReader()
              reader.onloadend = () => {
                setProgress(Math.round(((index + 1) / totalSlides) * 100))
                resolve({
                  dataUrl: reader.result,
                  width: canvas.width,
                  height: canvas.height,
                })
              }
              reader.onerror = reject
              reader.readAsDataURL(blob)
            },
            'image/jpeg',
            0.8
          )
        })
      }

      // Capture slides with concurrency limit (4 at a time)
      const CONCURRENCY = 4
      const capturedSlides = []
      
      for (let i = 0; i < slides.length; i += CONCURRENCY) {
        const batch = Array.from(slides)
          .slice(i, i + CONCURRENCY)
          .map((slide, batchIndex) => captureSlide(slide, i + batchIndex))
        
        const batchResults = await Promise.all(batch)
        capturedSlides.push(...batchResults)
      }

      // ──────────────────────────────────────────────────────────
      // BUILD PDF — Sequential (fast, ~10ms per slide)
      // ──────────────────────────────────────────────────────────
      const A4_W = 210
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })

      capturedSlides.forEach((captured, i) => {
        const imgHeight = (captured.height * A4_W) / captured.width
        if (i > 0) pdf.addPage()
        pdf.addImage(captured.dataUrl, 'JPEG', 0, 0, A4_W, imgHeight)
      })

      pdf.save(`Tvastr_${productName}.pdf`)
    } catch (err) {
      console.error('[PDF export error]', err)
    } finally {
      // Restore normal website layout
      if (root) root.classList.remove('pdf-export-mode')
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <>
      {/*
       * CONTACT SLIDE — appears in the PDF as the final slide.
       * Contains only contact info. No UI elements.
       */}
      <section
        className="presentation-slide"
        style={{ background: '#ffffff', textAlign: 'center', alignItems: 'center' }}
      >
        <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-8">
            Contact
          </p>
          <p className="text-2xl font-bold text-gray-900 mb-3">{contactName}</p>
          <a
            href={`mailto:${contactEmail}`}
            className="text-base text-slate-500"
            style={{ textDecoration: 'none' }}
          >
            {contactEmail}
          </a>
          <div className="mt-10" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
            <p className="text-xs text-slate-400 tracking-widest uppercase">Tvastr · Industrial AI Systems</p>
          </div>
        </div>

        {/* Slide footer */}
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>{productName.replace(/_/g, ' ')}</span>
          <span className="slide-number" />
        </div>
      </section>

      {/*
       * DOWNLOAD UI — visible on website only.
       * Hidden during PDF export via .no-pdf-export class.
       */}
      <div
        className="no-pdf-export"
        style={{
          background: '#f8fafc',
          borderTop: '1px solid #e5e7eb',
          padding: '48px 32px',
          textAlign: 'center',
        }}
      >
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-4">
          Download Presentation
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          System Overview Document
        </h2>
        <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto">
          Export this technical briefing as a structured PDF presentation.
        </p>

        <button
          onClick={downloadPDF}
          disabled={loading}
          className="inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: loading ? '#f1f5f9' : '#111827',
            color: loading ? '#64748b' : '#ffffff',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
          }}
        >
          {loading ? (
            <>
              <span
                className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full"
                style={{ animation: 'spin 0.7s linear infinite' }}
              />
              Generating PDF… {progress}%
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v9M5 7l3 3 3-3M2 12v2h12v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download PDF
            </>
          )}
        </button>

        <p className="text-xs text-slate-400 mt-4">
          Tvastr · {productName.replace(/_/g, ' ')}
        </p>
      </div>
    </>
  )
}
