'use client'

import { ArrowBack, CheckCircleRounded, Language, RadioButtonUnchecked, Send, Smartphone } from '@mui/icons-material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState, type KeyboardEvent } from 'react'
import {
  Button,
  FilterChip,
  Input,
  PhoneInput,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
  TextH4Bold,
  TextH6Bold,
} from '@/shared/components'
import { detailApps } from './apps'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const EMAIL_ERROR_DELAY_MS = 800

// Default phone country from the active locale (a German number usually matches a
// German-speaking user better than their current IP location). Accurate server-side
// IP geo is a deploy-time enhancement — see roadmap.
const PHONE_COUNTRY_BY_LOCALE: Record<string, 'SK' | 'CZ' | 'DE' | 'GB'> = {
  'sk-SK': 'SK',
  'cs-CZ': 'CZ',
  'de-DE': 'DE',
  'en-GB': 'GB',
}

// What the client actually wants — shown as pills at the top. Both selected by
// default; at least one must stay selected.
const PLATFORMS = [
  { key: 'web', Icon: Language, labelKey: 'home.platformWeb' },
  { key: 'mobile', Icon: Smartphone, labelKey: 'home.platformMobile' },
] as const

interface AppDetailProps {
  appId: string
}

export function AppDetail({ appId }: AppDetailProps) {
  const t = useTranslations()
  const locale = useLocale()
  const phoneCountry = PHONE_COUNTRY_BY_LOCALE[locale] ?? 'SK'
  const app = detailApps.find((item) => item.id === appId)
  const isCustom = appId === 'custom'
  const [selected, setSelected] = useState<Set<string>>(() => new Set(isCustom ? [] : (app?.featureKeys ?? [])))
  const [platforms, setPlatforms] = useState<Set<string>>(() => new Set(['web', 'mobile']))
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneHasNumber, setPhoneHasNumber] = useState(false)
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)
  const [showEmailError, setShowEmailError] = useState(false)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  useEffect(() => {
    if (!email || emailValid) {
      setShowEmailError(false)
      return
    }
    const timer = setTimeout(() => setShowEmailError(true), EMAIL_ERROR_DELAY_MS)
    return () => clearTimeout(timer)
  }, [email, emailValid])

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
  const canSubmit = isCustom
    ? selectedFeatures.length > 0 || note.trim().length > 0
    : selectedFeatures.length > 0

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

  const togglePlatform = (key: string) => {
    setPlatforms((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size === 1) return prev // keep at least one
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const submit = async () => {
    if (sending) return
    if (!emailValid) {
      setShowEmailError(true)
      return
    }
    setSending(true)
    setError(false)
    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: t('home.mailSubject', { app: appLabel }),
          'App type': appLabel,
          Platforms: PLATFORMS.filter((p) => platforms.has(p.key))
            .map((p) => t(p.labelKey))
            .join(', '),
          ...(name.trim() ? { name: name.trim() } : {}),
          ...(phoneHasNumber ? { phone: phone.trim() } : {}),
          email,
          message: [
            isCustom ? t('home.customIntro') : t('home.mailIntro', { app: appLabel }),
            '',
            ...selectedFeatures.map((feature) => `• ${feature.label}`),
            ...(note.trim() ? ['', `${t('home.noteLabel')}:`, note.trim()] : []),
          ].join('\n'),
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
    <Box component="main" sx={{ maxWidth: 880, mx: 'auto', px: 3, py: { xs: 4, md: 6 } }}>
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

          <Box sx={{ mb: 3 }}>
            <TextBody1Neutral60 sx={{ mb: 1 }}>{t('home.platformsLabel')}</TextBody1Neutral60>
            <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
              {PLATFORMS.map((platform) => {
                const PlatformIcon = platform.Icon
                return (
                  <FilterChip
                    key={platform.key}
                    selected={platforms.has(platform.key)}
                    onClick={() => togglePlatform(platform.key)}
                    label={
                      <Box
                        component="span"
                        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, verticalAlign: 'middle' }}
                      >
                        <PlatformIcon sx={{ fontSize: 18 }} />
                        {t(platform.labelKey)}
                      </Box>
                    }
                  />
                )
              })}
            </Stack>
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

          <Stack spacing={2} sx={{ mb: error ? 2 : 3 }}>
            <Input
              label={t('home.nameLabel')}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Input
                  type="email"
                  label={t('home.emailLabel')}
                  placeholder="name@email.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  error={showEmailError}
                  errorText={t('home.emailInvalid')}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <PhoneInput
                  label={t('home.phoneLabel')}
                  value={phone}
                  defaultCountry={phoneCountry}
                  onChange={(value, info) => {
                    setPhone(value)
                    setPhoneHasNumber(Boolean(info.nationalNumber))
                  }}
                />
              </Box>
            </Box>
            <Input
              label={t('home.messageLabel')}
              placeholder={t('home.messagePlaceholder')}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              multiline
              minRows={3}
            />
          </Stack>
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
            disabled={!canSubmit}
          >
            {selectedFeatures.length > 0 ? `${t('home.sendCta')} (${selectedFeatures.length})` : t('home.sendCta')}
          </Button>

          <Box sx={{ mt: 1.5 }}>
            <TextCaptionNeutral60>
              {t.rich('home.consent', {
                link: (chunks) => (
                  <Box component={Link} href="/privacy" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    {chunks}
                  </Box>
                ),
              })}
            </TextCaptionNeutral60>
          </Box>
        </>
      )}
    </Box>
  )
}
