'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useColorScheme } from '@mui/material/styles'

export type Scheme = 'light' | 'dark'

// The server reads this from a cookie and seeds it here, so theme-dependent UI (the toggle icon)
// renders correctly on first paint — the same way locale is server-known. Falls back to 'light'
// on the first-ever visit (no cookie yet), then the cookie makes every later visit flash-free.
const InitialSchemeContext = createContext<Scheme>('light')
export const useInitialScheme = () => useContext(InitialSchemeContext)

export function InitialSchemeProvider({ value, children }: { value: Scheme; children: ReactNode }) {
  return <InitialSchemeContext.Provider value={value}>{children}</InitialSchemeContext.Provider>
}

// Mirror the resolved scheme into a cookie so the NEXT request is server-correct.
export function SchemeCookieSync() {
  const { mode, systemMode } = useColorScheme()
  const resolved = mode === 'system' ? systemMode : mode
  useEffect(() => {
    if (resolved) document.cookie = `scheme=${resolved};path=/;max-age=31536000;samesite=lax`
  }, [resolved])
  return null
}
