'use client'

import { LunchDining, Restaurant } from '@mui/icons-material'
import { motion } from 'motion/react'

// One vertical flip that swaps the restaurant icon for a burger at the edge-on point.
const FLIP_TRANSITION = { duration: 0.32, ease: 'easeInOut' as const }

const layerStyle = {
  position: 'absolute' as const,
  inset: 0,
  display: 'grid',
  placeItems: 'center',
}

interface FoodFlipProps {
  accent: string
}

export function FoodFlip({ accent }: FoodFlipProps) {
  return (
    <motion.div
      variants={{ rest: { scaleY: 1 }, active: { scaleY: [1, 0, 1] } }}
      transition={FLIP_TRANSITION}
      style={{ position: 'relative', width: 76, height: 76, transformOrigin: 'center' }}
    >
      <motion.div
        variants={{ rest: { opacity: 1 }, active: { opacity: [1, 0, 0] } }}
        transition={FLIP_TRANSITION}
        style={layerStyle}
      >
        <Restaurant sx={{ fontSize: 38, color: accent }} />
      </motion.div>
      <motion.div
        variants={{ rest: { opacity: 0 }, active: { opacity: [0, 1, 1] } }}
        transition={FLIP_TRANSITION}
        style={layerStyle}
      >
        <LunchDining sx={{ fontSize: 38, color: accent }} />
      </motion.div>
    </motion.div>
  )
}
