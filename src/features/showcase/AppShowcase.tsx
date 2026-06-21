'use client'

import Box from '@mui/material/Box'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Reveal } from '@/shared/components'
import { Section } from '@/features/home/Section'
import { AppRevealCard } from './AppRevealCard'
import { BankFlip } from './BankFlip'
import { FlipRevealCard } from './FlipRevealCard'
import { FoodFlip } from './FoodFlip'
import { MoreIdeasCard } from './MoreIdeasCard'
import { showcaseApps } from './apps'

const STAGGER_STEP = 0.06
const STAGGER_MAX = 0.3

// The flip-card craft demo — a section like any other. Header and edges come from <Section>,
// so it lines up with the rest of the page; only the grid is its own.
export function AppShowcase() {
  const t = useTranslations()
  const router = useRouter()
  const open = (id: string) => router.push(`/app/${id}`)

  return (
    <Section divider title={t('home.headline')} subtitle={t('home.subline')}>
      <Box
        sx={{
          display: 'grid',
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
        }}
      >
        {showcaseApps.map((app, index) => (
          <Reveal key={app.id} delay={Math.min(index * STAGGER_STEP, STAGGER_MAX)}>
            {app.iconAnimation === 'flip' ? (
              <FlipRevealCard
                app={app}
                ariaLabel={t('home.openDetail', { name: t(`apps.${app.id}.label`) })}
                onActivate={() => open(app.id)}
                frontIcon={<BankFlip accent={app.accent} flipSign={-1} />}
                flipSign={-1}
              />
            ) : app.iconAnimation === 'food' ? (
              <FlipRevealCard
                app={app}
                ariaLabel={t('home.openDetail', { name: t(`apps.${app.id}.label`) })}
                onActivate={() => open(app.id)}
                frontIcon={<FoodFlip accent={app.accent} flipSign={1} />}
                flipSign={1}
              />
            ) : (
              <AppRevealCard
                app={app}
                ariaLabel={t('home.openDetail', { name: t(`apps.${app.id}.label`) })}
                onActivate={() => open(app.id)}
              />
            )}
          </Reveal>
        ))}
      </Box>

      <Reveal delay={0.1}>
        <MoreIdeasCard />
      </Reveal>
    </Section>
  )
}
