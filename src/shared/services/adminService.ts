import type {
  DemoRequest,
  DocumentRequest,
  LeadStatus,
  MilestoneRequest,
  PaymentRequest,
  StartProjectRequest,
  UpdateLinksRequest,
  UploadDocumentRequest,
  UpdateProjectRequest,
} from '@/shared/types'
import { adminApi } from '../api'

export const adminService = {
  // leads (sales)
  getLeads: () => adminApi.getLeads(),
  getLead: (email: string) => adminApi.getLead(email),
  updateStatus: (email: string, status: LeadStatus) => adminApi.updateStatus(email, status),

  // clients (won leads + delivery)
  getClients: () => adminApi.getClients(),

  inviteClient: (email: string) => adminApi.inviteClient(email),

  // project (delivery)
  getProject: (email: string) => adminApi.getProject(email),
  getClientPreview: (email: string) => adminApi.getClientPreview(email),
  startProject: (email: string, req: StartProjectRequest) => adminApi.startProject(email, req),
  updateProject: (email: string, req: UpdateProjectRequest) => adminApi.updateProject(email, req),
  updateLinks: (email: string, req: UpdateLinksRequest) => adminApi.updateLinks(email, req),
  completeProject: (email: string) => adminApi.completeProject(email),
  archiveProject: (email: string) => adminApi.archiveProject(email),
  unarchiveProject: (email: string) => adminApi.unarchiveProject(email),
  addDocument: (email: string, req: DocumentRequest) => adminApi.addDocument(email, req),
  uploadDocument: (email: string, req: UploadDocumentRequest) => adminApi.uploadDocument(email, req),
  deleteDocument: (email: string, id: number) => adminApi.deleteDocument(email, id),
  addMilestone: (email: string, req: MilestoneRequest) => adminApi.addMilestone(email, req),
  updateMilestone: (email: string, id: number, req: MilestoneRequest) => adminApi.updateMilestone(email, id, req),
  deleteMilestone: (email: string, id: number) => adminApi.deleteMilestone(email, id),
  addDemo: (email: string, req: DemoRequest) => adminApi.addDemo(email, req),
  updateDemo: (email: string, id: number, req: DemoRequest) => adminApi.updateDemo(email, id, req),
  deleteDemo: (email: string, id: number) => adminApi.deleteDemo(email, id),
  addPayment: (email: string, req: PaymentRequest) => adminApi.addPayment(email, req),
  updatePayment: (email: string, id: number, req: PaymentRequest) => adminApi.updatePayment(email, id, req),
  deletePayment: (email: string, id: number) => adminApi.deletePayment(email, id),
}
