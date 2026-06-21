import { Mail } from '@mui/icons-material'
import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Reveal, TextBody1Neutral60, TextCaptionNeutral60, TextH1Bold } from '@/shared/components'

// Final CTA + contact — the close. The research wants one clear action, a response-time
// reassurance, and low friction (see portfolio-research.md). Outcome-led repeat of the primary
// CTA, the 24h promise, and the company line for procurement confidence.
export async function ContactSection() {
  const t = await getTranslations('home.contact')

  return (
    <Box component="section" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ maxWidth: 880, mx: 'auto', px: 3, py: { xs: 10, md: 16 }, textAlign: 'center' }}>
        <Reveal>
          <TextH1Bold sx={{ mb: 3 }}>{t('headline')}</TextH1Bold>
        </Reveal>
        <Reveal delay={0.08}>
          <Box sx={{ mb: 4, maxWidth: 620, mx: 'auto' }}>
            <TextBody1Neutral60>{t('subline')}</TextBody1Neutral60>
          </Box>
        </Reveal>
        <Reveal delay={0.16}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Button variant="primary" startIcon={<Mail />} href="mailto:admin@mkdigital.sk">
              {t('cta')}
            </Button>
          </Box>
        </Reveal>
        <Reveal delay={0.24}>
          <TextCaptionNeutral60>{t('company')}</TextCaptionNeutral60>
        </Reveal>
      </Box>
    </Box>
  )
}
