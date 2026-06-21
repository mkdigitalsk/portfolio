import { Box } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import { Reveal, TextBody1Neutral80 } from '@/shared/components'
import { SECTION_MAX, SECTION_MAX_WIDE } from '../layout'

// Trust / metrics band — a fast-scan reassurance strip directly under the hero. The research
// blueprint shows a metrics band high on the page correlates with top trust scores and reframes
// a solo studio's availability as a client outcome (see portfolio-research.md).
export async function TrustBandSection() {
  const t = await getTranslations('home.trust')
  const facts = [t('fact1'), t('fact2'), t('fact3'), t('fact4'), t('fact5'), t('fact6')]

  return (
    <Box component="section" sx={{ borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ maxWidth: SECTION_MAX_WIDE, mx: 'auto', px: 3, py: { xs: 3, md: 4 } }}>
        <Reveal>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'center' },
              gap: { xs: 1.5, sm: 2, md: 3 },
            }}
          >
            {facts.map((fact, i) => (
              <Box key={fact} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2, md: 3 } }}>
                <TextBody1Neutral80>{fact}</TextBody1Neutral80>
                {i < facts.length - 1 && (
                  <Box aria-hidden sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider', display: { xs: 'none', sm: 'block' } }} />
                )}
              </Box>
            ))}
          </Box>
        </Reveal>
      </Box>
    </Box>
  )
}
