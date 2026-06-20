'use client'

import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

const STAYS = [
  { emoji: '🏖️', name: 'Beach Resort', meta: '★ 4.8', price: '€120' },
  { emoji: '🏔️', name: 'Mountain Lodge', meta: '★ 4.9', price: '€95' },
  { emoji: '🏙️', name: 'City Hotel', meta: '★ 4.6', price: '€110' },
  { emoji: '🏡', name: 'Cozy Cabin', meta: '★ 4.7', price: '€80' },
]

export function BookingCarousel({ accent }: PreviewProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setIndex((i) => (i + 1) % STAYS.length), 2600)
    return () => clearInterval(id)
  }, [reduceMotion])

  const stay = STAYS[index]

  return (
    <PreviewScreen>
      {/* heading */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box sx={{ fontSize: 11, color: 'text.secondary' }}>Stay somewhere lovely</Box>
        <Box sx={{ fontSize: 12, fontWeight: 800, color: 'text.primary' }}>Featured destinations</Box>
      </Box>

      {/* carousel slide */}
      <Box sx={{ flex: 1, position: 'relative', px: 1.5 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -18 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, padding: '0 12px' }}
          >
            <Box
              sx={{
                height: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                bgcolor: 'action.hover',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* big emoji stage */}
              <Box
                sx={{
                  flex: 1,
                  position: 'relative',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 56,
                  bgcolor: `${accent}14`,
                }}
              >
                {stay.emoji}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    px: 0.9,
                    py: 0.3,
                    borderRadius: 1.5,
                    fontSize: 10,
                    fontWeight: 800,
                    color: '#fff',
                    bgcolor: accent,
                  }}
                >
                  Book
                </Box>
              </Box>

              {/* caption */}
              <Box sx={{ px: 1.25, py: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ fontSize: 12, fontWeight: 800, color: 'text.primary' }}>{stay.name}</Box>
                  <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{stay.meta} · per night</Box>
                </Box>
                <Box sx={{ fontSize: 13, fontWeight: 800, color: accent, whiteSpace: 'nowrap' }}>{stay.price}</Box>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* dots */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.6, py: 1 }}>
        {STAYS.map((s, i) => (
          <Box
            key={s.name}
            sx={{
              width: i === index ? 14 : 5,
              height: 5,
              borderRadius: 3,
              bgcolor: i === index ? accent : 'action.selected',
              transition: 'width 0.4s ease, background-color 0.4s ease',
            }}
          />
        ))}
      </Box>
    </PreviewScreen>
  )
}
