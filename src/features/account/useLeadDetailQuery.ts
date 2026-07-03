'use client'

import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/shared/services'

export function useLeadDetailQuery(email: string) {
  return useQuery({ queryKey: ['admin', 'lead', email], queryFn: () => adminService.getLead(email) })
}
