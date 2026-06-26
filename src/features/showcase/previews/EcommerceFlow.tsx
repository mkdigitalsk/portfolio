'use client'

import { Check } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'
import {
  DETAIL_HOLD_MS,
  LOOP_GAP_MS,
  POP_SPRING,
  PRESS_DIP,
  PRESS_TRANSITION,
  SCREEN_FADE_S,
  SCREEN_SLIDE_PX,
  TAP_RIPPLE_S,
  TAP_TO_FLIP_MS,
} from './previewTiming'

// E-commerce micro-theme: Nike/ASOS product page. Distinct flow (no other demo does this): on the
// product page you pick a COLORWAY and the product panel recolors live, then a size, then Add to
// bag -> "Added" + the bag badge bumps. Variant configuration, not a cart or a checklist.

const R = 11
// Product names are content (proper nouns) kept inline; the UI chrome is localized.
const PRODUCTS = [
  { name: 'Aero Runner', emoji: '👟', price: 'from €119' },
  { name: 'Track Jacket', emoji: '🧥', price: '€189.00' },
  { name: 'Daypack', emoji: '🎒', price: '€89.00' },
]
const CHOSEN = PRODUCTS[0]

// Each colorway has its own price — that's why the shopper settles on #2 (the cheapest).
const COLORWAYS = [
  { id: 'charcoal', hex: '#33363D', price: '€139.00' },
  { id: 'teal', hex: '#2E9E8F', price: '€119.00' },
  { id: 'coral', hex: '#E0734A', price: '€149.00' },
]
const SIZES = ['UK 8', 'UK 9', 'UK 10']
const PICK_SIZE = 1 // UK 9

// Browse the colorways like a real shopper: swatch 2 → 3 → back to 2. Each recolors the panel and
// the price follows; he settles on #2 because it's the cheapest.
const COLOR_SEQUENCE = [1, 2, 1]
const SETTLED_COLOR = COLOR_SEQUENCE[COLOR_SEQUENCE.length - 1]
const FIRST_COLOR_MS = 420
const COLOR_STEP_MS = 400
const SIZE_MS = FIRST_COLOR_MS + COLOR_SEQUENCE.length * COLOR_STEP_MS // browsing done → pick size
const ADD_MS = SIZE_MS + 680 // → Add to bag

