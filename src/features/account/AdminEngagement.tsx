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
import { TextBody1Neutral60, TextH6Bold } from '@/shared/components'
import type { MilestoneStatus } from '@/shared/types'
import { MILESTONE_STATUSES } from '@/shared/types'
import {
  useAddDemo,
  useAddMilestone,
  useAdminEngagementQuery,
  useDeleteDemo,
  useDeleteMilestone,
  useUpdateDemo,
  useUpdateMilestone,
} from './useAdminEngagement'

type T = ReturnType<typeof useTranslations<'account'>>

export function AdminEngagement({ email }: { email: string }) {
  const t = useTranslations('account')
  const { data, isLoading } = useAdminEngagementQuery(email)

  const addMilestone = useAddMilestone(email)
  const updateMilestone = useUpdateMilestone(email)
  const deleteMilestone = useDeleteMilestone(email)
  const addDemo = useAddDemo(email)
  const updateDemo = useUpdateDemo(email)
  const deleteDemo = useDeleteDemo(email)

  if (isLoading || !data) return <TextBody1Neutral60>{t('engagement.loading')}</TextBody1Neutral60>

  return (
    <Stack spacing={4}>
      <Box>
        <TextH6Bold gutterBottom>{t('delivery.milestones')}</TextH6Bold>
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
                    req: { title: m.title, description: m.description, status: e.target.value as MilestoneStatus, position: m.position },
                  })
                }
                sx={{ minWidth: 140 }}
              >
                {MILESTONE_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {t(`engagement.milestoneStatus.${s}`)}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ flex: 1, minWidth: 180 }}>
                <TextBody1Neutral60>{m.title}</TextBody1Neutral60>
              </Box>
              <IconButton aria-label={t('delivery.delete')} onClick={() => deleteMilestone.mutate(m.id)}>
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Stack>
        <AddMilestoneForm t={t} onAdd={(req) => addMilestone.mutate(req)} nextPosition={data.milestones.length} />
      </Box>

      <Box>
        <TextH6Bold gutterBottom>{t('delivery.demos')}</TextH6Bold>
        <Stack spacing={1.5}>
          {data.demos.map((d) => (
            <Box key={d.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={d.released}
                    onChange={(e) =>
                      updateDemo.mutate({ id: d.id, req: { title: d.title, url: d.url, released: e.target.checked } })
                    }
                  />
                }
                label={t('delivery.released')}
              />
              <Box sx={{ flex: 1, minWidth: 180 }}>
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
  onAdd,
  nextPosition,
}: {
  t: T
  onAdd: (req: { title: string; description: string | null; status: MilestoneStatus; position: number }) => void
  nextPosition: number
}) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<MilestoneStatus>('PENDING')

  const submit = () => {
    if (!title.trim()) return
    onAdd({ title: title.trim(), description: null, status, position: nextPosition })
    setTitle('')
    setStatus('PENDING')
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
      <TextField
        size="small"
        label={t('delivery.milestoneTitle')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <TextField select size="small" value={status} onChange={(e) => setStatus(e.target.value as MilestoneStatus)} sx={{ minWidth: 140 }}>
        {MILESTONE_STATUSES.map((s) => (
          <MenuItem key={s} value={s}>
            {t(`engagement.milestoneStatus.${s}`)}
          </MenuItem>
        ))}
      </TextField>
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
      <TextField
        size="small"
        label={t('delivery.demoTitle')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ minWidth: 160 }}
      />
      <TextField
        size="small"
        label={t('delivery.demoUrl')}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        sx={{ flex: 1, minWidth: 200 }}
      />
      <Button startIcon={<Add />} variant="outlined" onClick={submit}>
        {t('delivery.add')}
      </Button>
    </Box>
  )
}
