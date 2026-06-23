'use client'

import { useSyncExternalStore } from 'react'

// Input-capability detection — NOT screen width. The question is "can the primary pointer hover?"
// `(hover: hover)` = mouse-like → hover interactions; `(hover: none)` = touch → tap interactions.
// DIP: components depend on this intent ("can hover?"), never on the platform / raw matchMedia.
// SSR snapshot = true (desktop-first) so the common case has no hydration flash.
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
