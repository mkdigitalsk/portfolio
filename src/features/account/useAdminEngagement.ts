'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/shared/services'
import type { DemoRequest, MilestoneRequest } from '@/shared/types'

const key = (email: string) => ['admin', 'engagement', email]

export function useAdminEngagementQuery(email: string) {
  return useQuery({ queryKey: key(email), queryFn: () => adminService.getEngagement(email) })
}

// Read-only "view as client" — retry:false so a 404 (client has no engagement yet) is an empty state.
export function useClientPreviewQuery(email: string) {
  return useQuery({
    queryKey: ['admin', 'client-preview', email],
    queryFn: () => adminService.getClientPreview(email),
    retry: false,
  })
}

function useInvalidate(email: string) {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: key(email) })
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
