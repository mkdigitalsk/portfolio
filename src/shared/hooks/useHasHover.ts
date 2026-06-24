'use client'

import { useSyncExternalStore } from 'react'

// Hover-capability, not screen width — callers branch on intent, never the platform.
const HOVER_QUERY = '(hover: hover)'

function subscribe(callback: () => void) {
  const mql = window.matchMedia(HOVER_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

export function useHasHover() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => true,
  )
}
