// Order + names must match the server LeadStatus enum.
export const LEAD_STATUSES = [
  'NEW',
  'REVIEWING',
  'ANALYZED',
  'PROPOSAL_DRAFTED',
  'PROPOSAL_SENT',
  'WON',
  'LOST',
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]

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
