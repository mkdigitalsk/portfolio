'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { TextBody1, TextBody1Neutral60, TextH6Bold } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import { useLeadsQuery } from './useLeadsQuery'
import { LeadsTable } from './LeadsTable'

export function AdminLeadsList() {
  const t = useTranslations('account')
  const router = useRouter()
  const { data: leads = [], isLoading, error } = useLeadsQuery()

  if (isLoading) return <TextBody1Neutral60>{t('loadingLeads')}</TextBody1Neutral60>
  if (error)
    return (
      <Box sx={{ color: 'error.main' }}>
        <TextBody1>{t(`errors.${httpStatus(error) === 403 ? 'notAuthorized' : 'loadLeadsFailed'}`)}</TextBody1>
      </Box>
    )
  if (leads.length === 0) return <TextBody1Neutral60>{t('noLeads')}</TextBody1Neutral60>

  return (
    <Stack spacing={2}>
      <TextH6Bold>{t('leads', { count: leads.length })}</TextH6Bold>
      <LeadsTable leads={leads} onSelect={(email) => router.push(`/account/leads/${encodeURIComponent(email)}`)} />
    </Stack>
  )
}
