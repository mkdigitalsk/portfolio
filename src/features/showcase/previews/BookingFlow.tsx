'use client'

import { Add, Check, Remove } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'
import {
  DETAIL_HOLD_MS,
  LOOP_GAP_MS,
  POP_SPRING,
  PRESS_DIP,
  PRESS_TRANSITION,
  SCREEN_FADE_S,
  SCREEN_SLIDE_PX,
  TAP_RIPPLE_S,
  TAP_TO_FLIP_MS,
} from './previewTiming'

// Booking & travel micro-theme: Airbnb "Cereal" vibe — warm, soft, airy. Flow: search results ->
// tap the featured stay -> stay detail where you set the number of NIGHTS (the total follows
// nights × rate), then Book -> "Your trip is booked". A reservation confirmation. Two screens.

const R = 16 // softer, friendlier radius
const NIGHTS_START = 5
const NIGHTS_CLICKS = 3 // tap "+" three times: 5 → 8 nights
const FIRST_TAP_MS = 600 // first "+" tap after the detail opens
const TAP_STEP_MS = 450 // cadence between the "+" taps
const BOOK_MS = FIRST_TAP_MS + (NIGHTS_CLICKS - 1) * TAP_STEP_MS + 700 // then tap Book -> confirmed

// Fun easter egg: the search field types out a real destination and the featured stay is named
// after it, on real dates. Swap these two constants to re-theme the whole flow thematically. 🏖️
const DESTINATION = 'Da Nang'
const DATES = '24–27 Jun 2026'
const RATE = 120 // €/night for the featured stay

const STAYS = [
  { key: 'beachResort', emoji: '🏖️', rating: '4.8', nights: 5, price: '€120' },
  { key: 'mountainLodge', emoji: '🏔️', rating: '4.9', nights: 4, price: '€95' },
  { key: 'cityHotel', emoji: '🏙️', rating: '4.6', nights: 3, price: '€110' },
]
const featured = STAYS[0]

