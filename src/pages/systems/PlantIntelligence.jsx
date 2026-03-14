import { Link } from 'react-router-dom'
import { SystemDetailSection } from '../../components/systems/SystemDetailSection'
import { SystemWorkflow } from '../../components/systems/SystemWorkflow'
import { SystemImpactGrid } from '../../components/systems/SystemImpactGrid'
import { DownloadPresentationButton } from '../../components/DownloadPresentationButton'

/**
 * PlantIntelligence — Technical detail page.
 * Light industrial theme. Structured like a consulting presentation deck.
 * Each section maps to one PDF slide via .presentation-slide class.
 * Route: /systems/plant-intelligence
 */
export function PlantIntelligence() {
  return (
    <div id="presentation-root" style={{ background: '#ffffff', color: '#111827' }}>

      {/* ── Top nav (not a slide — excluded from PDF) ─────────────── */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-12 h-14"
        style={{ background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #e5e7eb', backdropFilter: 'blur(8px)' }}
      >
        <Link to="/" className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 hover:text-slate-700 transition-colors">
          ← Tvastr
        </Link>
        <span className="text-xs text-slate-400 tracking-wide hidden sm:block">Plant Intelligence</span>
      </div>

      {/* ── SLIDE 1 — Title ───────────────────────────────────────── */}
      <section className="presentation-slide" style={{ background: '#ffffff' }}>
        <div className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20 w-full">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-6">
            Tvastr · Industrial AI Systems
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            Plant Intelligence
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-[680px] leading-relaxed mb-5">
            A factory intelligence layer that answers operational questions from plant data.
          </p>
          <p className="text-base text-gray-600 max-w-[680px] leading-relaxed">
            Plant Intelligence reads ERP data, inspection databases, and production logs
            to surface actionable operational insights — in natural language.
          </p>
        </div>
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>Plant Intelligence</span>
          <span className="slide-number" />
        </div>
      </section>

      {/* ── SLIDE 2 — The Problem ─────────────────────────────────── */}
      <SystemDetailSection
        label="01 / The Problem"
        title="Plant data exists, but operational insight does not."
        body="Modern factories generate large volumes of structured data — ERP transactions, production logs, quality records, maintenance events. Yet operational insight remains scarce. Most plant managers cannot easily answer basic questions about their own production."
        bullets={[
          'ERP data is fragmented across modules and difficult to query',
          'Inspection and quality records are stored separately from production logs',
          'Operational questions require manual data extraction and analysis',
          'Insight generation depends on individual analyst capability',
          'Data exists in silos — no unified view of plant performance',
        ]}
      />

      {/* ── SLIDE 3 — The Solution ───────────────────────────────── */}
      <SystemDetailSection
        label="02 / The Solution"
        title="A unified factory intelligence layer that connects plant data sources."
        body="Plant Intelligence sits as an intelligence layer above existing plant data systems. It connects to ERP databases, inspection records, and production logs — and makes them queryable in natural language."
        bullets={[
          'Natural language query interface for operational questions',
          'SQL analytics engine for structured plant data',
          'RAG-based knowledge retrieval from production documents',
          'Automated insight generation from production patterns',
          'No replacement of existing systems — reads data where it lives',
        ]}
      />

      {/* ── SLIDE 4 — How It Works ───────────────────────────────── */}
      <SystemDetailSection
        label="03 / How It Works"
        title="Natural language queries resolved through a multi-layer intelligence pipeline."
        body="When a plant manager asks a question, the system routes it through the appropriate intelligence layer — SQL analytics for structured queries, RAG retrieval for knowledge-based questions, or a combination of both."
      >
        <SystemWorkflow
          steps={[
            'Receive natural language query',
            'Parse query intent',
            'Route to SQL / RAG / hybrid',
            'Execute against plant data',
            'Synthesise structured response',
            'Surface actionable insight',
          ]}
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <p className="text-sm font-semibold text-gray-700 mb-3">SQL Analytics</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Translates natural language questions into SQL queries against structured plant databases — ERP tables, production logs, quality records.
            </p>
          </div>
          <div className="p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <p className="text-sm font-semibold text-gray-700 mb-3">RAG Knowledge Retrieval</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Retrieves relevant context from production procedures, quality standards, and historical reports using retrieval-augmented generation.
            </p>
          </div>
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 5 — Data Sources ───────────────────────────────── */}
      <SystemDetailSection
        label="04 / Data Sources"
        title="Connects to existing plant data infrastructure."
        body="Plant Intelligence reads from data sources already present in the factory. No data migration or system replacement is required."
      >
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { source: 'ERP System', examples: ['Production orders', 'Material consumption', 'Inventory levels', 'Dispatch records'] },
            { source: 'Inspection Database', examples: ['Rejection records', 'Defect classifications', 'Quality KPIs', 'Inspector logs'] },
            { source: 'Production Logs', examples: ['Machine run times', 'Shift records', 'Process parameters', 'Maintenance events'] },
          ].map((ds, i) => (
            <div key={i} className="p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <p className="text-sm font-semibold text-gray-800 mb-3">{ds.source}</p>
              <ul className="space-y-1.5">
                {ds.examples.map((ex, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />{ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 6 — System Architecture ───────────────────────── */}
      <SystemDetailSection
        label="05 / System Architecture"
        title="On-premise data connectors within the plant network."
        body="The system runs on-premise within the factory network. Data connectors read from existing databases. No plant data is transmitted to external services."
        bullets={[
          'On-premise deployment on a plant server or workstation',
          'Read-only connectors to ERP, quality, and production databases',
          'Local vector store for RAG knowledge base',
          'LLM inference runs locally or via private API endpoint',
          'Plant data never leaves the factory network',
        ]}
      />

      {/* ── SLIDE 7 — Operational Insights ──────────────────────── */}
      <SystemDetailSection
        label="06 / Operational Insights"
        title="Examples of questions Plant Intelligence can answer."
        body="The system answers the operational questions that plant managers and quality engineers ask every day — but currently cannot get answered quickly."
      >
        <div className="mt-6 space-y-3">
          {[
            'What was the rejection rate for casting X across the last 3 months by shift?',
            'Which mold configurations have the highest sand inclusion frequency?',
            'What process parameters correlate with shrinkage defects in heat Y?',
            'Which production orders are behind schedule this week and why?',
            'What is the trend in surface risk scores over the last 30 production runs?',
            'Which machine had the most downtime last month and what were the causes?',
          ].map((q, i) => (
            <div key={i} className="flex items-start gap-3 p-4"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <span className="mt-0.5 text-xs font-mono font-semibold text-slate-300 flex-shrink-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="text-sm text-gray-600 italic">&ldquo;{q}&rdquo;</p>
            </div>
          ))}
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 8 — Business Impact ────────────────────────────── */}
      <SystemDetailSection
        label="07 / Business Impact"
        title="Measurable impact across operational and strategic dimensions."
        body="Plant Intelligence reduces the time from question to insight — enabling faster decisions with better data."
      >
        <SystemImpactGrid
          operational={[
            'Operational questions answered in seconds rather than hours',
            'Reduced dependency on manual data extraction and analysis',
            'Plant managers access production intelligence directly',
            'Faster identification of production bottlenecks and anomalies',
          ]}
          strategic={[
            'Unified view of plant performance across data silos',
            'Data-driven decisions grounded in actual production history',
            'Knowledge base preserves institutional process knowledge',
            'Foundation for continuous operational intelligence improvement',
          ]}
        />
      </SystemDetailSection>

      {/* ── SLIDE 9 — Download / Contact (final slide) ───────────── */}
      <DownloadPresentationButton productName="Plant_Intelligence" />

    </div>
  )
}
