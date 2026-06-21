import { Mail, Shield } from '@mui/icons-material'
import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Reveal, TextBody1Neutral60, TextBody1Neutral80, TextCaptionNeutral60, TextH6Bold } from '@/shared/components'
import { Section } from '../Section'

// How we work — opinionated process + productized first step. The research is explicit: for a
// boutique/solo brand, process transparency and a low-risk productized discovery substitute for
// client logos and directly de-risk the buyer. The single highest-leverage NDA-safe trust builder.
const PHASES = ['phase1', 'phase2', 'phase3'] as const
const PRINCIPLES = ['principle1', 'principle2', 'principle3', 'principle4'] as const

export async function ProcessSection() {
  const t = await getTranslations('home.process')

  return (
    <Section bg title={t('title')} subtitle={t('subtitle')}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 3, md: 4 } }}>
        {PHASES.map((key, i) => (
          <Reveal key={key} delay={0.08 * i}>
            <Box>
              <Box sx={{ mb: 1 }}>
                <TextCaptionNeutral60>{t(`${key}.when`)}</TextCaptionNeutral60>
              </Box>
              <TextH6Bold sx={{ mb: 0.5 }}>{t(`${key}.title`)}</TextH6Bold>
              <TextBody1Neutral60>{t(`${key}.detail`)}</TextBody1Neutral60>
            </Box>
          </Reveal>
        ))}
      </Box>

      <Reveal delay={0.28}>
        <Box sx={{ mt: { xs: 5, md: 6 }, display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, md: 3 } }}>
          {PRINCIPLES.map((key) => (
            <Box key={key} sx={{ flex: '1 1 220px' }}>
              <TextBody1Neutral80>{t(key)}</TextBody1Neutral80>
            </Box>
          ))}
        </Box>
      </Reveal>

      <Reveal delay={0.34}>
        <Box
          sx={{
            mt: { xs: 4, md: 5 },
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'primary.main',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Shield sx={{ fontSize: 28, color: 'primary.main' }} />
          <Box sx={{ flex: '1 1 320px' }}>
            <TextH6Bold sx={{ mb: 0.5 }}>{t('riskReversal.title')}</TextH6Bold>
            <TextBody1Neutral60>{t('riskReversal.body')}</TextBody1Neutral60>
          </Box>
          <Button variant="primary" startIcon={<Mail />} href="mailto:admin@mkdigital.sk">
            {t('cta')}
          </Button>
        </Box>
      </Reveal>
    </Section>
  )
}
