import { Code, Download } from '@mui/icons-material'
import { IconButton, List, ListItem, ListItemIcon, ListItemText, Stack, Tooltip } from '@mui/material'
import { PlatformIcon, type Platform } from '@/shared/components/icons/PlatformIcon'

export interface Showcase {
  platform: Platform
  label: string
  description?: string
  // Always present — links to the source repo.
  repoUrl: string
  // Optional — the deployed app / downloadable artifact (web URL, APK, TestFlight).
  // The download action only renders once this exists.
  appUrl?: string
}

interface ShowcaseListProps {
  items: Showcase[]
}

export function ShowcaseList({ items }: ShowcaseListProps) {
  return (
    <List disablePadding>
      {items.map((item) => (
        <ListItem
          key={item.label}
          divider
          secondaryAction={
            <Stack direction="row" spacing={0.5}>
              {item.appUrl && (
                <Tooltip title="Open app">
                  <IconButton
                    component="a"
                    href={item.appUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${item.label} app`}
                    size="small"
                  >
                    <Download fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="View code">
                <IconButton
                  component="a"
                  href={item.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${item.label} code`}
                  size="small"
                >
                  <Code fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        >
          <ListItemIcon sx={{ minWidth: 44 }}>
            <PlatformIcon platform={item.platform} />
          </ListItemIcon>
          <ListItemText primary={item.label} secondary={item.description} />
        </ListItem>
      ))}
    </List>
  )
}
