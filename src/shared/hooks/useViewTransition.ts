'use client'

import { useCallback } from 'react'
import { flushSync } from 'react-dom'

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => unknown
}

/**
 * Runs a DOM-mutating update inside the browser's View Transition (smooth
 * crossfade of the whole page). Falls back to an instant update when the API is
 * unavailable. `flushSync` ensures React commits synchronously so the snapshot
 * captures the new state.
 */
export function useViewTransition() {
  return useCallback((update: () => void) => {
    const doc = typeof document === 'undefined' ? undefined : (document as DocumentWithViewTransition)
    if (doc?.startViewTransition) {
      doc.startViewTransition(() => flushSync(update))
    } else {
      update()
    }
  }, [])
}
