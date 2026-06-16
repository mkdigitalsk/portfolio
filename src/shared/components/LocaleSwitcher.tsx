'use client'

import { Check } from '@mui/icons-material'
import { Box, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { type MouseEvent, useState } from 'react'
import { LOCALES } from '../i18n/locales'

const LOCALE_MAX_AGE = 60 * 60 * 24 * 365

export function LocaleSwitcher() {
  const activeLocale = useLocale()
  const t = useTranslations('common')
  const router = useRouter()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const current = LOCALES.find((l) => l.code === activeLocale) ?? LOCALES[0]

  const handleOpen = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)

  const handleSelect = (code: string) => {
    document.cookie = `locale=${code}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax`
    setAnchor(null)
    router.refresh()
  }

  return (
    <>
      <Tooltip title={t('language')}>
        <IconButton onClick={handleOpen} size="small" aria-label={t('language')}>
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
        {LOCALES.map((option) => (
          <MenuItem key={option.code} selected={option.code === activeLocale} onClick={() => handleSelect(option.code)}>
            <Box component="span" sx={{ mr: 1.5, fontSize: 18 }}>
              {option.flag}
            </Box>
            {option.label}
            {option.code === activeLocale && (
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
