'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowBack, DescriptionOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import {
  Button,
  Chip,
  Markdown,
  Select,
  TextBody1,
  TextBody1Neutral60,
  TextCaptionNeutral60,
  TextH4Bold,
  TextH6Bold,
} from '@/shared/components'
import { httpStatus } from '@/shared/api'
import { LEAD_STATUSES, type AdminLead, type LeadStatus } from '@/shared/types'
import { STATUS_COLOR } from './leadStatus'
import { useLeadDetailQuery } from './useLeadDetailQuery'
import { useUpdateStatusMutation } from './useUpdateStatusMutation'

const STAGES = [
  { stage: 'REQUIREMENTS', key: 'requirements' },
  { stage: 'QUESTIONS', key: 'questions' },
  { stage: 'ANALYSIS', key: 'analysis' },
  { stage: 'PROPOSAL', key: 'proposal' },
  { stage: 'INTERNAL_SCOPE', key: 'internalScope' },
] as const

export function LeadDetail({ email, onBack }: { email: string; onBack: () => void }) {
  const t = useTranslations('account')
  const { data: detail, isLoading, error } = useLeadDetailQuery(email)
  const statusMutation = useUpdateStatusMutation(email)
  const [tab, setTab] = useState(0)

  if (isLoading) return <TextBody1Neutral60>{t('loadingLead')}</TextBody1Neutral60>
  if (error)
    return <ErrorBack message={t(`errors.${httpStatus(error) === 403 ? 'notAuthorized' : 'loadLeadFailed'}`)} onBack={onBack} />
  if (!detail) return <ErrorBack message={t('leadNotFound')} onBack={onBack} />

  const { lead, artifacts } = detail
  const present = STAGES.filter((s) => artifacts.some((a) => a.stage === s.stage))

  return (
    <Stack spacing={3}>
      <Button variant="text" onClick={onBack} startIcon={<ArrowBack />} sx={{ alignSelf: 'flex-start' }}>
        {t('allLeads')}
      </Button>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <TextH4Bold>{lead.email}</TextH4Bold>
          <TextBody1Neutral60>
            {lead.appType}
            {lead.name ? ` · ${lead.name}` : ''}
            {lead.phone ? ` · ${lead.phone}` : ''}
          </TextBody1Neutral60>
        </Box>
        <StatusControl value={lead.status} onChange={(s) => statusMutation.mutate(s)} />
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
        <Tab label={t('submission')} />
        {present.map((s) => (
          <Tab key={s.stage} label={t(`stage.${s.key}`)} />
        ))}
      </Tabs>

      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
        {tab === 0 ? (
          <Submission lead={lead} />
        ) : (
          <Markdown>{artifacts.find((a) => a.stage === present[tab - 1]?.stage)?.content ?? ''}</Markdown>
        )}
      </Paper>
    </Stack>
  )
}

function StatusControl({ value, onChange }: { value: LeadStatus; onChange: (s: LeadStatus) => void }) {
  const t = useTranslations('account')
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as LeadStatus)} sx={{ minWidth: 180 }}>
      {LEAD_STATUSES.map((s) => (
        <MenuItem key={s} value={s}>
          <Chip label={t(`status.${s}`)} color={STATUS_COLOR[s]} size="small" variant="outlined" />
        </MenuItem>
      ))}
    </Select>
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
