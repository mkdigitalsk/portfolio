import { Download, Mail } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Chip, Reveal, TextBody1Neutral60, TextH1Bold, TextH4Bold } from '@/shared/components'
import { ShowcaseList, type Showcase } from '@/features/home/ShowcaseList'

const GITHUB = 'https://github.com/KusnirM'

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

const techGroups = [
  {
    labelKey: 'techStack.mobile',
    items: [
      'React Native',
      'iOS',
      'Android',
      'Flutter',
      'Kotlin Multiplatform',
      'Compose Multiplatform',
      'Jetpack Compose',
      'SwiftUI',
      'Kotlin',
      'Swift',
      'Dart',
    ],
  },
  { labelKey: 'techStack.web', items: ['TypeScript'] },
  { labelKey: 'techStack.backend', items: ['Ktor', 'PostgreSQL', 'REST APIs'] },
  {
    labelKey: 'techStack.foundations',
    items: ['Clean Architecture', 'MVVM', 'Koin', 'SQLDelight', 'CI/CD', 'Firebase', 'AI-assisted development'],
  },
]

export default async function HomePage() {
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
            <Button variant="primary" startIcon={<Mail />} href="mailto:mir.kusnir@gmail.com">
              {t('hero.cta')}
            </Button>
            <Button variant="outline" startIcon={<Download />} href="/cv.pdf" target="_blank" rel="noopener noreferrer">
              {t('hero.cv')}
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
        <Reveal>
          <TextH4Bold sx={{ mb: 2 }}>{t('techStack.title')}</TextH4Bold>
        </Reveal>
        <Stack spacing={2.5}>
          {techGroups.map((group, index) => (
            <Reveal key={group.labelKey} delay={0.06 * index}>
              <Box>
                <TextBody1Neutral60 sx={{ mb: 1 }}>{t(group.labelKey)}</TextBody1Neutral60>
                <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {group.items.map((tech) => (
                    <Chip key={tech} label={tech} variant="outlined" />
                  ))}
                </Stack>
              </Box>
            </Reveal>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
