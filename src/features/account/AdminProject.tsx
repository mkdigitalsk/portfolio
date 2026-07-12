'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Add, DeleteOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import { Chip, TextBody1Neutral60, TextCaptionNeutral60, TextH6Bold } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import type { AdminProject as Project, DocumentType, MilestoneStatus, ProjectHealth } from '@/shared/types'
import { DOCUMENT_TYPES, MILESTONE_STATUSES, PROJECT_HEALTH } from '@/shared/types'
import {
  useAddDemo,
  useAddDocument,
  useAddMilestone,
  useAdminProjectQuery,
  useArchiveProject,
  useCompleteProject,
  useDeleteDemo,
  useDeleteDocument,
  useDeleteMilestone,
  useStartProject,
  useUpdateDemo,
  useUpdateMilestone,
  useUpdateProject,
} from './useAdminProject'

type T = ReturnType<typeof useTranslations<'account'>>

const toDateInput = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 10) : '')
const toMillis = (d: string): number | null => (d ? new Date(d).getTime() : null)

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

  const submit = () => {
    const ms = toMillis(startDate)
    if (ms == null) return
    start.mutate({ startDate: ms, targetEndDate: toMillis(targetEndDate), health })
  }

  return (
    <Stack spacing={2} sx={{ maxWidth: 520 }}>
      <TextBody1Neutral60>{t('delivery.noProject')}</TextBody1Neutral60>
      <TextField
        type="date"
        size="small"
        label={t('delivery.startDate')}
        slotProps={{ inputLabel: { shrink: true } }}
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <TextField
        type="date"
        size="small"
        label={t('delivery.targetEndDate')}
        slotProps={{ inputLabel: { shrink: true } }}
        value={targetEndDate}
        onChange={(e) => setTargetEndDate(e.target.value)}
      />
      <TextField select size="small" label={t('delivery.health')} value={health} onChange={(e) => setHealth(e.target.value as ProjectHealth)}>
        {PROJECT_HEALTH.map((h) => (
          <MenuItem key={h} value={h}>
            {t(`project.health.${h}`)}
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" onClick={submit} disabled={!startDate}>
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

  return (
    <Stack spacing={4}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Chip size="small" label={t(`project.state.${data.state}`)} />
        <TextField
          select
          size="small"
          label={t('delivery.health')}
          value={data.health}
          onChange={(e) => update.mutate({ health: e.target.value as ProjectHealth, targetEndDate: toMillis(toDateInput(data.targetEndDate)) })}
          sx={{ minWidth: 140 }}
        >
          {PROJECT_HEALTH.map((h) => (
            <MenuItem key={h} value={h}>
              {t(`project.health.${h}`)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          type="date"
          size="small"
          label={t('delivery.targetEndDate')}
          slotProps={{ inputLabel: { shrink: true } }}
          value={toDateInput(data.targetEndDate)}
          onChange={(e) => update.mutate({ health: data.health, targetEndDate: toMillis(e.target.value) })}
        />
        <Box sx={{ flex: 1 }} />
        {data.state === 'ACTIVE' && (
          <Button size="small" variant="outlined" onClick={() => complete.mutate()}>
            {t('delivery.complete')}
          </Button>
        )}
        {data.state === 'COMPLETED' && (
          <Button size="small" variant="outlined" onClick={() => archive.mutate()}>
            {t('delivery.archive')}
          </Button>
        )}
      </Box>

      <Box>
        <TextH6Bold gutterBottom>{t('project.roadmap')}</TextH6Bold>
        <Stack spacing={1.5}>
          {data.milestones.map((m) => (
            <Box key={m.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                select
                size="small"
                value={m.status}
                onChange={(e) =>
                  updateMilestone.mutate({
                    id: m.id,
                    req: {
                      title: m.title,
                      description: m.description,
                      status: e.target.value as MilestoneStatus,
                      plannedDate: toMillis(toDateInput(m.plannedDate)),
                      completedDate: toMillis(toDateInput(m.completedDate)),
                      position: m.position,
                    },
                  })
                }
                sx={{ minWidth: 130 }}
              >
                {MILESTONE_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {t(`project.milestoneStatus.${s}`)}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <TextBody1Neutral60>{m.title}</TextBody1Neutral60>
                {m.plannedDate && <TextCaptionNeutral60>{toDateInput(m.plannedDate)}</TextCaptionNeutral60>}
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
              <FormControlLabel
                control={
                  <Switch
                    checked={d.released}
                    onChange={(e) => updateDemo.mutate({ id: d.id, req: { title: d.title, url: d.url, released: e.target.checked } })}
                  />
                }
                label={t('delivery.released')}
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

function AddMilestoneForm({
  t,
  nextPosition,
  onAdd,
}: {
  t: T
  nextPosition: number
  onAdd: (req: { title: string; description: null; status: MilestoneStatus; plannedDate: number | null; completedDate: null; position: number }) => void
}) {
  const [title, setTitle] = useState('')
  const [plannedDate, setPlannedDate] = useState('')
  const [status, setStatus] = useState<MilestoneStatus>('PENDING')

  const submit = () => {
    if (!title.trim()) return
    onAdd({ title: title.trim(), description: null, status, plannedDate: toMillis(plannedDate), completedDate: null, position: nextPosition })
    setTitle('')
    setPlannedDate('')
    setStatus('PENDING')
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
      <TextField size="small" label={t('delivery.milestoneTitle')} value={title} onChange={(e) => setTitle(e.target.value)} sx={{ flex: 1, minWidth: 180 }} />
      <TextField type="date" size="small" label={t('delivery.plannedDate')} slotProps={{ inputLabel: { shrink: true } }} value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} />
      <TextField select size="small" value={status} onChange={(e) => setStatus(e.target.value as MilestoneStatus)} sx={{ minWidth: 130 }}>
        {MILESTONE_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {t(`project.milestoneStatus.${s}`)}
          </MenuItem>
        ))}
      </TextField>
      <Button startIcon={<Add />} variant="outlined" onClick={submit}>
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
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
      <TextField select size="small" value={type} onChange={(e) => setType(e.target.value as DocumentType)} sx={{ minWidth: 150 }}>
        {DOCUMENT_TYPES.map((dt) => (
          <MenuItem key={dt} value={dt}>
            {t(`project.documentType.${dt}`)}
          </MenuItem>
        ))}
      </TextField>
      <TextField size="small" label={t('delivery.docTitle')} value={title} onChange={(e) => setTitle(e.target.value)} sx={{ minWidth: 150 }} />
      <TextField size="small" label={t('delivery.docUrl')} value={url} onChange={(e) => setUrl(e.target.value)} sx={{ flex: 1, minWidth: 180 }} />
      <Button startIcon={<Add />} variant="outlined" onClick={submit}>
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
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
      <TextField size="small" label={t('delivery.demoTitle')} value={title} onChange={(e) => setTitle(e.target.value)} sx={{ minWidth: 160 }} />
      <TextField size="small" label={t('delivery.demoUrl')} value={url} onChange={(e) => setUrl(e.target.value)} sx={{ flex: 1, minWidth: 180 }} />
      <Button startIcon={<Add />} variant="outlined" onClick={submit}>
        {t('delivery.add')}
      </Button>
    </Box>
  )
}
