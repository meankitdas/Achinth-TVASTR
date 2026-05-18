import { useDocumentHead } from "../hooks/useDocumentHead";
import { sectionRegistry } from "../config/sectionRegistry";
import { technologySections } from "../config/technologySections";

export function TechnologyPage() {
  useDocumentHead(
    "Technology | Tvastr Industrial Intelligence",
    "Learn how Tvastr works: signal-based inspection pipeline, process intelligence, SPC monitoring, and deployment architecture.",
    "https://tvastr.co/technology",
  );

  return (
    <div id="technology-page" className="bg-bg-primary">
      {technologySections.map(({ type, id }) => {
        const SectionComponent = sectionRegistry[type];
        if (!SectionComponent) {
          console.warn(`Section component not found for type: ${type}`);
          return null;
        }
        return <SectionComponent key={id} />;
      })}
    </div>
  );
}
