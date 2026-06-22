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
  Input,
  PhoneInput,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
  TextH4Bold,
  TextH6Bold,
} from '@/shared/components'
import { CONTENT_MAX, PAGE_PT } from '@/shared/layout'
import { CORE_FEATURES, detailApps } from './apps'
import { scopeColor, scopeFill, scopeScore, scopeTier } from './complexity'

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

// What the client actually wants — a whole platform, not a minor toggle, so each is a
// full-weight selectable card (icon + label + trailing check) in the app's accent colour.
// Both selected by default; at least one must stay selected.
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
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(isCustom ? [] : (CORE_FEATURES[appId] ?? app?.featureKeys ?? [])),
  )
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

  // Reset everything to defaults when the app type changes (rail switch) — the React-recommended
  // "adjust state when a prop changes" pattern, robust even if Next reuses the instance. Each app
  // is independent: re-opening a tab starts fresh, no bleed from the previous one.
  const [activeAppId, setActiveAppId] = useState(appId)
  if (appId !== activeAppId) {
    setActiveAppId(appId)
    setSelected(new Set(isCustom ? [] : (CORE_FEATURES[appId] ?? app?.featureKeys ?? [])))
    setPlatforms(new Set(['web', 'mobile']))
    setEmail('')
    setName('')
    setPhone('')
    setPhoneHasNumber(false)
    setNote('')
    setSending(false)
    setError(false)
    setSent(false)
    setShowEmailError(false)
  }

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

  // Public scope signal — complexity only, never a price (price = difficulty × country stays internal).
  const maxScore = scopeScore(appId, app.featureKeys, ['web', 'mobile'])
  const scopeValue = scopeScore(appId, selected, platforms)
  const fill = scopeFill(scopeValue, maxScore)
  const tier = scopeTier(fill)

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

  const onSelectableKeyDown = (event: KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
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
    <Box component="main" sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: 3, pt: PAGE_PT, pb: { xs: 4, md: 6 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '230px minmax(0, 1fr)' },
          gap: { xs: 0, md: 5 },
          alignItems: 'start',
        }}
      >
        {/* Left column: back link (always) sits at the same top as the right column's hero,
            then the app-type switcher rail (desktop only; mobile keeps just the back link). */}
        <Box>
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
          <Box component="nav" aria-label={t('home.appTypes')} sx={{ display: { xs: 'none', md: 'block' }, position: 'sticky', top: 88 }}>
          <Box sx={{ mb: 1.5 }}>
            <TextCaptionNeutral60>{t('home.appTypes')}</TextCaptionNeutral60>
          </Box>
          <Stack spacing={1}>
            {detailApps.map((item) => {
              const RailIcon = item.Icon
              const isCurrent = item.id === appId
              return (
                <Box
                  key={item.id}
                  component={Link}
                  href={`/app/${item.id}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                    p: 1.25,
                    borderRadius: 2,
                    textDecoration: 'none',
                    color: 'text.primary',
                    border: '1px solid',
                    borderColor: isCurrent ? item.accent : 'divider',
                    bgcolor: isCurrent ? `${item.accent}14` : 'transparent',
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
                    '&:hover': { borderColor: item.accent, bgcolor: 'action.hover' },
                  }}
                >
                  <RailIcon sx={{ fontSize: 20, color: item.accent, flexShrink: 0 }} />
                  <TextBody1Neutral80>{t(`apps.${item.id}.label`)}</TextBody1Neutral80>
                </Box>
              )
            })}
          </Stack>
          </Box>
        </Box>

        {/* Right column — fills to the shared CONTENT_MAX right edge (no hardcoded width),
            so the hero + content line up with the home sections, nav and footer. */}
        <Box sx={{ minWidth: 0 }}>
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
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {PLATFORMS.map((platform) => {
                    const PlatformIcon = platform.Icon
                    const isSelected = platforms.has(platform.key)
                    return (
                      <Box
                        key={platform.key}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={0}
                        onClick={() => togglePlatform(platform.key)}
                        onKeyDown={(event) => onSelectableKeyDown(event, () => togglePlatform(platform.key))}
                        sx={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.25,
                          p: 2,
                          borderRadius: 2,
                          cursor: 'pointer',
                          outline: 'none',
                          border: '1px solid',
                          borderColor: isSelected ? accent : 'divider',
                          bgcolor: isSelected ? `${accent}14` : 'transparent',
                          opacity: isSelected ? 1 : 0.55,
                          transition: 'border-color 0.15s ease, background-color 0.15s ease, opacity 0.15s ease',
                          '&:hover': { borderColor: accent },
                          '&:focus-visible': { borderColor: accent },
                        }}
                      >
                        <PlatformIcon sx={{ fontSize: 22, color: isSelected ? accent : 'text.secondary', flexShrink: 0 }} />
                        <Box sx={{ flex: 1 }}>
                          <TextBody1Neutral80>{t(platform.labelKey)}</TextBody1Neutral80>
                        </Box>
                        {isSelected ? (
                          <CheckCircleRounded sx={{ color: accent, fontSize: 20, flexShrink: 0 }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ color: 'text.disabled', fontSize: 20, flexShrink: 0 }} />
                        )}
                      </Box>
                    )
                  })}
                </Box>
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
                  return (
                    <Box
                      key={feature.key}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onClick={() => toggle(feature.key)}
                      onKeyDown={(event) => onSelectableKeyDown(event, () => toggle(feature.key))}
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

              <Box sx={{ mb: 3, p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1 }}>
                  <TextCaptionNeutral60>{t('home.scope.label')}</TextCaptionNeutral60>
                  <Box component="span" sx={{ color: accent, fontWeight: 600, fontSize: '0.95rem' }}>
                    {t(`home.scope.${tier}`)}
                  </Box>
                </Box>
                <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', overflow: 'hidden' }}>
                  <Box
                    sx={{
                      height: '100%',
                      width: `${fill * 100}%`,
                      bgcolor: scopeColor(accent, tier),
                      transition: 'width 0.3s ease, background-color 0.55s ease-in-out',
                    }}
                  />
                </Box>
                <Box sx={{ mt: 1 }}>
                  <TextCaptionNeutral60>{t('home.scope.hint')}</TextCaptionNeutral60>
                </Box>
              </Box>

              <Stack spacing={2} sx={{ mb: error ? 2 : 3 }}>
                <Input label={t('home.nameLabel')} value={name} onChange={(event) => setName(event.target.value)} />
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

              <Button variant="primary" startIcon={<Send />} onClick={submit} loading={sending} disabled={!canSubmit}>
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
      </Box>
    </Box>
  )
}
