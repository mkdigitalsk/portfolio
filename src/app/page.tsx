import { Download, Mail } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Chip, TextBody1Neutral60, TextH1Bold, TextH4Bold } from '@/shared/components'
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

const techStack = [
  'iOS',
  'Compose Multiplatform',
  'Jetpack Compose',
  'SwiftUI',
  'Flutter',
  'Kotlin',
  'Swift',
  'Dart',
  'TypeScript',
  'Ktor',
  'PostgreSQL',
  'REST APIs',
  'Clean Architecture',
  'MVVM',
  'Koin',
  'SQLDelight',
  'CI/CD',
  'Firebase',
  'AI-assisted development',
]

export default async function HomePage() {
  const t = await getTranslations()

  return (
    <Box component="main">
      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pt: { xs: 6, md: 12 }, pb: { xs: 6, md: 10 } }}>
        <TextH1Bold sx={{ mb: 3 }}>{t('hero.headline')}</TextH1Bold>
        <TextBody1Neutral60 sx={{ mb: 4 }}>{t('hero.subline')}</TextBody1Neutral60>
        <Stack direction="row" useFlexGap spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <Button variant="primary" startIcon={<Mail />} href="mailto:mir.kusnir@gmail.com">
            {t('hero.cta')}
          </Button>
          <Button variant="outline" startIcon={<Download />} href="/cv.pdf" target="_blank" rel="noopener noreferrer">
            {t('hero.cv')}
          </Button>
        </Stack>
      </Box>

      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pb: { xs: 6, md: 8 } }}>
        <TextH4Bold sx={{ mb: 1 }}>{t('showcases.title')}</TextH4Bold>
        <TextBody1Neutral60 sx={{ mb: 2 }}>{t('showcases.subtitle')}</TextBody1Neutral60>
        <ShowcaseList items={showcases} />
      </Box>

      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pb: { xs: 8, md: 12 } }}>
        <TextH4Bold sx={{ mb: 2 }}>{t('techStack.title')}</TextH4Bold>
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
          {techStack.map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
