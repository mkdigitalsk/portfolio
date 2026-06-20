'use client'

import Box from '@mui/material/Box'
import { motion, useAnimationControls, useReducedMotion, type TargetAndTransition } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { TextH6Bold } from '@/shared/components'
import { useMotion } from '@/shared/context/MotionContext'
import { HeartBeat } from './HeartBeat'
import { fasterClose } from './closeTransition'
import { iconAnimations } from './iconAnimations'
import { planePaths, revealAnimations } from './revealAnimations'
import { APP_PREVIEWS } from './previews'
import type { ShowcaseApp } from './apps'

const CARD_RADIUS = 12

const REVEAL_DURATION_MS = 550
// Start playback this long BEFORE the reveal finishes, so the video is already
// in motion by the moment it becomes visible.
const PLAY_OFFSET_MS = 130

// Close (unhover): the plane flies back IN from the bottom-left corner along a curve at
// constant speed, down to home — a different path from the takeoff (so it's driven
// imperatively, not by reversing the hover variant).
const PLANE_FLY_IN: TargetAndTransition = {
  x: [-260, -150, -55, 0],
  y: [210, 145, 55, 0],
  rotate: [10, 6, 2, 0],
  scale: [0.55, 0.72, 0.9, 1],
}
const PLANE_FLY_IN_TRANSITION = { duration: 0.85, ease: 'linear' } as const

interface AppRevealCardProps {
  app: ShowcaseApp
  ariaLabel: string
  onActivate: () => void
  height?: number
}

export function AppRevealCard({ app, ariaLabel, onActivate, height = 240 }: AppRevealCardProps) {
  const { Icon, accent, previewSrc, iconAnimation } = app
  const Preview = APP_PREVIEWS[app.id]
  const t = useTranslations()
  const label = t(`apps.${app.id}.label`)
  const reduceMotion = useReducedMotion()
  const { motionEnabled } = useMotion()
  const animate = !reduceMotion && motionEnabled
  const videoRef = useRef<HTMLVideoElement>(null)
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const iconAnim = iconAnimations[iconAnimation]
  const reveal = revealAnimations[iconAnimation]
  const isFly = iconAnimation === 'fly'
  const clipId = `plane-reveal-${app.id}`
  const flyControls = useAnimationControls()

  const clearPlayTimer = () => {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current)
      playTimerRef.current = null
    }
  }
  const schedulePlay = () => {
    if (!previewSrc || !animate) return
    clearPlayTimer()
    playTimerRef.current = setTimeout(() => {
      videoRef.current?.play().catch(() => undefined)
    }, REVEAL_DURATION_MS - PLAY_OFFSET_MS)
  }
  const stopPreview = () => {
    clearPlayTimer()
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  useEffect(() => clearPlayTimer, [])

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
      onMouseEnter={schedulePlay}
      onMouseLeave={stopPreview}
      sx={{
        height,
        cursor: 'pointer',
        borderRadius: `${CARD_RADIUS}px`,
        outline: 'none',
        transition: 'box-shadow 0.25s ease, transform 0.25s ease',
        '&:hover': {
          boxShadow: `0 0 0 2px ${accent}, 0 12px 24px -10px rgba(0,0,0,0.26)`,
          transform: 'translateY(-4px)',
        },
        '&:focus-visible': {
          boxShadow: `0 0 0 2px ${accent}, 0 12px 24px -10px rgba(0,0,0,0.26)`,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <motion.div
        initial="rest"
        animate="rest"
        whileHover={animate ? 'active' : undefined}
        onHoverStart={() => {
          if (isFly && animate) {
            flyControls.start({ ...(iconAnim.variants.active as TargetAndTransition), transition: iconAnim.transition })
          }
        }}
        onHoverEnd={() => {
          if (isFly && animate) {
            flyControls.start({ ...PLANE_FLY_IN, transition: PLANE_FLY_IN_TRANSITION })
          }
        }}
        style={{ position: 'relative', width: '100%', height: '100%', borderRadius: CARD_RADIUS, overflow: 'hidden' }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: `${CARD_RADIUS}px`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        />

        {previewSrc && isFly && (
          <>
            <svg aria-hidden width={0} height={0} style={{ position: 'absolute' }}>
              <defs>
                <clipPath id={clipId} clipPathUnits="objectBoundingBox">
                  <motion.path
                    d={planePaths[0]}
                    variants={{
                      rest: { d: planePaths[0], transition: fasterClose(reveal.transition) },
                      active: { d: planePaths, transition: reveal.transition },
                    }}
                  />
                </clipPath>
              </defs>
            </svg>
            <Box
              sx={{ position: 'absolute', inset: 0, clipPath: `url(#${clipId})`, WebkitClipPath: `url(#${clipId})` }}
            >
              {Preview ? (
                <Preview accent={accent} />
              ) : (
                <Box
                  component="video"
                  ref={videoRef}
                  src={previewSrc}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  aria-hidden
                  sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </Box>
          </>
        )}

        {previewSrc && !isFly && (
          <motion.div
            variants={{
              rest: { ...reveal.rest, transition: fasterClose(reveal.transition) },
              active: { ...reveal.active, transition: reveal.transition },
            }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {Preview ? (
              <Preview accent={accent} />
            ) : (
              <Box
                component="video"
                ref={videoRef}
                src={previewSrc}
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden
                sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </motion.div>
        )}

        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '38%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          {iconAnimation === 'heart' ? (
            <HeartBeat accent={accent} />
          ) : isFly ? (
            <motion.div
              initial={{ x: 0, y: 0, rotate: 0, scale: 1 }}
              animate={flyControls}
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: accent,
                backgroundColor: `${accent}1A`,
              }}
            >
              <Icon sx={{ fontSize: 38 }} />
            </motion.div>
          ) : (
            <motion.div
              variants={{
                rest: { ...iconAnim.variants.rest, transition: fasterClose(iconAnim.transition) },
                active: { ...iconAnim.variants.active, transition: iconAnim.transition },
              }}
              style={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: accent,
                backgroundColor: `${accent}1A`,
              }}
            >
              <Icon sx={{ fontSize: 38 }} />
            </motion.div>
          )}
        </Box>

        <motion.div
          variants={{ rest: { opacity: 1 }, active: { opacity: 0 } }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '60%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            pointerEvents: 'none',
          }}
        >
          <TextH6Bold>{label}</TextH6Bold>
        </motion.div>
      </motion.div>
    </Box>
  )
}
