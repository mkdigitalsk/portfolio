'use client'

import { Check } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { PreviewScreen, type PreviewProps } from './PreviewKit'
import {
  CONFIRM_GAP_MS,
  DETAIL_HOLD_MS,
  FIRST_BEAT_MS,
  LOOP_GAP_MS,
  POP_SPRING,
  PRESS_DIP,
  PRESS_TRANSITION,
  SCREEN_FADE_S,
  SCREEN_SLIDE_PX,
  STEP_MS,
  TAP_RIPPLE_S,
  TAP_TO_FLIP_MS,
} from './previewTiming'

// Food-delivery micro-theme: Uber Eats / Wolt vibe. Flow: MENU scrolls down the list until the
// burger lands in the middle -> tap it -> "build your burger": ingredients tick in (the burger
// reacts with a little bounce), then Add to order is confirmed. About the food, not price.

const R = 13 // medium-large, food-app radius

// Menu scroll-to-burger
const ROW_H = 48
const VISIBLE = 3
const BURGER_INDEX = 6 // the scroll lands with the burger in the middle of the 3 visible rows
const SCROLL_Y = -(BURGER_INDEX - 1) * ROW_H // bring row (BURGER_INDEX-1) to the window top → burger centered
const SCROLL_DELAY_S = 0.86 // flip reveal ≈840ms + 20ms: show the top (pizza) first, then scroll
const SCROLL_DUR_S = 1.4 // longer travel — scroll passes several items before the burger lands

// Dish + topping names are content (proper nouns) kept inline; the UI chrome below is localized.
const DISHES = [
  { key: 'pizza', emoji: '🍕', meta: '★ 4.8 · 25 min', price: '€9.50' },
  { name: 'Caesar salad', emoji: '🥗', meta: '★ 4.7 · 15 min', price: '€8.20' },
  { name: 'Tacos', emoji: '🌮', meta: '★ 4.5 · 20 min', price: '€6.90' },
  { key: 'ramen', emoji: '🍜', meta: '★ 4.9 · 30 min', price: '€11.00' },
  { name: 'Sushi set', emoji: '🍣', meta: '★ 4.8 · 35 min', price: '€14.00' },
  { name: 'Pasta', emoji: '🍝', meta: '★ 4.6 · 25 min', price: '€9.80' },
  { key: 'burger', emoji: '🍔', meta: '★ 4.6 · 20 min', price: '€7.90' }, // the target (index 6)
  { name: 'Poke bowl', emoji: '🥡', meta: '★ 4.7 · 25 min', price: '€12.50' },
  { name: 'Wings', emoji: '🍗', meta: '★ 4.5 · 20 min', price: '€8.90' },
  { name: 'Falafel wrap', emoji: '🥙', meta: '★ 4.6 · 15 min', price: '€6.50' },
]

const TOPPINGS = [
  { id: 'cheese', emoji: '🧀', name: 'Extra cheese' },
  { id: 'bacon', emoji: '🥓', name: 'Crispy bacon' },
  { id: 'avocado', emoji: '🥑', name: 'Avocado' },
]

function CustomizeBurger({ accent, name, t }: { accent: string; name: string; t: ReturnType<typeof useTranslations> }) {
  const reduceMotion = useReducedMotion()
  const [picked, setPicked] = useState(0)
  const [ordered, setOrdered] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined
    const timers = TOPPINGS.map((_, i) => setTimeout(() => setPicked(i + 1), FIRST_BEAT_MS + i * STEP_MS))
    timers.push(setTimeout(() => setOrdered(true), FIRST_BEAT_MS + TOPPINGS.length * STEP_MS + CONFIRM_GAP_MS))
    return () => timers.forEach(clearTimeout)
  }, [reduceMotion])

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
        <Box
          sx={{
            width: 46,
            height: 46,
            borderRadius: `${R}px`,
            display: 'grid',
            placeItems: 'center',
            fontSize: 28,
            flexShrink: 0,
            bgcolor: 'action.hover',
          }}
        >
          🍔
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}>{name}</Box>
          <Box sx={{ fontSize: 10.5, color: 'text.secondary' }}>{t('buildYourBurger')}</Box>
        </Box>
      </Box>

      {TOPPINGS.map((top, i) => {
        const on = i < picked
        return (
          <Box key={top.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 34, px: 0.5 }}>
            <motion.div
              initial={false}
              animate={{ scale: on ? [0.85, 1.22, 1] : 0.92, backgroundColor: on ? accent : 'rgba(0,0,0,0)' }}
              transition={{
                scale: { duration: 0.42, times: [0, 0.55, 1], ease: 'easeOut' },
                backgroundColor: { duration: 0.2 },
              }}
              style={{
                width: 19,
                height: 19,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                border: on ? 'none' : '2px solid rgba(140,140,140,0.5)',
                color: '#fff',
              }}
            >
              <motion.span
                initial={false}
                animate={{ scale: on ? 1 : 0 }}
                transition={{ duration: 0.18 }}
                style={{ display: 'grid' }}
              >
                <Check sx={{ fontSize: 13 }} />
              </motion.span>
            </motion.div>
            <Box sx={{ fontSize: 17, lineHeight: 1 }}>{top.emoji}</Box>
            <Box sx={{ flex: 1, fontSize: 12, fontWeight: on ? 700 : 500, color: 'text.primary' }}>{top.name}</Box>
          </Box>
        )
      })}

      <Box
        component={motion.div}
        animate={ordered && !reduceMotion ? { scale: [1, 0.95, 1] } : {}}
        transition={{ duration: 0.3 }}
        sx={{
          mt: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.75,
          height: 36,
          borderRadius: `${R}px`,
          bgcolor: accent,
          color: '#fff',
          fontSize: 12,
          fontWeight: 800,
          transition: 'background-color 0.3s ease',
        }}
      >
        {ordered ? (
          <>
            <motion.span
              initial={reduceMotion ? false : { scale: 0 }}
              animate={{ scale: 1 }}
              transition={POP_SPRING}
              style={{ display: 'grid' }}
            >
              <Check sx={{ fontSize: 16 }} />
            </motion.span>
            {t('addedToOrder')}
          </>
        ) : (
          t('addToOrder')
        )}
      </Box>
    </>
  )
}

