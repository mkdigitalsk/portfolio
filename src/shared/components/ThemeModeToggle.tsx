'use client'

import { DarkMode, LightMode } from '@mui/icons-material'
import { Box, IconButton, Tooltip } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'

// One boolean: "do I agree with the system?" (isSystem) vs "I don't" (!system).
// Light/dark are just the side-effect. Clicking toggles agreement: from system →
// override to the opposite appearance; from override → back to following the OS.
// (No menu, no three states — see todo.md design note.)
export function ThemeModeToggle() {
  const { mode, systemMode, setMode } = useColorScheme()

  // `mode` is undefined during SSR / before hydration — stable placeholder so
  // server and first client render match (no hydration mismatch).
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
    setMode(isSystem ? opposite : 'system')
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
          {/* Sun — present in light, spins/scales out into dark */}
          <LightMode
            sx={{
              ...iconBaseSx,
              color: 'warning.main',
              opacity: isDark ? 0 : 1,
              transform: isDark ? 'rotate(90deg) scale(0.3)' : 'rotate(0deg) scale(1)',
            }}
          />
          {/* Moon — rises in from the side as dark takes over */}
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
