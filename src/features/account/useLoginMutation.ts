'use client'

import { useMutation } from '@tanstack/react-query'
import { authService } from '@/shared/services'

export function useLoginMutation() {
  return useMutation({ mutationFn: authService.login })
}
