'use client'

import { GitHub, LinkedIn } from '@mui/icons-material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Brand } from '@/shared/theme/color'
import { Logo } from '../icons/Logo'
import { TextCaptionNeutral60 } from '../text'
import { GitHubDark, GitHubLight } from '../../theme/socialColors'

const GITHUB = 'https://github.com/mkdigitalsk'
const LINKEDIN = 'https://www.linkedin.com/in/miroslavkusnir/'
const CONTACT_EMAIL = 'admin@mkdigital.sk'

const socials = [
  { label: 'GitHub', href: GITHUB, Icon: GitHub, brand: 'github' as const },
  { label: 'LinkedIn', href: LINKEDIN, Icon: LinkedIn, brand: '#0A66C2' as const },
]

// Footer link row — the home sections plus About and Privacy, a second path to everything.
const FOOTER_LINKS = [
  { href: '/#services', key: 'common.services' },
  { href: '/#demos', key: 'common.demos' },
  { href: '/#process', key: 'common.process' },
  { href: '/#proof', key: 'common.proof' },
  { href: '/#contact', key: 'common.contact' },
  { href: '/about', key: 'common.about' },
  { href: '/privacy', key: 'common.privacy' },
]

const linkSx = {
  fontSize: '0.875rem',
  color: 'text.secondary',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  '&:hover': { color: 'primary.main' },
} as const

// Minimal two-row footer (research: keep it to the bare essentials, 1-2 rows, don't cram):
// row 1 = section links + socials, row 2 = copyright / company / contact / privacy.
export function Footer() {
  const t = useTranslations()

  return (
    <Box
      component="footer"
      className="dark" // brand bar: force on-dark tokens so text reads on the navy surface
      sx={{ bgcolor: Brand.navy, borderTop: '1px solid', borderColor: 'divider' }}
    >
      <Box sx={{ px: { xs: 2, md: 3 }, py: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box component="nav" aria-label="Footer" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
            {FOOTER_LINKS.map((l) => (
              <Box key={l.href} component={Link} href={l.href} sx={linkSx}>
                {t(l.key)}
              </Box>
            ))}
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

        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
        >
          <Logo variant="lockup" height={36} />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 2, rowGap: 0.5 }}>
            <TextCaptionNeutral60>© 2026 MK Digital s. r. o. · IČO 55 450 229</TextCaptionNeutral60>
            <Box component="a" href={`mailto:${CONTACT_EMAIL}`} sx={linkSx}>
              {CONTACT_EMAIL}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
