'use client'

import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/shared/services'

export function useLeadsQuery() {
  return useQuery({ queryKey: ['admin', 'leads'], queryFn: adminService.getLeads })
}
