import { AutoAwesome, RocketLaunch, Insights } from '@mui/icons-material'
import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Reveal, TextBody1Neutral60, TextBody1Primary, TextH4Bold, TextH6Bold } from '@/shared/components'

// Services as 3-4 named lifecycle pillars + engagement model. Replaces the implicit
// "we do everything" read with an intentional, scannable taxonomy that signals focus and
// sales maturity (see portfolio-research.md). AI is elevated as a first-class capability.
const PILLARS = [
  { key: 'strategy', Icon: Insights },
  { key: 'build', Icon: AutoAwesome },
  { key: 'launch', Icon: RocketLaunch },
] as const

export async function ServicesSection() {
  const t = await getTranslations('home.services')

  return (
    <Box component="section" sx={{ maxWidth: 1040, mx: 'auto', px: 3, py: { xs: 8, md: 12 } }}>
      <Reveal>
        <TextH4Bold sx={{ mb: 2 }}>{t('title')}</TextH4Bold>
      </Reveal>
      <Reveal delay={0.06}>
        <Box sx={{ mb: 5, maxWidth: 680 }}>
          <TextBody1Neutral60>{t('subtitle')}</TextBody1Neutral60>
        </Box>
      </Reveal>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: { xs: 3, md: 4 } }}>
        {PILLARS.map(({ key, Icon }, i) => (
          <Reveal key={key} delay={0.08 * i}>
            <Box
              sx={{
                height: '100%',
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Icon sx={{ fontSize: 22, color: 'primary.main' }} />
                <TextH6Bold>{t(`${key}.title`)}</TextH6Bold>
              </Box>
              <TextBody1Neutral60>{t(`${key}.outcome`)}</TextBody1Neutral60>
              <Box sx={{ mt: 'auto', pt: 1 }}>
                <TextBody1Primary>{t(`${key}.credential`)}</TextBody1Primary>
              </Box>
            </Box>
          </Reveal>
        ))}
      </Box>

      <Reveal delay={0.28}>
        <Box
          sx={{
            mt: { xs: 4, md: 5 },
            p: 3,
            borderRadius: 2,
            bgcolor: 'action.hover',
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 2, md: 4 },
          }}
        >
          <Box sx={{ flex: '1 1 280px' }}>
            <TextH6Bold sx={{ mb: 0.5 }}>{t('engagement.fullTitle')}</TextH6Bold>
            <TextBody1Neutral60>{t('engagement.fullDesc')}</TextBody1Neutral60>
          </Box>
          <Box sx={{ flex: '1 1 280px' }}>
            <TextH6Bold sx={{ mb: 0.5 }}>{t('engagement.embeddedTitle')}</TextH6Bold>
            <TextBody1Neutral60>{t('engagement.embeddedDesc')}</TextBody1Neutral60>
          </Box>
        </Box>
      </Reveal>
    </Box>
  )
}
