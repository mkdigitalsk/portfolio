'use client'

import Box from '@mui/material/Box'
import { AutoScroll, PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const PRODUCTS = [
  { emoji: '👟', name: 'Running Shoes', price: '€89.00' },
  { emoji: '🎧', name: 'Headphones', price: '€149.00' },
  { emoji: '⌚', name: 'Smart Watch', price: '€199.00' },
  { emoji: '🧥', name: 'Jacket', price: '€79.00' },
  { emoji: '🕶️', name: 'Sunglasses', price: '€45.00' },
  { emoji: '🎒', name: 'Backpack', price: '€59.00' },
]

export function EcommercePreview({ accent }: PreviewProps) {
  return (
    <PreviewScreen>
      {/* header: search + cart */}
      <Box sx={{ px: 1.5, pb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Box
          sx={{
            flex: 1,
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
          Search products
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            px: 0.75,
            py: 0.75,
            borderRadius: 2,
            bgcolor: 'action.hover',
            fontSize: 11,
            color: 'text.secondary',
          }}
        >
          <Box component="span" sx={{ fontSize: 12 }}>
            🛒
          </Box>
          <Box component="span" sx={{ fontSize: 11, fontWeight: 800, color: accent }}>
            3
          </Box>
        </Box>
      </Box>

      {/* signature: free shipping promo */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: `${accent}1A`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ fontSize: 11, fontWeight: 700, color: 'text.primary' }}>Free shipping over €50</Box>
          <Box
            sx={{
              fontSize: 10,
              fontWeight: 800,
              color: '#fff',
              bgcolor: accent,
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
            }}
          >
            Today only
          </Box>
        </Box>
      </Box>

      {/* scrolling products */}
      <AutoScroll>
        {PRODUCTS.map((p) => (
          <Box key={p.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75 }}>
            <Thumb emoji={p.emoji} bg={`${accent}1A`} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {p.name}
              </Box>
              <Box sx={{ fontSize: 10, color: 'text.secondary' }}>In stock</Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ fontSize: 11.5, fontWeight: 800, color: accent }}>{p.price}</Box>
              <Box
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#fff',
                  bgcolor: accent,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 1,
                }}
              >
                Add
              </Box>
            </Box>
          </Box>
        ))}
      </AutoScroll>
    </PreviewScreen>
  )
}
