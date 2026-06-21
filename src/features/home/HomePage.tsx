import type { ReactNode } from 'react'
import { AppShowcase } from '@/features/showcase/AppShowcase'
import { HOME_SECTIONS } from './homeSections'
import { ScaffoldSection } from './ScaffoldSection'
import { AboutSection } from './sections/AboutSection'
import { ContactSection } from './sections/ContactSection'
import { HeroSection } from './sections/HeroSection'
import { ProcessSection } from './sections/ProcessSection'
import { ProofSection } from './sections/ProofSection'
import { ServicesSection } from './sections/ServicesSection'
import { TestimonialsSection } from './sections/TestimonialsSection'
import { TrustBandSection } from './sections/TrustBandSection'

// Research-backed homepage (see portfolio-research.md). Sections render in the order the
// 112-site study recommends. As each section gets built for real it's registered here, keyed
// by its id from homeSections.ts, and renders instead of its <ScaffoldSection> placeholder.
// The flip-card grid is demoted to a single "craft demo" section (AppShowcase).
const REAL_SECTIONS: Record<string, ReactNode> = {
  'hero-outcome-in-view-proof': <HeroSection />,
  'trust-metrics-band': <TrustBandSection />,
  'services-as-3-4-named-lifecycle-': <ServicesSection />,
  'how-i-work-opinionated-process-p': <ProcessSection />,
  'proof-spine-open-source-showcase': <ProofSection />,
  'testimonials-human-attribution': <TestimonialsSection />,
  'about-the-person-you-hire': <AboutSection />,
  'final-cta-contact': <ContactSection />,
}

export function HomePage() {
  return (
    <main>
      {HOME_SECTIONS.map((spec, i) => {
        const real = REAL_SECTIONS[spec.id]
        if (real) return <div key={spec.id}>{real}</div>
        return (
          <ScaffoldSection key={spec.id} index={i + 1} spec={spec}>
            {spec.embed === 'showcase' ? <AppShowcase /> : undefined}
          </ScaffoldSection>
        )
      })}
    </main>
  )
}
