import { TERMS } from '@/constants/terminology'

export function SectionHeader({ title, subtitle, eyebrow }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-forge opacity-60 mb-2">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-black text-metallic-100 leading-tight tracking-tight mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-base md:text-lg text-metallic-400 leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}