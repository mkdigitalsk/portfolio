import type { ClientEngagement } from '@/shared/types'
import { BaseApiService } from './BaseApiService'
import { API_PREFIX } from './apiVersion'

// The logged-in client's own resources — scoped server-side to the caller's identity (JWT), never a param.
export class ClientApi extends BaseApiService {
  protected readonly baseRoute = `${API_PREFIX}/me`

  getEngagement(): Promise<ClientEngagement> {
    return this._get<ClientEngagement>(`${this.baseRoute}/engagement`)
  }
}
