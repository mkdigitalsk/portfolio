import type { LeadDraft } from '@/shared/types'
import { BaseApiService } from './BaseApiService'
import { API_PREFIX } from './apiVersion'

export class LeadApi extends BaseApiService {
  protected readonly baseRoute = `${API_PREFIX}/leads`

  submit(draft: LeadDraft): Promise<{ success: boolean }> {
    return this._post<{ success: boolean }>(this.baseRoute, draft)
  }
}
