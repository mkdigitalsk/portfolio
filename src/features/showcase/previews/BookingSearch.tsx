'use client'

import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const RESULTS = [
  { emoji: '🏖️', name: 'Beach Resort', meta: '★ 4.8 · 5 nights', price: '€600' },
  { emoji: '🏙️', name: 'City Hotel', meta: '★ 4.6 · 5 nights', price: '€550' },
  { emoji: '🏡', name: 'Cozy Cabin', meta: '★ 4.7 · 5 nights', price: '€400' },
]

type Phase = 'searching' | 'results'

export function BookingSearch({ accent }: PreviewProps) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(reduceMotion ? 'results' : 'searching')

  useEffect(() => {
    if (reduceMotion) return
    let toResults: ReturnType<typeof setTimeout>
    const loop = setInterval(() => {
      setPhase('searching')
      toResults = setTimeout(() => setPhase('results'), 900)
    }, 2400)
    toResults = setTimeout(() => setPhase('results'), 900)
    return () => {
      clearInterval(loop)
      clearTimeout(toResults)
    }
  }, [reduceMotion])

  return (
    <PreviewScreen>
      {/* search panel */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, borderRadius: 2.5, bgcolor: 'action.hover', display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 11, color: 'text.secondary' }}>
            <Box component="span" sx={{ fontSize: 12 }}>
              📍
            </Box>
            <Box sx={{ fontWeight: 700, color: 'text.primary' }}>Where to?</Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Pill label="Jun 20" />
            <Box sx={{ fontSize: 10, color: 'text.disabled' }}>→</Box>
            <Pill label="Jun 25" />
            <Box sx={{ flex: 1 }} />
            <Pill label="2 guests" />
          </Box>
        </Box>
      </Box>

      {/* results / searching */}
      <Box sx={{ flex: 1, px: 1.5, position: 'relative' }}>
        <AnimatePresence mode="wait">
          {phase === 'searching' ? (
            <motion.div
              key="searching"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box sx={{ fontSize: 10, color: 'text.secondary', mb: 0.75 }}>Searching…</Box>
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 0.6,
                  }}
                >
                  <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: 'action.selected', flexShrink: 0 }} />
                  <Box sx={{ flex: 1 }}>
                    <Shimmer width="70%" />
                    <Box sx={{ height: 4 }} />
                    <Shimmer width="40%" />
                  </Box>
                </Box>
              ))}
            </motion.div>
          ) : (
            <motion.div key="results" initial={false}>
              {RESULTS.map((r, i) => (
                <motion.div
                  key={r.name}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: reduceMotion ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.6 }}>
                    <Thumb emoji={r.emoji} bg={`${accent}14`} />
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
                        {r.name}
                      </Box>
                      <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{r.meta}</Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.25 }}>
                      <Box sx={{ fontSize: 11.5, fontWeight: 800, color: accent }}>{r.price}</Box>
                      <Box
                        sx={{
                          fontSize: 9,
                          fontWeight: 700,
                          px: 0.6,
                          py: 0.15,
                          borderRadius: 1,
                          color: accent,
                          bgcolor: `${accent}1A`,
                        }}
                      >
                        Available
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}

function Pill({ label }: { label: string }) {
  return (
    <Box
      sx={{
        px: 0.9,
        py: 0.3,
        borderRadius: 1.5,
        fontSize: 10,
        fontWeight: 700,
        color: 'text.primary',
        bgcolor: 'background.paper',
      }}
    >
      {label}
    </Box>
  )
}

function Shimmer({ width }: { width: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{ width, height: 8, borderRadius: 4, background: 'rgba(128,128,128,0.25)' }}
    />
  )
}
