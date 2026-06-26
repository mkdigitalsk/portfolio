'use client'

import { Add, Check, Remove } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

// Booking & travel micro-theme: Airbnb "Cereal" vibe — warm, soft, airy. Distinct flow: on the
// stay detail you set the number of NIGHTS (the total follows nights × rate), then Book ->
// "Your trip is booked". A reservation confirmation, not a cart or a build-up. Two screens.

const R = 16 // softer, friendlier radius

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

function BookingDetail({ accent, t, startDelay }: { accent: string; t: ReturnType<typeof useTranslations>; startDelay: number }) {
  const reduceMotion = useReducedMotion()
  const [nights, setNights] = useState(4)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined // reduced motion: static, not booked
    const t1 = setTimeout(() => setNights(5), startDelay) // tap "+"
    const t2 = setTimeout(() => setBooked(true), startDelay + 900) // tap Book -> confirmed
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reduceMotion, startDelay])

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

      {/* TODO(i18n): "Nights" / "Your trip is booked" literals — localize before final */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
        <Box>
          <Box sx={{ fontSize: 11, fontWeight: 700, color: 'text.primary' }}>Nights</Box>
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
            transition={{ type: 'spring', stiffness: 500, damping: 16 }}
            sx={{ minWidth: 16, textAlign: 'center', fontSize: 14, fontWeight: 800, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}
          >
            {nights}
          </Box>
          <Box component={motion.div} animate={nights === 5 && !reduceMotion ? { scale: [1, 1.18, 1] } : {}} transition={{ duration: 0.3 }}>
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
        <Box sx={{ fontSize: 15, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>{formatEUR(nights * RATE)}</Box>
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
          bgcolor: booked ? 'success.main' : accent,
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
              transition={{ type: 'spring', stiffness: 500, damping: 16 }}
              style={{ display: 'grid' }}
            >
              <Check sx={{ fontSize: 16 }} />
            </motion.span>
            Your trip is booked
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
  const [screen, setScreen] = useState(1) // start on the action screen → it plays immediately on open
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
    }, 3200)
    return () => {
      clearInterval(loop)
      clearTimeout(flip)
    }
  }, [reduceMotion])

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
                  <Box sx={{ fontSize: 10, fontWeight: 500, color: 'text.secondary', bgcolor: 'background.paper', borderRadius: `${R - 6}px`, px: 1, py: 0.5 }}>
                    {DATES}
                  </Box>
                  <Box sx={{ fontSize: 10, fontWeight: 500, color: 'text.secondary', bgcolor: 'background.paper', borderRadius: `${R - 6}px`, px: 1, py: 0.5 }}>
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
              <BookingDetail accent={accent} t={t} startDelay={startDelay} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
