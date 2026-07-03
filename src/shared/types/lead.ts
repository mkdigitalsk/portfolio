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

export interface AdminLead {
  id: number
  email: string
  appType: string
  platforms: string[]
  features: string[]
  name: string | null
  phone: string | null
  note: string | null
  hasDoc: boolean
  createdAt: string // ISO-8601 UTC
  status: LeadStatus
}

export interface LeadArtifact {
  stage: string
  content: string
  updatedAt: string // ISO-8601 UTC
}

export interface LeadDetail {
  lead: AdminLead
  artifacts: LeadArtifact[]
}

export interface LeadDraft {
  email: string
  appType: string
  platforms: string[]
  features: string[]
  name?: string
  phone?: string
  note?: string
  hasDoc: boolean
  locale: string
}
