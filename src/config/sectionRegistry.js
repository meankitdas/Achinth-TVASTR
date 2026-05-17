// Homepage sections
import { HeroSection } from '../components/sections/HeroSection'
import { IndustryProblemSection } from '../components/sections/IndustryProblemSection'
import { CoreThesisSection } from '../components/sections/home/CoreThesisSection'
import { IntelligenceLayersSection } from '../components/sections/home/IntelligenceLayersSection'
import { MultiGateIntelligenceSection } from '../components/sections/home/MultiGateIntelligenceSection'
import { SignalFirstAISection } from '../components/sections/home/SignalFirstAISection'
import { IndustrialMemorySection } from '../components/sections/home/IndustrialMemorySection'
import { FinalPositioningSection } from '../components/sections/home/FinalPositioningSection'
import { InspectionVisibilitySection } from '../components/sections/InspectionVisibilitySection'
import { DeploymentSection } from '../components/sections/DeploymentSection'
import { PlatformOverviewSection } from '../components/sections/PlatformOverviewSection'
import { ContactSection } from '../components/sections/ContactSection'

// Technology page sections
import { TechnologyHeroSection } from '../components/sections/technology/TechnologyHeroSection'
import { CoreArchitectureSection } from '../components/sections/technology/CoreArchitectureSection'
import { PerceptionEngineSection } from '../components/sections/technology/PerceptionEngineSection'
import { SignalReasoningSection } from '../components/sections/technology/SignalReasoningSection'
import { EnergyReasoningSection } from '../components/sections/technology/EnergyReasoningSection'
import { CognitionRuntimeSection } from '../components/sections/technology/CognitionRuntimeSection'
import { ProcessIntelligenceSection } from '../components/sections/technology/ProcessIntelligenceSection'
import { DeploymentArchitectureSection } from '../components/sections/technology/DeploymentArchitectureSection'
import { TechnologyCTASection } from '../components/sections/technology/TechnologyCTASection'

export const sectionRegistry = {
  // Homepage
  'hero': HeroSection,
  'industry-problem': IndustryProblemSection,
  'core-thesis': CoreThesisSection,
  'intelligence-layers': IntelligenceLayersSection,
  'multi-gate-intelligence': MultiGateIntelligenceSection,
  'signal-first-ai': SignalFirstAISection,
  'platform-overview': PlatformOverviewSection,
  'inspection-visibility': InspectionVisibilitySection,
  'industrial-memory': IndustrialMemorySection,
  'deployment': DeploymentSection,
  'final-positioning': FinalPositioningSection,
  'contact': ContactSection,

  // Technology page
  'technology-hero': TechnologyHeroSection,
  'core-architecture': CoreArchitectureSection,
  'perception-engine': PerceptionEngineSection,
  'signal-reasoning': SignalReasoningSection,
  'energy-reasoning': EnergyReasoningSection,
  'cognition-runtime': CognitionRuntimeSection,
  'process-intelligence': ProcessIntelligenceSection,
  'deployment-architecture': DeploymentArchitectureSection,
  'technology-cta': TechnologyCTASection,
}
