'use client'

import Box from '@mui/material/Box'
import { AutoScroll, PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const DISHES = [
  { emoji: '🍕', name: 'Margherita Pizza', meta: '★ 4.8 · 25 min', price: '€9.50' },
  { emoji: '🍔', name: 'Classic Burger', meta: '★ 4.6 · 20 min', price: '€7.90' },
  { emoji: '🍜', name: 'Ramen Bowl', meta: '★ 4.9 · 30 min', price: '€11.00' },
  { emoji: '🥗', name: 'Caesar Salad', meta: '★ 4.7 · 15 min', price: '€6.50' },
  { emoji: '🍣', name: 'Sushi Set', meta: '★ 4.9 · 35 min', price: '€14.00' },
  { emoji: '🌮', name: 'Street Tacos', meta: '★ 4.5 · 18 min', price: '€8.20' },
]

export function FoodPreview({ accent }: PreviewProps) {
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
          Restaurants near you
        </Box>
      </Box>

      {/* signature: live order tracking */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${accent}1A` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Box sx={{ fontSize: 11, fontWeight: 700, color: 'text.primary' }}>Order on the way</Box>
            <Box sx={{ fontSize: 11, fontWeight: 800, color: accent }}>12 min</Box>
          </Box>
          <Box sx={{ height: 4, borderRadius: 2, bgcolor: 'action.selected', overflow: 'hidden' }}>
            <Box sx={{ width: '62%', height: 1, borderRadius: 2, bgcolor: accent }} />
          </Box>
        </Box>
      </Box>

      {/* scrolling dishes */}
      <AutoScroll>
        {DISHES.map((d) => (
          <Box
            key={d.name}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75 }}
          >
            <Thumb emoji={d.emoji} bg={`${accent}1A`} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {d.name}
              </Box>
              <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{d.meta}</Box>
            </Box>
            <Box sx={{ fontSize: 11.5, fontWeight: 800, color: accent }}>{d.price}</Box>
          </Box>
        ))}
      </AutoScroll>
    </PreviewScreen>
  )
}
