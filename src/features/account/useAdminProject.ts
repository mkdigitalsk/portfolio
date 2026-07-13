'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/shared/services'
import type {
  DemoRequest,
  DocumentRequest,
  MilestoneRequest,
  PaymentRequest,
  StartProjectRequest,
  UpdateProjectRequest,
} from '@/shared/types'

const key = (email: string) => ['admin', 'project', email]

// retry:false — 404 (client has no project yet) drives the "Start project" empty state, not a retry.
export function useAdminProjectQuery(email: string) {
  return useQuery({ queryKey: key(email), queryFn: () => adminService.getProject(email), retry: false })
}

export function useClientPreviewQuery(email: string) {
  return useQuery({
    queryKey: ['admin', 'project-preview', email],
    queryFn: () => adminService.getClientPreview(email),
    retry: false,
  })
}

function useInvalidate(email: string) {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: key(email) })
    qc.invalidateQueries({ queryKey: ['admin', 'project-preview', email] })
  }
}

export function useStartProject(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (req: StartProjectRequest) => adminService.startProject(email, req), onSuccess: invalidate })
}

export function useUpdateProject(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (req: UpdateProjectRequest) => adminService.updateProject(email, req), onSuccess: invalidate })
}

export function useCompleteProject(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: () => adminService.completeProject(email), onSuccess: invalidate })
}

export function useArchiveProject(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: () => adminService.archiveProject(email), onSuccess: invalidate })
}

export function useAddDocument(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (req: DocumentRequest) => adminService.addDocument(email, req), onSuccess: invalidate })
}

export function useDeleteDocument(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (id: number) => adminService.deleteDocument(email, id), onSuccess: invalidate })
}

export function useAddMilestone(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (req: MilestoneRequest) => adminService.addMilestone(email, req), onSuccess: invalidate })
}

export function useUpdateMilestone(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({
    mutationFn: (v: { id: number; req: MilestoneRequest }) => adminService.updateMilestone(email, v.id, v.req),
    onSuccess: invalidate,
  })
}

export function useDeleteMilestone(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (id: number) => adminService.deleteMilestone(email, id), onSuccess: invalidate })
}

export function useAddDemo(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (req: DemoRequest) => adminService.addDemo(email, req), onSuccess: invalidate })
}

export function useUpdateDemo(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({
    mutationFn: (v: { id: number; req: DemoRequest }) => adminService.updateDemo(email, v.id, v.req),
    onSuccess: invalidate,
  })
}

export function useDeleteDemo(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (id: number) => adminService.deleteDemo(email, id), onSuccess: invalidate })
}

export function useAddPayment(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (req: PaymentRequest) => adminService.addPayment(email, req), onSuccess: invalidate })
}

export function useUpdatePayment(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({
    mutationFn: (v: { id: number; req: PaymentRequest }) => adminService.updatePayment(email, v.id, v.req),
    onSuccess: invalidate,
  })
}

export function useDeletePayment(email: string) {
  const invalidate = useInvalidate(email)
  return useMutation({ mutationFn: (id: number) => adminService.deletePayment(email, id), onSuccess: invalidate })
}
