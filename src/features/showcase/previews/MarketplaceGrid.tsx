'use client'

import Box from '@mui/material/Box'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

const ITEMS = [
  { emoji: '📷', name: 'Camera', seller: '★ 4.9', price: '€240' },
  { emoji: '🚲', name: 'Bike', seller: '★ 4.8', price: '€180' },
  { emoji: '🪑', name: 'Chair', seller: '★ 4.7', price: '€60' },
  { emoji: '🎸', name: 'Guitar', seller: '★ 5.0', price: '€150' },
  { emoji: '📚', name: 'Books', seller: '★ 4.6', price: '€25' },
  { emoji: '🖼️', name: 'Art', seller: '★ 4.9', price: '€40' },
]

export function MarketplaceGrid({ accent }: PreviewProps) {
  const reduceMotion = useReducedMotion()
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setCycle((c) => c + 1), 3000)
    return () => clearInterval(id)
  }, [reduceMotion])

  return (
    <PreviewScreen>
      {/* search */}
      <Box sx={{ px: 1.5, pb: 0.75 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            px: 1.25,
            py: 0.6,
            borderRadius: 2,
            bgcolor: 'action.hover',
            fontSize: 11,
            color: 'text.secondary',
          }}
        >
          <Box component="span" sx={{ fontSize: 12 }}>
            🔍
          </Box>
          Search the marketplace
        </Box>
      </Box>

      {/* trust banner */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            py: 0.7,
            borderRadius: 2,
            bgcolor: `${accent}1A`,
            fontSize: 10.5,
            fontWeight: 700,
            color: accent,
          }}
        >
          <Box component="span" sx={{ fontSize: 12 }}>
            🔒
          </Box>
          Secure escrow · buyer protection
        </Box>
      </Box>

      {/* discovery grid */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden',
          px: 1.5,
          pb: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          alignContent: 'start',
        }}
      >
        {ITEMS.map((item, i) => (
          <motion.div
            key={`${cycle}-${item.name}`}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? undefined : { duration: 0.4, delay: i * 0.12, ease: 'easeOut' }}
          >
            <Box
              sx={{
                p: 0.9,
                borderRadius: 2,
                bgcolor: 'action.hover',
                display: 'flex',
                flexDirection: 'column',
                gap: 0.4,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box component="span" sx={{ fontSize: 18, lineHeight: 1 }}>
                  {item.emoji}
                </Box>
                <Box component="span" sx={{ fontSize: 12 }}>
                  💬
                </Box>
              </Box>
              <Box sx={{ fontSize: 11, fontWeight: 700, color: 'text.primary' }}>{item.name}</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{item.seller} seller</Box>
                <Box sx={{ fontSize: 11, fontWeight: 800, color: accent }}>{item.price}</Box>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </PreviewScreen>
  )
}
