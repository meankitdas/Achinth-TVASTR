import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { DiagramFlow } from '@/components/primitives/DiagramFlow'
import { cognitionRuntimeContent } from '@/content/technology/cognition-runtime'

export function CognitionRuntimeSection() {
  const { title, subtitle, body, runtimeComponents, executionFlow, keyMessage } = cognitionRuntimeContent

  return (
    <SectionShell id="cognition-runtime">
      <SectionHeader title={title} subtitle={subtitle} eyebrow="Runtime Layer" />

      <p className="text-sm text-metallic-400 leading-relaxed max-w-4xl mt-4 mb-12">
        {body}
      </p>

      {/* Runtime components */}
      <div className="space-y-4 mb-12">
        {runtimeComponents.map((comp, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-metallic-800/20 bg-charcoal-950/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-md bg-amber-forge/10 border border-amber-forge/30 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-forge">{i + 1}</span>
              </div>
              <h4 className="text-base font-bold text-metallic-100">{comp.name}</h4>
            </div>
            <p className="text-xs text-metallic-400 leading-relaxed mb-3">{comp.description}</p>

            {/* Render characteristics, states, logs, or interfaces depending on component */}
            {comp.characteristics && (
              <div className="flex flex-wrap gap-2">
                {comp.characteristics.map((item, j) => (
                  <span key={j} className="inline-block px-2 py-1 text-[11px] text-metallic-300 bg-charcoal-900/80 border border-metallic-800/20 rounded">
                    {item}
                  </span>
                ))}
              </div>
            )}
            {comp.states && (
              <div className="space-y-1">
                {comp.states.map((s, j) => (
                  <div key={j} className="flex items-center gap-2 text-xs">
                    <span className={`font-mono font-bold ${
                      s.state === 'OK' ? 'text-green-400' : s.state === 'DEGRADED' ? 'text-yellow-400' : 'text-red-400'
                    }`}>{s.state}</span>
                    <span className="text-metallic-400">{s.description}</span>
                  </div>
                ))}
              </div>
            )}
            {comp.logs && (
              <div className="space-y-1">
                {comp.logs.map((log, j) => (
                  <p key={j} className="text-[11px] text-metallic-400 font-mono">{log}</p>
                ))}
              </div>
            )}
            {comp.interfaces && (
              <div className="flex flex-wrap gap-2">
                {comp.interfaces.map((iface, j) => (
                  <span key={j} className="inline-block px-2 py-1 text-[11px] text-metallic-300 bg-charcoal-900/80 border border-metallic-800/20 rounded">
                    {iface}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Execution flow diagram */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-metallic-100 mb-4 text-center">Execution Pipeline</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-2">
          {executionFlow.map((step, i) => (
            <div key={i} className="relative flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-charcoal-950 rounded border border-metallic-800/30 text-center">
                <span className="text-[10px] text-amber-forge/60 block">{i + 1}</span>
                <span className="text-[11px] text-metallic-300 leading-tight">{step}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key message */}
      <p className="mt-8 text-center text-base text-metallic-400 leading-relaxed max-w-3xl mx-auto italic">
        {keyMessage}
      </p>
    </SectionShell>
  )
}
