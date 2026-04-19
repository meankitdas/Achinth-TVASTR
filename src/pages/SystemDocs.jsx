import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Logo } from '../components/Logo'

// Mobile-friendly doc selector
function MobileDocSelector({ docs, selectedDoc, setSelectedDoc }) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedDocTitle = docs?.find(d => d.file === selectedDoc)?.title || 'Select document'

  return (
    <div className="md:hidden mb-4 px-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm rounded"
        style={{
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.2)',
          color: '#fbbf24',
        }}
      >
        <span>{selectedDocTitle}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="mt-2 rounded overflow-hidden"
          style={{
            background: 'rgba(17,17,19,0.95)',
            border: '1px solid rgba(168,168,180,0.08)',
          }}
        >
          <div className="p-2">
            {docs?.map((doc) => (
              <button
                key={doc.file}
                onClick={() => {
                  setSelectedDoc(doc.file)
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-2 rounded text-sm transition-colors duration-150"
                style={{
                  color: selectedDoc === doc.file ? '#fbbf24' : '#a8a8b4',
                  background: selectedDoc === doc.file ? 'rgba(245,158,11,0.08)' : 'transparent',
                }}
              >
                {doc.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const STYLES = {
  background: { background: '#0a0a0b' },
  header: {
    background: 'rgba(10,10,11,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(168,168,180,0.06)',
  },
  titleGradient: {
    background: 'linear-gradient(135deg, #ffffff 0%, #c8c8d0 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  card: {
    background: 'rgba(17,17,19,0.95)',
    border: '1px solid rgba(168,168,180,0.08)',
    borderRadius: '0.75rem',
    boxShadow: '0 0 15px rgba(245,158,11,0.08), 0 0 30px rgba(245,158,11,0.04)',
  },
}

/**
 * SystemDocs — Public system documentation page
 * 
 * Displays the 5 customer-facing system documentation files
 * with a sidebar navigation and markdown viewer.
 */
export function SystemDocs() {
  const [manifest, setManifest] = useState(null)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [docContent, setDocContent] = useState('')
  const [loadingDoc, setLoadingDoc] = useState(false)
  const [error, setError] = useState(null)

  // Fetch documentation manifest
  useEffect(() => {
    async function fetchManifest() {
      try {
        const response = await fetch('/manual/manifest.json')
        if (!response.ok) throw new Error('Failed to load documentation manifest')
        const data = await response.json()
        setManifest(data)
        
        // Auto-select first doc
        if (data.docs?.[0]) {
          setSelectedDoc(data.docs[0].file)
        }
      } catch (err) {
        console.error('[SystemDocs] Error loading manifest:', err)
        setError(err.message)
      }
    }

    fetchManifest()
  }, [])

  // Fetch selected document content
  useEffect(() => {
    if (!selectedDoc) return

    async function fetchDocContent() {
      setLoadingDoc(true)
      setError(null)

      try {
        const response = await fetch(`/manual/${selectedDoc}`)
        if (!response.ok) throw new Error('Failed to load document')
        const content = await response.text()
        setDocContent(content)
      } catch (err) {
        console.error('[SystemDocs] Error loading document:', err)
        setError(err.message)
        setDocContent('')
      } finally {
        setLoadingDoc(false)
      }
    }

    fetchDocContent()
  }, [selectedDoc])

  return (
    <div className="min-h-screen relative" style={STYLES.background}>
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Top nav */}
      <header className="sticky top-0 z-40" style={STYLES.header}>
        <div className="w-full px-4 md:px-6 lg:px-8 xl:px-12 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
            <Logo size="sm" />
            <span className="text-metallic-600 text-xs hidden md:inline">/ System Documentation</span>
          </Link>

          <div className="flex items-center gap-3 md:gap-6">
            <Link
              to="/"
              className="text-xs font-semibold tracking-wider md:tracking-widest uppercase text-amber-forge hover:text-amber-glow transition-colors duration-200"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 w-full px-4 md:px-6 lg:px-8 xl:px-12 py-8 md:py-12 lg:py-16">
        {/* Page header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-amber-forge opacity-60" />
            <span className="text-xs font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase text-amber-forge opacity-60">
              Technical Documentation
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-3" style={STYLES.titleGradient}>
            TvastrRAS System Documentation
          </h1>
          <p className="text-xs md:text-sm text-metallic-400">
            Comprehensive technical documentation for the TvastrRAS inspection system.
          </p>
        </div>

        {/* Documentation viewer */}
        <div style={STYLES.card}>
          <div className="md:flex">
            {/* Desktop sidebar */}
            <div
              className="hidden md:block w-1/5 min-w-[180px] max-w-[240px] shrink-0 border-r overflow-y-auto"
              style={{
                borderColor: 'rgba(168,168,180,0.08)',
                maxHeight: '70vh',
              }}
            >
              {manifest ? (
                <div className="p-4">
                  <div className="space-y-1">
                    {manifest.docs?.map((doc) => (
                      <button
                        key={doc.file}
                        onClick={() => setSelectedDoc(doc.file)}
                        className="w-full text-left px-3 py-2 rounded text-sm transition-colors duration-150"
                        style={{
                          color: selectedDoc === doc.file ? '#fbbf24' : '#a8a8b4',
                          background: selectedDoc === doc.file ? 'rgba(245,158,11,0.08)' : 'transparent',
                          border: selectedDoc === doc.file ? '1px solid rgba(245,158,11,0.15)' : '1px solid transparent',
                        }}
                      >
                        {doc.title}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <span className="text-xs text-metallic-500">Loading...</span>
                </div>
              )}
            </div>

            {/* Content area */}
            <div className="flex-1">
              {/* Mobile document selector */}
              {manifest && <MobileDocSelector docs={manifest.docs} selectedDoc={selectedDoc} setSelectedDoc={setSelectedDoc} />}

              <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                {loadingDoc ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className="w-8 h-8"
                        style={{
                          background: 'rgba(245,158,11,0.1)',
                          border: '1px solid rgba(245,158,11,0.3)',
                          borderRadius: '0.375rem',
                          transform: 'rotate(45deg)',
                          animation: 'pulse 1.5s ease-in-out infinite',
                        }}
                      />
                      <span className="text-xs text-metallic-500 tracking-widest uppercase">
                        Loading document...
                      </span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="p-4 md:p-8 text-center">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                ) : docContent ? (
                  <div className="p-4 md:p-8 prose prose-invert prose-amber max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => <h1 className="text-xl md:text-2xl font-bold text-metallic-100 mb-4 border-b border-metallic-800 pb-3" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-lg md:text-xl font-bold text-metallic-200 mb-3 mt-6 md:mt-8" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-base md:text-lg font-semibold text-metallic-300 mb-2 mt-4 md:mt-6" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="text-sm md:text-base font-semibold text-metallic-300 mb-2 mt-3 md:mt-4" {...props} />,
                        h5: ({ node, ...props }) => <h5 className="text-xs md:text-sm font-semibold text-metallic-400 mb-1 mt-2 md:mt-3" {...props} />,
                        h6: ({ node, ...props }) => <h6 className="text-xs font-semibold text-metallic-500 mb-1 mt-2" {...props} />,
                        p: ({ node, ...props }) => <p className="text-xs md:text-sm text-metallic-400 mb-4 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => <ul className="text-xs md:text-sm text-metallic-400 mb-4 ml-4 md:ml-6 list-disc space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="text-xs md:text-sm text-metallic-400 mb-4 ml-4 md:ml-6 list-decimal space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
                        code: ({ node, inline, ...props }) =>
                          inline ? (
                            <code className="px-1.5 py-0.5 rounded text-amber-forge font-mono text-xs" style={{ background: 'rgba(245,158,11,0.1)' }} {...props} />
                          ) : (
                            <code className="block p-3 md:p-4 rounded font-mono text-xs text-metallic-300 overflow-x-auto" style={{ background: 'rgba(10,10,11,0.6)', border: '1px solid rgba(168,168,180,0.08)' }} {...props} />
                          ),
                        pre: ({ node, ...props }) => <pre className="mb-4" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold text-amber-forge" {...props} />,
                        em: ({ node, ...props }) => <em className="italic text-metallic-300" {...props} />,
                        a: ({ node, href, ...props }) => {
                          // Inter-doc link handler
                          if (href && href.endsWith('.md')) {
                            return (
                              <button
                                onClick={() => setSelectedDoc(href)}
                                className="text-amber-forge hover:underline break-words cursor-pointer"
                                {...props}
                              />
                            )
                          }
                          return <a href={href} className="text-amber-forge hover:underline break-words" target="_blank" rel="noopener noreferrer" {...props} />
                        },
                        hr: ({ node, ...props }) => <hr className="my-6 md:my-8 border-metallic-800" {...props} />,
                        blockquote: ({ node, ...props }) => (
                          <blockquote
                            className="pl-4 md:pl-6 py-3 my-4 italic text-metallic-300 border-l-4"
                            style={{
                              borderColor: '#f59e0b',
                              background: 'rgba(245,158,11,0.05)',
                            }}
                            {...props}
                          />
                        ),
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto mb-4">
                            <table
                              className="w-full text-xs md:text-sm border-collapse"
                              style={{ border: '1px solid rgba(168,168,180,0.15)' }}
                              {...props}
                            />
                          </div>
                        ),
                        thead: ({ node, ...props }) => (
                          <thead
                            style={{ background: 'rgba(245,158,11,0.1)' }}
                            {...props}
                          />
                        ),
                        tbody: ({ node, ...props }) => <tbody {...props} />,
                        tr: ({ node, ...props }) => (
                          <tr
                            style={{ borderBottom: '1px solid rgba(168,168,180,0.1)' }}
                            {...props}
                          />
                        ),
                        th: ({ node, ...props }) => (
                          <th
                            className="px-3 md:px-4 py-2 text-left font-semibold tracking-wider uppercase text-amber-forge"
                            style={{ borderBottom: '2px solid rgba(245,158,11,0.3)' }}
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td
                            className="px-3 md:px-4 py-2 text-metallic-300"
                            style={{ borderRight: '1px solid rgba(168,168,180,0.08)' }}
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
                    <p className="text-sm text-metallic-500">Select a document to view</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back to site */}
        <div className="mt-6 md:mt-8 text-center">
          <Link
            to="/"
            className="text-xs text-metallic-600 hover:text-metallic-300 transition-colors duration-200 tracking-wider"
          >
            ← Return to tvastr.ai
          </Link>
        </div>
      </main>
    </div>
  )
}
