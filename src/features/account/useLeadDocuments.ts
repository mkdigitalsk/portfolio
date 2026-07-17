'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UploadDocumentRequest } from '@/shared/types'
import { adminService } from '@/shared/services'

const key = (email: string) => ['admin', 'documents', email]

export function useLeadDocumentsQuery(email: string) {
  return useQuery({ queryKey: key(email), queryFn: () => adminService.getDocuments(email) })
}

export function useUploadLeadDocumentMutation(email: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: UploadDocumentRequest) => adminService.uploadClientDocument(email, req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key(email) })
      // The project view reads the same client-scoped rows — keep it in sync.
      queryClient.invalidateQueries({ queryKey: ['admin', 'project', email] })
    },
  })
}