const formatEUR = (n: number) => `€${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

// Types the destination out letter-by-letter. Lives in its own component so it resets by
// remounting with the search screen (no synchronous setState in an effect).
function TypedDestination({ accent }: { accent: string }) {
  const reduceMotion = useReducedMotion()
  const [len, setLen] = useState(reduceMotion ? DESTINATION.length : 0)
  useEffect(() => {
    if (reduceMotion) return undefined
    let i = 0
    const id = setInterval(() => {
      i += 1
      setLen(i)
      if (i >= DESTINATION.length) clearInterval(id)
    }, 110)
    return () => clearInterval(id)
  }, [reduceMotion])
  return (
    <Box sx={{ fontSize: 12, fontWeight: 600, color: 'text.primary' }}>
      {DESTINATION.slice(0, len)}
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
  )
}

function StepperButton({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        width: 22,
        height: 22,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        border: '1.5px solid',
        borderColor: 'divider',
        color: 'text.secondary',
      }}
    >
      {children}
    </Box>
  )
}

function BookingDetail({ accent, t }: { accent: string; t: ReturnType<typeof useTranslations> }) {
  const reduceMotion = useReducedMotion()
  const [nights, setNights] = useState(reduceMotion ? NIGHTS_START + NIGHTS_CLICKS : NIGHTS_START)
  const [clicks, setClicks] = useState(0)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined // reduced motion: static 8 nights, not booked
    const timers = Array.from({ length: NIGHTS_CLICKS }, (_, i) =>
      setTimeout(
        () => {
          setNights(NIGHTS_START + i + 1) // 6, 7, 8
          setClicks(i + 1)
        },
        FIRST_TAP_MS + i * TAP_STEP_MS,
      ),
    )
    timers.push(setTimeout(() => setBooked(true), BOOK_MS)) // tap Book -> confirmed
    return () => timers.forEach(clearTimeout)
  }, [reduceMotion])

  return (
    <>
      <Box
        sx={{
          height: 72,
          borderRadius: `${R}px`,
          p: 1.5,
          mb: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'common.white',
          background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
        }}
      >
        <Box sx={{ fontSize: 20, lineHeight: 1 }}>{featured.emoji}</Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Box sx={{ fontSize: 13, fontWeight: 600 }}>{DESTINATION}</Box>
          <Box sx={{ fontSize: 10, fontWeight: 500, opacity: 0.9 }}>★ {featured.rating}</Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
        <Box>
          <Box sx={{ fontSize: 11, fontWeight: 700, color: 'text.primary' }}>{t('nightsLabel')}</Box>
          <Box sx={{ fontSize: 9.5, color: 'text.secondary' }}>
            {formatEUR(RATE)} {t('perNight')}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StepperButton>
            <Remove sx={{ fontSize: 14 }} />
          </StepperButton>
          <Box
            component={motion.div}
            key={nights}
            initial={reduceMotion ? false : { scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={POP_SPRING}
            sx={{
              minWidth: 16,
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 800,
              color: 'text.primary',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {nights}
          </Box>
          <Box
            component={motion.div}
            key={clicks}
            animate={clicks > 0 && !reduceMotion ? { scale: [1, 1.18, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <StepperButton>
              <Add sx={{ fontSize: 14, color: accent }} />
            </StepperButton>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1,
          pt: 0.75,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ fontSize: 10, fontWeight: 500, color: 'text.secondary' }}>
          {t('nights', { count: nights })} · ✓ {t('freeCancellation')}
        </Box>
        <Box sx={{ fontSize: 15, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>
          {formatEUR(nights * RATE)}
        </Box>
      </Box>

      <Box
        component={motion.div}
        animate={booked && !reduceMotion ? { scale: [1, 0.96, 1] } : {}}
        transition={{ duration: 0.3 }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          borderRadius: `${R}px`,
          bgcolor: accent,
          color: 'common.white',
          py: 1.25,
          fontSize: 12,
          fontWeight: 600,
          transition: 'background-color 0.3s ease',
        }}
      >
        {booked ? (
          <>
            <motion.span
              initial={reduceMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={POP_SPRING}
              style={{ display: 'grid' }}
            >
              <Check sx={{ fontSize: 16 }} />
            </motion.span>
            {t('tripBooked')}
          </>
        ) : (
          t('bookNow')
        )}
      </Box>
    </>
  )
}

export function BookingFlow({ accent, startDelay = 1320 }: PreviewProps) {
  const t = useTranslations('previews.booking')
  const reduceMotion = useReducedMotion()
  const [screen, setScreen] = useState(0) // start on the search results
  const [tapping, setTapping] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined
    const timers: ReturnType<typeof setTimeout>[] = []
    const cycle = () => {
      timers.push(setTimeout(() => setTapping(true), startDelay)) // tap the featured stay
      timers.push(
        setTimeout(() => {
          setScreen(1)
          setTapping(false)
        }, startDelay + TAP_TO_FLIP_MS),
      )
      timers.push(setTimeout(() => setScreen(0), startDelay + TAP_TO_FLIP_MS + DETAIL_HOLD_MS)) // back to search
      timers.push(setTimeout(cycle, startDelay + TAP_TO_FLIP_MS + DETAIL_HOLD_MS + LOOP_GAP_MS)) // loop
    }
    cycle()
    return () => timers.forEach(clearTimeout)
  }, [reduceMotion, startDelay])

  return (
    <PreviewScreen>
      <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {screen === 0 ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -SCREEN_SLIDE_PX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -SCREEN_SLIDE_PX }}
              transition={{ duration: SCREEN_FADE_S }}
              style={{ padding: '0 14px' }}
            >
              <Box sx={{ borderRadius: `${R}px`, bgcolor: 'action.hover', p: 1.25, mb: 1.25 }}>
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
                  <TypedDestination accent={accent} />
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
                  component={motion.div}
                  animate={tapping && i === 0 && !reduceMotion ? { scale: PRESS_DIP } : {}}
                  transition={PRESS_TRANSITION}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    p: 1,
                    mb: 0.75,
                    borderRadius: `${R}px`,
                    bgcolor: i === 0 && tapping ? 'action.selected' : 'action.hover',
                    overflow: 'hidden',
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
                      initial={{ scale: 0, opacity: 0.4 }}
                      animate={{ scale: 1, opacity: 0 }}
                      transition={{ duration: TAP_RIPPLE_S, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: 240,
                        height: 240,
                        marginLeft: -120,
                        marginTop: -120,
                        borderRadius: '50%',
                        background: accent,
                        pointerEvents: 'none',
                      }}
                    />
                  )}
                </Box>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="stay"
              initial={{ opacity: 0, x: SCREEN_SLIDE_PX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: SCREEN_SLIDE_PX }}
              transition={{ duration: SCREEN_FADE_S }}
              style={{ padding: '0 14px' }}
            >
              <BookingDetail accent={accent} t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
