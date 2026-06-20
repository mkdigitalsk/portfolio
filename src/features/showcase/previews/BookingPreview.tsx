'use client'

import Box from '@mui/material/Box'
import { AutoScroll, PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const STAYS = [
  { emoji: '🏖️', name: 'Beach Resort', meta: '★ 4.8 · 5 nights', price: '€120/night' },
  { emoji: '🏔️', name: 'Mountain Lodge', meta: '★ 4.9 · 3 nights', price: '€95/night' },
  { emoji: '🏙️', name: 'City Hotel', meta: '★ 4.6 · 2 nights', price: '€110/night' },
  { emoji: '🏡', name: 'Cozy Cabin', meta: '★ 4.7 · 4 nights', price: '€80/night' },
  { emoji: '✈️', name: 'Flight to Rome', meta: '★ 4.5 · round trip', price: '€140' },
  { emoji: '🚗', name: 'Car rental', meta: '★ 4.4 · per day', price: '€35' },
]

export function BookingPreview({ accent }: PreviewProps) {
  return (
    <PreviewScreen>
      {/* search */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.25,
            py: 0.75,
            borderRadius: 2,
            bgcolor: 'action.hover',
            fontSize: 11,
            color: 'text.secondary',
          }}
        >
          <Box component="span" sx={{ fontSize: 12 }}>
            🔍
          </Box>
          Where to? · Jun 20–25
        </Box>
      </Box>

      {/* signature: instant booking */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${accent}1A` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ fontSize: 11, fontWeight: 700, color: 'text.primary' }}>Instant booking · free cancellation</Box>
            <Box sx={{ fontSize: 10, fontWeight: 800, color: accent, flexShrink: 0, ml: 0.75 }}>Available</Box>
          </Box>
        </Box>
      </Box>

      {/* scrolling results */}
      <AutoScroll>
        {STAYS.map((s) => (
          <Box
            key={s.name}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75 }}
          >
            <Thumb emoji={s.emoji} bg={`${accent}1A`} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.name}
              </Box>
              <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{s.meta}</Box>
            </Box>
            <Box sx={{ fontSize: 11.5, fontWeight: 800, color: accent }}>{s.price}</Box>
          </Box>
        ))}
      </AutoScroll>
    </PreviewScreen>
  )
}
