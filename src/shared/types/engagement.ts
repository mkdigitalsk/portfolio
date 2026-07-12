// The client-safe engagement projection — mirrors the server ClientEngagementDTO.
export const CLIENT_STAGES = ['IN_REVIEW', 'PREPARING_PROPOSAL', 'PROPOSAL_READY', 'IN_PROGRESS', 'CLOSED'] as const
export type ClientStage = (typeof CLIENT_STAGES)[number]

export const MILESTONE_STATUSES = ['PENDING', 'IN_PROGRESS', 'DONE'] as const
export type MilestoneStatus = (typeof MILESTONE_STATUSES)[number]

export interface ClientMilestone {
  title: string
  description: string | null
  status: MilestoneStatus
  position: number
}

export interface ClientDemo {
  title: string
  url: string
  updatedAt: string // ISO-8601 UTC
}

export interface ClientEngagement {
  appType: string
  platforms: string[]
  features: string[]
  hasDoc: boolean
  note: string | null
  stage: ClientStage
  submittedAt: string // ISO-8601 UTC
  proposal: string | null // markdown, present only once sent
  milestones: ClientMilestone[]
  demos: ClientDemo[]
}

// Admin side — full records (incl. unreleased demos) the admin manages.
export interface AdminMilestone {
  id: number
  title: string
  description: string | null
  status: MilestoneStatus
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

export interface AdminEngagement {
  milestones: AdminMilestone[]
  demos: AdminDemo[]
}

export interface MilestoneRequest {
  title: string
  description?: string | null
  status: MilestoneStatus
  position: number
}

export interface DemoRequest {
  title: string
  url: string
  released: boolean
}