function BagBadge({ accent, count }: { accent: string; count: number }) {
  return (
    <Box sx={{ position: 'relative', width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', bgcolor: 'rgba(255,255,255,0.22)', fontSize: 14 }}>
      🛍️
      <motion.div
        key={count}
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={POP_SPRING}
        style={{
          position: 'absolute',
          top: -3,
          right: -3,
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

function ProductDetail({ accent, t }: { accent: string; t: ReturnType<typeof useTranslations> }) {
  const reduceMotion = useReducedMotion()
  const [color, setColor] = useState(reduceMotion ? SETTLED_COLOR : 0)
  const [size, setSize] = useState<number | null>(reduceMotion ? PICK_SIZE : null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined
    const timers = COLOR_SEQUENCE.map((c, i) => setTimeout(() => setColor(c), FIRST_COLOR_MS + i * COLOR_STEP_MS))
    timers.push(setTimeout(() => setSize(PICK_SIZE), SIZE_MS))
    timers.push(setTimeout(() => setAdded(true), ADD_MS))
    return () => timers.forEach(clearTimeout)
  }, [reduceMotion])

  return (
    <Box>
      <Box
        component={motion.div}
        animate={{ backgroundColor: COLORWAYS[color].hex }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        sx={{ position: 'relative', height: 60, borderRadius: `${R}px`, display: 'grid', placeItems: 'center', fontSize: 30, mb: 0.75 }}
      >
        {CHOSEN.emoji}
        <Box sx={{ position: 'absolute', top: 6, right: 6 }}>
          <BagBadge accent={accent} count={added ? 3 : 2} />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Box sx={{ fontSize: 13.5, fontWeight: 700, color: 'text.primary', letterSpacing: '-0.01em' }}>{CHOSEN.name}</Box>
        <Box
          component={motion.div}
          key={color}
          initial={reduceMotion ? false : { scale: 0.8, opacity: 0.4 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          sx={{ fontSize: 15, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}
        >
          {COLORWAYS[color].price}
        </Box>
      </Box>
      <Box sx={{ fontSize: 9.5, color: 'text.secondary', mb: 0.75 }}>★★★★☆ 124 {t('reviews')}</Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.6 }}>
        <Box sx={{ fontSize: 9.5, fontWeight: 700, color: 'text.secondary', width: 30 }}>{t('color')}</Box>
        {COLORWAYS.map((c, i) => {
          const on = color === i
          return (
            <Box
              key={c.id}
              component={motion.div}
              animate={on && !reduceMotion ? { scale: [1, 1.18, 1] } : {}}
              transition={{ duration: 0.3 }}
              sx={{
                width: 19,
                height: 19,
                borderRadius: '50%',
                bgcolor: c.hex,
                outline: on ? `2px solid ${accent}` : '2px solid transparent',
                outlineOffset: 2,
              }}
            />
          )
        })}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 1 }}>
        <Box sx={{ fontSize: 9.5, fontWeight: 700, color: 'text.secondary', width: 30 }}>{t('size')}</Box>
        {SIZES.map((s, i) => {
          const on = size === i
          return (
            <Box
              key={s}
              component={motion.div}
              animate={on && !reduceMotion ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
              sx={{
                px: 0.75,
                height: 22,
                borderRadius: `${R - 5}px`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 9.5,
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

      <Box
        component={motion.div}
        animate={added && !reduceMotion ? { scale: PRESS_DIP } : {}}
        transition={PRESS_TRANSITION}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          py: 1,
          borderRadius: `${R}px`,
          bgcolor: accent,
          color: 'common.white',
          fontSize: 12,
          fontWeight: 700,
          transition: 'background-color 0.3s ease',
        }}
      >
        {added ? (
          <>
            <motion.span initial={reduceMotion ? false : { scale: 0 }} animate={{ scale: 1 }} transition={POP_SPRING} style={{ display: 'grid' }}>
              <Check sx={{ fontSize: 16 }} />
            </motion.span>
            {t('addedToBag')}
          </>
        ) : (
          t('addToBag')
        )}
      </Box>
    </Box>
  )
}

export function EcommerceFlow({ accent, startDelay = 850 }: PreviewProps) {
  const t = useTranslations('previews.ecommerce')
  const reduceMotion = useReducedMotion()
  const [screen, setScreen] = useState(0) // start on the shop
  const [tapping, setTapping] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined
    const timers: ReturnType<typeof setTimeout>[] = []
    const cycle = () => {
      timers.push(setTimeout(() => setTapping(true), startDelay)) // tap the featured product
      timers.push(
        setTimeout(() => {
          setScreen(1)
          setTapping(false)
        }, startDelay + TAP_TO_FLIP_MS),
      )
      timers.push(setTimeout(() => setScreen(0), startDelay + TAP_TO_FLIP_MS + DETAIL_HOLD_MS)) // back to shop
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
              key="shop"
              initial={{ opacity: 0, x: -SCREEN_SLIDE_PX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -SCREEN_SLIDE_PX }}
              transition={{ duration: SCREEN_FADE_S }}
              style={{ padding: '10px 14px 0' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Box sx={{ flex: 1, px: 1.25, py: 0.7, borderRadius: `${R}px`, bgcolor: 'action.hover', fontSize: 11, color: 'text.secondary' }}>
                  🔍 {t('searchProducts')}
                </Box>
                <BagBadge accent={accent} count={2} />
              </Box>
              {PRODUCTS.map((p, i) => (
                <Box
                  key={p.name}
                  component={motion.div}
                  animate={tapping && i === 0 && !reduceMotion ? { scale: PRESS_DIP } : {}}
                  transition={PRESS_TRANSITION}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    p: 0.7,
                    mb: 0.5,
                    borderRadius: `${R}px`,
                    bgcolor: i === 0 && tapping ? 'action.selected' : 'action.hover',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ width: 34, height: 34, borderRadius: `${R - 3}px`, display: 'grid', placeItems: 'center', bgcolor: 'background.paper', fontSize: 19, flexShrink: 0 }}>
                    {p.emoji}
                  </Box>
                  <Box sx={{ flex: 1, fontSize: 11.5, fontWeight: 600, color: 'text.primary' }}>{p.name}</Box>
                  <Box sx={{ fontSize: 11.5, fontWeight: 800, color: accent, fontVariantNumeric: 'tabular-nums' }}>{p.price}</Box>
                  {tapping && i === 0 && !reduceMotion && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.4 }}
                      animate={{ scale: 1, opacity: 0 }}
                      transition={{ duration: TAP_RIPPLE_S, ease: 'easeOut' }}
                      style={{ position: 'absolute', left: '50%', top: '50%', width: 240, height: 240, marginLeft: -120, marginTop: -120, borderRadius: '50%', background: accent, pointerEvents: 'none' }}
                    />
                  )}
                </Box>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="product"
              initial={{ opacity: 0, x: SCREEN_SLIDE_PX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: SCREEN_SLIDE_PX }}
              transition={{ duration: SCREEN_FADE_S }}
              style={{ padding: '10px 14px 0' }}
            >
              <ProductDetail accent={accent} t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
