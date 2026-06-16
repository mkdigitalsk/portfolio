import { Download, Mail } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { Button, Chip, TextBody1Neutral60, TextH1Bold, TextH4Bold } from '@/shared/components'
import { ShowcaseList, type Showcase } from '@/features/home/ShowcaseList'

const GITHUB = 'https://github.com/KusnirM'

// The main pillars — each a live showcase project. `repoUrl` exists now; `appUrl`
// (deployed demo / artifact) gets wired once the apps are hosted.
const showcases: Showcase[] = [
  {
    platform: 'kotlin',
    label: 'Kotlin Multiplatform',
    description: 'iOS + Android, shared business logic',
    repoUrl: `${GITHUB}/kmp-showcase`,
  },
  {
    platform: 'android',
    label: 'Android',
    description: 'Native Android, Jetpack Compose',
    repoUrl: `${GITHUB}/android-showcase`,
  },
  {
    platform: 'react',
    label: 'React Native',
    description: 'Cross-platform mobile',
    repoUrl: `${GITHUB}/rn-showcase`,
  },
  {
    platform: 'typescript',
    label: 'Web',
    description: 'React + TypeScript SPA',
    repoUrl: `${GITHUB}/kmp-showcase/tree/master/web`,
  },
]

// Everything else — supporting tech, shown as a flat tag cloud.
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

export default function HomePage() {
  return (
    <Box component="main">
      {/* Hero — one dominant headline, one primary CTA. */}
      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pt: { xs: 6, md: 12 }, pb: { xs: 6, md: 10 } }}>
        <TextH1Bold sx={{ mb: 3 }}>I build apps end to end.</TextH1Bold>
        <TextBody1Neutral60 sx={{ mb: 4 }}>
          iOS, Android, web, and backend — built once, properly, with the production patterns I use on real client
          work.
        </TextBody1Neutral60>
        <Stack direction="row" useFlexGap spacing={1.5} sx={{ flexWrap: 'wrap' }}>
          <Button variant="primary" startIcon={<Mail />} href="mailto:mir.kusnir@gmail.com">
            Let&apos;s talk
          </Button>
          <Button variant="outline" startIcon={<Download />} href="/cv.pdf" target="_blank" rel="noopener noreferrer">
            Download CV
          </Button>
        </Stack>
      </Box>

      {/* Showcases — the main pillars as a list (platform logo + code/app actions). */}
      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pb: { xs: 6, md: 8 } }}>
        <TextH4Bold sx={{ mb: 1 }}>Showcases</TextH4Bold>
        <TextBody1Neutral60 sx={{ mb: 2 }}>
          Live demos of the patterns I ship — source now, deployed apps soon.
        </TextBody1Neutral60>
        <ShowcaseList items={showcases} />
      </Box>

      {/* Tech stack — supporting tech as pills. */}
      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pb: { xs: 8, md: 12 } }}>
        <TextH4Bold sx={{ mb: 2 }}>Tech stack</TextH4Bold>
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
          {techStack.map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
