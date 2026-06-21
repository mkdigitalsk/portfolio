import { AppShowcase } from '@/features/showcase/AppShowcase'
import { AboutSection } from './sections/AboutSection'
import { ContactSection } from './sections/ContactSection'
import { HeroSection } from './sections/HeroSection'
import { ProcessSection } from './sections/ProcessSection'
import { ProofSection } from './sections/ProofSection'
import { ServicesSection } from './sections/ServicesSection'
import { TrustBandSection } from './sections/TrustBandSection'

// Research-backed homepage (see portfolio-research.md). Sections render in the order the
// 112-site study recommends. The flip-card grid is one section among many — the "craft demo"
// proof module (AppShowcase), not the whole page. Every section shares the <Section> wrapper.
export function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBandSection />
      <ServicesSection />
      <AppShowcase />
      <ProcessSection />
      <ProofSection />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
