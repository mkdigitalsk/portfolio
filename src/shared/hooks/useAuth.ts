'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { authStore } from '@/shared/auth/authStore'
import { authService } from '@/shared/services'

let revalidated = false

export function useAuth() {
  const { token, user } = useSyncExternalStore(authStore.subscribe, authStore.getSnapshot, authStore.getServerSnapshot)

  useEffect(() => {
    if (revalidated || !authStore.getToken()) return
    revalidated = true
    // 200 refreshes token + role; 401 is cleared by the response interceptor; a network error keeps the session.
    authService.me().catch(() => {})
  }, [])

  return { token, user, logout: authService.logout }
}
