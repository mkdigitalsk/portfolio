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

export function EcommerceGrid({ accent }: PreviewProps) {
  const reduceMotion = useReducedMotion()
  const [count, setCount] = useState(2)
  const [pulse, setPulse] = useState(-1)

  useEffect(() => {
    if (reduceMotion) return
    let tile = 0
    const id = setInterval(() => {
      setPulse(tile % PRODUCTS.length)
      setCount((c) => c + 1)
      tile += 1
      setTimeout(() => setPulse(-1), 500)
    }, 2000)
    return () => clearInterval(id)
  }, [reduceMotion])

  return (
    <PreviewScreen>
      {/* header: search + cart */}
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
              overflow: 'hidden',
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={reduceMotion ? false : { y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduceMotion ? undefined : { y: 10, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </Box>
        </Box>
      </Box>

      {/* 2-column grid */}
      <Box
        sx={{
          flex: 1,
          px: 1.5,
          pb: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 1,
          alignContent: 'start',
        }}
      >
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: reduceMotion ? 0 : i * 0.08 }}
          >
            <Box
              sx={{
                height: '100%',
                p: 1,
                borderRadius: 2,
                bgcolor: 'action.hover',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.25,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 22,
                  bgcolor: `${accent}1A`,
                  mb: 0.25,
                }}
              >
                {p.emoji}
              </Box>
              <Box sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.primary', textAlign: 'center' }}>
                {p.name}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mt: 0.25 }}>
                <Box sx={{ fontSize: 11, fontWeight: 800, color: accent }}>{p.price}</Box>
                <motion.div animate={pulse === i && !reduceMotion ? { scale: [1, 1.25, 1] } : { scale: 1 }} transition={{ duration: 0.4 }}>
                  <Box
                    sx={{
                      px: 1,
                      py: 0.25,
                      borderRadius: 4,
                      bgcolor: accent,
                      color: 'common.white',
                      fontSize: 9.5,
                      fontWeight: 700,
                    }}
                  >
                    Add
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </PreviewScreen>
  )
}
