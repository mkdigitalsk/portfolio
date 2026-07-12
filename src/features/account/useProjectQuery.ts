'use client'

import { useQuery } from '@tanstack/react-query'
import { clientService } from '@/shared/services'

// retry:false — a 404 (no project yet) is an expected empty state, not a transient failure.
export function useProjectQuery() {
  return useQuery({ queryKey: ['client', 'project'], queryFn: clientService.getProject, retry: false })
}
