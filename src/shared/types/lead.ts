import type { ProjectHealth, ProjectState } from './project'

// Order + names must match the server LeadStatus enum.
export const LEAD_STATUSES = [
  'NEW',
  'INTAKE',
  'DISCOVERY',
  'PROPOSAL',
  'WON',
  'DECLINED',
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
  hasDesign: boolean
  createdAt: string // ISO-8601 UTC
  status: LeadStatus
}

// A won lead (the account) joined with its delivery project summary. projectState is null when the
// deal is won but the project hasn't been started yet.
export interface AdminClient {
  lead: AdminLead
  projectState: ProjectState | null
  projectHealth: ProjectHealth | null
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
  hasDesign: boolean
  locale: string
}
