import Box from '@mui/material/Box'
import type { ReactNode } from 'react'
import { Reveal, TextBody1Neutral60, TextH4Bold } from '@/shared/components'
import { CONTENT_MAX, SECTION_PY, TEXT_MAX } from './layout'

interface SectionProps {
  children: ReactNode
  /** Consistent H4 section header — every content section's title goes through here. */
  title?: string
  /** Lead paragraph under the title, constrained to a readable column. */
  subtitle?: string
  /** Tinted background band (e.g. process, testimonials). */
  bg?: boolean
  /** Top border. */
  divider?: boolean
  /** Bottom border (e.g. the trust strip uses both). */
  dividerBottom?: boolean
  /** Override the standard vertical padding. */
  py?: { xs: number; md: number }
  /** Override just the TOP padding (e.g. the hero uses the shared PAGE_PT page-top constant). */
  pt?: { xs: number; md: number }
  id?: string
}

// The ONE wrapper every home section uses — width, centering, padding, edges AND the title/body
// header all live here, in one place. Change it here and every section moves together; no
// per-section copy-paste that can drift. Content stays left-aligned (TEXT_MAX for text columns).
// Hero and the final CTA intentionally render their own H1 (bookends) instead of `title`.
export function Section({ children, title, subtitle, bg, divider, dividerBottom, py = SECTION_PY, pt, id }: SectionProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        ...(bg && { bgcolor: 'action.hover' }),
        ...(divider && { borderTop: '1px solid', borderColor: 'divider' }),
        ...(dividerBottom && { borderBottom: '1px solid', borderColor: 'divider' }),
      }}
    >
      <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: { xs: 2, md: 3 }, py, ...(pt && { pt }) }}>
        {title && (
          <Reveal>
            <TextH4Bold sx={{ mb: subtitle ? 2 : 4 }}>{title}</TextH4Bold>
          </Reveal>
        )}
        {subtitle && (
          <Reveal delay={0.06}>
            <Box sx={{ mb: 5, maxWidth: TEXT_MAX }}>
              <TextBody1Neutral60>{subtitle}</TextBody1Neutral60>
            </Box>
          </Reveal>
        )}
        {children}
      </Box>
    </Box>
  )
}
