'use client'

import { useQuery } from '@tanstack/react-query'
import { clientService } from '@/shared/services'

// retry:false — a 404 (no engagement yet) is an expected empty state, not a transient failure.
export function useEngagementQuery() {
  return useQuery({ queryKey: ['client', 'engagement'], queryFn: clientService.getEngagement, retry: false })
}
