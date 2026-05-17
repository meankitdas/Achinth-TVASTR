// Homepage sections
import { HeroSection } from '../components/sections/HeroSection'
import { IndustryProblemSection } from '../components/sections/IndustryProblemSection'
import { WhatTvastrDoesSection } from '../components/sections/WhatTvastrDoesSection'
import { QualityGatesSection } from '../components/sections/QualityGatesSection'
import { WorkflowIntegrationSection } from '../components/sections/WorkflowIntegrationSection'
import { OperationalBenefitsSection } from '../components/sections/OperationalBenefitsSection'
import { WhyNotTraditionalSection } from '../components/sections/WhyNotTraditionalSection'
import { InspectionVisibilitySection } from '../components/sections/InspectionVisibilitySection'
import { DeploymentSection } from '../components/sections/DeploymentSection'
import { PlatformOverviewSection } from '../components/sections/PlatformOverviewSection'
import { ContactSection } from '../components/sections/ContactSection'

// Technology page sections
import { TechnologyHeroSection } from '../components/sections/technology/TechnologyHeroSection'
import { InspectionPipelineSection } from '../components/sections/technology/InspectionPipelineSection'
import { SignalAnalysisSection } from '../components/sections/technology/SignalAnalysisSection'
import { FingerprintingSection } from '../components/sections/technology/FingerprintingSection'
import { ProcessIntelligenceSection } from '../components/sections/technology/ProcessIntelligenceSection'
import { SPCSection } from '../components/sections/technology/SPCSection'
import { FishboneSection } from '../components/sections/technology/FishboneSection'
import { ParetoSection } from '../components/sections/technology/ParetoSection'
import { TraceabilitySection } from '../components/sections/technology/TraceabilitySection'
import { DeploymentArchitectureSection } from '../components/sections/technology/DeploymentArchitectureSection'
import { TechnologyCTASection } from '../components/sections/technology/TechnologyCTASection'

export const sectionRegistry = {
  // Homepage — new architecture
  hero: HeroSection,
  'industry-problem': IndustryProblemSection,
  'core-thesis': WhatTvastrDoesSection,
  'intelligence-layers': QualityGatesSection,
  'multi-gate-intelligence': WorkflowIntegrationSection,
  'signal-first-ai': WhyNotTraditionalSection,
  'platform-overview': PlatformOverviewSection,
  'inspection-visibility': InspectionVisibilitySection,
  'industrial-memory': OperationalBenefitsSection,
  'deployment': DeploymentSection,
  'final-positioning': PlatformOverviewSection,
  contact: ContactSection,

  // Legacy homepage mappings (backward compatibility)
  'what-tvastr-does': WhatTvastrDoesSection,
  'quality-gates': QualityGatesSection,
  'workflow-integration': WorkflowIntegrationSection,
  'operational-benefits': OperationalBenefitsSection,
  'why-not-traditional': WhyNotTraditionalSection,
  
  // Technology page — new architecture
  'technology-hero': TechnologyHeroSection,
  'core-architecture': InspectionPipelineSection,
  'perception-engine': SignalAnalysisSection,
  'signal-reasoning': SignalAnalysisSection,
  'energy-reasoning': FingerprintingSection,
  'industrial-memory': OperationalBenefitsSection,
  'cognition-runtime': ProcessIntelligenceSection,
  'process-intelligence': ProcessIntelligenceSection,
  'deployment-architecture': DeploymentArchitectureSection,
  'technology-cta': TechnologyCTASection,

  // Legacy technology mappings (backward compatibility)
  'inspection-pipeline': InspectionPipelineSection,
  'signal-analysis': SignalAnalysisSection,
  'fingerprinting': FingerprintingSection,
  'spc': SPCSection,
  'fishbone': FishboneSection,
  'pareto': ParetoSection,
  'traceability': TraceabilitySection
}
