'use client'

import Box from '@mui/material/Box'
import { AutoScroll, PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const STATS = [
  { value: '8,240', label: 'Steps' },
  { value: '540', label: 'kcal' },
  { value: '47', label: 'min Active' },
]

const WORKOUTS = [
  { emoji: '🏃', name: 'Morning Run', meta: '30 min · 320 kcal' },
  { emoji: '🧘', name: 'Yoga Flow', meta: '20 min · 110 kcal' },
  { emoji: '🚴', name: 'Cycling', meta: '45 min · 480 kcal' },
  { emoji: '💪', name: 'Strength', meta: '25 min · 240 kcal' },
  { emoji: '🏊', name: 'Swimming', meta: '40 min · 400 kcal' },
]

export function HealthPreview({ accent }: PreviewProps) {
  return (
    <PreviewScreen>
      {/* header */}
      <Box sx={{ px: 1.5, pb: 1, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Box sx={{ fontSize: 12, fontWeight: 800, color: 'text.primary' }}>Today</Box>
        <Box sx={{ fontSize: 10, color: 'text.secondary' }}>Fri, 20 Jun</Box>
      </Box>

      {/* signature: progress dashboard */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.75, mb: 1 }}>
          {STATS.map((s) => (
            <Box
              key={s.label}
              sx={{
                flex: 1,
                minWidth: 0,
                p: 0.75,
                borderRadius: 2,
                bgcolor: 'action.hover',
                textAlign: 'center',
              }}
            >
              <Box sx={{ fontSize: 12, fontWeight: 800, color: accent }}>{s.value}</Box>
              <Box sx={{ fontSize: 10, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.label}
              </Box>
            </Box>
          ))}
        </Box>

        {/* CTA */}
        <Box
          sx={{
            py: 0.75,
            borderRadius: 2,
            bgcolor: accent,
            color: '#fff',
            textAlign: 'center',
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          Start workout
        </Box>
      </Box>

      {/* scrolling workouts */}
      <AutoScroll>
        {WORKOUTS.map((w) => (
          <Box
            key={w.name}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75 }}
          >
            <Thumb emoji={w.emoji} bg={`${accent}1A`} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {w.name}
              </Box>
              <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{w.meta}</Box>
            </Box>
          </Box>
        ))}
      </AutoScroll>
    </PreviewScreen>
  )
}
