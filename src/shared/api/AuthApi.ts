import type { AuthResponse, LoginRequest } from '@/shared/types'
import { BaseApiService } from './BaseApiService'
import { API_PREFIX } from './apiVersion'

export class AuthApi extends BaseApiService {
  protected readonly baseRoute = `${API_PREFIX}/auth`

  login(credentials: LoginRequest): Promise<AuthResponse> {
    return this._post<AuthResponse>(`${this.baseRoute}/login`, credentials)
  }

  me(): Promise<AuthResponse> {
    return this._get<AuthResponse>(`${this.baseRoute}/me`)
  }
}
