import type { LeadStatus } from '@/shared/types'
import { adminApi } from '../api'

export const adminService = {
  getLeads: () => adminApi.getLeads(),
  getLead: (email: string) => adminApi.getLead(email),
  updateStatus: (email: string, status: LeadStatus) => adminApi.updateStatus(email, status),
}
