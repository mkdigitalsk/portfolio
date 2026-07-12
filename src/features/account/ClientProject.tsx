'use client'

import { useTranslations } from 'next-intl'
import {
  CheckCircle,
  RadioButtonUnchecked,
  Autorenew,
  OpenInNew,
  DescriptionOutlined,
  ArticleOutlined,
  BrushOutlined,
  GavelOutlined,
} from '@mui/icons-material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { Chip, TextBody1, TextBody1Neutral60, TextCaptionNeutral60, TextH4Bold, TextH6Bold } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import type { ClientDemo, ClientDocument, ClientMilestone, ClientProject as Project, DocumentType, ProjectHealth } from '@/shared/types'
import { useProjectQuery } from './useProjectQuery'
import { formatDate } from './formatDate'

type T = ReturnType<typeof useTranslations<'account'>>

// The client page: fetches the caller's own project, then renders the shared view.
export function ClientProject({ name }: { name: string }) {
  const t = useTranslations('account')
  const { data, isLoading, error } = useProjectQuery()

  if (isLoading) return <TextBody1Neutral60>{t('project.loading')}</TextBody1Neutral60>
  if (error && httpStatus(error) === 404) return <EmptyState name={name} t={t} />
  if (error || !data) return <Card><TextBody1Neutral60>{t('project.loadFailed')}</TextBody1Neutral60></Card>

  return <ClientProjectView data={data} name={name} />
}

// Presentational — the exact panel the client sees. Reused by the admin read-only "view as client".
export function ClientProjectView({ data, name }: { data: Project; name: string }) {
  const t = useTranslations('account')
  const closed = data.state !== 'ACTIVE'
  return (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <TextH4Bold>{name ? t('welcomeNamed', { name }) : t('welcome')}</TextH4Bold>
        <Chip
          size="small"
          label={t(`project.state.${data.state}`)}
          color={data.state === 'ACTIVE' ? 'primary' : 'default'}
          variant={data.state === 'ACTIVE' ? 'filled' : 'outlined'}
        />
      </Box>

      <Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <TextCaptionNeutral60>{t('project.timeline')}</TextCaptionNeutral60>
            <TextBody1>
              {formatDate(data.startDate)} &rarr; {data.targetEndDate ? formatDate(data.targetEndDate) : t('project.tbd')}
            </TextBody1>
            {closed && data.actualEndDate && (
              <TextCaptionNeutral60>
                {t('project.deliveredOn', { date: formatDate(data.actualEndDate) })}
              </TextCaptionNeutral60>
            )}
          </Box>
          <HealthBadge health={data.health} t={t} />
        </Box>
      </Card>

      <Card>
        <TextH6Bold gutterBottom>{t('project.roadmap')}</TextH6Bold>
        {data.milestones.length > 0 ? (
          <Stack spacing={2}>
            {data.milestones.map((m, i) => (
              <MilestoneRow key={i} milestone={m} t={t} />
            ))}
          </Stack>
        ) : (
          <TextBody1Neutral60>{t('project.noMilestones')}</TextBody1Neutral60>
        )}
      </Card>

      <Card>
        <TextH6Bold gutterBottom>{t('project.documents')}</TextH6Bold>
        {data.documents.length > 0 ? (
          <Stack spacing={1.5}>
            {data.documents.map((d, i) => (
              <DocumentRow key={i} doc={d} t={t} />
            ))}
          </Stack>
        ) : (
          <TextBody1Neutral60>{t('project.noDocuments')}</TextBody1Neutral60>
        )}
      </Card>

      <Card>
        <TextH6Bold gutterBottom>{t('project.demos')}</TextH6Bold>
        {data.demos.length > 0 ? (
          <Stack spacing={1.5}>
            {data.demos.map((d, i) => (
              <DemoRow key={i} demo={d} t={t} />
            ))}
          </Stack>
        ) : (
          <TextBody1Neutral60>{t('project.noDemos')}</TextBody1Neutral60>
        )}
      </Card>
    </Stack>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3 }}>
      {children}
    </Paper>
  )
}

function EmptyState({ name, t }: { name: string; t: T }) {
  return (
    <Card>
      <Stack spacing={1}>
        <TextH6Bold>{name ? t('welcomeNamed', { name }) : t('welcome')}</TextH6Bold>
        <TextBody1Neutral60>{t('project.none')}</TextBody1Neutral60>
      </Stack>
    </Card>
  )
}

const HEALTH_COLOR: Record<ProjectHealth, 'success' | 'warning' | 'error'> = {
  GREEN: 'success',
  AMBER: 'warning',
  RED: 'error',
}

function HealthBadge({ health, t }: { health: ProjectHealth; t: T }) {
  return <Chip size="small" color={HEALTH_COLOR[health]} label={t(`project.health.${health}`)} />
}

const MILESTONE_ICON = {
  DONE: <CheckCircle fontSize="small" color="success" />,
  IN_PROGRESS: <Autorenew fontSize="small" color="primary" />,
  PENDING: <RadioButtonUnchecked fontSize="small" sx={{ color: 'text.disabled' }} />,
} as const

function MilestoneRow({ milestone, t }: { milestone: ClientMilestone; t: T }) {
  const date = milestone.completedDate ?? milestone.plannedDate
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <Box sx={{ mt: 0.25 }}>{MILESTONE_ICON[milestone.status]}</Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
          <TextBody1>{milestone.title}</TextBody1>
          {date && <TextCaptionNeutral60>{formatDate(date)}</TextCaptionNeutral60>}
        </Box>
        {milestone.description && <TextBody1Neutral60>{milestone.description}</TextBody1Neutral60>}
        <TextCaptionNeutral60>{t(`project.milestoneStatus.${milestone.status}`)}</TextCaptionNeutral60>
      </Box>
    </Box>
  )
}

const DOC_ICON: Record<DocumentType, React.ReactNode> = {
  CONTRACT: <GavelOutlined fontSize="small" />,
  PROPOSAL: <ArticleOutlined fontSize="small" />,
  DOCUMENTATION: <DescriptionOutlined fontSize="small" />,
  DESIGN: <BrushOutlined fontSize="small" />,
}

function DocumentRow({ doc, t }: { doc: ClientDocument; t: T }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
      <Box sx={{ color: 'text.secondary', display: 'inline-flex' }}>{DOC_ICON[doc.type]}</Box>
      <Box sx={{ flex: 1, minWidth: 120 }}>
        <TextBody1>{doc.title}</TextBody1>
        <TextCaptionNeutral60>{t(`project.documentType.${doc.type}`)}</TextCaptionNeutral60>
      </Box>
      <Link href={doc.url} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        {t('project.open')}
        <OpenInNew fontSize="small" />
      </Link>
    </Box>
  )
}

function DemoRow({ demo, t }: { demo: ClientDemo; t: T }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <TextBody1>{demo.title}</TextBody1>
      <Link href={demo.url} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        {t('project.open')}
        <OpenInNew fontSize="small" />
      </Link>
    </Box>
  )
}
