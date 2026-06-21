'use client'

import { GitHub } from '@mui/icons-material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { CONTENT_MAX } from '@/shared/layout'
import { TextBody1Neutral60, TextCaptionNeutral60 } from '../text'
import { GitHubDark, GitHubLight } from '../../theme/socialColors'

const socials = [{ label: 'GitHub', href: 'https://github.com/mkdigitalsk', Icon: GitHub, brand: 'github' as const }]
const CONTACT_EMAIL = 'admin@mkdigital.sk'
const ADDRESS = 'Medená 15387/2, 974 05 Banská Bystrica · IČO 55 450 229'

const linkSx = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  '&:hover': { color: 'primary.main' },
} as const

export function Footer() {
  const t = useTranslations()

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
      <Box
        sx={{
          maxWidth: CONTENT_MAX,
          mx: 'auto',
          px: 3,
          py: 4,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          <TextBody1Neutral60>© 2026 MK Digital s. r. o.</TextBody1Neutral60>
          <TextCaptionNeutral60>{ADDRESS}</TextCaptionNeutral60>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box component="a" href={`mailto:${CONTACT_EMAIL}`} sx={linkSx}>
              {CONTACT_EMAIL}
            </Box>
            <Box component={Link} href="/privacy" sx={linkSx}>
              {t('common.privacy')}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {socials.map(({ label, href, Icon, brand }) => (
            <IconButton
              key={label}
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              size="small"
              sx={(theme) => ({
                color: 'text.secondary',
                transition: 'color 0.2s ease, transform 0.2s ease',
                '&:hover': {
                  color: brand === 'github' ? (theme.palette.mode === 'dark' ? GitHubLight : GitHubDark) : brand,
                  transform: 'translateY(-2px)',
                },
              })}
            >
              <Icon fontSize="small" />
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
