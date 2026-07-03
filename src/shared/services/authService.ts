import type { LoginRequest } from '@/shared/types'
import { authApi } from '../api'
import { authStore } from '../auth/authStore'

export const authService = {
  login: async (credentials: LoginRequest) => {
    const res = await authApi.login(credentials)
    authStore.persist(res)
    return res
  },
  me: async () => {
    const res = await authApi.me()
    authStore.persist(res)
    return res
  },
  logout: () => authStore.clear(),
}
