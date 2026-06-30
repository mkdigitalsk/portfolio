'use client'

import Box from '@mui/material/Box'
import type { SxProps, Theme } from '@mui/material/styles'
import { Brand, Light, Dark } from '@/shared/theme/color'

type LogoVariant = 'mark' | 'wordmark' | 'lockup'

interface LogoProps {
  variant?: LogoVariant
  height?: number
  sx?: SxProps<Theme>
}

// 2 bands clipped to text — MK is white/navy (top) + blue (bottom), mirroring the mark's top two
// stripes. Teal lives only in the mark + the descriptor; the wordmark stays two-tone (FINAL).
const bands = (bars: readonly string[]) =>
  `linear-gradient(to bottom, ${bars[0]} 0 52%, ${bars[1]} 52% 100%)`

// Bar/stripe colors swap light↔dark in pure CSS (applyStyles) → SSR-safe, no JS mode detection.
function StackMark({ size }: { size: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 64 64"
      aria-hidden
      sx={[
        { width: size, height: size, display: 'block', flexShrink: 0, '--bar1': Light.stack[0], '--bar2': Light.stack[1] },
        (theme) => theme.applyStyles('dark', { '--bar1': Dark.stack[0], '--bar2': Dark.stack[1] }),
      ]}
    >
      <rect x="10" y="10" width="44" height="12" rx="3" fill="var(--bar1)" />
      <rect x="10" y="26" width="44" height="12" rx="3" fill="var(--bar2)" />
      <rect x="10" y="42" width="44" height="12" rx="3" fill={Brand.teal} />
    </Box>
  )
}

export function Logo({ variant = 'wordmark', height = 28, sx }: LogoProps) {
  if (variant === 'mark') {
    return (
      <Box role="img" aria-label="MK Digital" sx={sx}>
        <StackMark size={height} />
      </Box>
    )
  }

  const isLockup = variant === 'lockup'
  const wordSize = height * (isLockup ? 0.52 : 0.62)

  return (
    <Box role="img" aria-label="MK Digital" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, ...sx }}>
      <StackMark size={height} />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
        <Box
          component="span"
          sx={{ fontFamily: (t) => t.typography.h6.fontFamily, fontWeight: 800, fontSize: wordSize, letterSpacing: '-0.02em' }}
        >
          <Box
            component="span"
            aria-hidden
            sx={[
              {
                display: 'inline-block', // establishes a box so -webkit-background-clip: text actually paints
                backgroundImage: bands(Light.stack),
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitTextFillColor: 'transparent',
              },
              (t) => t.applyStyles('dark', { backgroundImage: bands(Dark.stack) }),
            ]}
          >
            MK
          </Box>
          <Box component="span" aria-hidden sx={{ color: 'text.primary' }}>
            Digital
          </Box>
        </Box>
        {isLockup && (
          <>
            <Box
              aria-hidden
              sx={{
                height: '1.5px',
                width: '100%',
                mt: 0.5,
                background: `linear-gradient(to right, transparent, ${Brand.teal} 12%, ${Brand.teal} 88%, transparent)`,
              }}
            />
            <Box
              aria-hidden
              sx={[
                {
                  display: 'flex',
                  width: '100%', // stretch the descriptor edge-to-edge across the wordmark width
                  justifyContent: 'space-between',
                  fontFamily: (t) => t.typography.h6.fontFamily,
                  fontWeight: 600, // subordinate to the wordmark — tagline whispers
                  fontSize: height * 0.13,
                  mt: 0.3,
                  color: Brand.tealDark,
                },
                (t) => t.applyStyles('dark', { color: Brand.teal }),
              ]}
            >
              {'SOFTWARE STUDIO'.split('').map((ch, i) => (
                <Box component="span" key={i} sx={ch === ' ' ? { width: '0.35em' } : undefined}>
                  {ch === ' ' ? '' : ch}
                </Box>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
