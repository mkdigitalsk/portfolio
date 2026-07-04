'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowBack, DescriptionOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  Button,
  Chip,
  Markdown,
  TextBody1,
  TextBody1Neutral60,
  TextCaptionNeutral60,
  TextH6Bold,
} from '@/shared/components'
import { httpStatus } from '@/shared/api'
import type { AdminLead } from '@/shared/types'
import { useLeadDetailQuery } from './useLeadDetailQuery'
import { LeadStatusSelect } from './LeadStatusSelect'

const STAGES = [
  { stage: 'REQUIREMENTS', key: 'requirements' },
  { stage: 'QUESTIONS', key: 'questions' },
  { stage: 'ANALYSIS', key: 'analysis' },
  { stage: 'PROPOSAL', key: 'proposal' },
  { stage: 'INTERNAL_SCOPE', key: 'internalScope' },
] as const

export function LeadDetail({ email }: { email: string }) {
  const t = useTranslations('account')
  const router = useRouter()
  const { data: detail, isLoading, error } = useLeadDetailQuery(email)
  const [tab, setTab] = useState(0)
  // Section nav is a left rail on wide (landscape) screens, top tabs on narrow (portrait) — a pattern
  // change, not sizing; safe with useMediaQuery since the account tree is client-only (never SSR'd).
  const railNav = useMediaQuery((theme) => theme.breakpoints.up('md'))
  const toList = () => router.push('/account')

  if (isLoading) return <TextBody1Neutral60>{t('loadingLead')}</TextBody1Neutral60>
  if (error)
    return (
      <ErrorBack
        message={t(`errors.${httpStatus(error) === 403 ? 'notAuthorized' : 'loadLeadFailed'}`)}
        onBack={toList}
      />
    )
  if (!detail) return <ErrorBack message={t('leadNotFound')} onBack={toList} />

  const { lead, artifacts } = detail
  const present = STAGES.filter((s) => artifacts.some((a) => a.stage === s.stage))
  const content =
    tab === 0 ? (
      <Submission lead={lead} />
    ) : (
      <Markdown>{artifacts.find((a) => a.stage === present[tab - 1]?.stage)?.content ?? ''}</Markdown>
    )

  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Button variant="text" onClick={toList} startIcon={<ArrowBack />} sx={{ flexShrink: 0 }}>
          {t('allLeads')}
        </Button>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <TextH6Bold>{lead.email}</TextH6Bold>
          <TextCaptionNeutral60>
            {lead.appType}
            {lead.name ? ` · ${lead.name}` : ''}
            {lead.phone ? ` · ${lead.phone}` : ''}
          </TextCaptionNeutral60>
        </Box>
        <LeadStatusSelect email={lead.email} value={lead.status} />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 2, md: 4 } }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          orientation={railNav ? 'vertical' : 'horizontal'}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            flexShrink: 0,
            minWidth: { md: 200 },
            borderRight: { md: 1 },
            borderBottom: { xs: 1, md: 0 },
            borderColor: 'divider',
          }}
        >
          <Tab label={t('submission')} sx={{ alignItems: 'flex-start', textAlign: 'left' }} />
          {present.map((s) => (
            <Tab key={s.stage} label={t(`stage.${s.key}`)} sx={{ alignItems: 'flex-start', textAlign: 'left' }} />
          ))}
        </Tabs>
        <Box sx={{ flex: 1, minWidth: 0 }}>{content}</Box>
      </Box>
    </Stack>
  )
}

function Submission({ lead }: { lead: AdminLead }) {
  const t = useTranslations('account')
  return (
    <Stack spacing={2.5}>
      <Field label={t('table.platforms')}>
        <TextBody1>{lead.platforms.join(' · ') || '—'}</TextBody1>
      </Field>
      <Field label={t('features', { count: lead.features.length })}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {lead.features.map((f) => (
            <Chip key={f} label={f} size="small" variant="outlined" />
          ))}
        </Box>
      </Field>
      {lead.hasDoc && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <DescriptionOutlined fontSize="small" />
          <TextBody1Neutral60>{t('hasDocLong')}</TextBody1Neutral60>
        </Box>
      )}
      {lead.note && (
        <Field label={t('note')}>
          <Box sx={{ fontStyle: 'italic' }}>
            <TextBody1>“{lead.note}”</TextBody1>
          </Box>
        </Field>
      )}
    </Stack>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <TextCaptionNeutral60>{label}</TextCaptionNeutral60>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  )
}

function ErrorBack({ message, onBack }: { message: string; onBack: () => void }) {
  const t = useTranslations('account')
  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Button variant="text" onClick={onBack} startIcon={<ArrowBack />}>
        {t('allLeads')}
      </Button>
      <Box sx={{ color: 'error.main' }}>
        <TextH6Bold>{message}</TextH6Bold>
      </Box>
    </Stack>
  )
}
