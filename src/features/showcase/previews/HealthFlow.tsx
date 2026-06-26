'use client'

import { Bolt, Check, DirectionsRun, LocalFireDepartment, Timer } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

// Health & Fitness micro-theme: Strava/Nike Training Club vibe. Full flow: dashboard -> tap
// "Start workout" -> the run progresses live (ring fills, clock ticks, distance/kcal climb) ->
// at the end a "Save progress" button appears. Two screens.

const R = 12 // medium, sporty radius

const STATS = [
  { Icon: DirectionsRun, value: '14,820', key: 'steps' },
  { Icon: LocalFireDepartment, value: '540', key: 'kcal' },
  { Icon: Timer, value: '47', key: 'min' },
]

const RING_SIZE = 94
const RING_STROKE = 8
const RING_R = (RING_SIZE - RING_STROKE) / 2
const RING_C = 2 * Math.PI * RING_R

const START = 12 * 60 + 34 // 12:34 elapsed
const RUN_MS = 2400 // how long the run progresses before it's "done"
const fmtClock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function ActiveWorkout({ accent, t }: { accent: string; t: ReturnType<typeof useTranslations> }) {
  const reduceMotion = useReducedMotion()
  const [secs, setSecs] = useState(START)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined // reduced motion: frozen snapshot
    const id = setInterval(() => setSecs((s) => s + 1), 200)
    const finish = setTimeout(() => {
      clearInterval(id)
      setDone(true) // run complete -> reveal the Save button
    }, RUN_MS)
    return () => {
      clearInterval(id)
      clearTimeout(finish)
    }
  }, [reduceMotion])

  const ticks = secs - START
  const progress = done ? 0.96 : Math.min(0.92, 0.16 + ticks * 0.065)
  const offset = RING_C * (1 - progress)
  const distance = 3.2 + ticks * 0.03
  const kcal = 320 + ticks * 3

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
        <DirectionsRun sx={{ fontSize: 16, color: accent }} />
        <Box sx={{ fontSize: 12, fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>{t('morningRun')}</Box>
      </Box>
      <Box sx={{ position: 'relative', width: RING_SIZE, height: RING_SIZE, mb: 0.75 }}>
        <svg width={RING_SIZE} height={RING_SIZE} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_R} fill="none" stroke="rgba(128,128,128,0.18)" strokeWidth={RING_STROKE} />
          <motion.circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_R}
            fill="none"
            stroke={accent}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={RING_C}
            initial={false}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.25, ease: 'linear' }}
          />
        </svg>
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ fontSize: 22, fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
            {fmtClock(secs)}
          </Box>
          <Box sx={{ fontSize: 9, fontWeight: 700, color: 'text.secondary', mt: 0.25 }}>{t('elapsed')}</Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.9 }}>
        {[`${distance.toFixed(1)} km`, `${Math.round(kcal)} kcal`, "5'10/km"].map((m, i, arr) => (
          <Box key={m} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ fontSize: 11, fontWeight: 800, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>{m}</Box>
            {i < arr.length - 1 && <Box sx={{ fontSize: 11, fontWeight: 700, color: 'text.disabled' }}>·</Box>}
          </Box>
        ))}
      </Box>
      {/* TODO(i18n): "Save progress" literal — localize before final */}
      {done && (
        <Box
          component={motion.div}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            alignSelf: 'stretch',
            mx: 1.5,
            py: 0.9,
            borderRadius: `${R}px`,
            bgcolor: accent,
            color: 'common.white',
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          <Check sx={{ fontSize: 16 }} />
          Save progress
        </Box>
      )}
    </Box>
  )
}

export function HealthFlow({ accent, startDelay = 900 }: PreviewProps) {
  const t = useTranslations('previews.health')
  const reduceMotion = useReducedMotion()
  const [screen, setScreen] = useState(0)
  const [tapping, setTapping] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined
    const timers: ReturnType<typeof setTimeout>[] = []
    const cycle = () => {
      timers.push(setTimeout(() => setTapping(true), startDelay)) // tap "Start workout"
      timers.push(
        setTimeout(() => {
          setScreen(1)
          setTapping(false)
        }, startDelay + 400),
      )
      timers.push(setTimeout(() => setScreen(0), startDelay + 400 + 3600)) // back to dashboard
      timers.push(setTimeout(cycle, startDelay + 400 + 3600 + 700)) // loop
    }
    cycle() // first cycle (screen starts on the dashboard — no sync setState in effect body)
    return () => timers.forEach(clearTimeout)
  }, [reduceMotion, startDelay])

  return (
    <PreviewScreen>
      <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {screen === 0 ? (
            <motion.div
              key="today"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '0 12px' }}
            >
              <Box sx={{ fontSize: 22, fontWeight: 800, color: 'text.primary', letterSpacing: '-0.02em' }}>{t('today')}</Box>
              <Box sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.secondary', mb: 1.25 }}>Mon, Jun 20</Box>
              <Box sx={{ display: 'flex', gap: 0.75, mb: 1.5 }}>
                {STATS.map((s) => (
                  <Box key={s.key} sx={{ flex: 1, borderRadius: `${R}px`, bgcolor: 'action.hover', p: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <s.Icon sx={{ fontSize: 14, color: accent, mb: 0.5 }} />
                    <Box sx={{ fontSize: 18, fontWeight: 800, color: accent, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 }}>
                      {s.value}
                    </Box>
                    <Box sx={{ fontSize: 9.5, fontWeight: 700, color: 'text.secondary' }}>{t(s.key)}</Box>
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  height: 44,
                  borderRadius: `${R}px`,
                  bgcolor: accent,
                  color: 'common.white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.75,
                  overflow: 'hidden',
                }}
              >
                <Bolt sx={{ fontSize: 18 }} />
                <Box sx={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.01em' }}>{t('startWorkout')}</Box>
                {tapping && !reduceMotion && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 6, opacity: 0 }}
                    transition={{ duration: 0.45 }}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: 28,
                      height: 28,
                      marginLeft: -14,
                      marginTop: -14,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.7)',
                    }}
                  />
                )}
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="workout"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '4px 12px 0' }}
            >
              <ActiveWorkout accent={accent} t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
