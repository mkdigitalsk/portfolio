import type {
  AdminClient,
  AdminDemo,
  AdminDocument,
  AdminLead,
  AdminMilestone,
  AdminPayment,
  AdminProject,
  ClientProject,
  DemoRequest,
  DocumentRequest,
  LeadDetail,
  LeadStatus,
  MilestoneRequest,
  PaymentRequest,
  StartProjectRequest,
  UpdateLinksRequest,
  UpdateProjectRequest,
} from '@/shared/types'
import { BaseApiService } from './BaseApiService'
import { API_PREFIX } from './apiVersion'

export class AdminApi extends BaseApiService {
  protected readonly baseRoute = `${API_PREFIX}/admin`

  // --- Leads (sales pipeline) ---
  getLeads(): Promise<AdminLead[]> {
    return this._get<AdminLead[]>(`${this.baseRoute}/leads`)
  }

  getLead(email: string): Promise<LeadDetail> {
    return this._get<LeadDetail>(`${this.baseRoute}/leads/${encodeURIComponent(email)}`)
  }

  updateStatus(email: string, status: LeadStatus): Promise<AdminLead> {
    return this._patch<AdminLead>(`${this.baseRoute}/leads/${encodeURIComponent(email)}/status`, { status })
  }

  // --- Clients (won leads + delivery project summary) ---
  getClients(): Promise<AdminClient[]> {
    return this._get<AdminClient[]>(`${this.baseRoute}/clients`)
  }

  // --- Project (delivery) ---
  private project(email: string): string {
    return `${this.baseRoute}/projects/${encodeURIComponent(email)}`
  }

  getProject(email: string): Promise<AdminProject> {
    return this._get<AdminProject>(this.project(email))
  }

  // Read-only "view as client" — the same client-safe projection the client sees.
  getClientPreview(email: string): Promise<ClientProject> {
    return this._get<ClientProject>(`${this.project(email)}/client-preview`)
  }

  startProject(email: string, req: StartProjectRequest): Promise<AdminProject> {
    return this._post<AdminProject>(this.project(email), req)
  }

  updateProject(email: string, req: UpdateProjectRequest): Promise<AdminProject> {
    return this._patch<AdminProject>(this.project(email), req)
  }

  updateLinks(email: string, req: UpdateLinksRequest): Promise<AdminProject> {
    return this._patch<AdminProject>(`${this.project(email)}/links`, req)
  }

  completeProject(email: string): Promise<AdminProject> {
    return this._post<AdminProject>(`${this.project(email)}/complete`)
  }

  archiveProject(email: string): Promise<AdminProject> {
    return this._post<AdminProject>(`${this.project(email)}/archive`)
  }

  unarchiveProject(email: string): Promise<AdminProject> {
    return this._post<AdminProject>(`${this.project(email)}/unarchive`)
  }

  addDocument(email: string, req: DocumentRequest): Promise<AdminDocument> {
    return this._post<AdminDocument>(`${this.project(email)}/documents`, req)
  }

  deleteDocument(email: string, id: number): Promise<void> {
    return this._delete(`${this.project(email)}/documents/${id}`)
  }

  addMilestone(email: string, req: MilestoneRequest): Promise<AdminMilestone> {
    return this._post<AdminMilestone>(`${this.project(email)}/milestones`, req)
  }

  updateMilestone(email: string, id: number, req: MilestoneRequest): Promise<AdminMilestone> {
    return this._patch<AdminMilestone>(`${this.project(email)}/milestones/${id}`, req)
  }

  deleteMilestone(email: string, id: number): Promise<void> {
    return this._delete(`${this.project(email)}/milestones/${id}`)
  }

  addDemo(email: string, req: DemoRequest): Promise<AdminDemo> {
    return this._post<AdminDemo>(`${this.project(email)}/demos`, req)
  }

  updateDemo(email: string, id: number, req: DemoRequest): Promise<AdminDemo> {
    return this._patch<AdminDemo>(`${this.project(email)}/demos/${id}`, req)
  }

  deleteDemo(email: string, id: number): Promise<void> {
    return this._delete(`${this.project(email)}/demos/${id}`)
  }

  addPayment(email: string, req: PaymentRequest): Promise<AdminPayment> {
    return this._post<AdminPayment>(`${this.project(email)}/payments`, req)
  }

  updatePayment(email: string, id: number, req: PaymentRequest): Promise<AdminPayment> {
    return this._patch<AdminPayment>(`${this.project(email)}/payments/${id}`, req)
  }

  deletePayment(email: string, id: number): Promise<void> {
    return this._delete(`${this.project(email)}/payments/${id}`)
  }
}
