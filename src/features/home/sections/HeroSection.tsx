import { CheckCircle, Mail } from '@mui/icons-material'
import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Button, Reveal, TextBody1Neutral60, TextH1Bold } from '@/shared/components'
import { SECTION_MAX, TEXT_MAX } from '../layout'

// Homepage hero — the research blueprint's #1 lever: an outcome-led claim with hard proof
// in the first viewport (see portfolio-research.md). With no client logos (NDA), the proof
// trio carries credibility: 24h reply, open-source code, full focus.
export async function HeroSection() {
  const t = await getTranslations('home.hero')
  const proofs = [t('proof1'), t('proof2'), t('proof3')]

  return (
    <Box component="section" sx={{ maxWidth: SECTION_MAX, mx: 'auto', px: 3, pt: { xs: 5, md: 7 }, pb: { xs: 5, md: 7 } }}>
      <Reveal>
        <TextH1Bold sx={{ mb: 3 }}>{t('headline')}</TextH1Bold>
      </Reveal>
      <Reveal delay={0.08}>
        <Box sx={{ mb: 4, maxWidth: TEXT_MAX }}>
          <TextBody1Neutral60>{t('subline')}</TextBody1Neutral60>
        </Box>
      </Reveal>
      <Reveal delay={0.16}>
        <Box sx={{ mb: 4 }}>
          <Button variant="primary" startIcon={<Mail />} href="mailto:admin@mkdigital.sk">
            {t('cta')}
          </Button>
        </Box>
      </Reveal>
      <Reveal delay={0.24}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 3 } }}>
          {proofs.map((proof) => (
            <Box key={proof} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <CheckCircle sx={{ fontSize: 18, color: 'primary.main' }} />
              <TextBody1Neutral60>{proof}</TextBody1Neutral60>
            </Box>
          ))}
        </Box>
      </Reveal>
    </Box>
  )
}
