import { AppShowcase } from '@/features/showcase/AppShowcase'
import { HOME_SECTIONS } from './homeSections'
import { ScaffoldSection } from './ScaffoldSection'

// Research-backed homepage skeleton (see portfolio-research.md). Sections render in the order
// the 112-site study recommends. The flip-card grid is demoted from "the whole homepage" to a
// single "craft demo" section (AppShowcase); every other section is a visible scaffold carrying
// its own brief on screen until it's built for real — fill them in one by one.
export function HomePage() {
  return (
    <main>
      {HOME_SECTIONS.map((spec, i) => (
        <ScaffoldSection key={spec.id} index={i + 1} spec={spec}>
          {spec.embed === 'showcase' ? <AppShowcase /> : undefined}
        </ScaffoldSection>
      ))}
    </main>
  )
}
