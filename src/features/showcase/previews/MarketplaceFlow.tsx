'use client'

import { Check, ShoppingCartOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

// Variation A — about price/cart: items drop into the cart (top-right icon fills), then the cart
// opens to a SUMMARY with the running total, and Checkout is tapped -> "Order placed". Two screens.

const R = 10 // medium, friendly radius
const PAD = '10px 12px 8px' // top breathing room under the status bar; bottom keeps the 3rd row off the frame

const PILL_KEYS = ['pillAll', 'pillTech', 'pillHome'] as const
const LISTINGS = [
  { key: 'camera', emoji: '📷', price: 240, rating: '4.9' },
  { key: 'bike', emoji: '🚲', price: 180, rating: '4.7' },
  { key: 'designerChair', emoji: '🪑', price: 60, rating: '4.8' },
] as const

const formatEUR = (n: number) => `€${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
const CART_TOTAL = LISTINGS.reduce((s, l) => s + l.price, 0)

export function MarketplaceFlow({ accent, startDelay = 670 }: PreviewProps) {
  const t = useTranslations('previews.marketplace')
  const reduceMotion = useReducedMotion()
  const [screen, setScreen] = useState(0)
  const [inCart, setInCart] = useState(0)
  const [tapping, setTapping] = useState(false)
  const [placed, setPlaced] = useState(false) // checkout tapped on the summary

  useEffect(() => {
    if (reduceMotion) return undefined
    const timers: ReturnType<typeof setTimeout>[] = []
    const runAdds = () => {
      timers.push(setTimeout(() => setInCart(1), startDelay))
      timers.push(setTimeout(() => setInCart(2), startDelay + 500))
      timers.push(setTimeout(() => setInCart(3), startDelay + 1000))
      timers.push(setTimeout(() => setTapping(true), startDelay + 1600)) // tap the cart icon
      timers.push(
        setTimeout(() => {
          setScreen(1)
          setTapping(false)
        }, startDelay + 2000),
      )
      timers.push(setTimeout(() => setPlaced(true), startDelay + 3400)) // tap Checkout -> placed
    }
    const restart = () => {
      setScreen(0)
      setInCart(0)
      setPlaced(false)
      runAdds()
      timers.push(setTimeout(restart, startDelay + 4500))
    }
    runAdds() // first cycle (state already at defaults — no sync setState in effect body)
    timers.push(setTimeout(restart, startDelay + 4500))
    return () => timers.forEach(clearTimeout)
  }, [reduceMotion, startDelay])

  return (
    <PreviewScreen>
      <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          {screen === 0 ? (
            <motion.div
              key="browse"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: PAD }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.9 }}>
                {PILL_KEYS.map((pillKey, i) => (
                  <Box
                    key={pillKey}
                    sx={{
                      fontSize: 10,
                      fontWeight: 700,
                      px: 1,
                      py: 0.4,
                      borderRadius: `${R}px`,
                      bgcolor: i === 0 ? accent : 'action.hover',
                      color: i === 0 ? 'common.white' : 'text.secondary',
                    }}
                  >
                    {t(pillKey)}
                  </Box>
                ))}
                <Box sx={{ position: 'relative', ml: 'auto', display: 'grid', placeItems: 'center', width: 26, height: 26 }}>
                  <ShoppingCartOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                  {inCart > 0 && (
                    <motion.div
                      key={inCart}
                      initial={reduceMotion ? false : { scale: 0.4 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                      style={{
                        position: 'absolute',
                        top: -4,
                        right: -4,
                        minWidth: 14,
                        height: 14,
                        padding: '0 3px',
                        borderRadius: 7,
                        background: accent,
                        color: '#fff',
                        fontSize: 9,
                        fontWeight: 800,
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {inCart}
                    </motion.div>
                  )}
                  {tapping && !reduceMotion && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 2.6, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      style={{ position: 'absolute', inset: 0, margin: 'auto', width: 24, height: 24, borderRadius: '50%', background: accent }}
                    />
                  )}
                </Box>
              </Box>
              {LISTINGS.map((l, i) => {
                const added = inCart > i
                return (
                  <Box
                    key={l.key}
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 0.6,
                      mb: 0.6,
                      borderRadius: `${R}px`,
                      bgcolor: 'action.hover',
                    }}
                  >
                    {added && !reduceMotion && (
                      <motion.span
                        initial={{ opacity: 0.2 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.9 }}
                        style={{ position: 'absolute', inset: 0, borderRadius: R, background: accent, pointerEvents: 'none' }}
                      />
                    )}
                    <Box
                      sx={{
                        position: 'relative',
                        width: 30,
                        height: 30,
                        borderRadius: `${R - 2}px`,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 17,
                        bgcolor: 'background.paper',
                      }}
                    >
                      {l.emoji}
                    </Box>
                    <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
                      <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary' }}>{t(l.key)}</Box>
                      <Box sx={{ fontSize: 9.5, fontWeight: 700, color: accent }}>
                        ★{l.rating} {t('seller')}
                      </Box>
                    </Box>
                    <Box sx={{ position: 'relative', fontSize: 12, fontWeight: 800, color: accent }}>{formatEUR(l.price)}</Box>
                  </Box>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: PAD }}
            >
              {/* TODO(i18n): "Your cart" / "Total" / "Checkout" / "Order placed" literals — localize before final */}
              <Box sx={{ fontSize: 12, fontWeight: 800, color: 'text.primary', mb: 0.75 }}>Your cart · {LISTINGS.length} items</Box>
              {LISTINGS.map((l) => (
                <Box key={l.key} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.4 }}>
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: `${R - 2}px`,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 15,
                      bgcolor: 'action.hover',
                    }}
                  >
                    {l.emoji}
                  </Box>
                  <Box sx={{ flex: 1, fontSize: 11.5, fontWeight: 700, color: 'text.primary' }}>{t(l.key)}</Box>
                  <Box sx={{ fontSize: 11.5, fontWeight: 800, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>
                    {formatEUR(l.price)}
                  </Box>
                </Box>
              ))}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 0.5,
                  pt: 0.5,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary' }}>Total</Box>
                <Box sx={{ fontSize: 15, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>
                  {formatEUR(CART_TOTAL)}
                </Box>
              </Box>
              <Box
                component={motion.div}
                animate={placed && !reduceMotion ? { scale: [1, 0.95, 1] } : {}}
                transition={{ duration: 0.3 }}
                sx={{
                  position: 'relative',
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.75,
                  py: 1,
                  borderRadius: `${R}px`,
                  bgcolor: placed ? 'success.main' : accent,
                  color: 'common.white',
                  fontSize: 12,
                  fontWeight: 800,
                  transition: 'background-color 0.3s ease',
                }}
              >
                {placed ? (
                  <>
                    <motion.span
                      initial={reduceMotion ? false : { scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                      style={{ display: 'grid' }}
                    >
                      <Check sx={{ fontSize: 16 }} />
                    </motion.span>
                    Order placed
                  </>
                ) : (
                  `Checkout · ${formatEUR(CART_TOTAL)}`
                )}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
