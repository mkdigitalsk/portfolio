'use client'

import Box from '@mui/material/Box'
import { motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useState, type KeyboardEvent, type ReactNode } from 'react'
import { TextH6Bold } from '@/shared/components'
import { CARD_FLIP_CLOSE_S, CARD_FLIP_S, FLIP_EASE, ICON_FLIP_S } from './flipTiming'
import { APP_PREVIEWS } from './previews'
import type { ShowcaseApp } from './apps'

const CARD_RADIUS = 12

const faceStyle = {
  position: 'absolute',
  inset: 0,
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  borderRadius: `${CARD_RADIUS}px`,
  overflow: 'hidden',
} as const

interface FlipRevealCardProps {
  app: ShowcaseApp
  ariaLabel: string
  onActivate: () => void
  // The animated icon shown on the front face — it flips first, e.g. BankFlip / FoodFlip.
  frontIcon: ReactNode
  // 1 flips the card bottom-to-top, -1 top-to-bottom.
  flipSign?: 1 | -1
  height?: number
}

export function FlipRevealCard({
  app,
  ariaLabel,
  onActivate,
  frontIcon,
  flipSign = -1,
  height = 240,
}: FlipRevealCardProps) {
  const { accent } = app
  const Preview = APP_PREVIEWS[app.id]
  const t = useTranslations()
  const label = t(`apps.${app.id}.label`)
  const reduceMotion = useReducedMotion()
  const animate = !reduceMotion
  const flipTo = 180 * flipSign
  // Drive the flip from hover state tracked on the STABLE outer container — never via
  // whileHover on the rotating card itself: mid-flip the 3D card turns edge-on, the
  // browser fires pointerleave, and Framer would think hover ended and reverse/stall.
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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        height,
        cursor: 'pointer',
        borderRadius: `${CARD_RADIUS}px`,
        outline: 'none',
        perspective: 1200,
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
        animate={animate && hovered ? 'active' : 'rest'}
        variants={{
          // Close: the card flips back first (no delay, a touch quicker), then the icon flips.
          rest: { rotateX: 0, transition: { duration: CARD_FLIP_CLOSE_S, delay: 0, ease: FLIP_EASE } },
          // Open: the icon flips first, then the card flips.
          active: { rotateX: flipTo, transition: { duration: CARD_FLIP_S, delay: ICON_FLIP_S, ease: FLIP_EASE } },
        }}
        style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
      >
        <Box sx={{ ...faceStyle, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Box sx={{ position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%, -50%)' }}>
            <Box
              sx={{
                width: 76,
                height: 76,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                bgcolor: `${accent}1A`,
              }}
            >
              {frontIcon}
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '60%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <TextH6Bold>{label}</TextH6Bold>
          </Box>
        </Box>

        <Box sx={{ ...faceStyle, transform: `rotateX(${flipTo}deg)`, bgcolor: 'background.paper' }}>
          {Preview ? <Preview accent={accent} /> : null}
        </Box>
      </motion.div>
    </Box>
  )
}
