'use client'

import { useTranslations } from 'next-intl'
import { TextBody1Neutral60 } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import { ClientProjectView } from './ClientProject'
import { useClientPreviewQuery } from './useAdminProject'

// Admin-only, READ-ONLY "view as client": renders the exact client project view from the same server-side
// projection the client gets. Best practice over impersonation — no session takeover, no over-exposure.
// The "view as" toggle in the header already signals this is a preview, so no separate note is needed.
export function ClientPreview({ email, name }: { email: string; name: string }) {
  const t = useTranslations('account')
  const { data, isLoading, error } = useClientPreviewQuery(email)

  if (isLoading) return <TextBody1Neutral60>{t('project.loading')}</TextBody1Neutral60>
  if (error && httpStatus(error) === 404) return <TextBody1Neutral60>{t('project.none')}</TextBody1Neutral60>
  if (error || !data) return <TextBody1Neutral60>{t('project.loadFailed')}</TextBody1Neutral60>

  return <ClientProjectView data={data} name={name} />
}
