'use client'

import { AccountBalanceWallet, ArrowDownward, ArrowUpward, CreditCard } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

// Fintech micro-theme: Revolut/Monzo vibe — tighter corners, real MUI icons (not emoji),
// tabular-nums, high contrast. Auto-simulates a tap on the card row -> navigates to the
// card detail and loops (a "recorded interaction", not real clicks).

const R = 8 // tighter, fintech radius

const ACCOUNTS = [
  { Icon: AccountBalanceWallet, name: 'Main account', sub: 'Current', amount: '€8,210.30' },
  { Icon: CreditCard, name: 'Card · Physical', sub: 'Visa', amount: '€4,270.20' },
]
const TX = [
  { dir: 'in' as const, name: 'Salary', amount: '+€2,400.00' },
  { dir: 'out' as const, name: 'Tesco', amount: '−€42.10' },
  { dir: 'out' as const, name: 'Spotify', amount: '−€9.99' },
]

export function FintechFlow({ accent }: PreviewProps) {
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
      }, 450)
    }, 3000)
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
              key="home"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '0 12px' }}
            >
              <Box sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.secondary', letterSpacing: '-0.01em' }}>
                Accounts
              </Box>
              <Box
                sx={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: 'text.primary',
                  letterSpacing: '-0.02em',
                  mb: 1.25,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                €12,480.50
              </Box>
              {ACCOUNTS.map((a, i) => (
                <Box
                  key={a.name}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    mb: 0.75,
                    borderRadius: `${R}px`,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: `${R - 2}px`,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: `${accent}1A`,
                      color: accent,
                    }}
                  >
                    <a.Icon sx={{ fontSize: 16 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary' }}>{a.name}</Box>
                    <Box sx={{ fontSize: 9.5, color: 'text.secondary' }}>{a.sub}</Box>
                  </Box>
                  <Box sx={{ fontSize: 11.5, fontWeight: 800, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
                    {a.amount}
                  </Box>
                  {tapping && i === 1 && !reduceMotion && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      style={{
                        position: 'absolute',
                        right: 22,
                        top: '50%',
                        width: 22,
                        height: 22,
                        marginTop: -11,
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
              key="card"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '0 12px' }}
            >
              <Box
                sx={{
                  height: 62,
                  borderRadius: `${R}px`,
                  p: 1.25,
                  mb: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: 'common.white',
                  background: `linear-gradient(135deg, ${accent}, ${accent}bb)`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ fontSize: 10, fontWeight: 700, opacity: 0.85 }}>Card · Visa</Box>
                  <CreditCard sx={{ fontSize: 16, opacity: 0.85 }} />
                </Box>
                <Box sx={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.1em' }}>•••• 4821</Box>
              </Box>
              {TX.map((t) => (
                <Box key={t.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: `${R - 2}px`,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: 'action.hover',
                      color: t.dir === 'in' ? 'success.main' : 'text.secondary',
                    }}
                  >
                    {t.dir === 'in' ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
                  </Box>
                  <Box sx={{ flex: 1, fontSize: 11.5, fontWeight: 700, color: 'text.primary' }}>{t.name}</Box>
                  <Box
                    sx={{
                      fontSize: 11.5,
                      fontWeight: 800,
                      color: t.dir === 'in' ? 'success.main' : 'text.primary',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {t.amount}
                  </Box>
                </Box>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
