// Lead lifecycle — mirrors the server LeadStatus enum. Order = the pipeline progression.
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

export const STATUS_META: Record<LeadStatus, { label: string; color: MuiColor }> = {
  NEW: { label: 'New', color: 'info' },
  REVIEWING: { label: 'Reviewing', color: 'warning' },
  ANALYZED: { label: 'Analyzed', color: 'secondary' },
  PROPOSAL_DRAFTED: { label: 'Proposal drafted', color: 'primary' },
  PROPOSAL_SENT: { label: 'Proposal sent', color: 'primary' },
  WON: { label: 'Won', color: 'success' },
  LOST: { label: 'Lost', color: 'error' },
}

// Tolerates a missing/unknown status (e.g. an older server that predates the status column).
export function statusMeta(status: LeadStatus | undefined): { label: string; color: MuiColor } {
  return (status && STATUS_META[status]) || { label: status ?? 'Unknown', color: 'default' }
}
