'use client'

import { ArrowDownward, ArrowUpward } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { animate, AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'
import {
  DETAIL_HOLD_MS,
  LOOP_GAP_MS,
  PRESS_DIP,
  PRESS_TRANSITION,
  SCREEN_FADE_S,
  SCREEN_SLIDE_PX,
  TAP_RIPPLE_S,
  TAP_TO_FLIP_MS,
} from './previewTiming'

// Fintech micro-theme: Revolut/Monzo vibe — tighter corners, real MUI icons (not emoji),
// tabular-nums, high contrast. Flow: accounts overview -> tap Main Account -> account detail where
// you first see the base balance, then an incoming credit drops in from the top, the list carousels
// down one row (last clipped off the bottom), and the balance counts up.

const R = 8 // tighter, fintech radius
const ROW = 34 // transaction row height (also the carousel slide distance)
const VISIBLE = 3
const CREDIT_DROP_MS = 700 // after the detail opens: hold on the base balance, then the credit lands

// Multi-currency wallet (Revolut/Wise vibe): the EUR account is the main one (tapped → detail);
// the others are the same wallet in other currencies, each with its flag.
const ACCOUNTS = [
  { flag: '🇪🇺', key: 'mainAccount', sub: 'EUR', symbol: '€', amount: 8210.3, rate: 1 },
  { flag: '🇬🇧', key: 'gbpAccount', sub: 'GBP', symbol: '£', amount: 2450, rate: 1.17 },
  { flag: '🇺🇸', key: 'usdAccount', sub: 'USD', symbol: '$', amount: 1920, rate: 0.92 },
]
// The header total is the EUR-equivalent sum of every account — like a real multi-currency wallet.
const TOTAL_EUR = ACCOUNTS.reduce((sum, a) => sum + a.amount * a.rate, 0)

type Tx = { id: string; dir: 'in' | 'out'; name: string; amount: string }

const BASE_BALANCE = 8210.3
const CREDIT_AMOUNT = 5321
const CREDIT: Tx = { id: 'credit', dir: 'in', name: 'Incoming transfer', amount: '+€5,321.00' }
const BASE_TX: Tx[] = [
  { id: 'tesco', dir: 'out', name: 'Tesco', amount: '−€42.10' },
  { id: 'spotify', dir: 'out', name: 'Spotify', amount: '−€9.99' },
  { id: 'uber', dir: 'out', name: 'Uber', amount: '−€14.30' },
]

const fmtMoney = (symbol: string, n: number) =>
  `${symbol}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const formatEUR = (n: number) => fmtMoney('€', n)

function TxRow({ tx, flash }: { tx: Tx; flash: boolean }) {
  return (
    <Box sx={{ position: 'relative', height: ROW }}>
      {flash && (
        <motion.span
          initial={{ opacity: 0.22 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgb(52,211,153)',
            borderRadius: R,
            pointerEvents: 'none',
          }}
        />
      )}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1, height: ROW, px: 0.5 }}>
        <Box
          sx={{
            width: 26,
            height: 26,
            borderRadius: `${R - 2}px`,
            display: 'grid',
            placeItems: 'center',
            bgcolor: 'action.hover',
            color: tx.dir === 'in' ? 'success.main' : 'text.secondary',
          }}
        >
          {tx.dir === 'in' ? <ArrowUpward sx={{ fontSize: 14 }} /> : <ArrowDownward sx={{ fontSize: 14 }} />}
        </Box>
        <Box sx={{ flex: 1, fontSize: 11.5, fontWeight: 700, color: 'text.primary' }}>{tx.name}</Box>
        <Box
          sx={{
            fontSize: 11.5,
            fontWeight: 800,
            color: tx.dir === 'in' ? 'success.main' : 'text.primary',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {tx.amount}
        </Box>
      </Box>
    </Box>
  )
}

// Plays the incoming-credit beat from its OWN mount (which happens after the overview tap + flip —
// so it's always the second beat, after the tap on Main Account).
function AccountDetail({ label, sub, incoming }: { label: string; sub: string; incoming: string }) {
  const reduceMotion = useReducedMotion()
  const [balance, setBalance] = useState(BASE_BALANCE)
  const [rows, setRows] = useState<Tx[]>(BASE_TX)
  const [slideKey, setSlideKey] = useState(0)

  useEffect(() => {
    if (reduceMotion) return undefined // reduced motion: static base account, no incoming-credit beat
    let controls: ReturnType<typeof animate> | undefined
    const timer = setTimeout(() => {
      setRows([{ ...CREDIT, name: incoming }, ...BASE_TX]) // credit on top; the old last row is now the clipped 4th
      setSlideKey(1) // remount the strip → carousel slide from y:-ROW to 0
      controls = animate(BASE_BALANCE, BASE_BALANCE + CREDIT_AMOUNT, {
        duration: 0.9,
        ease: 'easeOut',
        onUpdate: setBalance,
      })
    }, CREDIT_DROP_MS)
    return () => {
      clearTimeout(timer)
      controls?.stop()
    }
  }, [reduceMotion, incoming])

  return (
    <>
      <Box
        sx={{ fontSize: 10.5, fontWeight: 700, color: 'text.secondary', letterSpacing: '-0.01em', textAlign: 'right' }}
      >
        {label}
      </Box>
      <Box
        sx={{
          fontSize: 26,
          fontWeight: 800,
          color: 'text.primary',
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
          textAlign: 'right',
        }}
      >
        {formatEUR(balance)}
      </Box>
      <Box sx={{ fontSize: 9.5, color: 'text.secondary', mb: 1, textAlign: 'right' }}>{sub}</Box>
      <Box sx={{ height: ROW * VISIBLE, overflow: 'hidden' }}>
        <motion.div
          key={slideKey}
          initial={slideKey === 0 ? false : { y: -ROW }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {rows.map((tx) => (
            <TxRow key={tx.id} tx={tx} flash={tx.id === 'credit' && !reduceMotion} />
          ))}
        </motion.div>
      </Box>
    </>
  )
}

export function FintechFlow({ accent, startDelay = 900 }: PreviewProps) {
  const t = useTranslations('previews.fintech')
  const reduceMotion = useReducedMotion()
  const [screen, setScreen] = useState(0) // start on the accounts overview
  const [tapping, setTapping] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined
    const timers: ReturnType<typeof setTimeout>[] = []
    const cycle = () => {
      timers.push(setTimeout(() => setTapping(true), startDelay)) // tap Main Account
      timers.push(
        setTimeout(() => {
          setScreen(1)
          setTapping(false)
        }, startDelay + TAP_TO_FLIP_MS),
      )
      timers.push(setTimeout(() => setScreen(0), startDelay + TAP_TO_FLIP_MS + DETAIL_HOLD_MS)) // back to overview
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
              key="home"
              initial={{ opacity: 0, x: -SCREEN_SLIDE_PX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -SCREEN_SLIDE_PX }}
              transition={{ duration: SCREEN_FADE_S }}
              style={{ padding: '0 12px' }}
            >
              <Box
                sx={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: '-0.01em',
                  textAlign: 'right',
                }}
              >
                {t('accounts')}
              </Box>
              <Box
                sx={{
                  fontSize: 23,
                  fontWeight: 800,
                  color: 'text.primary',
                  letterSpacing: '-0.02em',
                  mb: 1,
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: 'right',
                }}
              >
                {formatEUR(TOTAL_EUR)}
              </Box>
              {ACCOUNTS.map((a, i) => (
                <Box
                  key={a.sub}
                  component={motion.div}
                  animate={tapping && i === 0 && !reduceMotion ? { scale: PRESS_DIP } : {}}
                  transition={PRESS_TRANSITION}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 0.85,
                    mb: 0.6,
                    borderRadius: `${R}px`,
                    bgcolor: i === 0 && tapping ? 'action.selected' : 'action.hover',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 16,
                      flexShrink: 0,
                      bgcolor: 'action.hover',
                    }}
                  >
                    {a.flag}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary' }}>{t(a.key)}</Box>
                    <Box sx={{ fontSize: 9.5, color: 'text.secondary' }}>{a.sub}</Box>
                  </Box>
                  <Box
                    sx={{ fontSize: 11.5, fontWeight: 800, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {fmtMoney(a.symbol, a.amount)}
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
                        width: 220,
                        height: 220,
                        marginLeft: -110,
                        marginTop: -110,
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
              key="detail"
              initial={{ opacity: 0, x: SCREEN_SLIDE_PX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: SCREEN_SLIDE_PX }}
              transition={{ duration: SCREEN_FADE_S }}
              style={{ padding: '0 12px' }}
            >
              <AccountDetail label={t('mainAccount')} sub={t('current')} incoming={t('incomingTransfer')} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
