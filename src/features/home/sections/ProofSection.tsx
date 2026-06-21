import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Chip, Reveal, TextBody1Primary } from '@/shared/components'
import { ShowcaseList, type Showcase } from '@/features/home/ShowcaseList'
import { Section } from '../Section'

// Proof spine — open-source showcases reframed as quantified proof. The NDA-safe trust axis:
// closed-source agencies ask you to trust code you can't see; ours is public. We quantify the
// ARTIFACT and engineering rigor instead of (forbidden) client revenue (see portfolio-research.md).
const GITHUB = 'https://github.com/mkdigitalsk'

const showcases: Showcase[] = [
  { platform: 'kotlin', label: 'Kotlin Multiplatform', descriptionKey: 'kmpDesc', repoUrl: `${GITHUB}/kmp-showcase` },
  { platform: 'android', label: 'Android', descriptionKey: 'androidDesc', repoUrl: `${GITHUB}/android-showcase` },
  { platform: 'react', label: 'React Native', descriptionKey: 'rnDesc', repoUrl: `${GITHUB}/rn-showcase` },
  { platform: 'typescript', label: 'Web', descriptionKey: 'webDesc', repoUrl: `${GITHUB}/kmp-showcase/tree/master/web` },
]

const SIGNALS = ['signal1', 'signal2', 'signal3', 'signal4'] as const

export async function ProofSection() {
  const t = await getTranslations('home.proof')

  return (
    <Section title={t('title')} subtitle={t('subtitle')}>
      <Reveal delay={0.12}>
        <Box sx={{ mb: 4 }}>
          <TextBody1Primary>{t('inspectLine')}</TextBody1Primary>
        </Box>
      </Reveal>
      <Reveal delay={0.18}>
        <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {SIGNALS.map((key) => (
            <Chip key={key} variant="outlined" label={t(key)} />
          ))}
        </Box>
      </Reveal>
      <Reveal delay={0.24}>
        <ShowcaseList items={showcases} />
      </Reveal>
    </Section>
  )
}
