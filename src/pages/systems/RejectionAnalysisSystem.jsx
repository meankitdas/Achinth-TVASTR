import { Link } from 'react-router-dom'
import { SystemDetailSection } from '../../components/systems/SystemDetailSection'
import { SystemImageBlock } from '../../components/systems/SystemImageBlock'
import { SystemWorkflow } from '../../components/systems/SystemWorkflow'
import { SystemImpactGrid } from '../../components/systems/SystemImpactGrid'
import { DownloadPresentationButton } from '../../components/DownloadPresentationButton'
import { useDocumentHead } from '../../hooks/useDocumentHead'

/**
 * RejectionAnalysisSystem — Technical detail page.
 * Light industrial theme. Structured like a consulting presentation deck.
 * Each section maps to one PDF slide via .presentation-slide class.
 * Route: /systems/rejection-analysis-system
 */
export function RejectionAnalysisSystem() {
  useDocumentHead(
    'Rejection Analysis System — AI Inspection & Quality Control | Tvastr',
    'AI-powered inspection platform for heavy manufacturing. Automated defect detection, root cause mapping, and process-aware quality intelligence.',
    'https://tvastr.co/systems/rejection-analysis-system'
  )

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
        <span className="text-xs text-slate-400 tracking-wide hidden sm:block">Rejection Analysis System</span>
      </div>

      {/* ── SLIDE 1 — Title ───────────────────────────────────────── */}
      <section className="presentation-slide" style={{ background: '#ffffff' }}>
        <div className="max-w-[900px] mx-auto px-6 md:px-8 py-16 md:py-20 w-full">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-6">
            Tvastr · Industrial AI Systems
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            Rejection Analysis System
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-[680px] leading-relaxed">
            An industrial AI platform that transforms casting inspection into structured plant-level quality intelligence.
          </p>
        </div>
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>Rejection Analysis System</span>
          <span className="slide-number" />
        </div>
      </section>

      {/* ── SLIDE 2 — Deployment Modes ────────────────────────────── */}
      <SystemDetailSection
        label="01 / Deployment Modes"
        title="Available in Two Configurations"
        body="Rejection Analysis System is available in two configurations to match different deployment requirements."
      >
        <div className="mt-6 flex flex-col md:flex-row items-stretch gap-0" style={{ maxWidth: '720px' }}>
          {/* LEFT — Core (Standalone) */}
          <div className="flex-1 p-6" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px 0 0 8px' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
              <p className="text-base font-bold text-gray-800">Core (Standalone)</p>
            </div>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Image-based inspection system with no integration requirements.
            </p>
            <ul className="space-y-2">
              {['Image-based inspection','Defect detection and classification','Root cause analysis','PDF reporting'].map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />{c}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT — Enterprise (Integrated) */}
          <div className="flex-1 p-6" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0 8px 8px 0' }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
              <p className="text-base font-bold text-gray-800">Enterprise (Integrated)</p>
            </div>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              Fully integrated system with process-aware quality analysis.
            </p>
            <ul className="space-y-2">
              {['SQL / ERP integration','Batch ingestion','Full manufacturing traceability','Process intelligence (drift detection, defect graph, heat analysis)'].map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1 h-1 rounded-full bg-sky-400 flex-shrink-0" />{c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-5 text-sm text-slate-500 italic text-center" style={{ maxWidth: '720px' }}>
          The Enterprise configuration transforms inspection into a continuous process intelligence layer.
        </p>
      </SystemDetailSection>

      {/* ── SLIDE 3 — The Problem ─────────────────────────────────── */}
      <SystemDetailSection
        label="02 / The Problem"
        title="Manual inspection is inconsistent and opaque."
        body="In most foundries, casting inspection is performed manually. The process is subjective, shift-dependent, and difficult to audit. Inspection data is rarely structured — defects are logged informally or not at all."
        bullets={[
          'Subjective evaluation that varies across inspectors',
          'Inconsistent decisions across shifts and operators',
          'No standardised defect classification or severity scoring',
          'Inspection only flags defects — it does not generate manufacturing insight',
          'Difficult to trace decisions back to process conditions',
        ]}
      />

      {/* ── SLIDE 4 — The Opportunity ────────────────────────────── */}
      <SystemDetailSection
        label="03 / The Opportunity"
        title="Every casting is inspected. That makes inspection the largest scalable data stream in a foundry."
        body="If structured properly, inspection becomes far more than a quality gate. It becomes a real-time process diagnostic layer — running automatically, on every part, at production speed."
        bullets={[
          'A standardised decision engine operating at casting level',
          'A process diagnostic layer linked to manufacturing context',
          'A measurable KPI framework for quality operations',
          'A continuous improvement pipeline driven by production data',
        ]}
      />

      {/* ── SLIDE 5 — The Solution ───────────────────────────────── */}
      <SystemDetailSection
        label="04 / The Solution"
        title="A structured inspection pipeline from image capture to operational decision."
      >
        <SystemWorkflow
          steps={[
            'Capture Casting Image',
            'Verify Image Quality',
            'Detect & Localise Defects',
            'Dense Surface Analysis',
            'Severity & Spatial Scoring',
            'Root Cause Reasoning',
            'Casting-Level Decision',
            'Process Section Linkage',
            'Structured Logging',
          ]}
          outputs={['Accept', 'Check Required', 'Reject']}
        />
      </SystemDetailSection>

      {/* ── SLIDE 6 — Inspection Interface ──────────────────────── */}
      <SystemDetailSection
        label="05 / Application Screens"
        title="Inspection Interface"
        body="Operators upload casting images and manufacturing context before running inspection."
      >
        <SystemImageBlock
          src="/inspection_app_ss.png"
          alt="Rejection Analysis System — Inspection Interface"
          caption="Operators upload casting images and manufacturing context before running inspection."
        />
      </SystemDetailSection>

      {/* ── SLIDE 7 — Batch Processing ───────────────────────────── */}
      <SystemDetailSection
        label="06 / Application Screens"
        title="Batch Processing"
        body="Multiple castings can be queued and processed in a single batch run, enabling high-throughput inspection across production shifts."
      >
        <SystemImageBlock
          src="/batchProc_app_ss.png"
          alt="Rejection Analysis System — Batch Processing"
          caption="Multiple castings queued and processed in a single batch run for high-throughput inspection."
        />
      </SystemDetailSection>

      {/* ── SLIDE 8 — Analytics Dashboard ───────────────────────── */}
      <SystemDetailSection
        label="07 / Application Screens"
        title="Analytics Dashboard"
      >
        <SystemImageBlock
          src="/analytics_app_ss.png"
          alt="Rejection Analysis System — Analytics Dashboard"
          caption="Inspection results automatically generate plant-level quality analytics and operational KPIs."
        />
      </SystemDetailSection>

      {/* ── SLIDE 9 — Process Intelligence ──────────────────────── */}
      <SystemDetailSection
        label="08 / Application Screens"
        title="Process Intelligence"
        body="Plant managers query inspection and production data using natural language to surface operational insights and quality trends."
      >
        <SystemImageBlock
          src="/procInt_app_ss.png"
          alt="Rejection Analysis System — Process Intelligence"
          caption="Natural language queries against plant data surface quality and operational insights directly."
        />
      </SystemDetailSection>

      {/* ── SLIDE 10 — Inference Engine ───────────────────────────── */}
      <SystemDetailSection
        label="09 / Inference Engine"
        title="Rule-based decision engine converts AI predictions into operational outcomes."
        body="The inference pipeline culminates in a decision engine that applies configurable rules to determine inspection outcomes."
      >
        <div className="mt-6 p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <p className="text-sm font-semibold text-gray-700 mb-3">Decision Engine Rules</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Area thresholds', 'Defect severity weights', 'Zone-based inspection sensitivity', 'Critical zone sensitivity', 'Customer-specific rules'].map((rule, i) => (
              <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-slate-300" />{rule}
              </div>
            ))}
          </div>
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 11 — Root Cause Mapping ───────────────────────── */}
      <SystemDetailSection
        label="10 / Root Cause Mapping"
        title="Root Cause Mapping"
        body="Each inspection event carries structured manufacturing context. Aggregated across multiple inspections, these records reveal recurring process-level patterns and their likely root causes. The system generates plain-language root cause explanations alongside statistical patterns."
      >
        {/* Two-column diagnostic layout */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch gap-0">

          {/* LEFT — Inspection Record */}
          <div className="flex-1 p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px 0 0 8px' }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-4">Inspection Record</p>
            <div className="space-y-2 mb-5">
              {[
                ['Casting ID', 'C-11842'],
                ['Heat Number', '2343'],
                ['Batch', 'B-07'],
                ['Mold ID', 'M12'],
                ['Furnace', 'F2'],
                ['Shift', 'Night'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-400 w-28 flex-shrink-0">{k}</span>
                  <span className="text-sm font-medium text-gray-700">{v}</span>
                </div>
              ))}
            </div>
            <div className="pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
              {[
                ['Detected Defect', 'Porosity', 'text-gray-700'],
                ['Severity', 'High', 'text-red-600 font-semibold'],
                ['Decision', 'Reject', 'text-red-600 font-semibold'],
              ].map(([k, v, cls]) => (
                <div key={k} className="flex items-baseline gap-2 mt-2">
                  <span className="text-xs text-slate-400 w-28 flex-shrink-0">{k}</span>
                  <span className={`text-sm ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 italic mt-4">
              Single inspection event with traceable manufacturing context.
            </p>
          </div>

          {/* CONNECTOR — Pattern Detection */}
          <div className="flex flex-row md:flex-col items-center justify-center px-2 py-4 md:py-0" style={{ minWidth: '80px' }}>
            <div className="hidden md:flex flex-col items-center gap-1">
              <div className="w-px flex-1" style={{ background: '#e2e8f0' }} />
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                <path d="M0 12h26M20 6l6 6-6 6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="w-px flex-1" style={{ background: '#e2e8f0' }} />
            </div>
            <p className="text-xs font-semibold text-slate-400 tracking-[0.15em] uppercase md:mt-2 text-center leading-tight" style={{ fontSize: '10px' }}>
              Pattern<br />Detection
            </p>
            {/* Mobile horizontal arrow */}
            <svg className="md:hidden mx-3" width="24" height="16" viewBox="0 0 24 16" fill="none">
              <path d="M0 8h18M14 4l4 4-4 4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* RIGHT — Process Insight */}
          <div className="flex-1 p-5" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0 8px 8px 0' }}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 mb-4">Process Insight</p>
            <div className="space-y-2 mb-4">
              {[
                ['Heat Number', '2343'],
                ['Total Castings', '112'],
                ['Rejected Castings', '20'],
                ['Rejection Rate', '17.8%'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-400 w-32 flex-shrink-0">{k}</span>
                  <span className="text-sm font-medium text-gray-700">{v}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 space-y-3" style={{ borderTop: '1px solid #bae6fd' }}>
              <div>
                <p className="text-xs text-slate-400 mb-1">Dominant Defect</p>
                <p className="text-sm font-semibold text-gray-800">Porosity</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Likely Process Cause</p>
                <p className="text-sm text-gray-700">Gas entrapment or pouring temperature variation</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-2">Recommended Checks</p>
                <ul className="space-y-1">
                  {[
                    'Verify melt degassing procedure',
                    'Review pouring temperature stability',
                    'Inspect gating and venting conditions',
                  ].map((check, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                      {check}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="text-xs text-slate-400 italic mt-4">
              Aggregated inspection data reveals manufacturing patterns and likely root causes.
            </p>
          </div>
        </div>

        {/* Bottom summary line */}
        <p className="mt-6 text-sm text-slate-500 text-center italic">
          Rejection data becomes a structured diagnostic layer for the manufacturing process.
        </p>
      </SystemDetailSection>

      {/* ── SLIDE 12 — System Architecture ──────────────────────── */}
      <SystemDetailSection
        label="11 / System Architecture"
        title="On-premise deployment within the plant network."
        body="The system runs entirely on-premise on a dedicated inspection workstation. No casting images or production data leave the plant network."
        bullets={[
          'Processes images in real time at the inspection station',
          'Stores inspection records in a local SQL database',
          'Integrates with ERP and MES data for manufacturing context',
          'Full data sovereignty — no cloud dependency',
        ]}
      />

      {/* ── SLIDE 13 — Traceability ──────────────────────────────── */}
      <SystemDetailSection
        label="12 / Traceability"
        title="Every inspection generates a fully traceable structured record."
        body="The system stores a complete audit trail for every inspection event. Records link AI decisions to casting metadata, enabling post-hoc analysis and compliance reporting."
        bullets={[
          'Inspection ID and timestamp',
          'Casting metadata: heat number, shift, mold ID, operator',
          'Defect severity profile per surface zone',
          'Overall surface risk score',
          'Final inspection decision outcome',
          'Model version used for inference',
        ]}
      />

      {/* ── SLIDE 14 — Continuous Learning ──────────────────────── */}
      <SystemDetailSection
        label="13 / Continuous Learning"
        title="Inspection intelligence evolves with plant operations."
        body="Disagreements between AI decisions and supervisor corrections become training signal to improve subsequent model versions."
      >
        <SystemWorkflow
          steps={[
            'Identify disagreement cases',
            'Curate correction datasets',
            'Retrain model',
            'Evaluate agreement rate',
            'Deploy updated model',
          ]}
        />
      </SystemDetailSection>

      {/* ── SLIDE 15 — Quality Analytics ────────────────────────── */}
      <SystemDetailSection
        label="14 / Quality Analytics"
        title="Automated plant-level quality insights from inspection data."
        body="The analytics layer aggregates inspection records into operational metrics — enabling management to detect scrap trends, recurring defects, and process drift."
        bullets={[
          'Total inspections and rejection rate by period',
          'Model-human agreement rate (accuracy proxy)',
          'Average surface risk score across production runs',
          'Most frequent defect types and their process associations',
          'Most affected process sections and mold configurations',
        ]}
      />

      {/* ── SLIDE 16 — Business Impact ───────────────────────────── */}
      <SystemDetailSection
        label="15 / Business Impact"
        title="Measurable impact across operational and strategic dimensions."
        body="Deploying structured AI inspection creates compounding value — in day-to-day operations and in long-term process intelligence."
      >
        <SystemImpactGrid
          operational={[
            'Reduced inspection variability across operators and shifts',
            'Faster decision cycles at the inspection station',
            'Standardised defect evaluation with consistent criteria',
            'Reduced supervisory correction load',
          ]}
          strategic={[
            'Quantified quality trends over time',
            'Data-driven process improvement from real defect patterns',
            'Traceable inspection intelligence for compliance and audit',
            'Scalable deployment across multiple plant lines',
          ]}
        />
      </SystemDetailSection>

      {/* ── SLIDE 17 — Download / Contact (final slide) ──────────── */}
      <DownloadPresentationButton productName="Rejection_Analysis_System" />

    </div>
  )
}
