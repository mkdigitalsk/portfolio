import type {
  AdminDemo,
  AdminEngagement,
  AdminLead,
  AdminMilestone,
  DemoRequest,
  LeadDetail,
  LeadStatus,
  MilestoneRequest,
} from '@/shared/types'
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

  private lead(email: string): string {
    return `${this.baseRoute}/leads/${encodeURIComponent(email)}`
  }

  getEngagement(email: string): Promise<AdminEngagement> {
    return this._get<AdminEngagement>(`${this.lead(email)}/engagement`)
  }

  addMilestone(email: string, req: MilestoneRequest): Promise<AdminMilestone> {
    return this._post<AdminMilestone>(`${this.lead(email)}/milestones`, req)
  }

  updateMilestone(email: string, id: number, req: MilestoneRequest): Promise<AdminMilestone> {
    return this._patch<AdminMilestone>(`${this.lead(email)}/milestones/${id}`, req)
  }

  deleteMilestone(email: string, id: number): Promise<void> {
    return this._delete(`${this.lead(email)}/milestones/${id}`)
  }

  addDemo(email: string, req: DemoRequest): Promise<AdminDemo> {
    return this._post<AdminDemo>(`${this.lead(email)}/demos`, req)
  }

  updateDemo(email: string, id: number, req: DemoRequest): Promise<AdminDemo> {
    return this._patch<AdminDemo>(`${this.lead(email)}/demos/${id}`, req)
  }

  deleteDemo(email: string, id: number): Promise<void> {
    return this._delete(`${this.lead(email)}/demos/${id}`)
  }
}
