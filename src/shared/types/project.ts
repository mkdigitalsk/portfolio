// Mirrors the server project aggregate. Client-safe view + admin management types.
export const PROJECT_STATES = ['ACTIVE', 'COMPLETED', 'ARCHIVED'] as const
export type ProjectState = (typeof PROJECT_STATES)[number]

export const PROJECT_HEALTH = ['GREEN', 'AMBER', 'RED'] as const
export type ProjectHealth = (typeof PROJECT_HEALTH)[number]

export const MILESTONE_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE'] as const
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number]

export const DOCUMENT_TYPES = ['CONTRACT', 'PROPOSAL', 'DOCUMENTATION', 'DESIGN'] as const
export type DocumentType = (typeof DOCUMENT_TYPES)[number]

export const PAYMENT_STATUSES = ['DUE', 'PAID'] as const
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export const CURRENCIES = ['EUR', 'USD', 'GBP', 'CZK'] as const
export type Currency = (typeof CURRENCIES)[number]

// A SOW deliverable / exclusion — named line + optional elaboration.
export interface ScopeItem {
  title: string
  detail: string | null
}

export interface ClientDocument {
  type: DocumentType
  title: string
  url: string
}

export interface ClientMilestone {
  title: string
  description: string | null
  status: MilestoneStatus
  plannedDate: string | null // ISO-8601 UTC
  completedDate: string | null
  position: number
  acceptanceCriteria: string[]
}

export interface ClientDemo {
  title: string
  url: string
  thumbnailUrl: string | null
  updatedAt: string
}

export interface ClientPayment {
  label: string
  amountCents: number
  currency: Currency
  status: PaymentStatus
  position: number
}

export interface ProjectEvent {
  type: string
  detail: string | null
  at: string // ISO-8601 UTC
}

export interface ClientProject {
  state: ProjectState
  health: ProjectHealth
  startDate: string // ISO-8601 UTC
  targetEndDate: string | null
  actualEndDate: string | null
  scope: ScopeItem[]
  outOfScope: ScopeItem[]
  documents: ClientDocument[]
  milestones: ClientMilestone[]
  demos: ClientDemo[]
  payments: ClientPayment[]
  history: ProjectEvent[]
}

// Admin — full records (incl. unreleased demos + ids).
export interface AdminDocument {
  id: number
  type: DocumentType
  title: string
  url: string
  updatedAt: string
}

export interface AdminMilestone {
  id: number
  title: string
  description: string | null
  status: MilestoneStatus
  plannedDate: string | null
  completedDate: string | null
  position: number
  updatedAt: string
  acceptanceCriteria: string[]
}

export interface AdminDemo {
  id: number
  title: string
  url: string
  thumbnailUrl: string | null
  released: boolean
  updatedAt: string
}

export interface AdminPayment {
  id: number
  label: string
  amountCents: number
  currency: Currency
  status: PaymentStatus
  position: number
}

export interface AdminProject {
  email: string
  state: ProjectState
  health: ProjectHealth
  startDate: string
  targetEndDate: string | null
  actualEndDate: string | null
  scope: ScopeItem[]
  outOfScope: ScopeItem[]
  jiraBoardUrl: string | null
  specUrl: string | null
  designUrl: string | null
  documents: AdminDocument[]
  milestones: AdminMilestone[]
  demos: AdminDemo[]
  payments: AdminPayment[]
  history: ProjectEvent[]
}

// Requests — dates are epoch millis on the wire (the web converts date inputs to millis).
export interface StartProjectRequest {
  startDate: number
  targetEndDate?: number | null
  health?: ProjectHealth
  scope?: ScopeItem[]
  outOfScope?: ScopeItem[]
}

export interface UpdateProjectRequest {
  health: ProjectHealth
  targetEndDate?: number | null
  scope?: ScopeItem[]
  outOfScope?: ScopeItem[]
}

export interface UpdateLinksRequest {
  jiraBoardUrl?: string | null
  specUrl?: string | null
  designUrl?: string | null
}

export interface UploadDocumentRequest {
  type: DocumentType
  title: string
  filename: string
  contentType: string
  base64: string
}

export interface DocumentRequest {
  type: DocumentType
  title: string
  url: string
}

export interface MilestoneRequest {
  title: string
  description?: string | null
  status: MilestoneStatus
  plannedDate?: number | null
  completedDate?: number | null
  position: number
  acceptanceCriteria?: string[]
}

export interface DemoRequest {
  title: string
  url: string
  thumbnailUrl?: string | null
  released: boolean
}

export interface PaymentRequest {
  label: string
  amountCents: number
  currency?: Currency
  status?: PaymentStatus
  position?: number
}
