'use client'

import { useState } from 'react'
import { ArrowBack, DescriptionOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import {
  Button,
  Chip,
  Markdown,
  TextBody1,
  TextBody1Neutral60,
  TextCaptionNeutral60,
  TextH4Bold,
  TextH6Bold,
} from '@/shared/components'
import { LEAD_STATUSES, STATUS_META, type LeadStatus } from './leadStatus'
import { useAdminLeadDetail } from './useAdminLeadDetail'
import type { AdminLead } from './useAdminLeads'

const STAGE_ORDER = ['REQUIREMENTS', 'QUESTIONS', 'ANALYSIS', 'PROPOSAL', 'INTERNAL_SCOPE'] as const
const STAGE_LABEL: Record<string, string> = {
  REQUIREMENTS: 'Requirements',
  QUESTIONS: 'Questions',
  ANALYSIS: 'Analysis',
  PROPOSAL: 'Proposal',
  INTERNAL_SCOPE: 'Internal scope',
}

export function LeadDetail({ token, email, onBack }: { token: string; email: string; onBack: () => void }) {
  const { detail, loading, error, updateStatus } = useAdminLeadDetail(token, email)
  const [tab, setTab] = useState(0)

  if (loading) return <TextBody1Neutral60>Loading lead…</TextBody1Neutral60>
  if (error) return <ErrorBack error={error} onBack={onBack} />
  if (!detail) return <ErrorBack error="Lead not found." onBack={onBack} />

  const { lead, artifacts } = detail
  const present = STAGE_ORDER.filter((s) => artifacts.some((a) => a.stage === s))

  return (
    <Stack spacing={3}>
      <Button variant="text" onClick={onBack} startIcon={<ArrowBack />} sx={{ alignSelf: 'flex-start' }}>
        All leads
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
        <StatusControl value={lead.status} onChange={updateStatus} />
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
        <Tab label="Submission" />
        {present.map((s) => (
          <Tab key={s} label={STAGE_LABEL[s]} />
        ))}
      </Tabs>

      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
        {tab === 0 ? (
          <Submission lead={lead} />
        ) : (
          <Markdown>{artifacts.find((a) => a.stage === present[tab - 1])?.content ?? ''}</Markdown>
        )}
      </Paper>
    </Stack>
  )
}

function StatusControl({ value, onChange }: { value: LeadStatus; onChange: (s: LeadStatus) => void }) {
  return (
    <Select
      value={value}
      size="small"
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      sx={{ minWidth: 180 }}
    >
      {LEAD_STATUSES.map((s) => (
        <MenuItem key={s} value={s}>
          <Chip label={STATUS_META[s].label} color={STATUS_META[s].color} size="small" variant="outlined" />
        </MenuItem>
      ))}
    </Select>
  )
}

function Submission({ lead }: { lead: AdminLead }) {
  return (
    <Stack spacing={2.5}>
      <Field label="Platforms">
        <TextBody1>{lead.platforms.join(' · ') || '—'}</TextBody1>
      </Field>
      <Field label={`Features (${lead.features.length})`}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {lead.features.map((f) => (
            <Chip key={f} label={f} size="small" variant="outlined" />
          ))}
        </Box>
      </Field>
      {lead.hasDoc && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <DescriptionOutlined fontSize="small" />
          <TextBody1Neutral60>Client attached their own spec / documentation.</TextBody1Neutral60>
        </Box>
      )}
      {lead.note && (
        <Field label="Note">
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

function ErrorBack({ error, onBack }: { error: string; onBack: () => void }) {
  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Button variant="text" onClick={onBack} startIcon={<ArrowBack />}>
        All leads
      </Button>
      <Box sx={{ color: 'error.main' }}>
        <TextH6Bold>{error}</TextH6Bold>
      </Box>
    </Stack>
  )
}
