'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  CheckCircle,
  RadioButtonUnchecked,
  Autorenew,
  PlayCircle,
  DescriptionOutlined,
  ArticleOutlined,
  BrushOutlined,
  HistoryEduOutlined,
} from '@mui/icons-material'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import {
  Chip,
  Tabs,
  type TabItem,
  TextBody1,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
  TextH6Bold,
} from '@/shared/components'
import { httpStatus } from '@/shared/api'
import { PANEL } from '@/shared/layout'
import type {
  ClientDemo,
  ClientDocument,
  ClientMilestone,
  ClientPayment,
  ClientProject as Project,
  DocumentType,
  PaymentStatus,
  ProjectEvent,
  ProjectHealth,
  ScopeItem,
} from '@/shared/types'
import { useProjectQuery } from './useProjectQuery'
import { formatDate } from './formatDate'
import { formatMoney } from './formatMoney'

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
  const [tab, setTab] = useState('overview')

  const tabs: TabItem[] = [
    { value: 'overview', label: t('project.tab.overview') },
    { value: 'roadmap', label: t('project.tab.roadmap') },
    { value: 'documents', label: t('project.tab.documents') },
    { value: 'demos', label: t('project.tab.demos') },
    { value: 'payments', label: t('project.tab.payments') },
  ]

  return (
    // Client SOW panel is a reading/list surface, not a dense dashboard — cap it to a focused column
    // so rows don't stretch edge-to-edge across the wide app shell (dates/actions isolating far right).
    <Stack spacing={PANEL.section} sx={{ maxWidth: PANEL.max }}>
      {/* Compact page header + tabs grouped tightly (GitHub/Atlassian pattern): a small identity gives
          context, tabs sit directly above their panel — no large block wasting height on every view. */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 1.5 }}>
          <TextH6Bold>{name ? t('welcomeNamed', { name }) : t('welcome')}</TextH6Bold>
          <Chip
            size="small"
            label={t(`project.state.${data.state}`)}
            color={data.state === 'ACTIVE' ? 'primary' : 'default'}
            variant={data.state === 'ACTIVE' ? 'filled' : 'outlined'}
          />
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={setTab} items={tabs} />
        </Box>
      </Box>

      {tab === 'overview' && <OverviewTab data={data} t={t} />}
      {tab === 'roadmap' && <RoadmapTab milestones={data.milestones} t={t} />}
      {tab === 'documents' && <DocumentsTab documents={data.documents} t={t} />}
      {tab === 'demos' && <DemosTab demos={data.demos} t={t} />}
      {tab === 'payments' && <PaymentsTab payments={data.payments} t={t} />}
    </Stack>
  )
}

function OverviewTab({ data, t }: { data: Project; t: T }) {
  const closed = data.state !== 'ACTIVE'
  const latest =
    data.history.length > 0
      ? data.history.reduce((a, b) => (new Date(b.at).getTime() > new Date(a.at).getTime() ? b : a))
      : null
  return (
    <Stack spacing={PANEL.section}>
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
        {latest && (
          <Box sx={{ mt: 1.5 }}>
            <TextCaptionNeutral60>
              {t('project.lastUpdate')}: {eventLabel(latest, t)} &middot; {formatDate(latest.at)}
            </TextCaptionNeutral60>
          </Box>
        )}
      </Card>

      <Card>
        <TextH6Bold gutterBottom>{t('project.scopeTitle')}</TextH6Bold>
        {data.scope.length > 0 || data.outOfScope.length > 0 ? (
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {data.scope.length > 0 && <ScopeBlock label={t('project.scope')} items={data.scope} />}
            {data.outOfScope.length > 0 && <ScopeBlock label={t('project.outOfScope')} items={data.outOfScope} />}
          </Stack>
        ) : (
          <TextBody1Neutral60>{t('project.noScope')}</TextBody1Neutral60>
        )}
      </Card>
    </Stack>
  )
}

