import { SectionShell } from '../../primitives/SectionShell'
import { technologyCTAContent } from '@/content/technology/index'

export function TechnologyCTASection() {
  const { title, subtitle, buttons } = technologyCTAContent

  const handleClick = (href) => {
    if (href.startsWith('#')) {
      // Navigate to home then scroll
      window.location.href = `/${href}`
    }
  }

  return (
    <SectionShell
      id="technology-cta"
      className="text-center"
      style={{
        background: 'linear-gradient(to bottom, #0a0a0b 0%, #12121a 100%)'
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-metallic-50">
          {title}
        </h2>
        
        <p className="text-lg text-txt-secondary">
          {subtitle}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          {buttons.map((button, idx) => (
            <a
              key={idx}
              href={button.href}
              onClick={(e) => {
                if (button.href.startsWith('#')) {
                  e.preventDefault()
                  handleClick(button.href)
                }
              }}
              className={
                button.variant === 'primary'
                  ? 'px-8 py-3 bg-amber-forge text-metallic-950 font-semibold rounded hover:bg-amber-600 transition-colors'
                  : 'px-8 py-3 border border-metallic-700 text-txt-primary font-semibold rounded hover:border-amber-forge hover:text-telemetry-primary transition-colors'
              }
            >
              {button.label}
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
