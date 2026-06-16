'use client'

import { Check } from '@mui/icons-material'
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import { type MouseEvent, useState } from 'react'
import { useLocale } from '../hooks/useLocale'

export function LocaleSwitcher() {
  const { locale, setLocale, locales } = useLocale()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const current = locales.find((l) => l.code === locale) ?? locales[0]

  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)
  const handleSelect = (code: string) => {
    setLocale(code)
    setAnchor(null)
  }

  return (
    <>
      <Tooltip title="Language">
        <IconButton onClick={handleOpen} size="small" aria-label="Language">
          <Box component="span" sx={{ fontSize: 20, lineHeight: 1 }}>
            {current.flag}
          </Box>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {locales.map((option) => (
          <MenuItem key={option.code} selected={option.code === locale} onClick={() => handleSelect(option.code)}>
            <Box component="span" sx={{ mr: 1.5, fontSize: 18 }}>
              {option.flag}
            </Box>
            {option.label}
            {option.code === locale && (
              <ListItemIcon sx={{ ml: 'auto', minWidth: 'auto' }}>
                <Check fontSize="small" />
              </ListItemIcon>
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
