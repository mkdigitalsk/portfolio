'use client'

import { Download, GitHub } from '@mui/icons-material'
import { Box, List, ListItem, ListItemIcon, ListItemText, Stack, Tooltip } from '@mui/material'
import { useTranslations } from 'next-intl'
import { Chip } from '@/shared/components'
import { PlatformIcon, type Platform } from '@/shared/components/icons/PlatformIcon'

export interface Showcase {
  platform: Platform
  label: string
  descriptionKey?: string
  repoUrl: string
  appUrl?: string
}

interface ShowcaseListProps {
  items: Showcase[]
}

const linkChipSx = {
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
  '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
}

export function ShowcaseList({ items }: ShowcaseListProps) {
  const t = useTranslations('showcases')

  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItem key={item.label} divider disableGutters sx={{ gap: 1 }}>
          <ListItemIcon sx={{ minWidth: 44 }}>
            <PlatformIcon platform={item.platform} />
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            secondary={item.descriptionKey ? t(item.descriptionKey) : undefined}
            sx={{ flex: 1, my: 0 }}
          />
          <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
            <Box
              component="a"
              href={item.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('viewCode', { name: item.label })}
              sx={{ textDecoration: 'none' }}
            >
              <Chip icon={<GitHub />} label={t('code')} variant="outlined" size="small" sx={linkChipSx} />
            </Box>
            {item.appUrl ? (
              <Box
                component="a"
                href={item.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('openApp', { name: item.label })}
                sx={{ textDecoration: 'none' }}
              >
                <Chip
                  icon={<Download />}
                  label={t('app')}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={linkChipSx}
                />
              </Box>
            ) : (
              <Tooltip title={t('appComingSoon')}>
                <Box component="span">
                  <Chip icon={<Download />} label={t('app')} variant="outlined" size="small" disabled />
                </Box>
              </Tooltip>
            )}
          </Stack>
        </ListItem>
      ))}
    </List>
  )
}
