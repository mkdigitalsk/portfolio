'use client'

import { CheckCircleRounded, Close, Mail } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { useTranslations } from 'next-intl'
import {
  Button,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
  TextH4Bold,
  TextH6Bold,
} from '@/shared/components'
import type { ShowcaseApp } from './apps'

interface AppDetailDialogProps {
  app: ShowcaseApp | null
  open: boolean
  onClose: () => void
}

export function AppDetailDialog({ app, open, onClose }: AppDetailDialogProps) {
  const t = useTranslations()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="body">
      {app && (
        <Box>
          <Box
            sx={{
              position: 'relative',
              height: 200,
              display: 'grid',
              placeItems: 'center',
              background: `linear-gradient(135deg, ${app.accent}, ${app.accent}99)`,
            }}
          >
            <app.Icon sx={{ fontSize: 76, color: 'common.white', opacity: 0.95 }} />
            <IconButton
              onClick={onClose}
              aria-label={t('home.close')}
              sx={{ position: 'absolute', top: 8, right: 8, color: 'common.white' }}
            >
              <Close />
            </IconButton>
          </Box>

          <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
            <TextH4Bold>{app.label}</TextH4Bold>
            <Box sx={{ mt: 0.5, mb: 3 }}>
              <TextBody1Neutral60>{app.tagline}</TextBody1Neutral60>
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextH6Bold>{t('home.detailHeading')}</TextH6Bold>
            </Box>

            <Stack spacing={1.75} sx={{ mb: 4 }}>
              {app.features.map((feature) => (
                <Box key={feature.label} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <CheckCircleRounded sx={{ color: app.accent, fontSize: 22, mt: '2px', flexShrink: 0 }} />
                  <Box>
                    <TextBody1Neutral80>{feature.label}</TextBody1Neutral80>
                    <TextCaptionNeutral60>{feature.benefit}</TextCaptionNeutral60>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Button variant="primary" startIcon={<Mail />} href="mailto:mir.kusnir@gmail.com">
              {t('home.detailCta')}
            </Button>
          </DialogContent>
        </Box>
      )}
    </Dialog>
  )
}
