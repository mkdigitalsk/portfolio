'use client'

import Box from '@mui/material/Box'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const TARGET = 12480.5

const BARS = [0.45, 0.62, 0.38, 0.78, 0.55, 1] // last is current (tallest)

const TXNS = [
  { emoji: '🏢', name: 'Acme Payroll', cat: 'Income', amount: '+€3,200.00', positive: true },
  { emoji: '⚡', name: 'EnerGrid Utilities', cat: 'Bills', amount: '−€84.20', positive: false },
  { emoji: '🛒', name: 'Market Fresh', cat: 'Groceries', amount: '−€56.90', positive: false },
  { emoji: '💳', name: 'Card Repayment', cat: 'Transfer', amount: '−€500.00', positive: false },
]

function formatEuro(value: number) {
  return `€${value.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function FintechDashboard({ accent }: PreviewProps) {
  const reduceMotion = useReducedMotion()
  const [amount, setAmount] = useState(reduceMotion ? TARGET : 0)

  useEffect(() => {
    if (reduceMotion) return
    const duration = 900
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setAmount(TARGET * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [reduceMotion])

  return (
    <PreviewScreen>
      {/* balance card */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'text.secondary', mb: 0.25 }}>
          Total balance
        </Box>
        <Box sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1, color: accent, fontVariantNumeric: 'tabular-nums' }}>
          {formatEuro(amount)}
        </Box>
      </Box>

      {/* monthly spending bar chart */}
      <Box sx={{ px: 1.5, pb: 1.25 }}>
        <Box sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', mb: 0.75 }}>Monthly spending</Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 0.75, height: 46 }}>
          {BARS.map((h, i) => {
            const isCurrent = i === BARS.length - 1
            return (
              <Box
                key={i}
                component={motion.div}
                initial={reduceMotion ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={reduceMotion ? undefined : { duration: 0.6, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                sx={{
                  flex: 1,
                  height: `${h * 100}%`,
                  transformOrigin: 'bottom',
                  borderRadius: '3px',
                  bgcolor: isCurrent ? accent : 'action.selected',
                }}
              />
            )
          })}
        </Box>
      </Box>

      {/* transaction list */}
      <Box sx={{ px: 1.5, flex: 1 }}>
        <Box sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', mb: 0.5 }}>Recent activity</Box>
        {TXNS.map((tx) => (
          <Box key={tx.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.6 }}>
            <Thumb emoji={tx.emoji} bg="action.hover" />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tx.name}
              </Box>
              <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{tx.cat}</Box>
            </Box>
            <Box sx={{ fontSize: 11.5, fontWeight: 800, color: tx.positive ? 'success.main' : 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
              {tx.amount}
            </Box>
          </Box>
        ))}
      </Box>
    </PreviewScreen>
  )
}
