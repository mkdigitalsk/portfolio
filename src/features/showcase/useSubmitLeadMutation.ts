'use client'

import { track } from '@vercel/analytics'
import { useMutation } from '@tanstack/react-query'
import { leadService } from '@/shared/services'

export function useSubmitLeadMutation() {
  return useMutation({
    mutationFn: leadService.submit,
    // The conversion event. Keep props PII-free — appType only, never email/name.
    onSuccess: (_data, draft) => track('lead_submitted', { appType: draft.appType }),
  })
}
