'use client'

import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const CATEGORIES = ['All', 'Electronics', 'Home', 'Hobby']

const LISTINGS: Record<string, { emoji: string; name: string; seller: string; price: string }[]> = {
  All: [
    { emoji: '📷', name: 'Mirrorless Camera', seller: '★ 4.9 seller', price: '€240' },
    { emoji: '🪑', name: 'Oak Lounge Chair', seller: '★ 4.8 seller', price: '€60' },
    { emoji: '🎸', name: 'Acoustic Guitar', seller: '★ 5.0 seller', price: '€150' },
  ],
  Electronics: [
    { emoji: '📷', name: 'Mirrorless Camera', seller: '★ 4.9 seller', price: '€240' },
    { emoji: '🎧', name: 'Studio Headphones', seller: '★ 4.7 seller', price: '€85' },
    { emoji: '⌚', name: 'Smart Watch', seller: '★ 4.8 seller', price: '€120' },
  ],
  Home: [
    { emoji: '🪑', name: 'Oak Lounge Chair', seller: '★ 4.8 seller', price: '€60' },
    { emoji: '🖼️', name: 'Framed Wall Art', seller: '★ 4.9 seller', price: '€40' },
    { emoji: '🛋️', name: 'Linen Sofa', seller: '★ 4.6 seller', price: '€320' },
  ],
  Hobby: [
    { emoji: '🎸', name: 'Acoustic Guitar', seller: '★ 5.0 seller', price: '€150' },
    { emoji: '🚲', name: 'City Bike', seller: '★ 4.8 seller', price: '€180' },
    { emoji: '📚', name: 'Classic Novels', seller: '★ 4.7 seller', price: '€25' },
  ],
}

export function MarketplaceTabs({ accent }: PreviewProps) {
  const reduceMotion = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % CATEGORIES.length)
    }, 2500)
    return () => clearInterval(id)
  }, [reduceMotion])

  const active = CATEGORIES[index]
  const listings = LISTINGS[active]

  return (
    <PreviewScreen>
      {/* title */}
      <Box sx={{ px: 1.5, pb: 0.75 }}>
        <Box sx={{ fontSize: 12, fontWeight: 800, color: 'text.primary' }}>Marketplace</Box>
      </Box>

      {/* category tabs */}
      <Box sx={{ position: 'relative', px: 1.5, pb: 1 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {CATEGORIES.map((cat) => {
            const isActive = cat === active
            return (
              <Box key={cat} sx={{ position: 'relative', pb: 0.5 }}>
                <Box
                  sx={{
                    fontSize: 11,
                    fontWeight: isActive ? 800 : 600,
                    color: isActive ? accent : 'text.secondary',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </Box>
                {isActive && (
                  <motion.div
                    layoutId="market-tab-underline"
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 2,
                      borderRadius: 2,
                      background: accent,
                    }}
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Box>
            )
          })}
        </Box>
        <Box sx={{ position: 'absolute', left: 12, right: 12, bottom: 6, height: 1, bgcolor: 'divider' }} />
      </Box>

      {/* listings swap per category */}
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
          >
            {listings.map((l) => (
              <Box key={l.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.6 }}>
                <Thumb emoji={l.emoji} bg={`${accent}1A`} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: 'text.primary',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {l.name}
                  </Box>
                  <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{l.seller}</Box>
                </Box>
                <Box sx={{ fontSize: 11.5, fontWeight: 800, color: accent }}>{l.price}</Box>
              </Box>
            ))}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* trust strip */}
      <Box sx={{ px: 1.5, py: 0.75, flexShrink: 0 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.5,
            py: 0.6,
            borderRadius: 2,
            bgcolor: `${accent}1A`,
            fontSize: 10.5,
            fontWeight: 700,
            color: accent,
          }}
        >
          <Box component="span" sx={{ fontSize: 11 }}>
            🔒
          </Box>
          Secure escrow · buyer protection
        </Box>
      </Box>
    </PreviewScreen>
  )
}
