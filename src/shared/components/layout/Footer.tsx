'use client'

import { GitHub, LinkedIn, WhatsApp } from '@mui/icons-material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { TextBody1Neutral60 } from '../text'
import { GitHubDark, GitHubLight, LinkedInBlue, WhatsAppGreen } from '../../theme/socialColors'

const socials = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/miroslavkusnir', Icon: LinkedIn, brand: LinkedInBlue },
  { label: 'WhatsApp', href: 'https://wa.me/421951892670', Icon: WhatsApp, brand: WhatsAppGreen },
  { label: 'GitHub', href: 'https://github.com/mkdigitalsk', Icon: GitHub, brand: 'github' as const },
]

export function Footer() {
  const t = useTranslations()

  return (
    <Box component="footer" sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
      <Box
        sx={{
          maxWidth: 880,
          mx: 'auto',
          px: 3,
          py: 4,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <TextBody1Neutral60>© 2026 MK Digital s.r.o.</TextBody1Neutral60>
          <Box
            component={Link}
            href="/privacy"
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {t('common.privacy')}
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
