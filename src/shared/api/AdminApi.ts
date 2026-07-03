import type { AdminLead, LeadDetail, LeadStatus } from '@/shared/types'
import { BaseApiService } from './BaseApiService'
import { API_PREFIX } from './apiVersion'

export class AdminApi extends BaseApiService {
  protected readonly baseRoute = `${API_PREFIX}/admin`

  getLeads(): Promise<AdminLead[]> {
    return this._get<AdminLead[]>(`${this.baseRoute}/leads`)
  }

  getLead(email: string): Promise<LeadDetail> {
    return this._get<LeadDetail>(`${this.baseRoute}/leads/${encodeURIComponent(email)}`)
  }

  updateStatus(email: string, status: LeadStatus): Promise<AdminLead> {
    return this._patch<AdminLead>(`${this.baseRoute}/leads/${encodeURIComponent(email)}/status`, { status })
  }
}
