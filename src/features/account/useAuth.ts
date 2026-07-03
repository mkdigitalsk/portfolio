'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { jwtDecode } from 'jwt-decode'
import { API_BASE } from '@/shared/api'

const TOKEN_KEY = 'mk_account_token'
const USER_KEY = 'mk_account_user'

export type Role = 'ADMIN' | 'CLIENT'
export interface AccountUser {
  email: string
  name: string
  role: Role
}

interface AuthState {
  token: string | null
  user: AccountUser | null
}

const EMPTY: AuthState = { token: null, user: null }

// Cached snapshot so useSyncExternalStore gets a stable reference until localStorage changes.
let snapshot: AuthState = EMPTY
let lastToken: string | null = null
let lastUserRaw: string | null = null

function readSnapshot(): AuthState {
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
}

const listeners = new Set<() => void>()
function emit() {
  listeners.forEach((l) => l())
}
function subscribe(cb: () => void) {
  listeners.add(cb)
  window.addEventListener('storage', cb) // cross-tab sign in/out
  return () => {
    listeners.delete(cb)
    window.removeEventListener('storage', cb)
  }
}

// Role lives in the JWT claim. Decoding it here is only for UI branching — the server
// enforces the role on every protected endpoint, so a forged client-side role gets 403.
function decodeRole(token: string): Role {
  try {
    return jwtDecode<{ role?: string }>(token).role === 'ADMIN' ? 'ADMIN' : 'CLIENT'
  } catch {
    return 'CLIENT'
  }
}

interface AuthResponse {
  token: string
  user: { email: string; name: string }
}

function persist(data: AuthResponse) {
  const account: AccountUser = { email: data.user.email, name: data.user.name, role: decodeRole(data.token) }
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(USER_KEY, JSON.stringify(account))
  emit()
}

function clear() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  emit()
}

// Once per page load — the stored token may be expired (server JWT lives 24h) or the role may have
// changed. `/auth/me` refreshes both: 200 rotates the token + user, 401 signs out cleanly (→ login form).
// A network/5xx error keeps the cached session — offline must not log you out.
let revalidated = false
async function revalidate() {
  if (revalidated) return
  revalidated = true
  const stored = localStorage.getItem(TOKEN_KEY)
  if (!stored) return
  try {
    const res = await fetch(`${API_BASE}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${stored}` } })
    if (res.status === 401) return clear()
    if (!res.ok) return
    persist((await res.json()) as AuthResponse)
  } catch {
    // offline / transient — keep the cached snapshot
  }
}

export function useAuth() {
  const { token, user } = useSyncExternalStore(subscribe, readSnapshot, () => EMPTY)

  useEffect(() => {
    void revalidate()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error(res.status === 401 ? 'Invalid email or password.' : 'Login failed. Try again.')
    persist((await res.json()) as AuthResponse)
  }, [])

  const logout = useCallback(() => clear(), [])

  return { token, user, login, logout }
}
