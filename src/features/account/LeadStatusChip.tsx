'use client'

import { useTranslations } from 'next-intl'
import { Chip } from '@/shared/components'
import type { LeadStatus } from '@/shared/types'
import { STATUS_COLOR } from './leadStatus'

// Read-only status display — the list view shows state; changing it is a decision that lives in the
// detail's transition actions (LeadTransitions), never an inline edit in a table row.
export function LeadStatusChip({ value }: { value: LeadStatus }) {
  const t = useTranslations('account')
  return <Chip label={t(`status.${value}`)} color={STATUS_COLOR[value]} size="small" variant="outlined" />
}
