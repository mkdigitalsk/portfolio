'use client'

import { Check, FavoriteBorder } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'

// E-commerce micro-theme: Shopify/Amazon vibe. Distinct flow: on the product page you PICK A SIZE,
// then Add to Cart -> the button confirms "Added" and the cart badge bumps +1. Two screens.
// Layout: square product thumb (left) + details (right), wishlist + Add-to-Cart split along the bottom.

const R = 11 // medium radius
const SIZES = ['S', 'M', 'L'] as const
const PICK = 1 // auto-select M

const PRODUCTS = [
  { key: 'runningShoes', emoji: '👟', price: '€89.00' },
  { key: 'headphones', emoji: '🎧', price: '€149.00' },
  { key: 'smartWatch', emoji: '⌚', price: '€199.00' },
]
const CHOSEN = PRODUCTS[1]

function CartBadge({ accent, count }: { accent: string; count: number }) {
  return (
    <Box sx={{ position: 'relative', width: 32, height: 32, borderRadius: `${R}px`, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', fontSize: 14 }}>
      🛒
      <motion.div
        key={count}
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        style={{
          position: 'absolute',
          top: -4,
          right: -4,
          minWidth: 15,
          height: 15,
          padding: '0 3px',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          background: accent,
          color: '#fff',
          fontSize: 9.5,
          fontWeight: 800,
        }}
      >
        {count}
      </motion.div>
    </Box>
  )
}

function ProductDetail({ accent, t, startDelay }: { accent: string; t: ReturnType<typeof useTranslations>; startDelay: number }) {
  const reduceMotion = useReducedMotion()
  const [size, setSize] = useState<number | null>(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined // reduced motion: static product, nothing picked
    const t1 = setTimeout(() => setSize(PICK), startDelay)
    const t2 = setTimeout(() => setAdded(true), startDelay + 850)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [reduceMotion, startDelay])

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
        <CartBadge accent={accent} count={added ? 3 : 2} />
      </Box>

      {/* TODO(i18n): "Size" / "Added" literals — localize before final */}
      <Box sx={{ display: 'flex', gap: 1.25, mb: 1.25 }}>
        <Box sx={{ width: 76, height: 76, borderRadius: `${R}px`, display: 'grid', placeItems: 'center', bgcolor: 'action.hover', fontSize: 40, flexShrink: 0 }}>
          {CHOSEN.emoji}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0, pr: 4 }}>
          <Box sx={{ fontSize: 13.5, fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>{t(CHOSEN.key)}</Box>
          <Box sx={{ fontSize: 15, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>{CHOSEN.price}</Box>
          <Box sx={{ fontSize: 9.5, color: 'text.secondary', mt: 0.25, mb: 0.6 }}>★★★★☆ 124 {t('reviews')}</Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
            <Box sx={{ fontSize: 9.5, fontWeight: 700, color: 'text.secondary', mr: 0.1 }}>Size</Box>
            {SIZES.map((s, i) => {
              const on = size === i
              return (
                <Box
                  key={s}
                  component={motion.div}
                  animate={on && !reduceMotion ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  sx={{
                    width: 24,
                    height: 22,
                    borderRadius: `${R - 5}px`,
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 10,
                    fontWeight: 800,
                    border: '1.5px solid',
                    borderColor: on ? accent : 'divider',
                    bgcolor: on ? accent : 'transparent',
                    color: on ? '#fff' : 'text.secondary',
                    transition: 'background-color 0.2s ease, border-color 0.2s ease',
                  }}
                >
                  {s}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 0.75 }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 1,
            borderRadius: `${R}px`,
            border: '1.5px solid',
            borderColor: 'divider',
            color: 'text.secondary',
          }}
        >
          <FavoriteBorder sx={{ fontSize: 17 }} />
        </Box>
        <Box
          component={motion.div}
          animate={added && !reduceMotion ? { scale: [1, 0.95, 1] } : {}}
          transition={{ duration: 0.3 }}
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            py: 1,
            borderRadius: `${R}px`,
            bgcolor: added ? 'success.main' : accent,
            color: 'common.white',
            fontSize: 12,
            fontWeight: 700,
            transition: 'background-color 0.3s ease',
          }}
        >
          {added ? (
            <>
              <motion.span
                initial={reduceMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 16 }}
                style={{ display: 'grid' }}
              >
                <Check sx={{ fontSize: 16 }} />
              </motion.span>
              Added
            </>
          ) : (
            t('addToCart')
          )}
        </Box>
      </Box>
    </Box>
  )
}

export function EcommerceFlow({ accent, startDelay = 700 }: PreviewProps) {
  const t = useTranslations('previews.ecommerce')
  const reduceMotion = useReducedMotion()
  const [screen, setScreen] = useState(1) // start on the action screen → it plays immediately on open
  const [tapping, setTapping] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined
    let flip: ReturnType<typeof setTimeout>
    const loop = setInterval(() => {
      setTapping(true)
      flip = setTimeout(() => {
        setScreen((s) => 1 - s)
        setTapping(false)
      }, 400)
    }, 3200)
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
              key="shop"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '6px 14px 0' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Box sx={{ flex: 1, px: 1.25, py: 0.75, borderRadius: `${R}px`, bgcolor: 'action.hover', fontSize: 11, color: 'text.secondary' }}>
                  🔍 {t('searchProducts')}
                </Box>
                <CartBadge accent={accent} count={2} />
              </Box>
              {PRODUCTS.map((p, i) => (
                <Box key={p.key} sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1.25, py: 1 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: `${R}px`,
                      display: 'grid',
                      placeItems: 'center',
                      bgcolor: 'action.hover',
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {p.emoji}
                  </Box>
                  <Box sx={{ flex: 1, fontSize: 11.5, fontWeight: 600, color: 'text.primary' }}>{t(p.key)}</Box>
                  <Box sx={{ fontSize: 11.5, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>{p.price}</Box>
                  {tapping && i === 1 && !reduceMotion && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.5 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      style={{
                        position: 'absolute',
                        left: 19,
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
              key="product"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              style={{ padding: '8px 14px 0' }}
            >
              <ProductDetail accent={accent} t={t} startDelay={startDelay} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
