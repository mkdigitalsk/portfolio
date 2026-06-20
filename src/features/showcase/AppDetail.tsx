'use client'

import { ArrowBack, CheckCircleRounded, RadioButtonUnchecked, Send } from '@mui/icons-material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState, type KeyboardEvent } from 'react'
import {
  Button,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
  TextH4Bold,
  TextH6Bold,
} from '@/shared/components'
import { showcaseApps } from './apps'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

interface AppDetailProps {
  appId: string
}

export function AppDetail({ appId }: AppDetailProps) {
  const t = useTranslations()
  const app = showcaseApps.find((item) => item.id === appId)
  const [selected, setSelected] = useState<Set<string>>(() => new Set(app?.featureKeys ?? []))
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)

  if (!app) return null

  const { id, accent, Icon } = app
  const appLabel = t(`apps.${id}.label`)
  const appTagline = t(`apps.${id}.tagline`)
  const features = app.featureKeys.map((key) => ({
    key,
    label: t(`apps.${id}.features.${key}.label`),
    benefit: t(`apps.${id}.features.${key}.benefit`),
  }))
  const selectedFeatures = features.filter((feature) => selected.has(feature.key))

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

  const submit = async () => {
    if (!email || sending) return
    setSending(true)
    setError(false)
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: t('home.mailSubject', { app: appLabel }),
          email,
          message: `${t('home.mailIntro', { app: appLabel })}\n\n${selectedFeatures
            .map((feature) => `• ${feature.label}`)
            .join('\n')}`,
        }),
      })
      const data = (await response.json()) as { success?: boolean }
      if (data.success) {
        setSent(true)
      } else {
        setError(true)
      }
    } catch {
      setError(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <Box component="main" sx={{ maxWidth: 720, mx: 'auto', px: 3, py: { xs: 4, md: 6 } }}>
      <Box
        component={Link}
        href="/"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          mb: 3,
          color: 'text.secondary',
          textDecoration: 'none',
          transition: 'color 0.2s ease',
          '&:hover': { color: 'primary.main' },
        }}
      >
        <ArrowBack sx={{ fontSize: 18 }} />
        <TextCaptionNeutral60>{t('home.backToApps')}</TextCaptionNeutral60>
      </Box>

      <Box
        sx={{
          height: { xs: 150, md: 190 },
          borderRadius: 3,
          display: 'grid',
          placeItems: 'center',
          mb: 3,
          background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
        }}
      >
        <Icon sx={{ fontSize: 72, color: 'common.white', opacity: 0.95 }} />
      </Box>

      {sent ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <CheckCircleRounded sx={{ fontSize: 64, color: accent, mb: 2 }} />
          <TextH4Bold align="center">{t('home.sentHeading')}</TextH4Bold>
          <Box sx={{ mt: 1, mb: 4, maxWidth: 360, mx: 'auto' }}>
            <TextBody1Neutral60 align="center">{t('home.sentBody')}</TextBody1Neutral60>
          </Box>
          <Button variant="primary" component={Link} href="/">
            {t('home.done')}
          </Button>
        </Box>
      ) : (
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
                    <CheckCircleRounded sx={{ color: accent, fontSize: 22, mt: '2px', flexShrink: 0 }} />
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

          <TextField
            type="email"
            label={t('home.emailLabel')}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            fullWidth
            size="small"
            sx={{ mb: error ? 2 : 3 }}
          />
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {t('home.sendError')}
            </Alert>
          )}

          <Button
            variant="primary"
            startIcon={<Send />}
            onClick={submit}
            loading={sending}
            disabled={!email || selectedFeatures.length === 0}
          >
            {`${t('home.sendCta')} (${selectedFeatures.length})`}
          </Button>
        </>
      )}
    </Box>
  )
}
