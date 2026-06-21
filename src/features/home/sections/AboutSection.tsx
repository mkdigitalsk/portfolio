import { ArrowForward } from '@mui/icons-material'
import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Reveal, TextBody1Neutral80, TextH4Bold } from '@/shared/components'
import { SECTION_MAX, TEXT_MAX } from '../layout'

// About / the-person-you-hire — SHORT homepage version (the full story lives on /about). For a
// solo studio the engineer IS the de-risking story; the buyer trusts a person, not a logo wall
// (see portfolio-research.md). A few honest sentences + a deep link to the full /about page.
export async function AboutSection() {
  const t = await getTranslations('home.about')

  return (
    <Box component="section" sx={{ maxWidth: SECTION_MAX, mx: 'auto', px: 3, py: { xs: 6, md: 8 } }}>
      <Reveal>
        <TextH4Bold sx={{ mb: 3 }}>{t('title')}</TextH4Bold>
      </Reveal>
      <Reveal delay={0.06}>
        <Box sx={{ mb: 2, maxWidth: TEXT_MAX }}>
          <TextBody1Neutral80>{t('para1')}</TextBody1Neutral80>
        </Box>
      </Reveal>
      <Reveal delay={0.12}>
        <Box sx={{ mb: 4, maxWidth: TEXT_MAX }}>
          <TextBody1Neutral80>{t('para2')}</TextBody1Neutral80>
        </Box>
      </Reveal>
      <Reveal delay={0.18}>
        <Button variant="outline" href="/about" startIcon={<ArrowForward />}>
          {t('cta')}
        </Button>
      </Reveal>
    </Box>
  )
}
