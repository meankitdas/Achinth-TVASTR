import { SectionShell } from '../../primitives/SectionShell'
import { SectionHeader } from '../../primitives/SectionHeader'
import { traceabilityContent } from '@/content/technology/index'

export function TraceabilitySection() {
  const { title, subtitle, body, sqlStorage, pdfReports, erpExport, telemetry, auditSupport } = traceabilityContent

  return (
    <SectionShell id="traceability">
      <SectionHeader title={title} subtitle={subtitle} align="center" />
      <p className="text-metallic-400 text-center max-w-3xl mx-auto mb-12">{body}</p>

      {/* SQL Storage */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-6">{sqlStorage.title}</h3>
        <p className="text-metallic-400 mb-6">{sqlStorage.description}</p>
        <div className="space-y-4">
          {sqlStorage.tables.map((table, idx) => (
            <div key={idx} className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
              <h4 className="text-lg font-semibold text-metallic-100 mb-2">{table.name}</h4>
              <p className="text-sm text-metallic-400 mb-3">{table.description}</p>
              <div className="grid md:grid-cols-2 gap-2">
                {table.keyFields.map((field, fidx) => (
                  <span key={fidx} className="text-xs text-metallic-500 font-mono">• {field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Reports & ERP */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-3">{pdfReports.title}</h3>
          <p className="text-metallic-400 mb-4">{pdfReports.description}</p>
          <ul className="space-y-2 mb-4">
            {pdfReports.components.map((comp, idx) => (
              <li key={idx} className="text-sm text-metallic-500 flex items-start gap-2">
                <span className="text-amber-forge mt-1">•</span>
                <span>{comp}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-metallic-600 italic">{pdfReports.format}</p>
        </div>

        <div className="border border-metallic-800 bg-metallic-950/30 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-metallic-100 mb-3">{erpExport.title}</h3>
          <p className="text-metallic-400 mb-4">{erpExport.description}</p>
          <p className="text-sm text-amber-forge mb-3">{erpExport.format}</p>
          <ul className="space-y-1">
            {erpExport.fields.map((field, idx) => (
              <li key={idx} className="text-sm text-metallic-500">• {field}</li>
            ))}
          </ul>
          <p className="text-xs text-metallic-600 mt-3">Schedule: {erpExport.schedule}</p>
        </div>
      </div>

      {/* Telemetry */}
      <div className="border border-amber-forge/30 bg-amber-forge/5 rounded-lg p-6 mb-12">
        <h3 className="text-xl font-semibold text-metallic-100 mb-4">{telemetry.title}</h3>
        <p className="text-metallic-400 mb-6">{telemetry.description}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {telemetry.logs.map((log, idx) => (
            <div key={idx}>
              <h4 className="text-base font-semibold text-metallic-100 mb-2">{log.name}</h4>
              <p className="text-xs text-metallic-500 font-mono mb-2">{log.file}</p>
              <p className="text-sm text-metallic-400 mb-1">{log.description}</p>
              <p className="text-xs text-metallic-600">Retention: {log.retention}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Support */}
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-metallic-100 mb-4">{auditSupport.title}</h3>
        <p className="text-metallic-400 mb-6 max-w-3xl mx-auto">{auditSupport.description}</p>
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
          {auditSupport.features.map((feature, idx) => (
            <li key={idx} className="text-metallic-300 flex items-start gap-2">
              <span className="text-amber-forge mt-1">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionShell>
  )
}
