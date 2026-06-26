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

// 3 equal horizontal bands clipped to text — reproduces the tricolor "MK" of the mark.
const bands = (bars: readonly string[]) =>
  `linear-gradient(to bottom, ${bars[0]} 0 33.33%, ${bars[1]} 33.33% 66.66%, ${bars[2]} 66.66% 100%)`

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
      <rect x="8" y="12" width="48" height="11" rx="3" fill="var(--bar1)" />
      <rect x="8" y="27" width="48" height="11" rx="3" fill="var(--bar2)" />
      <rect x="8" y="42" width="48" height="11" rx="3" fill={Brand.teal} />
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
          <Box
            component="span"
            aria-hidden
            sx={[
              {
                fontFamily: (t) => t.typography.h6.fontFamily,
                fontWeight: 600,
                fontSize: height * 0.155,
                letterSpacing: '0.3em',
                mt: 0.4,
                color: Brand.tealDark,
              },
              (t) => t.applyStyles('dark', { color: Brand.teal }),
            ]}
          >
            SOFTWARE&nbsp;STUDIO
          </Box>
        )}
      </Box>
    </Box>
  )
}
