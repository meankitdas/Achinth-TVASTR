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
  // Homepage
  hero: HeroSection,
  'industry-problem': IndustryProblemSection,
  'what-tvastr-does': WhatTvastrDoesSection,
  'quality-gates': QualityGatesSection,
  'workflow-integration': WorkflowIntegrationSection,
  'operational-benefits': OperationalBenefitsSection,
  'why-not-traditional': WhyNotTraditionalSection,
  'inspection-visibility': InspectionVisibilitySection,
  'deployment': DeploymentSection,
  'platform-overview': PlatformOverviewSection,
  contact: ContactSection,
  
  // Technology page
  'technology-hero': TechnologyHeroSection,
  'inspection-pipeline': InspectionPipelineSection,
  'signal-analysis': SignalAnalysisSection,
  'fingerprinting': FingerprintingSection,
  'process-intelligence': ProcessIntelligenceSection,
  'spc': SPCSection,
  'fishbone': FishboneSection,
  'pareto': ParetoSection,
  'traceability': TraceabilitySection,
  'deployment-architecture': DeploymentArchitectureSection,
  'technology-cta': TechnologyCTASection
}
