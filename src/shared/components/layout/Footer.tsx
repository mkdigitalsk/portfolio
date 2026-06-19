'use client'

import { GitHub, LinkedIn, WhatsApp } from '@mui/icons-material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { TextBody1Neutral60 } from '../text'
import { GitHubDark, GitHubLight, LinkedInBlue, WhatsAppGreen } from '../../theme/socialColors'

const socials = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/miroslavkusnir', Icon: LinkedIn, brand: LinkedInBlue },
  { label: 'WhatsApp', href: 'https://wa.me/421951892670', Icon: WhatsApp, brand: WhatsAppGreen },
  { label: 'GitHub', href: 'https://github.com/KusnirM', Icon: GitHub, brand: 'github' as const },
]

export function Footer() {
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
        <TextBody1Neutral60>© 2026 MK Digital s.r.o. · Miroslav Kušnír</TextBody1Neutral60>
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
