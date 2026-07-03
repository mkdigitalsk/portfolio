import type { LeadStatus } from '@/shared/types'

type MuiColor = 'default' | 'info' | 'warning' | 'secondary' | 'primary' | 'success' | 'error'

export const STATUS_COLOR: Record<LeadStatus, MuiColor> = {
  NEW: 'info',
  REVIEWING: 'warning',
  ANALYZED: 'secondary',
  PROPOSAL_DRAFTED: 'primary',
  PROPOSAL_SENT: 'primary',
  WON: 'success',
  LOST: 'error',
}
