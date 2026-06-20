'use client'

import { RocketLaunchOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button, TextBody1Neutral60, TextH6Bold } from '@/shared/components'

export function MoreIdeasCard() {
  const t = useTranslations()

  return (
    <Box
      sx={{
        mt: { xs: 2, md: 3 },
        px: { xs: 3, md: 4 },
        py: { xs: 3, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: { xs: 2, sm: 3 },
        textAlign: { xs: 'center', sm: 'left' },
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
        transition: 'border-color 0.2s ease, box-shadow 0.25s ease, transform 0.25s ease',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -10px rgba(0,0,0,0.26)',
        },
      }}
    >
      <RocketLaunchOutlined sx={{ fontSize: 38, color: 'primary.main', flexShrink: 0 }} />
      <Box sx={{ flex: 1 }}>
        <TextH6Bold>{t('home.moreText')}</TextH6Bold>
        <Box sx={{ mt: 0.5 }}>
          <TextBody1Neutral60>{t('home.moreExisting')}</TextBody1Neutral60>
        </Box>
      </Box>
      <Button component={Link} href="/app/custom" variant="primary">
        {t('home.moreCta')}
      </Button>
    </Box>
  )
}
