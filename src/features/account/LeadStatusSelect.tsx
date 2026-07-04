'use client'

import { useTranslations } from 'next-intl'
import MenuItem from '@mui/material/MenuItem'
import { Chip, Select } from '@/shared/components'
import { LEAD_STATUSES, type LeadStatus } from '@/shared/types'
import { STATUS_COLOR } from './leadStatus'
import { useUpdateStatusMutation } from './useUpdateStatusMutation'

// Editable status — used inline in the leads list (triage) and in the detail toolbar. stopPropagation so
// a click inside a clickable table row changes status without opening the row's detail.
export function LeadStatusSelect({ email, value }: { email: string; value: LeadStatus }) {
  const t = useTranslations('account')
  const mutation = useUpdateStatusMutation(email)
  return (
    <Select
      value={value}
      onChange={(e) => mutation.mutate(e.target.value as LeadStatus)}
      onClick={(e) => e.stopPropagation()}
      variant="standard"
      disabled={mutation.isPending}
      sx={{ '&::before, &::after': { display: 'none' }, '& .MuiSelect-select': { py: 0.5, pr: 3 } }}
    >
      {LEAD_STATUSES.map((s) => (
        <MenuItem key={s} value={s}>
          <Chip label={t(`status.${s}`)} color={STATUS_COLOR[s]} size="small" variant="outlined" />
        </MenuItem>
      ))}
    </Select>
  )
}
