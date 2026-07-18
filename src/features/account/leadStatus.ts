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

// UI mirror of the server's ALLOWED_TRANSITIONS (LeadStatus.kt) — decides which transition ACTIONS
// render; the server remains the authority (an illegal jump would 409). Order = primary first.
// LOST sits under a separate destructive control, never in this list.
export const NEXT_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ['REVIEWING'],
  REVIEWING: ['ANALYZED'],
  ANALYZED: ['PROPOSAL_SENT', 'PROPOSAL_DRAFTED'],
  PROPOSAL_DRAFTED: ['PROPOSAL_SENT'],
  PROPOSAL_SENT: ['WON'],
  WON: [],
  LOST: ['REVIEWING'],
}

// Decline (→ LOST) is available from every active stage; terminal states have no decline.
export const CAN_DECLINE: Record<LeadStatus, boolean> = {
  NEW: true,
  REVIEWING: true,
  ANALYZED: true,
  PROPOSAL_DRAFTED: true,
  PROPOSAL_SENT: true,
  WON: false,
  LOST: false,
}
