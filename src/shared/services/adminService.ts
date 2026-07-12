import type { DemoRequest, LeadStatus, MilestoneRequest } from '@/shared/types'
import { adminApi } from '../api'

export const adminService = {
  getLeads: () => adminApi.getLeads(),
  getLead: (email: string) => adminApi.getLead(email),
  updateStatus: (email: string, status: LeadStatus) => adminApi.updateStatus(email, status),

  getEngagement: (email: string) => adminApi.getEngagement(email),
  addMilestone: (email: string, req: MilestoneRequest) => adminApi.addMilestone(email, req),
  updateMilestone: (email: string, id: number, req: MilestoneRequest) => adminApi.updateMilestone(email, id, req),
  deleteMilestone: (email: string, id: number) => adminApi.deleteMilestone(email, id),
  addDemo: (email: string, req: DemoRequest) => adminApi.addDemo(email, req),
  updateDemo: (email: string, id: number, req: DemoRequest) => adminApi.updateDemo(email, id, req),
  deleteDemo: (email: string, id: number) => adminApi.deleteDemo(email, id),
}