export function FoodFlow({ accent, startDelay = 900 }: PreviewProps) {
  const t = useTranslations('previews.food')
  const reduceMotion = useReducedMotion()
  const [screen, setScreen] = useState(0) // start on the MENU
  const [tapping, setTapping] = useState(false)

  useEffect(() => {
    if (reduceMotion) return undefined
    const timers: ReturnType<typeof setTimeout>[] = []
    const cycle = () => {
      timers.push(setTimeout(() => setTapping(true), startDelay)) // tap the burger (now centered)
      timers.push(
        setTimeout(() => {
          setScreen(1)
          setTapping(false)
        }, startDelay + TAP_TO_FLIP_MS),
      )
      timers.push(setTimeout(() => setScreen(0), startDelay + TAP_TO_FLIP_MS + DETAIL_HOLD_MS))
      timers.push(setTimeout(cycle, startDelay + TAP_TO_FLIP_MS + DETAIL_HOLD_MS + LOOP_GAP_MS))
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
              key="menu"
              initial={{ opacity: 0, x: -SCREEN_SLIDE_PX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -SCREEN_SLIDE_PX }}
              transition={{ duration: SCREEN_FADE_S }}
              style={{ padding: '0 12px' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 1.25,
                  py: 0.9,
                  mb: 1,
                  borderRadius: `${R}px`,
                  bgcolor: 'action.hover',
                  fontSize: 11,
                  fontWeight: 400,
                  color: 'text.secondary',
                }}
              >
                🔍&nbsp;{t('restaurantsNearYou')}
              </Box>
              <Box sx={{ height: ROW_H * VISIBLE, overflow: 'hidden' }}>
                <motion.div
                  initial={reduceMotion ? { y: SCROLL_Y } : { y: 0 }}
                  animate={{ y: SCROLL_Y }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { delay: SCROLL_DELAY_S, duration: SCROLL_DUR_S, ease: [0.4, 0, 0.2, 1] }
                  }
                >
                  {DISHES.map((d, i) => (
                    <Box
                      key={d.key ?? d.name}
                      component={motion.div}
                      animate={tapping && i === BURGER_INDEX && !reduceMotion ? { scale: PRESS_DIP } : {}}
                      transition={PRESS_TRANSITION}
                      sx={{
                        position: 'relative',
                        height: ROW_H,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.25,
                        px: 0.75,
                        borderRadius: `${R}px`,
                        bgcolor: i === BURGER_INDEX && tapping ? 'action.selected' : 'transparent',
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: `${R - 3}px`,
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 18,
                          flexShrink: 0,
                          bgcolor: 'action.hover',
                        }}
                      >
                        {d.emoji}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ fontSize: 11.5, fontWeight: 500, color: 'text.primary' }}>
                          {d.key ? t(`dish.${d.key}`) : d.name}
                        </Box>
                        <Box sx={{ fontSize: 9.5, fontWeight: 400, color: 'text.secondary' }}>{d.meta}</Box>
                      </Box>
                      <Box sx={{ fontSize: 11.5, fontWeight: 600, color: accent }}>{d.price}</Box>
                      {tapping && i === BURGER_INDEX && !reduceMotion && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0.5 }}
                          animate={{ scale: 2.4, opacity: 0 }}
                          transition={{ duration: TAP_RIPPLE_S }}
                          style={{
                            position: 'absolute',
                            left: 24,
                            top: '50%',
                            width: 24,
                            height: 24,
                            marginTop: -12,
                            borderRadius: '50%',
                            background: accent,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </motion.div>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: SCREEN_SLIDE_PX }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: SCREEN_SLIDE_PX }}
              transition={{ duration: SCREEN_FADE_S }}
              style={{ padding: '0 12px' }}
            >
              <CustomizeBurger accent={accent} name={t('dish.burger')} t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
