import { Link } from 'react-router-dom'
import { SystemDetailSection } from '../../components/systems/SystemDetailSection'
import { SystemImageBlock } from '../../components/systems/SystemImageBlock'
import { SystemWorkflow } from '../../components/systems/SystemWorkflow'
import { SystemImpactGrid } from '../../components/systems/SystemImpactGrid'
import { DownloadPresentationButton } from '../../components/DownloadPresentationButton'

/**
 * RejectionAnalysisSystem — Technical detail page.
 * Light industrial theme. Structured like a consulting presentation deck.
 * Each section maps to one PDF slide via .presentation-slide class.
 * Route: /systems/rejection-analysis-system
 */
export function RejectionAnalysisSystem() {
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
        <div className="max-w-[900px] mx-auto w-full">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-slate-400 mb-6">
            Tvastr · Industrial AI Systems
          </p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            Rejection Analysis System
          </h1>
          <p className="text-xl text-slate-500 font-light max-w-[680px] leading-relaxed mb-5">
            AI-driven casting inspection and manufacturing quality intelligence.
          </p>
          <p className="text-base text-gray-600 max-w-[680px] leading-relaxed">
            An industrial AI platform that transforms casting inspection into structured
            plant-level quality intelligence.
          </p>
        </div>
        <div className="slide-footer">
          <span>Tvastr</span>
          <span>Rejection Analysis System</span>
          <span className="slide-number" />
        </div>
      </section>

      {/* ── SLIDE 2 — The Problem ─────────────────────────────────── */}
      <SystemDetailSection
        label="01 / The Problem"
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

      {/* ── SLIDE 3 — The Opportunity ────────────────────────────── */}
      <SystemDetailSection
        label="02 / The Opportunity"
        title="Every casting is inspected. That makes inspection the largest scalable data stream in a foundry."
        body="If structured properly, inspection becomes far more than a quality gate. It becomes a real-time process diagnostic layer — running automatically, on every part, at production speed."
        bullets={[
          'A standardised decision engine operating at casting level',
          'A process diagnostic layer linked to manufacturing context',
          'A measurable KPI framework for quality operations',
          'A continuous improvement pipeline driven by production data',
        ]}
      />

      {/* ── SLIDE 4 — The Solution ───────────────────────────────── */}
      <SystemDetailSection
        label="03 / The Solution"
        title="A structured inspection pipeline from image capture to operational decision."
        body="The system processes casting images through a multi-stage AI pipeline. Each inspection produces a traceable structured record linked to process context."
      >
        <SystemWorkflow
          steps={[
            'Capture Casting Image',
            'Detect & Localise Defects',
            'Dense Surface Analysis',
            'Severity & Spatial Scoring',
            'Casting-Level Decision',
            'Process Section Linkage',
            'Structured Logging',
          ]}
          outputs={['Accept', 'Check Required', 'Reject']}
        />
      </SystemDetailSection>

      {/* ── SLIDE 5 — Inspection Interface ──────────────────────── */}
      <SystemDetailSection
        label="04 / Application Screens"
        title="Inspection Interface"
        body="Operators upload casting images and manufacturing context before running inspection."
      >
        <SystemImageBlock
          src="/inspection_app_ss.png"
          alt="Rejection Analysis System — Inspection Interface"
          caption="Operators upload casting images and manufacturing context before running inspection."
        />
      </SystemDetailSection>

      {/* ── SLIDE 6 — Analytics Dashboard ───────────────────────── */}
      <SystemDetailSection
        label="05 / Application Screens"
        title="Analytics Dashboard"
        body="Inspection results automatically generate plant-level quality analytics and operational KPIs."
      >
        <SystemImageBlock
          src="/analytics_app_ss.png"
          alt="Rejection Analysis System — Analytics Dashboard"
          caption="Inspection results automatically generate plant-level quality analytics and operational KPIs."
        />
      </SystemDetailSection>

      {/* ── SLIDE 7 — Inference Engine ───────────────────────────── */}
      <SystemDetailSection
        label="06 / Inference Engine"
        title="Multi-stage AI pipeline from raw image to structured decision."
        body="The inference pipeline processes each casting image through specialised models, culminating in a rule-based decision engine that converts AI predictions into operational outcomes."
        bullets={[
          'High-resolution image acquisition and preprocessing',
          'Casting segmentation to isolate inspection surfaces',
          'Surface risk modelling across the full casting geometry',
          'Defect localisation and classification by type',
          'Severity scoring per defect and per surface zone',
        ]}
      >
        <div className="mt-6 p-5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <p className="text-sm font-semibold text-gray-700 mb-3">Decision Engine Rules</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Area thresholds', 'Defect severity weights', 'Critical zone sensitivity', 'Customer-specific rules'].map((rule, i) => (
              <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-slate-300" />{rule}
              </div>
            ))}
          </div>
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 8 — Root Cause Diagnostics ────────────────────── */}
      <SystemDetailSection
        label="07 / Root Cause Diagnostics"
        title="Defect patterns mapped to manufacturing process sections."
        body="Rather than simply flagging defects, the system links them to likely process causes — enabling targeted corrective action."
      >
        <div className="mt-6 space-y-4">
          {[
            { defect: 'Shrinkage near feeder zone', cause: 'Verify riser design and solidification timing' },
            { defect: 'Sand inclusion near mold interface', cause: 'Check mold preparation and sand quality' },
            { defect: 'Porosity cluster in thick section', cause: 'Review gating design and pouring temperature' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <div className="sm:w-1/2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Defect</p>
                <p className="text-sm font-medium text-gray-700">{item.defect}</p>
              </div>
              <svg className="hidden sm:block flex-shrink-0" width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path d="M0 8h16M12 4l4 4-4 4" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="sm:w-1/2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Action</p>
                <p className="text-sm text-gray-600">{item.cause}</p>
              </div>
            </div>
          ))}
        </div>
      </SystemDetailSection>

      {/* ── SLIDE 9 — System Architecture ───────────────────────── */}
      <SystemDetailSection
        label="08 / System Architecture"
        title="On-premise deployment within the plant network."
        body="The system runs entirely on-premise on a dedicated inspection workstation. No casting images or production data leave the plant network."
        bullets={[
          'Runs on on-premise inspection workstation — no cloud dependency',
          'Processes images in real time at the inspection station',
          'Stores inspection records in a local SQL database',
          'Integrates with ERP and MES data for manufacturing context',
          'Operates within the plant network — data sovereignty maintained',
        ]}
      />

      {/* ── SLIDE 10 — Traceability ──────────────────────────────── */}
      <SystemDetailSection
        label="09 / Traceability"
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

      {/* ── SLIDE 11 — Continuous Learning ──────────────────────── */}
      <SystemDetailSection
        label="10 / Continuous Learning"
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

      {/* ── SLIDE 12 — Quality Analytics ────────────────────────── */}
      <SystemDetailSection
        label="11 / Quality Analytics"
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

      {/* ── SLIDE 13 — Business Impact ───────────────────────────── */}
      <SystemDetailSection
        label="12 / Business Impact"
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

      {/* ── SLIDE 14 — Download / Contact (final slide) ──────────── */}
      <DownloadPresentationButton productName="Rejection_Analysis_System" />

    </div>
  )
}
