'use client'

import { AccountBalance, AttachMoney } from '@mui/icons-material'
import { motion } from 'motion/react'

// One vertical flip that swaps the bank icon for a dollar icon at the edge-on point.
const FLIP_TRANSITION = { duration: 0.32, ease: 'easeInOut' as const }

const layerStyle = {
  position: 'absolute' as const,
  inset: 0,
  display: 'grid',
  placeItems: 'center',
}

interface BankFlipProps {
  accent: string
}

export function BankFlip({ accent }: BankFlipProps) {
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
        <AccountBalance sx={{ fontSize: 38, color: accent }} />
      </motion.div>
      <motion.div
        variants={{ rest: { opacity: 0 }, active: { opacity: [0, 1, 1] } }}
        transition={FLIP_TRANSITION}
        style={layerStyle}
      >
        <AttachMoney sx={{ fontSize: 42, color: accent }} />
      </motion.div>
    </motion.div>
  )
}
