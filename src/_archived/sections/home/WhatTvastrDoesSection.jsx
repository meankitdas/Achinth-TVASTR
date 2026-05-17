import { SectionShell } from '@/components/primitives/SectionShell'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { whatTvastrDoesContent } from '@/content/homepage/what-tvastr-does'

export function WhatTvastrDoesSection() {
  return (
    <SectionShell id={whatTvastrDoesContent.id}>
      <div className="max-w-4xl mx-auto">
        <SectionHeader
          title={whatTvastrDoesContent.title}
          subtitle={whatTvastrDoesContent.subtitle}
        />
        
        <p className="text-lg text-metallic-300 leading-relaxed mb-12 text-center">
          {whatTvastrDoesContent.body}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {whatTvastrDoesContent.capabilities.map((capability, index) => (
            <div
              key={index}
              className="group p-6 rounded-lg transition-all duration-300"
              style={{
                background: 'rgba(17,17,19,0.6)',
                border: '1px solid rgba(168,168,180,0.08)',
              }}
            >
              <h3
                className="text-lg font-bold mb-3 transition-colors duration-300"
                style={{
                  color: '#f5f5f7',
                }}
              >
                {capability.name}
              </h3>
              <p className="text-sm text-metallic-400 leading-relaxed">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}