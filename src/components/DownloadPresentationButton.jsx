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
  contactEmail = 'achintharya@gmail.com',
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
      await new Promise((resolve) => setTimeout(resolve, 200))

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

      // A4 width in mm — compress: true enables PDF-level deflate compression
      const A4_W = 210
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true })

      for (let i = 0; i < slides.length; i++) {
        setProgress(Math.round(((i + 1) / slides.length) * 100))

        const slide = slides[i]

        // scale 1.2 = good quality at reduced file size vs scale 2
        const canvas = await html2canvas(slide, {
          scale: 1.2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          windowWidth: slide.scrollWidth,
          windowHeight: slide.scrollHeight,
        })

        // JPEG at 0.8 quality — dramatically smaller than PNG, still sharp
        const imgData = canvas.toDataURL('image/jpeg', 0.8)
        const imgHeight = (canvas.height * A4_W) / canvas.width

        if (i > 0) pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, 0, A4_W, imgHeight)
      }

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
    <section
      className="presentation-slide"
      style={{ background: '#f8fafc', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
    >
      {/* Contact info */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-400 mb-6">
          Contact
        </p>
        <p className="text-lg font-semibold text-gray-900">{contactName}</p>
        <a
          href={`mailto:${contactEmail}`}
          className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          {contactEmail}
        </a>
      </div>

      <div
        className="w-16 h-px mb-10 mx-auto"
        style={{ background: '#e2e8f0' }}
      />

      {/* Download section */}
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-4">
        Download Presentation
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        System Overview Document
      </h2>
      <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
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

      {/* Slide footer */}
      <div className="slide-footer">
        <span>Tvastr</span>
        <span>{productName.replace(/_/g, ' ')}</span>
        <span className="slide-number" />
      </div>
    </section>
  )
}
