'use client'

import Box from '@mui/material/Box'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'

// Live HH:MM clock for the status bar — empty on the server / first render so it never
// mismatches during hydration, then filled in (and kept fresh) on the client.
function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const d = new Date()
      setTime(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 20000)
    return () => clearInterval(id)
  }, [])
  return time
}

// Shared building blocks for the app-screen previews. Every PreviewX is a self-contained
// animated "app screen" that fills its container (the card's reveal layer or the test
// page) and takes a single `accent` colour. Keep them theme-aware (use MUI palette
// tokens for surfaces/text; use `accent` only for the brand highlight).

export interface PreviewProps {
  accent: string
  // ms after the card is revealed before the in-screen action starts — per card type, so the
  // action begins right after that card's own open/reveal finishes. See previewTiming.ts.
  startDelay?: number
}

// A phone-style app screen: subtle status bar on top, content below, clipped + rounded.
export function PreviewScreen({ children }: { children: ReactNode }) {
  const time = useClock()
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.5,
          pt: 1,
          pb: 0.5,
          flexShrink: 0,
        }}
      >
        <Box sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', minWidth: 24 }}>{time}</Box>
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
          {[5, 7, 9].map((h) => (
            <Box key={h} sx={{ width: 3, height: h, borderRadius: 0.5, bgcolor: 'text.disabled' }} />
          ))}
          <Box
            sx={{
              ml: 0.25,
              width: 14,
              height: 8,
              borderRadius: 0.5,
              border: '1px solid',
              borderColor: 'text.disabled',
            }}
          />
        </Box>
      </Box>
      {children}
    </Box>
  )
}

// A column that loops its content upward forever (seamless because the children are
// duplicated). Pauses to a static layout when the user prefers reduced motion.
export function AutoScroll({ children, duration = 14 }: { children: ReactNode; duration?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <Box sx={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
      <motion.div
        animate={reduceMotion ? undefined : { y: ['0%', '-50%'] }}
        transition={reduceMotion ? undefined : { duration, repeat: Infinity, ease: 'linear' }}
      >
        {children}
        {!reduceMotion && children}
      </motion.div>
    </Box>
  )
}

// A small rounded thumbnail holding an emoji (no image assets needed).
export function Thumb({ emoji, bg }: { emoji: string; bg: string }) {
  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: 1.5,
        display: 'grid',
        placeItems: 'center',
        fontSize: 18,
        flexShrink: 0,
        bgcolor: bg,
      }}
    >
      {emoji}
    </Box>
  )
}
