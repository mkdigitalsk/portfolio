'use client'

import { useQuery } from '@tanstack/react-query'
import { adminService } from '@/shared/services'

export function useClientsQuery() {
  return useQuery({ queryKey: ['admin', 'clients'], queryFn: adminService.getClients })
}
