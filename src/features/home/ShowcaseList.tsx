'use client'

import { Download, GitHub } from '@mui/icons-material'
import { Box, List, ListItem, ListItemIcon, ListItemText, Stack, Tooltip } from '@mui/material'
import { Chip } from '@/shared/components'
import { PlatformIcon, type Platform } from '@/shared/components/icons/PlatformIcon'

export interface Showcase {
  platform: Platform
  label: string
  description?: string
  // Always present — links to the source repo.
  repoUrl: string
  // Optional — the deployed app / downloadable artifact (web URL, APK, TestFlight).
  // The "App" pill activates once this exists; until then it shows "coming soon".
  appUrl?: string
}

interface ShowcaseListProps {
  items: Showcase[]
}

// Hover affordance for the link pills. The Chip stays a plain (non-clickable)
// chip; the surrounding anchor carries the navigation — this avoids MUI's
// clickable Chip-as-link path, which mismatches between SSR and client.
const linkChipSx = {
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, background-color 0.15s ease',
  '&:hover': { borderColor: 'primary.main', backgroundColor: 'action.hover' },
}

export function ShowcaseList({ items }: ShowcaseListProps) {
  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItem key={item.label} divider disableGutters sx={{ gap: 1 }}>
          <ListItemIcon sx={{ minWidth: 44 }}>
            <PlatformIcon platform={item.platform} />
          </ListItemIcon>
          <ListItemText primary={item.label} secondary={item.description} sx={{ flex: 1, my: 0 }} />
          <Stack direction="row" spacing={0.75} sx={{ flexShrink: 0 }}>
            <Box
              component="a"
              href={item.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${item.label} code`}
              sx={{ textDecoration: 'none' }}
            >
              <Chip icon={<GitHub />} label="Code" variant="outlined" size="small" sx={linkChipSx} />
            </Box>
            {item.appUrl ? (
              <Box
                component="a"
                href={item.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${item.label} app`}
                sx={{ textDecoration: 'none' }}
              >
                <Chip icon={<Download />} label="App" color="primary" variant="outlined" size="small" sx={linkChipSx} />
              </Box>
            ) : (
              <Tooltip title="App coming soon">
                <Box component="span">
                  <Chip icon={<Download />} label="App" variant="outlined" size="small" disabled />
                </Box>
              </Tooltip>
            )}
          </Stack>
        </ListItem>
      ))}
    </List>
  )
}
