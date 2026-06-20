'use client'

import Box from '@mui/material/Box'
import { motion, useReducedMotion } from 'motion/react'
import { PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const BARS = [
  { day: 'M', h: 0.55 },
  { day: 'T', h: 0.78 },
  { day: 'W', h: 0.42 },
  { day: 'T', h: 0.9 },
  { day: 'F', h: 0.6 },
  { day: 'S', h: 0.35 },
  { day: 'S', h: 0.82, today: true },
]

const WORKOUTS = [
  { emoji: '🏃', name: 'Morning Run', meta: '32 min · 410 kcal' },
  { emoji: '🚴', name: 'Cycling', meta: '48 min · 520 kcal' },
]

const CHART_H = 70

export function HealthChart({ accent }: PreviewProps) {
  const reduce = useReducedMotion() ?? false

  return (
    <PreviewScreen>
      {/* header */}
      <Box sx={{ px: 1.5, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ fontSize: 12, fontWeight: 800, color: 'text.primary' }}>This week</Box>
        <Box sx={{ fontSize: 10, fontWeight: 700, color: accent }}>🔥 5-day streak</Box>
      </Box>

      {/* value label */}
      <Box sx={{ px: 1.5, pb: 0.5 }}>
        <Box sx={{ fontSize: 16, fontWeight: 800, color: accent, lineHeight: 1 }}>8,240</Box>
        <Box sx={{ fontSize: 10, color: 'text.secondary' }}>steps today</Box>
      </Box>

      {/* weekly bar chart */}
      <Box
        sx={{
          px: 1.5,
          pb: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 0.75,
          height: CHART_H + 16,
        }}
      >
        {BARS.map((b, i) => (
          <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Box
              sx={{
                width: '100%',
                height: CHART_H,
                borderRadius: 1,
                bgcolor: 'action.selected',
                display: 'flex',
                alignItems: 'flex-end',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  width: '100%',
                  borderRadius: 4,
                  background: accent,
                  opacity: b.today ? 1 : 0.5,
                  height: reduce ? `${b.h * 100}%` : undefined,
                }}
                initial={reduce ? undefined : { height: 0 }}
                animate={
                  reduce
                    ? undefined
                    : { height: [0, `${b.h * 100}%`, `${b.h * 100}%`, 0] }
                }
                transition={
                  reduce
                    ? undefined
                    : {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        times: [0, 0.45, 0.85, 1],
                        delay: i * 0.06,
                      }
                }
              />
            </Box>
            <Box sx={{ fontSize: 10, color: b.today ? accent : 'text.secondary', fontWeight: b.today ? 700 : 400 }}>
              {b.day}
            </Box>
          </Box>
        ))}
      </Box>

      {/* workout rows */}
      <Box sx={{ flex: 1 }}>
        {WORKOUTS.map((w) => (
          <Box key={w.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.5 }}>
            <Thumb emoji={w.emoji} bg={`${accent}1A`} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary' }}>{w.name}</Box>
              <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{w.meta}</Box>
            </Box>
          </Box>
        ))}
      </Box>
    </PreviewScreen>
  )
}
