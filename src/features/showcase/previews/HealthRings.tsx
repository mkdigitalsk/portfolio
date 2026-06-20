'use client'

import Box from '@mui/material/Box'
import { motion, useReducedMotion } from 'motion/react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

const RINGS = [
  { label: 'Steps', emoji: '👟', value: '8,240', target: 0.82 },
  { label: 'Calories', emoji: '🔥', value: '540', target: 0.64 },
  { label: 'Active', emoji: '⚡', value: '46 min', target: 0.71 },
]

const SIZE = 56
const STROKE = 6
const R = (SIZE - STROKE) / 2
const C = 2 * Math.PI * R

function Ring({ accent, target, reduce }: { accent: string; target: number; reduce: boolean }) {
  return (
    <Box sx={{ position: 'relative', width: SIZE, height: SIZE }}>
      <Box
        component="svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        sx={{ width: SIZE, height: SIZE, transform: 'rotate(-90deg)' }}
      >
        <Box
          component="circle"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          strokeWidth={STROKE}
          sx={{ stroke: 'action.selected' }}
        />
        <motion.circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={accent}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          initial={reduce ? undefined : { strokeDashoffset: C }}
          animate={
            reduce
              ? undefined
              : { strokeDashoffset: [C, C * (1 - target), C * (1 - target), C] }
          }
          transition={
            reduce
              ? undefined
              : { duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 0.85, 1] }
          }
          strokeDashoffset={reduce ? C * (1 - target) : undefined}
        />
      </Box>
    </Box>
  )
}

export function HealthRings({ accent }: PreviewProps) {
  const reduce = useReducedMotion() ?? false

  return (
    <PreviewScreen>
      {/* header */}
      <Box sx={{ px: 1.5, pb: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Box sx={{ fontSize: 12, fontWeight: 800, color: 'text.primary' }}>Today</Box>
        <Box sx={{ fontSize: 10, color: 'text.secondary' }}>Mon, Jun 16</Box>
      </Box>

      {/* three progress rings */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around', px: 1 }}>
        {RINGS.map((r) => (
          <Box key={r.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ position: 'relative' }}>
              <Ring accent={accent} target={r.target} reduce={reduce} />
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 16,
                }}
              >
                {r.emoji}
              </Box>
            </Box>
            <Box sx={{ fontSize: 11.5, fontWeight: 800, color: accent }}>{r.value}</Box>
            <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{r.label}</Box>
          </Box>
        ))}
      </Box>

      {/* CTA */}
      <Box sx={{ px: 1.5, pb: 1.5 }}>
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.03, 1] }}
          transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Box
            sx={{
              py: 1,
              borderRadius: 2,
              bgcolor: accent,
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              textAlign: 'center',
              letterSpacing: 0.3,
            }}
          >
            Start workout
          </Box>
        </motion.div>
      </Box>
    </PreviewScreen>
  )
}
