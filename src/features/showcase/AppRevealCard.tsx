'use client'

import Box from '@mui/material/Box'
import { motion, useAnimationControls, useReducedMotion, type TargetAndTransition } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useState, type KeyboardEvent } from 'react'
import { TextH6Bold } from '@/shared/components'
import { HeartBeat } from './HeartBeat'
import { fasterClose } from './closeTransition'
import { iconAnimations } from './iconAnimations'
import { planePaths, revealAnimations } from './revealAnimations'
import { APP_PREVIEWS } from './previews'
import { actionStartMs } from './previews/previewTiming'
import type { ShowcaseApp } from './apps'

const CARD_RADIUS = 12

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
  const { Icon, accent, iconAnimation } = app
  const Preview = APP_PREVIEWS[app.id]
  const t = useTranslations()
  const label = t(`apps.${app.id}.label`)
  const reduceMotion = useReducedMotion()
  const animate = !reduceMotion
  const iconAnim = iconAnimations[iconAnimation]
  const reveal = revealAnimations[iconAnimation]
  const isFly = iconAnimation === 'fly'
  const clipId = `plane-reveal-${app.id}`
  const flyControls = useAnimationControls()
  // Mount the preview only while hovered → its looped action restarts from the start on each
  // reveal (instead of running from page-load), and idle cards don't animate.
  const [hovered, setHovered] = useState(false)

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onActivate()
    }
  }

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onActivate}
      onKeyDown={handleKeyDown}
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
          setHovered(true)
          if (isFly && animate) {
            flyControls.start({ ...(iconAnim.variants.active as TargetAndTransition), transition: iconAnim.transition })
          }
        }}
        onHoverEnd={() => {
          setHovered(false)
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

        {isFly && (
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
              {hovered && Preview ? <Preview accent={accent} startDelay={actionStartMs(iconAnimation)} /> : null}
            </Box>
          </>
        )}

        {!isFly && (
          <motion.div
            variants={{
              rest: { ...reveal.rest, transition: fasterClose(reveal.transition) },
              active: { ...reveal.active, transition: reveal.transition },
            }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {hovered && Preview ? <Preview accent={accent} startDelay={actionStartMs(iconAnimation)} /> : null}
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
