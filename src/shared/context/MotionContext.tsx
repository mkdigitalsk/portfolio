'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'motion-enabled'

interface MotionContextValue {
  motionEnabled: boolean
  toggle: () => void
}

const MotionContext = createContext<MotionContextValue>({ motionEnabled: true, toggle: () => undefined })

export function MotionProvider({ children }: { children: ReactNode }) {
  const [motionEnabled, setMotionEnabled] = useState(true)

  // Restore the saved choice, otherwise follow the OS reduced-motion preference.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setMotionEnabled(stored === 'true')
    } else if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMotionEnabled(false)
    }
  }, [])

  const toggle = () => {
    setMotionEnabled((prev) => {
      const next = !prev
      window.localStorage.setItem(STORAGE_KEY, String(next))
      return next
    })
  }

  return <MotionContext.Provider value={{ motionEnabled, toggle }}>{children}</MotionContext.Provider>
}

export function useMotion(): MotionContextValue {
  return useContext(MotionContext)
}