function ScopeBlock({ label, items }: { label: string; items: ScopeItem[] }) {
  return (
    <Box>
      <TextCaptionNeutral60>{label}</TextCaptionNeutral60>
      <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, mt: 0.5, p: 0 }}>
        {items.map((item, i) => (
          <Box component="li" key={i} sx={{ display: 'flex', gap: 1 }}>
            <Box aria-hidden sx={{ color: 'primary.main', lineHeight: 1.6 }}>&bull;</Box>
            <Box>
              <TextBody1>{item.title}</TextBody1>
              {item.detail && <TextBody1Neutral60>{item.detail}</TextBody1Neutral60>}
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

function RoadmapTab({ milestones, t }: { milestones: ClientMilestone[]; t: T }) {
  return (
    <Card>
      {milestones.length > 0 ? (
        <Box>
          {milestones.map((m, i) => (
            <MilestoneItem key={i} milestone={m} last={i === milestones.length - 1} t={t} />
          ))}
        </Box>
      ) : (
        <TextBody1Neutral60>{t('project.noMilestones')}</TextBody1Neutral60>
      )}
    </Card>
  )
}

function DocumentsTab({ documents, t }: { documents: ClientDocument[]; t: T }) {
  return (
    <Card>
      {documents.length > 0 ? (
        <Stack spacing={0.5}>
          {documents.map((d, i) => (
            <DocumentRow key={i} doc={d} t={t} />
          ))}
        </Stack>
      ) : (
        <TextBody1Neutral60>{t('project.noDocuments')}</TextBody1Neutral60>
      )}
    </Card>
  )
}

function DemosTab({ demos, t }: { demos: ClientDemo[]; t: T }) {
  return (
    <Card>
      {demos.length > 0 ? (
        <Stack spacing={0.5}>
          {demos.map((d, i) => (
            <DemoRow key={i} demo={d} />
          ))}
        </Stack>
      ) : (
        <TextBody1Neutral60>{t('project.noDemos')}</TextBody1Neutral60>
      )}
    </Card>
  )
}

function PaymentsTab({ payments, t }: { payments: ClientPayment[]; t: T }) {
  if (payments.length === 0) {
    return <Card><TextBody1Neutral60>{t('project.noPayments')}</TextBody1Neutral60></Card>
  }
  const currency = payments[0].currency
  const total = payments.reduce((sum, p) => sum + p.amountCents, 0)
  const paid = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amountCents, 0)
  return (
    <Card>
      <Stack spacing={1.5} divider={<Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}>
        {payments.map((p, i) => (
          <PaymentRow key={i} payment={p} t={t} />
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, pt: 0.5 }}>
          <TextBody1Neutral60>
            {t('project.paymentsPaid')}: {formatMoney(paid, currency)}
          </TextBody1Neutral60>
          <TextH6Bold>
            {t('project.paymentsTotal')}: {formatMoney(total, currency)}
          </TextH6Bold>
        </Box>
      </Stack>
    </Card>
  )
}

function PaymentRow({ payment, t }: { payment: ClientPayment; t: T }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <TextBody1>{payment.label}</TextBody1>
        <PaymentStatusChip status={payment.status} t={t} />
      </Box>
      <TextBody1Neutral80>{formatMoney(payment.amountCents, payment.currency)}</TextBody1Neutral80>
    </Box>
  )
}

const PAYMENT_COLOR: Record<PaymentStatus, 'success' | 'default'> = { PAID: 'success', DUE: 'default' }

function PaymentStatusChip({ status, t }: { status: PaymentStatus; t: T }) {
  return (
    <Chip
      size="small"
      color={PAYMENT_COLOR[status]}
      variant={status === 'PAID' ? 'filled' : 'outlined'}
      label={t(`project.paymentStatus.${status}`)}
    />
  )
}

// Client sees only the latest lifecycle event as a "last update" line on Overview — the full
// append-only audit log stays admin-only (a thin status log reads redundant next to the roadmap).
function eventLabel(event: ProjectEvent, t: T): string {
  const health = event.type === 'HEALTH_CHANGED' && event.detail ? t(`project.health.${event.detail}`) : null
  return `${t(`project.event.${event.type}`)}${health ? `: ${health}` : ''}`
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: PANEL.card, borderRadius: 3 }}>
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

function MilestoneItem({ milestone, last, t }: { milestone: ClientMilestone; last: boolean; t: T }) {
  const done = milestone.status === 'DONE'
  const connectorColor = done ? 'success.main' : 'divider'
  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', lineHeight: 0 }}>{MILESTONE_ICON[milestone.status]}</Box>
        {!last && <Box sx={{ width: '2px', flexGrow: 1, my: 0.75, borderRadius: 1, bgcolor: connectorColor }} />}
      </Box>
      <Box sx={{ flex: 1, pb: last ? 0 : 3.5 }}>
        <TextBody1>{milestone.title}</TextBody1>
        {milestone.description && <TextBody1Neutral60>{milestone.description}</TextBody1Neutral60>}
        {/* Status → contextual line: DONE shows WHEN it completed, PENDING the planned date, the active
            step gets a wayfinding chip. The icon already carries done / not-started. */}
        <Box sx={{ mt: 0.75 }}>
          {milestone.status === 'DONE' && milestone.completedDate && (
            <TextCaptionNeutral60>{t('project.completedOn', { date: formatDate(milestone.completedDate) })}</TextCaptionNeutral60>
          )}
          {milestone.status === 'IN_PROGRESS' && (
            <Chip size="small" color="primary" variant="outlined" label={t('project.milestoneStatus.IN_PROGRESS')} />
          )}
          {milestone.status === 'PENDING' && milestone.plannedDate && (
            <TextCaptionNeutral60>{t('project.plannedOn', { date: formatDate(milestone.plannedDate) })}</TextCaptionNeutral60>
          )}
        </Box>
        {milestone.acceptanceCriteria.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <TextCaptionNeutral60>{t('project.acceptanceCriteria')}</TextCaptionNeutral60>
            <Stack component="ul" spacing={0.5} sx={{ listStyle: 'none', m: 0, mt: 0.5, p: 0 }}>
              {milestone.acceptanceCriteria.map((c, i) => (
                <Box component="li" key={i} sx={{ display: 'flex', gap: 1 }}>
                  {/* Criteria are "met" only once the milestone is DONE — otherwise a pending marker. */}
                  <Box aria-hidden sx={{ color: done ? 'success.main' : 'text.disabled', lineHeight: 1.6 }}>
                    {done ? '✓' : '○'}
                  </Box>
                  <TextBody1Neutral80>{c}</TextBody1Neutral80>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const DOC_ICON: Record<DocumentType, React.ReactNode> = {
  CONTRACT: <HistoryEduOutlined fontSize="small" />,
  PROPOSAL: <ArticleOutlined fontSize="small" />,
  DOCUMENTATION: <DescriptionOutlined fontSize="small" />,
  DESIGN: <BrushOutlined fontSize="small" />,
}

function DocumentRow({ doc, t }: { doc: ClientDocument; t: T }) {
  return (
    // Whole row is the link — the type icon labels it; a muted external-link glyph is the only affordance.
    <Box
      component={Link}
      href={doc.url}
      target="_blank"
      rel="noopener"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: PANEL.itemX,
        py: PANEL.itemY,
        mx: -PANEL.itemX,
        borderRadius: 2,
        color: 'inherit',
        textDecoration: 'none',
        transition: 'background-color 0.15s',
        '&:hover': { bgcolor: 'action.hover' },
        '&:hover .doc-open': { opacity: 1 },
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <TextBody1>{doc.title}</TextBody1>
        <TextCaptionNeutral60>{t(`project.documentType.${doc.type}`)}</TextCaptionNeutral60>
      </Box>
      {/* Type icon sits trailing — one glyph doubles as type indicator + affordance (row is the link). */}
      <Box
        className="doc-open"
        sx={{ color: 'text.secondary', display: 'inline-flex', opacity: 0.6, transition: 'opacity 0.15s' }}
      >
        {DOC_ICON[doc.type]}
      </Box>
    </Box>
  )
}

// Compact list row (scales to many demos): small 16:9 thumbnail + title, whole row is the link.
// Poster is a brand gradient placeholder until the demo model carries a real `thumbnailUrl`.
function DemoRow({ demo }: { demo: ClientDemo }) {
  return (
    <Box
      component={Link}
      href={demo.url}
      target="_blank"
      rel="noopener"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: PANEL.itemX,
        py: PANEL.itemY,
        mx: -PANEL.itemX,
        borderRadius: 2,
        color: 'inherit',
        textDecoration: 'none',
        transition: 'background-color 0.15s',
        '&:hover': { bgcolor: 'action.hover' },
        '&:hover .demo-play': { transform: 'scale(1.12)' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 96,
          flexShrink: 0,
          aspectRatio: '16 / 9',
          borderRadius: 1.5,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        }}
      >
        {demo.thumbnailUrl && (
          <Box
            component="img"
            src={demo.thumbnailUrl}
            alt=""
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
        <PlayCircle
          className="demo-play"
          sx={{
            position: 'relative',
            fontSize: 26,
            color: 'common.white',
            opacity: 0.92,
            transition: 'transform 0.15s',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.45))',
          }}
        />
      </Box>
      <TextBody1>{demo.title}</TextBody1>
    </Box>
  )
}
