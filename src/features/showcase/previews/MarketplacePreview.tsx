'use client'

import Box from '@mui/material/Box'
import { AutoScroll, PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const CATEGORIES = ['All', 'Electronics', 'Home', 'Hobby']

const LISTINGS = [
  { emoji: '📷', name: 'Camera', meta: '★ 4.9 seller · 💬 chat', price: '€240' },
  { emoji: '🚲', name: 'Bike', meta: '★ 4.7 seller · 💬 chat', price: '€180' },
  { emoji: '🪑', name: 'Designer Chair', meta: '★ 4.8 seller · 💬 chat', price: '€60' },
  { emoji: '🎸', name: 'Guitar', meta: '★ 5.0 seller · 💬 chat', price: '€150' },
  { emoji: '📚', name: 'Book bundle', meta: '★ 4.6 seller · 💬 chat', price: '€25' },
  { emoji: '🖼️', name: 'Art print', meta: '★ 4.9 seller · 💬 chat', price: '€40' },
]

export function MarketplacePreview({ accent }: PreviewProps) {
  return (
    <PreviewScreen>
      {/* header: category pills + search */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.5, flex: 1, minWidth: 0, overflow: 'hidden' }}>
          {CATEGORIES.map((cat, i) => (
            <Box
              key={cat}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 2,
                fontSize: 10,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                bgcolor: i === 0 ? `${accent}1A` : 'action.hover',
                color: i === 0 ? accent : 'text.secondary',
              }}
            >
              {cat}
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: 2,
            display: 'grid',
            placeItems: 'center',
            fontSize: 12,
            flexShrink: 0,
            bgcolor: 'action.hover',
            color: 'text.secondary',
          }}
        >
          🔍
        </Box>
      </Box>

      {/* signature: trust banner */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            p: 1,
            borderRadius: 2,
            bgcolor: `${accent}1A`,
          }}
        >
          <Box component="span" sx={{ fontSize: 13 }}>
            🔒
          </Box>
          <Box sx={{ fontSize: 11, fontWeight: 800, color: accent }}>Secure escrow</Box>
          <Box sx={{ fontSize: 10.5, fontWeight: 600, color: 'text.secondary' }}>· buyer protection</Box>
        </Box>
      </Box>

      {/* scrolling listings */}
      <AutoScroll>
        {LISTINGS.map((l) => (
          <Box
            key={l.name}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75 }}
          >
            <Thumb emoji={l.emoji} bg={`${accent}1A`} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {l.name}
              </Box>
              <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{l.meta}</Box>
            </Box>
            <Box sx={{ fontSize: 11.5, fontWeight: 800, color: accent }}>{l.price}</Box>
          </Box>
        ))}
      </AutoScroll>
    </PreviewScreen>
  )
}
