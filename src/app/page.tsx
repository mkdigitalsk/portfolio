import { Download, Mail } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { Button, TextBody1Neutral60, TextH1Bold, TextH4Bold } from '@/shared/components'
import { SkillGroup, type SkillItem } from '@/features/home/SkillGroup'

const GITHUB = 'https://github.com/KusnirM'

// Skills grouped by delivery area. Chips with `href` link to that platform's
// live showcase (GitHub repo for now; swap to deployed demos later). Tech names
// are proper nouns kept untranslated across locales.
const skillGroups: { title: string; items: SkillItem[] }[] = [
  {
    title: 'Mobile',
    items: [
      { label: 'Kotlin Multiplatform', href: `${GITHUB}/kmp-showcase` },
      { label: 'Android', href: `${GITHUB}/android-showcase` },
      { label: 'React Native', href: `${GITHUB}/rn-showcase` },
      { label: 'iOS' },
      { label: 'Compose Multiplatform' },
      { label: 'Jetpack Compose' },
      { label: 'SwiftUI' },
      { label: 'Flutter' },
      { label: 'Kotlin' },
      { label: 'Swift' },
      { label: 'Dart' },
    ],
  },
  {
    title: 'Web',
    items: [{ label: 'React', href: `${GITHUB}/kmp-showcase/tree/master/web` }, { label: 'TypeScript' }],
  },
  { title: 'Backend', items: [{ label: 'Ktor' }, { label: 'PostgreSQL' }, { label: 'REST APIs' }] },
  {
    title: 'Foundations',
    items: [
      { label: 'Clean Architecture' },
      { label: 'MVVM' },
      { label: 'Koin' },
      { label: 'SQLDelight' },
      { label: 'CI/CD' },
      { label: 'Firebase' },
      { label: 'AI-assisted development' },
    ],
  },
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

      {/* Skills + showcases */}
      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, pb: { xs: 8, md: 12 } }}>
        <TextH4Bold sx={{ mb: 1 }}>What I work with</TextH4Bold>
        <TextBody1Neutral60 sx={{ mb: 3 }}>Tags marked ↗ open the showcase.</TextBody1Neutral60>
        <Stack spacing={2}>
          {skillGroups.map((group) => (
            <SkillGroup key={group.title} title={group.title} items={group.items} />
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
