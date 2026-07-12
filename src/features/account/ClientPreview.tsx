'use client'

import { useTranslations } from 'next-intl'
import { InfoOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { TextBody1Neutral60, TextCaptionNeutral60 } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import { ClientEngagementView } from './ClientEngagement'
import { useClientPreviewQuery } from './useAdminEngagement'

// Admin-only, READ-ONLY "view as client": renders the exact client panel from the same server-side
// projection the client gets. Best practice over impersonation — no session takeover, no over-exposure.
export function ClientPreview({ email, name }: { email: string; name: string }) {
  const t = useTranslations('account')
  const { data, isLoading, error } = useClientPreviewQuery(email)

  if (isLoading) return <TextBody1Neutral60>{t('engagement.loading')}</TextBody1Neutral60>
  if (error && httpStatus(error) === 404) return <TextBody1Neutral60>{t('engagement.none')}</TextBody1Neutral60>
  if (error || !data) return <TextBody1Neutral60>{t('engagement.loadFailed')}</TextBody1Neutral60>

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 2, color: 'text.secondary' }}>
        <InfoOutlined fontSize="small" />
        <TextCaptionNeutral60>{t('delivery.clientPreviewNote')}</TextCaptionNeutral60>
      </Box>
      <ClientEngagementView data={data} name={name} />
    </Box>
  )
}
