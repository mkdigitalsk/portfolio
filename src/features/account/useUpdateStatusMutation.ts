'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AdminLead, LeadDetail, LeadStatus } from '@/shared/types'
import { adminService } from '@/shared/services'

export function useUpdateStatusMutation(email: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (status: LeadStatus) => adminService.updateStatus(email, status),
    onSuccess: (updated: AdminLead) => {
      queryClient.setQueryData<LeadDetail>(['admin', 'lead', email], (old) => (old ? { ...old, lead: updated } : old))
      queryClient.invalidateQueries({ queryKey: ['admin', 'leads'] })
    },
  })
}
