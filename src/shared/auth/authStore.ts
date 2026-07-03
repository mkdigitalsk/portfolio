import { jwtDecode } from 'jwt-decode'
import type { AccountUser, AuthResponse, Role } from '@/shared/types'

const TOKEN_KEY = 'mk_account_token'
const USER_KEY = 'mk_account_user'

interface AuthState {
  token: string | null
  user: AccountUser | null
}

const EMPTY: AuthState = { token: null, user: null }

// Cached snapshot so useSyncExternalStore gets a stable reference until localStorage changes.
let snapshot: AuthState = EMPTY
let lastToken: string | null = null
let lastUserRaw: string | null = null

// Role lives in the JWT claim; decoding here is only for UI branching — the server enforces it
// on every protected endpoint, so a forged client-side role gets 403.
function decodeRole(token: string): Role {
  try {
    return jwtDecode<{ role?: string }>(token).role === 'ADMIN' ? 'ADMIN' : 'CLIENT'
  } catch {
    return 'CLIENT'
  }
}

const listeners = new Set<() => void>()
function emit() {
  listeners.forEach((l) => l())
}

export const authStore = {
  subscribe(cb: () => void) {
    listeners.add(cb)
    window.addEventListener('storage', cb) // cross-tab sign in/out
    return () => {
      listeners.delete(cb)
      window.removeEventListener('storage', cb)
    }
  },

  getSnapshot(): AuthState {
    const token = localStorage.getItem(TOKEN_KEY)
    const userRaw = localStorage.getItem(USER_KEY)
    if (token !== lastToken || userRaw !== lastUserRaw) {
      lastToken = token
      lastUserRaw = userRaw
      let user: AccountUser | null = null
      if (userRaw) {
        try {
          user = JSON.parse(userRaw) as AccountUser
        } catch {
          user = null
        }
      }
      snapshot = { token, user }
    }
    return snapshot
  },

  getServerSnapshot(): AuthState {
    return EMPTY
  },

  getToken(): string | null {
    return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY)
  },

  persist(data: AuthResponse) {
    const account: AccountUser = { email: data.user.email, name: data.user.name, role: decodeRole(data.token) }
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(account))
    emit()
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    emit()
  },
}
