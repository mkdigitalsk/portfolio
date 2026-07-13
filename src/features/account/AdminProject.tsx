'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Add, DeleteOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import { Button, Chip, FilterChip, Input, TextBody1Neutral60, TextCaptionNeutral60, TextH6Bold } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import type {
  AdminMilestone,
  AdminProject as Project,
  Currency,
  DocumentType,
  MilestoneRequest,
  MilestoneStatus,
  PaymentRequest,
  ProjectHealth,
  ScopeItem,
  UpdateProjectRequest,
} from '@/shared/types'
import { CURRENCIES, DOCUMENT_TYPES, MILESTONE_STATUSES, PROJECT_HEALTH } from '@/shared/types'
import {
  useAddDemo,
  useAddDocument,
  useAddMilestone,
  useAddPayment,
  useAdminProjectQuery,
  useArchiveProject,
  useCompleteProject,
  useDeleteDemo,
  useDeleteDocument,
  useDeleteMilestone,
  useDeletePayment,
  useStartProject,
  useUpdateDemo,
  useUpdateMilestone,
  useUpdatePayment,
  useUpdateProject,
} from './useAdminProject'
import { formatMoney } from './formatMoney'

type T = ReturnType<typeof useTranslations<'account'>>

// Compact overrides on the design-system Input — the admin surface is dense, unlike the airy auth forms.
const dense = { '& .MuiOutlinedInput-input': { py: 1.25, px: 1.75, fontSize: '0.9rem' } }

const toDateInput = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : '')
const toMillis = (d: string): number | null => (d ? new Date(d).getTime() : null)
const toCents = (s: string): number | null => {
  const n = Number.parseFloat(s)
  return Number.isNaN(n) ? null : Math.round(n * 100)
}

// Admin edits scope as one item per line, "title | detail" (detail optional).
const scopeToText = (items: ScopeItem[]) => items.map((i) => (i.detail ? `${i.title} | ${i.detail}` : i.title)).join('\n')
const textToScope = (text: string): ScopeItem[] =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const sep = l.indexOf('|')
      return sep === -1 ? { title: l, detail: null } : { title: l.slice(0, sep).trim(), detail: l.slice(sep + 1).trim() || null }
    })

const linesToList = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

export function AdminProject({ email }: { email: string }) {
  const t = useTranslations('account')
  const { data, isLoading, error } = useAdminProjectQuery(email)

  if (isLoading) return <TextBody1Neutral60>{t('project.loading')}</TextBody1Neutral60>
  if (error && httpStatus(error) === 404) return <StartProjectForm email={email} t={t} />
  if (error || !data) return <TextBody1Neutral60>{t('project.loadFailed')}</TextBody1Neutral60>

  return <ManageProject data={data} email={email} t={t} />
}

function StartProjectForm({ email, t }: { email: string; t: T }) {
  const start = useStartProject(email)
  const [startDate, setStartDate] = useState('')
  const [targetEndDate, setTargetEndDate] = useState('')
  const [health, setHealth] = useState<ProjectHealth>('GREEN')
  const [scope, setScope] = useState('')
  const [outOfScope, setOutOfScope] = useState('')

  const submit = () => {
    const ms = toMillis(startDate)
    if (ms == null) return
    start.mutate({ startDate: ms, targetEndDate: toMillis(targetEndDate), health, scope: textToScope(scope), outOfScope: textToScope(outOfScope) })
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 560 }}>
      <TextBody1Neutral60>{t('delivery.noProject')}</TextBody1Neutral60>
      <Input type="date" size="small" sx={dense} label={t('delivery.startDate')} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <Input type="date" size="small" sx={dense} label={t('delivery.targetEndDate')} value={targetEndDate} onChange={(e) => setTargetEndDate(e.target.value)} />
      <Input select size="small" sx={dense} label={t('delivery.health')} value={health} onChange={(e) => setHealth(e.target.value as ProjectHealth)}>
        {PROJECT_HEALTH.map((h) => (
          <MenuItem key={h} value={h}>
            {t(`project.health.${h}`)}
          </MenuItem>
        ))}
      </Input>
      <TextCaptionNeutral60>{t('delivery.scopeHint')}</TextCaptionNeutral60>
      <Input multiline minRows={3} size="small" sx={dense} label={t('delivery.scope')} value={scope} onChange={(e) => setScope(e.target.value)} />
      <Input multiline minRows={2} size="small" sx={dense} label={t('delivery.outOfScope')} value={outOfScope} onChange={(e) => setOutOfScope(e.target.value)} />
      <Button variant="primary" onClick={submit} disabled={!startDate} sx={{ alignSelf: 'flex-start' }}>
        {t('delivery.startProject')}
      </Button>
    </Stack>
  )
}

