'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Tabs, type TabItem, TextBody1, TextBody1Neutral60 } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import { useLeadsQuery } from './useLeadsQuery'
import { useClientsQuery } from './useClientsQuery'
import { LeadsTable } from './LeadsTable'
import { ClientsTable } from './ClientsTable'

type T = ReturnType<typeof useTranslations<'account'>>

function ErrorLine({ error, t }: { error: unknown; t: T }) {
  return (
    <Box sx={{ color: 'error.main' }}>
      <TextBody1>{t(`errors.${httpStatus(error) === 403 ? 'notAuthorized' : 'loadLeadsFailed'}`)}</TextBody1>
    </Box>
  )
}

// Admin CRM split into pipeline (Leads) and delivery (Clients) — a won lead graduates to the Clients tab.
export function AdminLeadsList() {
  const t = useTranslations('account')
  const router = useRouter()
  const [tab, setTab] = useState('leads')
  const leadsQuery = useLeadsQuery()
  const clientsQuery = useClientsQuery()

  const pipeline = (leadsQuery.data ?? []).filter((l) => l.status !== 'WON')
  const clients = clientsQuery.data ?? []
  const select = (email: string) => router.push(`/account/leads/${encodeURIComponent(email)}`)

  const tabs: TabItem[] = [
    { value: 'leads', label: t('leadsTab', { count: pipeline.length }) },
    { value: 'clients', label: t('clientsTab', { count: clients.length }) },
  ]

  return (
    <Stack spacing={2}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tab} onChange={setTab} items={tabs} />
      </Box>

      {tab === 'leads' &&
        (leadsQuery.isLoading ? (
          <TextBody1Neutral60>{t('loadingLeads')}</TextBody1Neutral60>
        ) : leadsQuery.error ? (
          <ErrorLine error={leadsQuery.error} t={t} />
        ) : pipeline.length === 0 ? (
          <TextBody1Neutral60>{t('noLeads')}</TextBody1Neutral60>
        ) : (
          <LeadsTable leads={pipeline} onSelect={select} />
        ))}

      {tab === 'clients' &&
        (clientsQuery.isLoading ? (
          <TextBody1Neutral60>{t('loadingLeads')}</TextBody1Neutral60>
        ) : clientsQuery.error ? (
          <ErrorLine error={clientsQuery.error} t={t} />
        ) : clients.length === 0 ? (
          <TextBody1Neutral60>{t('clients.none')}</TextBody1Neutral60>
        ) : (
          <ClientsTable clients={clients} onSelect={select} />
        ))}
    </Stack>
  )
}
