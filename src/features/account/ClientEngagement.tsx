'use client'

import { useTranslations } from 'next-intl'
import { CheckCircle, RadioButtonUnchecked, Autorenew, OpenInNew, DescriptionOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import {
  Chip,
  Markdown,
  TextBody1,
  TextBody1Neutral60,
  TextCaptionNeutral60,
  TextH4Bold,
  TextH6Bold,
} from '@/shared/components'
import { httpStatus } from '@/shared/api'
import type { ClientDemo, ClientMilestone, ClientStage } from '@/shared/types'
import { useEngagementQuery } from './useEngagementQuery'

type T = ReturnType<typeof useTranslations<'account'>>

// Forward path shown in the stepper — CLOSED (a dead lead) is handled separately, not a step.
const STEPS: ClientStage[] = ['IN_REVIEW', 'PREPARING_PROPOSAL', 'PROPOSAL_READY', 'IN_PROGRESS']

export function ClientEngagement({ name }: { name: string }) {
  const t = useTranslations('account')
  const { data, isLoading, error } = useEngagementQuery()

  if (isLoading) return <TextBody1Neutral60>{t('engagement.loading')}</TextBody1Neutral60>
  if (error && httpStatus(error) === 404) return <EmptyState name={name} t={t} />
  if (error) return <Card><TextBody1Neutral60>{t('engagement.loadFailed')}</TextBody1Neutral60></Card>
  if (!data) return <EmptyState name={name} t={t} />

  return (
    <Stack spacing={3}>
      <Box>
        <TextH4Bold>{name ? t('welcomeNamed', { name }) : t('welcome')}</TextH4Bold>
        <TextBody1Neutral60>{data.appType}</TextBody1Neutral60>
      </Box>

      <Card>
        <StageStepper stage={data.stage} t={t} />
      </Card>

      <Card>
        <TextH6Bold gutterBottom>{t('engagement.request')}</TextH6Bold>
        <Stack spacing={1.5}>
          {data.platforms.length > 0 && (
            <ChipRow label={t('engagement.platforms')} values={data.platforms} />
          )}
          {data.features.length > 0 && (
            <ChipRow label={t('engagement.features')} values={data.features} />
          )}
          {data.hasDoc && <Chip icon={<DescriptionOutlined />} label={t('hasDoc')} size="small" />}
          {data.note && (
            <Box>
              <TextCaptionNeutral60>{t('engagement.note')}</TextCaptionNeutral60>
              <TextBody1>{data.note}</TextBody1>
            </Box>
          )}
        </Stack>
      </Card>

      <Card>
        <TextH6Bold gutterBottom>{t('engagement.proposal')}</TextH6Bold>
        {data.proposal ? (
          <Markdown>{data.proposal}</Markdown>
        ) : (
          <TextBody1Neutral60>{t('engagement.noProposal')}</TextBody1Neutral60>
        )}
      </Card>

      <Card>
        <TextH6Bold gutterBottom>{t('engagement.milestones')}</TextH6Bold>
        {data.milestones.length > 0 ? (
          <Stack spacing={2}>
            {data.milestones.map((m, i) => (
              <MilestoneRow key={i} milestone={m} t={t} />
            ))}
          </Stack>
        ) : (
          <TextBody1Neutral60>{t('engagement.noMilestones')}</TextBody1Neutral60>
        )}
      </Card>

      <Card>
        <TextH6Bold gutterBottom>{t('engagement.demos')}</TextH6Bold>
        {data.demos.length > 0 ? (
          <Stack spacing={1.5}>
            {data.demos.map((d, i) => (
              <DemoRow key={i} demo={d} t={t} />
            ))}
          </Stack>
        ) : (
          <TextBody1Neutral60>{t('engagement.noDemos')}</TextBody1Neutral60>
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
        <TextBody1Neutral60>{t('engagement.none')}</TextBody1Neutral60>
      </Stack>
    </Card>
  )
}

function StageStepper({ stage, t }: { stage: ClientStage; t: T }) {
  if (stage === 'CLOSED') {
    return <Chip label={t('engagement.stage.CLOSED')} size="small" />
  }
  const active = STEPS.indexOf(stage)
  return (
    <Stepper activeStep={active} alternativeLabel sx={{ '& .MuiStepLabel-label': { mt: 1 } }}>
      {STEPS.map((s) => (
        <Step key={s}>
          <StepLabel>{t(`engagement.stage.${s}`)}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}

function ChipRow({ label, values }: { label: string; values: string[] }) {
  return (
    <Box>
      <TextCaptionNeutral60>{label}</TextCaptionNeutral60>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 0.5 }}>
        {values.map((v, i) => (
          <Chip key={i} label={v} size="small" variant="outlined" />
        ))}
      </Box>
    </Box>
  )
}

const MILESTONE_ICON = {
  DONE: <CheckCircle fontSize="small" color="success" />,
  IN_PROGRESS: <Autorenew fontSize="small" color="primary" />,
  PENDING: <RadioButtonUnchecked fontSize="small" sx={{ color: 'text.disabled' }} />,
} as const

function MilestoneRow({ milestone, t }: { milestone: ClientMilestone; t: T }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <Box sx={{ mt: 0.25 }}>{MILESTONE_ICON[milestone.status]}</Box>
      <Box>
        <TextBody1>{milestone.title}</TextBody1>
        {milestone.description && <TextBody1Neutral60>{milestone.description}</TextBody1Neutral60>}
        <TextCaptionNeutral60>{t(`engagement.milestoneStatus.${milestone.status}`)}</TextCaptionNeutral60>
      </Box>
    </Box>
  )
}

function DemoRow({ demo, t }: { demo: ClientDemo; t: T }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <TextBody1>{demo.title}</TextBody1>
      <Link href={demo.url} target="_blank" rel="noopener" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
        {t('engagement.openDemo')}
        <OpenInNew fontSize="small" />
      </Link>
    </Box>
  )
}
