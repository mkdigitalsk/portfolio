'use client'

import { useTranslations } from 'next-intl'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { TextBody1Neutral60, TextH6Bold } from '@/shared/components'

export function ClientOverview({ name }: { name: string }) {
  const t = useTranslations('account')
  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
      <Stack spacing={1}>
        <TextH6Bold>{name ? t('welcomeNamed', { name }) : t('welcome')}</TextH6Bold>
        <TextBody1Neutral60>{t('clientComingSoon')}</TextBody1Neutral60>
      </Stack>
    </Paper>
  )
}
