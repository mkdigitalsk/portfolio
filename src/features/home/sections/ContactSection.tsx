import { Mail } from '@mui/icons-material'
import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Reveal, TextBody1Neutral60, TextCaptionNeutral60, TextH1Bold } from '@/shared/components'
import { TEXT_MAX } from '../layout'
import { Section } from '../Section'

// Final CTA + contact — the close. The research wants one clear action, a response-time
// reassurance, and low friction (see portfolio-research.md). Outcome-led repeat of the primary
// CTA, the 24h promise, and the company line for procurement confidence. Renders its own H1
// (a bookend focal point), not the shared Section header.
export async function ContactSection() {
  const t = await getTranslations('home.contact')

  return (
    <Section divider py={{ xs: 7, md: 10 }}>
      <Reveal>
        <TextH1Bold sx={{ mb: 3 }}>{t('headline')}</TextH1Bold>
      </Reveal>
      <Reveal delay={0.08}>
        <Box sx={{ mb: 4, maxWidth: TEXT_MAX }}>
          <TextBody1Neutral60>{t('subline')}</TextBody1Neutral60>
        </Box>
      </Reveal>
      <Reveal delay={0.16}>
        <Box sx={{ mb: 3 }}>
          <Button variant="primary" startIcon={<Mail />} href="mailto:admin@mkdigital.sk">
            {t('cta')}
          </Button>
        </Box>
      </Reveal>
      <Reveal delay={0.24}>
        <TextCaptionNeutral60>{t('company')}</TextCaptionNeutral60>
      </Reveal>
    </Section>
  )
}
