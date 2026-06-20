'use client'

import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

const PRODUCTS = [
  { emoji: '👟', name: 'Running Shoes', price: '€89' },
  { emoji: '🎧', name: 'Headphones', price: '€149' },
  { emoji: '⌚', name: 'Smart Watch', price: '€199' },
  { emoji: '🧥', name: 'Jacket', price: '€79' },
]

export function EcommerceCarousel({ accent }: PreviewProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setIndex((i) => (i + 1) % PRODUCTS.length), 2200)
    return () => clearInterval(id)
  }, [reduceMotion])

  const product = PRODUCTS[index]

  return (
    <PreviewScreen>
      {/* header: search pill + cart */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, pb: 1 }}>
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
        <Box sx={{ position: 'relative', fontSize: 16, lineHeight: 1 }}>
          🛒
          <Box
            sx={{
              position: 'absolute',
              top: -4,
              right: -6,
              minWidth: 13,
              height: 13,
              px: 0.25,
              borderRadius: 3,
              bgcolor: accent,
              color: 'common.white',
              fontSize: 9,
              fontWeight: 800,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            3
          </Box>
        </Box>
      </Box>

      {/* hero carousel */}
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden', px: 1.5 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduceMotion ? false : { x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduceMotion ? undefined : { x: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ height: '100%' }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: 3,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 48,
                  bgcolor: `${accent}1A`,
                  mb: 0.5,
                }}
              >
                {product.emoji}
              </Box>
              <Box sx={{ fontSize: 12, fontWeight: 700, color: 'text.primary' }}>{product.name}</Box>
              <Box sx={{ fontSize: 14, fontWeight: 800, color: accent }}>{product.price}</Box>
              <Box
                sx={{
                  mt: 0.5,
                  px: 2,
                  py: 0.5,
                  borderRadius: 5,
                  bgcolor: accent,
                  color: 'common.white',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                Add to cart
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, py: 1 }}>
        {PRODUCTS.map((p, i) => (
          <Box
            key={p.name}
            sx={{
              width: i === index ? 14 : 5,
              height: 5,
              borderRadius: 3,
              bgcolor: i === index ? accent : 'action.selected',
              transition: 'width 0.3s',
            }}
          />
        ))}
      </Box>
    </PreviewScreen>
  )
}
