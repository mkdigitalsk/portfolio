'use client'

import { ExpandMore, OpenInNew } from '@mui/icons-material'
import { Box, Collapse, IconButton, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useState } from 'react'
import { Chip, Divider, TextH6BoldPrimary } from '@/shared/components'

export interface SkillItem {
  label: string
  // When set, the chip becomes a link to that platform's showcase (repo / live demo).
  href?: string
}

interface SkillGroupProps {
  title: string
  items: SkillItem[]
}

export function SkillGroup({ title, items }: SkillGroupProps) {
  const [open, setOpen] = useState(true)

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        }}
      >
        <TextH6BoldPrimary>{title}</TextH6BoldPrimary>
        <IconButton size="small" onClick={() => setOpen((prev) => !prev)} aria-label={title}>
          <ExpandMore
            sx={{
              transition: 'transform 0.2s ease',
              transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
            }}
          />
        </IconButton>
      </Box>
      <Divider />
      <Collapse in={open}>
        <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap', p: 2 }}>
          {items.map((item) =>
            item.href ? (
              <Chip
                key={item.label}
                label={item.label}
                variant="outlined"
                color="primary"
                clickable
                component="a"
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                icon={<OpenInNew sx={{ fontSize: 16 }} />}
              />
            ) : (
              <Chip key={item.label} label={item.label} variant="outlined" />
            )
          )}
        </Stack>
      </Collapse>
    </Box>
  )
}