function ManageProject({ data, email, t }: { data: Project; email: string; t: T }) {
  const update = useUpdateProject(email)
  const complete = useCompleteProject(email)
  const archive = useArchiveProject(email)
  const addMilestone = useAddMilestone(email)
  const updateMilestone = useUpdateMilestone(email)
  const deleteMilestone = useDeleteMilestone(email)
  const addDocument = useAddDocument(email)
  const deleteDocument = useDeleteDocument(email)
  const addDemo = useAddDemo(email)
  const updateDemo = useUpdateDemo(email)
  const deleteDemo = useDeleteDemo(email)
  const addPayment = useAddPayment(email)
  const updatePayment = useUpdatePayment(email)
  const deletePayment = useDeletePayment(email)

  // Every PATCH carries all four fields — the server overwrites unconditionally, so a partial patch
  // would wipe scope/health. Merge current state with the changed field.
  const patchProject = (partial: Partial<UpdateProjectRequest>) =>
    update.mutate({
      health: data.health,
      targetEndDate: toMillis(toDateInput(data.targetEndDate)),
      scope: data.scope,
      outOfScope: data.outOfScope,
      ...partial,
    })

  return (
    <Stack spacing={4}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Chip size="small" label={t(`project.state.${data.state}`)} />
        <Input
          select
          size="small"
          sx={[dense, { minWidth: 140 }]}
          label={t('delivery.health')}
          value={data.health}
          onChange={(e) => patchProject({ health: e.target.value as ProjectHealth })}
        >
          {PROJECT_HEALTH.map((h) => (
            <MenuItem key={h} value={h}>
              {t(`project.health.${h}`)}
            </MenuItem>
          ))}
        </Input>
        <Input
          type="date"
          size="small"
          sx={dense}
          label={t('delivery.targetEndDate')}
          value={toDateInput(data.targetEndDate)}
          onChange={(e) => patchProject({ targetEndDate: toMillis(e.target.value) })}
        />
        <Box sx={{ flex: 1 }} />
        {data.state === 'ACTIVE' && (
          <Button variant="outline" onClick={() => complete.mutate()}>
            {t('delivery.complete')}
          </Button>
        )}
        {data.state === 'COMPLETED' && (
          <Button variant="outline" onClick={() => archive.mutate()}>
            {t('delivery.archive')}
          </Button>
        )}
      </Box>

      <ScopeEditor data={data} t={t} onSave={(scope, outOfScope) => patchProject({ scope, outOfScope })} />

      <Box>
        <TextH6Bold gutterBottom>{t('project.roadmap')}</TextH6Bold>
        <Stack spacing={1.5}>
          {data.milestones.map((m) => (
            <Box key={m.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Input
                select
                size="small"
                sx={[dense, { minWidth: 130 }]}
                value={m.status}
                onChange={(e) => updateMilestone.mutate({ id: m.id, req: milestoneReq(m, { status: e.target.value as MilestoneStatus }) })}
              >
                {MILESTONE_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {t(`project.milestoneStatus.${s}`)}
                  </MenuItem>
                ))}
              </Input>
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <TextBody1Neutral60>{m.title}</TextBody1Neutral60>
                {m.plannedDate && <TextCaptionNeutral60>{toDateInput(m.plannedDate)}</TextCaptionNeutral60>}
                {m.acceptanceCriteria.length > 0 && (
                  <TextCaptionNeutral60>
                    {t('delivery.acceptanceCriteria')}: {m.acceptanceCriteria.join('; ')}
                  </TextCaptionNeutral60>
                )}
              </Box>
              <IconButton aria-label={t('delivery.delete')} onClick={() => deleteMilestone.mutate(m.id)}>
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
        <AddMilestoneForm t={t} nextPosition={data.milestones.length} onAdd={(req) => addMilestone.mutate(req)} />
      </Box>

      <Box>
        <TextH6Bold gutterBottom>{t('delivery.payments')}</TextH6Bold>
        <Stack spacing={1.5}>
          {data.payments.map((p) => (
            <Box key={p.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <FilterChip
                size="small"
                selected={p.status === 'PAID'}
                label={t('delivery.markPaid')}
                onClick={() =>
                  updatePayment.mutate({
                    id: p.id,
                    req: { label: p.label, amountCents: p.amountCents, currency: p.currency, status: p.status === 'PAID' ? 'DUE' : 'PAID', position: p.position },
                  })
                }
              />
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <TextBody1Neutral60>
                  {p.label} — {formatMoney(p.amountCents, p.currency)}
                </TextBody1Neutral60>
              </Box>
              <IconButton aria-label={t('delivery.delete')} onClick={() => deletePayment.mutate(p.id)}>
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
        <AddPaymentForm t={t} nextPosition={data.payments.length} onAdd={(req) => addPayment.mutate(req)} />
      </Box>

      <Box>
        <TextH6Bold gutterBottom>{t('project.documents')}</TextH6Bold>
        <Stack spacing={1.5}>
          {data.documents.map((d) => (
            <Box key={d.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip size="small" variant="outlined" label={t(`project.documentType.${d.type}`)} />
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <TextBody1Neutral60>
                  {d.title} — {d.url}
                </TextBody1Neutral60>
              </Box>
              <IconButton aria-label={t('delivery.delete')} onClick={() => deleteDocument.mutate(d.id)}>
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
        <AddDocumentForm t={t} onAdd={(req) => addDocument.mutate(req)} />
      </Box>

      <Box>
        <TextH6Bold gutterBottom>{t('project.demos')}</TextH6Bold>
        <Stack spacing={1.5}>
          {data.demos.map((d) => (
            <Box key={d.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <FilterChip
                size="small"
                selected={d.released}
                label={t('delivery.released')}
                onClick={() => updateDemo.mutate({ id: d.id, req: { title: d.title, url: d.url, released: !d.released } })}
              />
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <TextBody1Neutral60>
                  {d.title} — {d.url}
                </TextBody1Neutral60>
              </Box>
              <IconButton aria-label={t('delivery.delete')} onClick={() => deleteDemo.mutate(d.id)}>
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
        <AddDemoForm t={t} onAdd={(req) => addDemo.mutate(req)} />
      </Box>
    </Stack>
  )
}

// Preserve every milestone field the edit form doesn't touch (the status dropdown would otherwise wipe them).
function milestoneReq(m: AdminMilestone, partial: Partial<MilestoneRequest>): MilestoneRequest {
  return {
    title: m.title,
    description: m.description,
    status: m.status,
    plannedDate: toMillis(toDateInput(m.plannedDate)),
    completedDate: toMillis(toDateInput(m.completedDate)),
    position: m.position,
    acceptanceCriteria: m.acceptanceCriteria,
    ...partial,
  }
}

function ScopeEditor({ data, t, onSave }: { data: Project; t: T; onSave: (scope: ScopeItem[], outOfScope: ScopeItem[]) => void }) {
  const [scope, setScope] = useState(scopeToText(data.scope))
  const [outOfScope, setOutOfScope] = useState(scopeToText(data.outOfScope))
  const dirty = scope !== scopeToText(data.scope) || outOfScope !== scopeToText(data.outOfScope)

  return (
    <Box>
      <TextH6Bold gutterBottom>{t('project.scopeTitle')}</TextH6Bold>
      <Stack spacing={1.5} sx={{ maxWidth: 720 }}>
        <TextCaptionNeutral60>{t('delivery.scopeHint')}</TextCaptionNeutral60>
        <Input multiline minRows={3} size="small" sx={dense} label={t('delivery.scope')} value={scope} onChange={(e) => setScope(e.target.value)} />
        <Input multiline minRows={2} size="small" sx={dense} label={t('delivery.outOfScope')} value={outOfScope} onChange={(e) => setOutOfScope(e.target.value)} />
        <Button variant="outline" disabled={!dirty} onClick={() => onSave(textToScope(scope), textToScope(outOfScope))} sx={{ alignSelf: 'flex-start' }}>
          {t('delivery.add')}
        </Button>
      </Stack>
    </Box>
  )
}

function AddMilestoneForm({ t, nextPosition, onAdd }: { t: T; nextPosition: number; onAdd: (req: MilestoneRequest) => void }) {
  const [title, setTitle] = useState('')
  const [plannedDate, setPlannedDate] = useState('')
  const [status, setStatus] = useState<MilestoneStatus>('PENDING')
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('')

  const submit = () => {
    if (!title.trim()) return
    onAdd({
      title: title.trim(),
      description: null,
      status,
      plannedDate: toMillis(plannedDate),
      completedDate: null,
      position: nextPosition,
      acceptanceCriteria: linesToList(acceptanceCriteria),
    })
    setTitle('')
    setPlannedDate('')
    setStatus('PENDING')
    setAcceptanceCriteria('')
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap', mt: 2 }}>
      <Input size="small" sx={[dense, { flex: 1, minWidth: 180 }]} label={t('delivery.milestoneTitle')} value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input type="date" size="small" sx={dense} label={t('delivery.plannedDate')} value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} />
      <Input select size="small" sx={[dense, { minWidth: 130 }]} value={status} onChange={(e) => setStatus(e.target.value as MilestoneStatus)}>
        {MILESTONE_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {t(`project.milestoneStatus.${s}`)}
          </MenuItem>
        ))}
      </Input>
      <Input multiline size="small" sx={[dense, { flex: 1, minWidth: 200 }]} label={t('delivery.acceptanceCriteria')} placeholder={t('delivery.acceptanceHint')} value={acceptanceCriteria} onChange={(e) => setAcceptanceCriteria(e.target.value)} />
      <Button variant="outline" startIcon={<Add />} onClick={submit}>
        {t('delivery.add')}
      </Button>
    </Box>
  )
}

function AddPaymentForm({ t, nextPosition, onAdd }: { t: T; nextPosition: number; onAdd: (req: PaymentRequest) => void }) {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>('EUR')

  const submit = () => {
    const cents = toCents(amount)
    if (!label.trim() || cents == null) return
    onAdd({ label: label.trim(), amountCents: cents, currency, status: 'DUE', position: nextPosition })
    setLabel('')
    setAmount('')
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap', mt: 2 }}>
      <Input size="small" sx={[dense, { flex: 1, minWidth: 200 }]} label={t('delivery.paymentLabel')} value={label} onChange={(e) => setLabel(e.target.value)} />
      <Input size="small" sx={[dense, { minWidth: 120 }]} label={t('delivery.amount')} value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
      <Input select size="small" sx={[dense, { width: 110 }]} label={t('delivery.currency')} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
        {CURRENCIES.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Input>
      <Button variant="outline" startIcon={<Add />} onClick={submit}>
        {t('delivery.add')}
      </Button>
    </Box>
  )
}

function AddDocumentForm({ t, onAdd }: { t: T; onAdd: (req: { type: DocumentType; title: string; url: string }) => void }) {
  const [type, setType] = useState<DocumentType>('CONTRACT')
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const submit = () => {
    if (!title.trim() || !url.trim()) return
    onAdd({ type, title: title.trim(), url: url.trim() })
    setTitle('')
    setUrl('')
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap', mt: 2 }}>
      <Input select size="small" sx={[dense, { minWidth: 150 }]} value={type} onChange={(e) => setType(e.target.value as DocumentType)}>
        {DOCUMENT_TYPES.map((dt) => (
          <MenuItem key={dt} value={dt}>
            {t(`project.documentType.${dt}`)}
          </MenuItem>
        ))}
      </Input>
      <Input size="small" sx={[dense, { minWidth: 150 }]} label={t('delivery.docTitle')} value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input size="small" sx={[dense, { flex: 1, minWidth: 180 }]} label={t('delivery.docUrl')} value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button variant="outline" startIcon={<Add />} onClick={submit}>
        {t('delivery.add')}
      </Button>
    </Box>
  )
}

function AddDemoForm({ t, onAdd }: { t: T; onAdd: (req: { title: string; url: string; released: boolean }) => void }) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const submit = () => {
    if (!title.trim() || !url.trim()) return
    onAdd({ title: title.trim(), url: url.trim(), released: false })
    setTitle('')
    setUrl('')
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', flexWrap: 'wrap', mt: 2 }}>
      <Input size="small" sx={[dense, { minWidth: 160 }]} label={t('delivery.demoTitle')} value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input size="small" sx={[dense, { flex: 1, minWidth: 180 }]} label={t('delivery.demoUrl')} value={url} onChange={(e) => setUrl(e.target.value)} />
      <Button variant="outline" startIcon={<Add />} onClick={submit}>
        {t('delivery.add')}
      </Button>
    </Box>
  )
}
