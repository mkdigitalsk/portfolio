'use client'

import { ArrowBack, CheckCircleRounded, Close, Mail, RadioButtonUnchecked } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { useTranslations } from 'next-intl'
import { useEffect, useState, type KeyboardEvent } from 'react'
import {
  Button,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
  TextH4Bold,
  TextH6Bold,
} from '@/shared/components'
import type { ShowcaseApp } from './apps'

const EMAIL = 'mir.kusnir@gmail.com'

type Step = 'select' | 'review'

interface AppDetailDialogProps {
  app: ShowcaseApp | null
  open: boolean
  onClose: () => void
}

export function AppDetailDialog({ app, open, onClose }: AppDetailDialogProps) {
  const t = useTranslations()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [step, setStep] = useState<Step>('select')

  // Start fresh whenever a different app opens: everything ticked, back to step 1.
  useEffect(() => {
    if (app) {
      setSelected(new Set(app.featureKeys))
      setStep('select')
    }
  }, [app])

  const toggle = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const appLabel = app ? t(`apps.${app.id}.label`) : ''
  const appTagline = app ? t(`apps.${app.id}.tagline`) : ''
  const features = app
    ? app.featureKeys.map((key) => ({
        key,
        label: t(`apps.${app.id}.features.${key}.label`),
        benefit: t(`apps.${app.id}.features.${key}.benefit`),
      }))
    : []
  const selectedFeatures = features.filter((feature) => selected.has(feature.key))
  const mailHref = app
    ? `mailto:${EMAIL}?subject=${encodeURIComponent(t('home.mailSubject', { app: appLabel }))}&body=${encodeURIComponent(
        `${t('home.mailIntro', { app: appLabel })}\n\n${selectedFeatures.map((feature) => `• ${feature.label}`).join('\n')}`,
      )}`
    : '#'

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
            {step === 'select' ? (
              <>
                <TextH4Bold>{appLabel}</TextH4Bold>
                <Box sx={{ mt: 0.5, mb: 3 }}>
                  <TextBody1Neutral60>{appTagline}</TextBody1Neutral60>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <TextH6Bold>{t('home.detailHeading')}</TextH6Bold>
                  <Box sx={{ mt: 0.5 }}>
                    <TextCaptionNeutral60>{t('home.detailHint')}</TextCaptionNeutral60>
                  </Box>
                </Box>

                <Stack spacing={0.5} sx={{ mb: 4 }}>
                  {features.map((feature) => {
                    const isSelected = selected.has(feature.key)
                    const onKeyDown = (event: KeyboardEvent) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        toggle(feature.key)
                      }
                    }
                    return (
                      <Box
                        key={feature.key}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => toggle(feature.key)}
                        onKeyDown={onKeyDown}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          alignItems: 'flex-start',
                          cursor: 'pointer',
                          borderRadius: 1,
                          p: 1,
                          mx: -1,
                          outline: 'none',
                          opacity: isSelected ? 1 : 0.5,
                          transition: 'background-color 0.15s ease, opacity 0.15s ease',
                          '&:hover': { backgroundColor: 'action.hover' },
                          '&:focus-visible': { backgroundColor: 'action.hover' },
                        }}
                      >
                        {isSelected ? (
                          <CheckCircleRounded sx={{ color: app.accent, fontSize: 22, mt: '2px', flexShrink: 0 }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ color: 'text.disabled', fontSize: 22, mt: '2px', flexShrink: 0 }} />
                        )}
                        <Box>
                          <TextBody1Neutral80>{feature.label}</TextBody1Neutral80>
                          <TextCaptionNeutral60>{feature.benefit}</TextCaptionNeutral60>
                        </Box>
                      </Box>
                    )
                  })}
                </Stack>

                <Button
                  variant="primary"
                  disabled={selectedFeatures.length === 0}
                  onClick={() => setStep('review')}
                >
                  {`${t('home.detailCta')} (${selectedFeatures.length})`}
                </Button>
              </>
            ) : (
              <>
                <TextH4Bold>{t('home.reviewHeading')}</TextH4Bold>
                <Box sx={{ mt: 0.5, mb: 3 }}>
                  <TextBody1Neutral60>{t('home.reviewSubtitle', { app: appLabel })}</TextBody1Neutral60>
                </Box>

                <Stack spacing={1.25} sx={{ mb: 4 }}>
                  {selectedFeatures.map((feature) => (
                    <Box key={feature.key} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <CheckCircleRounded sx={{ color: app.accent, fontSize: 20, flexShrink: 0 }} />
                      <TextBody1Neutral80>{feature.label}</TextBody1Neutral80>
                    </Box>
                  ))}
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <Button variant="outline" startIcon={<ArrowBack />} onClick={() => setStep('select')}>
                    {t('home.back')}
                  </Button>
                  <Button variant="primary" startIcon={<Mail />} href={mailHref}>
                    {t('home.sendCta')}
                  </Button>
                </Stack>
              </>
            )}
          </DialogContent>
        </Box>
      )}
    </Dialog>
  )
}
