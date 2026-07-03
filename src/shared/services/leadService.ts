import type { LeadDraft } from '@/shared/types'
import { leadApi } from '../api'

export const leadService = {
  submit: (draft: LeadDraft) => leadApi.submit(draft),
}
