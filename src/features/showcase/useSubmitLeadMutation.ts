'use client'

import { useMutation } from '@tanstack/react-query'
import { leadService } from '@/shared/services'

export function useSubmitLeadMutation() {
  return useMutation({ mutationFn: leadService.submit })
}
