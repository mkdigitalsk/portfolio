// Mirrors the server project aggregate. Client-safe view + admin management types.
export const PROJECT_STATES = ['ACTIVE', 'COMPLETED', 'ARCHIVED'] as const
export type ProjectState = (typeof PROJECT_STATES)[number]

export const PROJECT_HEALTH = ['GREEN', 'AMBER', 'RED'] as const
export type ProjectHealth = (typeof PROJECT_HEALTH)[number]

export const MILESTONE_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE'] as const
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number]

export const DOCUMENT_TYPES = ['CONTRACT', 'PROPOSAL', 'DOCUMENTATION', 'DESIGN'] as const
export type DocumentType = (typeof DOCUMENT_TYPES)[number]

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
}

export interface ClientDemo {
  title: string
  url: string
  updatedAt: string
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
  documents: ClientDocument[]
  milestones: ClientMilestone[]
  demos: ClientDemo[]
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
}

export interface AdminDemo {
  id: number
  title: string
  url: string
  released: boolean
  updatedAt: string
}

export interface AdminProject {
  email: string
  state: ProjectState
  health: ProjectHealth
  startDate: string
  targetEndDate: string | null
  actualEndDate: string | null
  documents: AdminDocument[]
  milestones: AdminMilestone[]
  demos: AdminDemo[]
  history: ProjectEvent[]
}

// Requests — dates are epoch millis on the wire (the web converts date inputs to millis).
export interface StartProjectRequest {
  startDate: number
  targetEndDate?: number | null
  health?: ProjectHealth
}

export interface UpdateProjectRequest {
  health: ProjectHealth
  targetEndDate?: number | null
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
}

export interface DemoRequest {
  title: string
  url: string
  released: boolean
}
