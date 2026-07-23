import type { LeadStatus } from '@/shared/types'

type MuiColor = 'default' | 'info' | 'warning' | 'secondary' | 'primary' | 'success' | 'error'

export const STATUS_COLOR: Record<LeadStatus, MuiColor> = {
  NEW: 'info',
  INTAKE: 'warning',
  DISCOVERY: 'secondary',
  PROPOSAL: 'primary',
  WON: 'success',
  DECLINED: 'error',
}

// UI mirror of the server's ALLOWED_TRANSITIONS (LeadStatus.kt) — decides which transition ACTIONS
// render; the server remains the authority (an illegal jump would 409). Order = primary first.
// DECLINED sits under a separate destructive control, never in this list; from it, the primary action reopens.
export const NEXT_TRANSITIONS: Record<LeadStatus, LeadStatus[]> = {
  NEW: ['INTAKE'],
  INTAKE: ['DISCOVERY'],
  DISCOVERY: ['PROPOSAL'],
  PROPOSAL: ['WON'],
  WON: [],
  DECLINED: ['INTAKE'],
}

// Decline (→ DECLINED) is available from every active status; terminal WON and DECLINED itself have none.
export const CAN_DECLINE: Record<LeadStatus, boolean> = {
  NEW: true,
  INTAKE: true,
  DISCOVERY: true,
  PROPOSAL: true,
  WON: false,
  DECLINED: false,
}
