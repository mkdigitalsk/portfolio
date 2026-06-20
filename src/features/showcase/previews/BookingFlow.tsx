'use client'

import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

// Booking & travel micro-theme: Airbnb "Cereal" vibe — warm, soft, airy. Larger/softer
// radius, lighter font weights, generous spacing. accent only on price + Book/Available
// tag + active dots. Auto-simulates a tap on the first stay -> navigates to the stay
// detail and loops (a "recorded interaction", not real clicks).

const R = 16 // softer, friendlier radius

// Fun easter egg: the search field types out a real destination and the featured stay is
// named after it, on real dates. Swap these two constants to re-theme the whole flow
// thematically (e.g. 'Bangkok' / '12–18 Aug 2026'). 🏖️
const DESTINATION = 'Da Nang'
const DATES = '24–27 Jun 2026'

const STAYS = [
  { key: 'beachResort', emoji: '🏖️', rating: '4.8', nights: 5, price: '€120' },
  { key: 'mountainLodge', emoji: '🏔️', rating: '4.9', nights: 4, price: '€95' },
  { key: 'cityHotel', emoji: '🏙️', rating: '4.6', nights: 3, price: '€110' },
]

export function BookingFlow({ accent }: PreviewProps) {
  const t = useTranslations('previews.booking')
  const reduceMotion = useReducedMotion()
  const [screen, setScreen] = useState(0)
  const [tapping, setTapping] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined
    let flip: ReturnType<typeof setTimeout>
    const loop = setInterval(() => {
      setTapping(true)
      flip = setTimeout(() => {
        setScreen((s) => 1 - s)
        setTapping(false)
      }, 400)
    }, 2000)
    return () => {
      clearInterval(loop)
      clearTimeout(flip)
    }
  }, [reduceMotion])

  // Type the destination out letter-by-letter each time the search screen is shown.
  const [typedLen, setTypedLen] = useState(DESTINATION.length)
  useEffect(() => {
    if (reduceMotion) {
      setTypedLen(DESTINATION.length)
      return undefined
    }
    if (screen !== 0) return undefined
    setTypedLen(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTypedLen(i)
      if (i >= DESTINATION.length) clearInterval(id)
    }, 110)
    return () => clearInterval(id)
  }, [screen, reduceMotion])

  const featured = STAYS[0]

  return (
    <PreviewScreen>
      <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {screen === 0 ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '0 14px' }}
            >
              <Box
                sx={{
                  borderRadius: `${R}px`,
                  bgcolor: 'action.hover',
                  p: 1.25,
                  mb: 1.25,
                }}
              >
                <Box sx={{ fontSize: 10, fontWeight: 600, color: 'text.secondary', mb: 0.5 }}>{t('whereTo')}</Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    bgcolor: 'background.paper',
                    borderRadius: `${R - 6}px`,
                    px: 1,
                    py: 0.6,
                    mb: 0.75,
                  }}
                >
                  <Box sx={{ fontSize: 12 }}>📍</Box>
                  <Box sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>
                    {DESTINATION.slice(0, typedLen)}
                    {!reduceMotion && (
                      <motion.span
                        aria-hidden
                        animate={{ opacity: [1, 1, 0, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                        style={{
                          display: 'inline-block',
                          width: 1.5,
                          height: 12,
                          marginLeft: 1,
                          borderRadius: 1,
                          verticalAlign: 'text-bottom',
                          background: accent,
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 0.75 }}>
                  <Box
                    sx={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: 'text.secondary',
                      bgcolor: 'background.paper',
                      borderRadius: `${R - 6}px`,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    {DATES}
                  </Box>
                  <Box
                    sx={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: 'text.secondary',
                      bgcolor: 'background.paper',
                      borderRadius: `${R - 6}px`,
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    {t('guests', { count: 2 })}
                  </Box>
                </Box>
              </Box>
              {STAYS.map((s, i) => (
                <Box
                  key={s.key}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    p: 1,
                    mb: 0.75,
                    borderRadius: `${R}px`,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: `${R - 6}px`,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 18,
                      flexShrink: 0,
                      bgcolor: 'background.paper',
                    }}
                  >
                    {s.emoji}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: 11.5, fontWeight: 600, color: 'text.primary' }}>{t(s.key)}</Box>
                    <Box sx={{ fontSize: 9.5, fontWeight: 500, color: 'text.secondary' }}>
                      ★ {s.rating} · {t('nights', { count: s.nights })}
                    </Box>
                  </Box>
                  <Box sx={{ fontSize: 11.5, fontWeight: 600, color: accent }}>
                    {s.price}
                    <Box component="span" sx={{ fontSize: 9, fontWeight: 500, color: 'text.secondary' }}>
                      {t('perNightShort')}
                    </Box>
                  </Box>
                  {tapping && i === 0 && !reduceMotion && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      style={{
                        position: 'absolute',
                        left: 17,
                        top: '50%',
                        width: 28,
                        height: 28,
                        marginTop: -14,
                        borderRadius: '50%',
                        background: accent,
                      }}
                    />
                  )}
                </Box>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="stay"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '0 14px' }}
            >
              <Box
                sx={{
                  height: 90,
                  borderRadius: `${R}px`,
                  p: 1.5,
                  mb: 1.25,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: 'common.white',
                  background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
                }}
              >
                <Box sx={{ fontSize: 22, lineHeight: 1 }}>{featured.emoji}</Box>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>{DESTINATION}</Box>
                    <Box sx={{ fontSize: 9.5, fontWeight: 500, opacity: 0.85, lineHeight: 1.3 }}>{t(featured.key)}</Box>
                  </Box>
                  <Box sx={{ fontSize: 10, fontWeight: 500, opacity: 0.9 }}>★ {featured.rating}</Box>
                </Box>
              </Box>
              <Box sx={{ px: 0.25, mb: 1.25 }}>
                <Box sx={{ fontSize: 16, fontWeight: 600, color: accent }}>
                  {featured.price}
                  <Box component="span" sx={{ fontSize: 11, fontWeight: 500, color: 'text.secondary' }}>
                    {' '}
                    {t('perNight')}
                  </Box>
                </Box>
                <Box sx={{ fontSize: 10.5, fontWeight: 500, color: 'text.secondary', mt: 0.5 }}>
                  ✓ {t('freeCancellation')}
                </Box>
              </Box>
              <Box
                sx={{
                  borderRadius: `${R}px`,
                  bgcolor: accent,
                  color: 'common.white',
                  textAlign: 'center',
                  py: 1.25,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {t('bookNow')}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
