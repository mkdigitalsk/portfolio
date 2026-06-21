'use client'

import { GitHub, LinkedIn } from '@mui/icons-material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { CONTENT_MAX } from '@/shared/layout'
import { TextBody1Neutral60, TextCaptionNeutral60 } from '../text'
import { GitHubDark, GitHubLight } from '../../theme/socialColors'

const GITHUB = 'https://github.com/mkdigitalsk'
const LINKEDIN = 'https://www.linkedin.com/in/miroslavkusnir/'
const CONTACT_EMAIL = 'admin@mkdigital.sk'
const ADDRESS = 'Medená 15387/2, 974 05 Banská Bystrica · IČO 55 450 229'

const socials = [
  { label: 'GitHub', href: GITHUB, Icon: GitHub, brand: 'github' as const },
  { label: 'LinkedIn', href: LINKEDIN, Icon: LinkedIn, brand: '#0A66C2' as const },
]

// Footer mini-sitemap — the same home sections as the nav, so the footer is a second path to them.
const FOOTER_LINKS = [
  { href: '/#services', key: 'common.services' },
  { href: '/#demos', key: 'common.demos' },
  { href: '/#process', key: 'common.process' },
  { href: '/#proof', key: 'common.proof' },
  { href: '/#contact', key: 'common.contact' },
  { href: '/about', key: 'common.about' },
]

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
          py: 5,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, maxWidth: 360 }}>
          <TextBody1Neutral60>© 2026 MK Digital s. r. o.</TextBody1Neutral60>
          <TextCaptionNeutral60>{t('common.tagline')}</TextCaptionNeutral60>
          <TextCaptionNeutral60>{ADDRESS}</TextCaptionNeutral60>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 0.5 }}>
            <Box component="a" href={`mailto:${CONTACT_EMAIL}`} sx={linkSx}>
              {CONTACT_EMAIL}
            </Box>
            <Box component={Link} href="/privacy" sx={linkSx}>
              {t('common.privacy')}
            </Box>
          </Box>
        </Box>

        <Box component="nav" aria-label="Footer" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {FOOTER_LINKS.map((l) => (
            <Box key={l.href} component={Link} href={l.href} sx={linkSx}>
              {t(l.key)}
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-start' }}>
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
