import { homepageSections, sectionRegistry } from '@/config'

export function HomePage() {
  return (
    <div id="homepage">
      {homepageSections.map(({ type, id }) => {
        const SectionComponent = sectionRegistry[type]
        return SectionComponent ? <SectionComponent key={id} /> : null
      })}
    </div>
  )
}