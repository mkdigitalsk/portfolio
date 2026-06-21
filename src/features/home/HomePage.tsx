import type { ReactNode } from 'react'
import { AppShowcase } from '@/features/showcase/AppShowcase'
import { HOME_SECTIONS } from './homeSections'
import { ScaffoldSection } from './ScaffoldSection'
import { HeroSection } from './sections/HeroSection'

// Research-backed homepage (see portfolio-research.md). Sections render in the order the
// 112-site study recommends. As each section gets built for real it's registered here, keyed
// by its id from homeSections.ts, and renders instead of its <ScaffoldSection> placeholder.
// The flip-card grid is demoted to a single "craft demo" section (AppShowcase).
const REAL_SECTIONS: Record<string, ReactNode> = {
  'hero-outcome-in-view-proof': <HeroSection />,
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
