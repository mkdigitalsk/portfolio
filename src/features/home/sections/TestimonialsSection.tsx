import { FormatQuote, Mail } from '@mui/icons-material'
import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Reveal, TextBody1Neutral60, TextBody1Neutral80, TextH4Bold } from '@/shared/components'
import { SECTION_MAX, TEXT_MAX } from '../layout'

// Testimonials / human attribution — HONEST placeholder only. NDA: no real attributable clients
// yet, and the research is explicit that a fabricated or anonymous wall of praise is worse than
// none. We render an empty-state that's structured for real, attributed quotes to drop in later.
export async function TestimonialsSection() {
  const t = await getTranslations('home.testimonials')

  return (
    <Box component="section" sx={{ bgcolor: 'action.hover' }}>
      <Box sx={{ maxWidth: SECTION_MAX, mx: 'auto', px: 3, py: { xs: 6, md: 8 } }}>
        <Reveal>
          <TextH4Bold sx={{ mb: 2 }}>{t('title')}</TextH4Bold>
        </Reveal>
        <Reveal delay={0.06}>
          <Box sx={{ mb: 4, maxWidth: TEXT_MAX }}>
            <TextBody1Neutral60>{t('subtitle')}</TextBody1Neutral60>
          </Box>
        </Reveal>
        <Reveal delay={0.12}>
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <FormatQuote sx={{ fontSize: 40, color: 'text.disabled' }} />
            <TextBody1Neutral80>{t('placeholder')}</TextBody1Neutral80>
            <Box>
              <Button variant="outline" startIcon={<Mail />} href="mailto:admin@mkdigital.sk">
                {t('cta')}
              </Button>
            </Box>
          </Box>
        </Reveal>
      </Box>
    </Box>
  )
}
