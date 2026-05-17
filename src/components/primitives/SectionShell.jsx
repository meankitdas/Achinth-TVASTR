import { SectionHeader } from './SectionHeader'

export function SectionShell({ children, id, className, style }) {
  return (
    <section
      id={id}
      className={`relative py-20 md:py-36 overflow-hidden ${className || ''}`}
      style={style}
    >
      {/* Grid background overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-60" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {children}
      </div>
    </section>
  )
}
