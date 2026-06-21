'use client'

import { DarkMode, LightMode } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import { useReducedMotion } from 'motion/react'
import { useViewTransition } from '@/shared/hooks/useViewTransition'

export function ThemeModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme()
  const reduceMotion = useReducedMotion()
  const startViewTransition = useViewTransition()

  if (!mode) {
    return (
      <IconButton size="small" disabled aria-label="Toggle theme">
        <LightMode fontSize="small" />
      </IconButton>
    )
  }

  const resolved = mode === 'system' ? systemMode : mode
  const isDark = resolved === 'dark'
  const isSystem = mode === 'system'

  const handleToggle = () => {
    const opposite = systemMode === 'dark' ? 'light' : 'dark'
    const next = isSystem ? opposite : 'system'
    if (!reduceMotion) {
      startViewTransition(() => setMode(next))
    } else {
      setMode(next)
    }
  }

  const tooltip = isSystem ? `Following system · ${resolved}` : `${resolved} · tap to follow system`

  const iconBaseSx = {
    position: 'absolute',
    inset: 0,
    fontSize: 20,
    transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease',
  }

  return (
    <Tooltip title={tooltip}>
      <IconButton onClick={handleToggle} size="small" aria-label="Toggle theme">
        <Box sx={{ position: 'relative', width: 20, height: 20 }}>
          <LightMode
            sx={{
              ...iconBaseSx,
              color: 'warning.main',
              opacity: isDark ? 0 : 1,
              transform: isDark ? 'rotate(90deg) scale(0.3)' : 'rotate(0deg) scale(1)',
            }}
          />
          <DarkMode
            sx={{
              ...iconBaseSx,
              opacity: isDark ? 1 : 0,
              transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.3)',
            }}
          />
        </Box>
      </IconButton>
    </Tooltip>
  )
}
