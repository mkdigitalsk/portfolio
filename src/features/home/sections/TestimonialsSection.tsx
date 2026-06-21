import { FormatQuote, Mail } from '@mui/icons-material'
import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Reveal, TextBody1Neutral80 } from '@/shared/components'
import { Section } from '../Section'

// Testimonials / human attribution — HONEST placeholder only. NDA: no real attributable clients
// yet, and the research is explicit that a fabricated or anonymous wall of praise is worse than
// none. We render an empty-state that's structured for real, attributed quotes to drop in later.
export async function TestimonialsSection() {
  const t = await getTranslations('home.testimonials')

  return (
    <Section bg title={t('title')} subtitle={t('subtitle')}>
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
    </Section>
  )
}
