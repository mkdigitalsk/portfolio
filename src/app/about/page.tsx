import { Mail } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Reveal, TextBody1Neutral60, TextH1Bold, TextH4Bold } from '@/shared/components'
import { ShowcaseList, type Showcase } from '@/features/home/ShowcaseList'
import { TechStack, type TechGroup } from '@/features/home/TechStack'

const GITHUB = 'https://github.com/mkdigitalsk'

const showcases: Showcase[] = [
  { platform: 'kotlin', label: 'Kotlin Multiplatform', descriptionKey: 'kmpDesc', repoUrl: `${GITHUB}/kmp-showcase` },
  { platform: 'android', label: 'Android', descriptionKey: 'androidDesc', repoUrl: `${GITHUB}/android-showcase` },
  { platform: 'react', label: 'React Native', descriptionKey: 'rnDesc', repoUrl: `${GITHUB}/rn-showcase` },
  {
    platform: 'typescript',
    label: 'Web',
    descriptionKey: 'webDesc',
    repoUrl: `${GITHUB}/kmp-showcase/tree/master/web`,
  },
]

const techGroups: TechGroup[] = [
  {
    labelKey: 'techStack.mobile',
    withIcons: true,
    items: [
      'iOS',
      'Android',
      'Kotlin Multiplatform',
      'Compose Multiplatform',
      'Flutter',
      'React Native',
      'SwiftUI',
      'Kotlin',
      'Swift',
    ],
  },
  {
    labelKey: 'techStack.web',
    withIcons: true,
    items: ['React', 'Next.js', 'TypeScript', 'Material UI', 'Tailwind CSS', 'TanStack Query'],
  },
  { labelKey: 'techStack.backend', withIcons: true, items: ['Ktor', 'PostgreSQL', 'Firebase'] },
  { labelKey: 'techStack.devops', withIcons: true, items: ['Docker', 'Vercel', 'GitHub Actions'] },
  {
    labelKey: 'techStack.foundations',
    items: ['AI-assisted development', 'Clean Architecture', 'MVVM', 'Hook Pattern', 'CI/CD', 'Deployment'],
  },
]

export default async function AboutPage() {
  const t = await getTranslations()

  return (
    <Box component="main">
      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pt: { xs: 6, md: 12 }, pb: { xs: 6, md: 10 } }}>
        <Reveal>
          <TextH1Bold sx={{ mb: 3 }}>{t('hero.headline')}</TextH1Bold>
        </Reveal>
        <Reveal delay={0.08}>
          <TextBody1Neutral60 sx={{ mb: 4 }}>{t('hero.subline')}</TextBody1Neutral60>
        </Reveal>
        <Reveal delay={0.16}>
          <Stack direction="row" useFlexGap spacing={1.5} sx={{ flexWrap: 'wrap' }}>
            <Button variant="primary" startIcon={<Mail />} href="mailto:mk.digital.sro@gmail.com">
              {t('hero.cta')}
            </Button>
          </Stack>
        </Reveal>
      </Box>

      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pb: { xs: 6, md: 8 } }}>
        <Reveal>
          <TextH4Bold sx={{ mb: 1 }}>{t('showcases.title')}</TextH4Bold>
        </Reveal>
        <Reveal delay={0.06}>
          <TextBody1Neutral60 sx={{ mb: 2 }}>{t('showcases.subtitle')}</TextBody1Neutral60>
        </Reveal>
        <Reveal delay={0.12}>
          <ShowcaseList items={showcases} />
        </Reveal>
      </Box>

      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pb: { xs: 8, md: 12 } }}>
        <TechStack groups={techGroups} />
      </Box>
    </Box>
  )
}
