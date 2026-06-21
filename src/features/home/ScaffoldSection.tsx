'use client'

// TEMPORARY SCAFFOLD — research-backed homepage skeleton.
// Renders a section's brief (purpose + what-goes-here, taken from the 112-site research
// blueprint — see portfolio-research.md) directly on screen, so the final information
// architecture is visible and fillable section by section. Replace each scaffold with a
// real implementation, then drop it from the scaffold treatment. Sections that already have
// a real component (the demoted flip-card) pass it as `children`.

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import type { HomeSectionSpec } from './homeSections'

interface ScaffoldSectionProps {
  index: number
  spec: HomeSectionSpec
  children?: ReactNode
}

export function ScaffoldSection({ index, spec, children }: ScaffoldSectionProps) {
  const embedded = spec.status === 'embedded'
  return (
    <Box
      component="section"
      id={spec.id}
      sx={{
        py: { xs: 5, md: 8 },
        borderTop: '1px dashed',
        borderColor: 'divider',
        bgcolor: embedded ? 'transparent' : 'action.hover',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={1.5}>
          <Chip
            size="small"
            variant="outlined"
            color={embedded ? 'success' : 'warning'}
            label={embedded ? `Section ${index} · KEEP — reframe heading` : `Section ${index} · SCAFFOLD`}
            sx={{ alignSelf: 'flex-start', fontWeight: 700 }}
          />

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {spec.title}
          </Typography>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Purpose
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {spec.purpose}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              What goes here
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {spec.recommended}
            </Typography>
          </Box>

          {children ? (
            <Box sx={{ mt: 2 }}>{children}</Box>
          ) : (
            <Stack spacing={1} sx={{ mt: 2, opacity: 0.45 }} aria-hidden>
              <Box sx={{ height: 18, borderRadius: 1, bgcolor: 'text.disabled', width: '55%' }} />
              <Box sx={{ height: 90, borderRadius: 1, bgcolor: 'text.disabled' }} />
              <Box sx={{ height: 18, borderRadius: 1, bgcolor: 'text.disabled', width: '35%' }} />
            </Stack>
          )}
        </Stack>
      </Container>
    </Box>
  )
}
