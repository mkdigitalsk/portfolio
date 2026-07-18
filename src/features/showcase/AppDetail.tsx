'use client'

import {
  ArrowBack,
  BrushOutlined,
  CheckCircleRounded,
  DescriptionOutlined,
  Language,
  RadioButtonUnchecked,
  Send,
  Smartphone,
} from '@mui/icons-material'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState, useSyncExternalStore, type KeyboardEvent } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { ACCOUNT_MAX, PAGE_PT } from '@/shared/layout'
import { detailApps } from './apps'
import { scopeColor, scopeFill, scopeScore, scopeTier } from './complexity'
import { LEAD_FORM_DEFAULTS, leadSchema, type LeadFormData } from './schemas'
import { useSubmitLeadMutation } from './useSubmitLeadMutation'

const EMAIL_ERROR_DELAY_MS = 1000

// Phone country default: server-side IP geo (Vercel X-Vercel-IP-Country → geo_country cookie, set in
// proxy.ts) when it resolves to a target market, else the active locale, else SK. Applied via a mount
// effect + key-remount — mui-tel-input's defaultCountry is init-only (changing it live infinite-loops).
type TargetCountry = 'SK' | 'CZ' | 'DE' | 'GB'
const TARGET_COUNTRIES: readonly TargetCountry[] = ['SK', 'CZ', 'DE', 'GB']
const PHONE_COUNTRY_BY_LOCALE: Record<string, TargetCountry> = {
  'sk-SK': 'SK',
  'cs-CZ': 'CZ',
  'de-DE': 'DE',
  'en-GB': 'GB',
}

function readGeoCountry(): TargetCountry | undefined {
  if (typeof document === 'undefined') return undefined
  const code = document.cookie.match(/(?:^|;\s*)geo_country=([^;]+)/)?.[1]?.toUpperCase()
  return TARGET_COUNTRIES.find((c) => c === code)
}

// The cookie is read-once, never changes in-session — no real subscription needed.
const subscribeGeo = () => () => {}

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

// key={appId} remounts the whole configurator on app-type switch — every piece of state (form,
// selections, sent/error) starts fresh; no manual reset choreography.
export function AppDetail({ appId }: AppDetailProps) {
  return <AppDetailContent key={appId} appId={appId} />
}

function AppDetailContent({ appId }: AppDetailProps) {
  const t = useTranslations()
  const locale = useLocale()
  // Geo cookie (set in proxy.ts) beats the locale default. useSyncExternalStore keeps SSR/hydration
  // consistent (server snapshot = undefined → locale), then the client re-reads the cookie.
  const geoCountry = useSyncExternalStore(subscribeGeo, readGeoCountry, () => undefined)
  const phoneCountry = geoCountry ?? PHONE_COUNTRY_BY_LOCALE[locale] ?? 'SK'
  const app = detailApps.find((item) => item.id === appId)
  const [phoneHasNumber, setPhoneHasNumber] = useState(false)
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)
  const submitLead = useSubmitLeadMutation()

  // The schema is THE required-fields list — the send button gates purely on formState.isValid;
  // no requirement lives outside it (see schemas.ts).
  const { control, handleSubmit, setValue, formState } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: LEAD_FORM_DEFAULTS,
    mode: 'onChange',
  })
  const [selectedFeatureKeys, selectedPlatforms, hasDoc, hasDesign, emailValue] = useWatch({
    control,
    name: ['features', 'platforms', 'hasDoc', 'hasDesign', 'email'],
  })
  const emailError = formState.errors.email

  // Debounced error display while typing: the schema flags an invalid email instantly (mode:
  // onChange), but the message arms only after a typing pause — keyed to the value so it re-arms
  // each keystroke. Blur/submit still show it immediately.
  const [errorArmedFor, setErrorArmedFor] = useState('')
  useEffect(() => {
    if (!emailValue || !emailError) return
    const timer = setTimeout(() => setErrorArmedFor(emailValue), EMAIL_ERROR_DELAY_MS)
    return () => clearTimeout(timer)
  }, [emailValue, emailError])
  const showEmailError = !!emailValue && !!emailError && errorArmedFor === emailValue

  if (!app) return null

  const { id, accent, Icon } = app
  const appLabel = t(`apps.${id}.label`)
  const appTagline = t(`apps.${id}.tagline`)
  const features = app.featureKeys.map((key) => ({
    key,
    label: t(`apps.${id}.features.${key}.label`),
    benefit: t(`apps.${id}.features.${key}.benefit`),
  }))
  const selectedFeatures = features.filter((feature) => selectedFeatureKeys.includes(feature.key))

  // Public scope signal — complexity only, never a price (price = difficulty × country stays internal).
  const maxScore = scopeScore(appId, app.featureKeys, ['web', 'mobile'])
  const scopeValue = scopeScore(appId, selectedFeatureKeys, selectedPlatforms)
  const fill = scopeFill(scopeValue, maxScore)
  const tier = scopeTier(fill)

  const toggle = (key: string) => {
    const next = selectedFeatureKeys.includes(key)
      ? selectedFeatureKeys.filter((k) => k !== key)
      : [...selectedFeatureKeys, key]
    setValue('features', next, { shouldValidate: true })
  }

  const togglePlatform = (key: string) => {
    if (selectedPlatforms.includes(key)) {
      if (selectedPlatforms.length === 1) return // keep at least one
      setValue(
        'platforms',
        selectedPlatforms.filter((k) => k !== key),
        { shouldValidate: true },
      )
    } else {
      setValue('platforms', [...selectedPlatforms, key], { shouldValidate: true })
    }
  }

  const onSelectableKeyDown = (event: KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  const submit = handleSubmit(async (data) => {
    if (submitLead.isPending) return
    setError(false)
    try {
      const { success } = await submitLead.mutateAsync({
        email: data.email,
        appType: appLabel,
        platforms: PLATFORMS.filter((p) => data.platforms.includes(p.key)).map((p) => t(p.labelKey)),
        features: features.filter((f) => data.features.includes(f.key)).map((f) => f.label),
        name: data.name.trim() || undefined,
        phone: phoneHasNumber ? data.phone.trim() : undefined,
        note: data.note.trim() || undefined,
        hasDoc: data.hasDoc,
        hasDesign: data.hasDesign,
        locale,
      })
      if (success) setSent(true)
      else setError(true)
    } catch {
      setError(true)
    }
  })

  return (
    <Box
      component="main"
      sx={{
        maxWidth: ACCOUNT_MAX,
        mx: 'auto',
        px: { xs: 2, md: 3 },
        pt: PAGE_PT,
        pb: { xs: 4, md: 6 },
      }}
    >
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
          {/* Mobile app-type switcher: scrollable strip; bleeds edge-to-edge as a scroll cue. */}
          <Box
            component="nav"
            aria-label={t('home.appTypes')}
            sx={{
              display: { xs: 'flex', md: 'none' },
              gap: 1,
              mb: 3,
              mx: -2,
              px: 2,
              pb: 1,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {detailApps.map((item) => {
              const StripIcon = item.Icon
              const isCurrent = item.id === appId
              return (
                <Box
                  key={item.id}
                  component={Link}
                  href={`/app/${item.id}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  sx={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.75,
                    py: 1,
                    px: 1.5,
                    borderRadius: 2,
                    textDecoration: 'none',
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    border: '1px solid',
                    borderColor: isCurrent ? item.accent : 'divider',
                    bgcolor: isCurrent ? `${item.accent}14` : 'transparent',
                    transition: 'border-color 0.15s ease, background-color 0.15s ease',
                  }}
                >
                  <StripIcon sx={{ fontSize: 18, color: item.accent, flexShrink: 0 }} />
                  <TextBody1Neutral80>{t(`apps.${item.id}.label`)}</TextBody1Neutral80>
                </Box>
              )
            })}
          </Box>
          <Box
            component="nav"
            aria-label={t('home.appTypes')}
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'sticky',
              top: 88,
            }}
          >
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
                      '&:hover': {
                        borderColor: item.accent,
                        bgcolor: 'action.hover',
                      },
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

        {/* Right column — the app-surface width (ACCOUNT_MAX); interactive tool, not reading copy,
            so it uses the screen. Splits into features · sticky summary below. */}
        <Box sx={{ minWidth: 0 }}>
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
              {/* Two-pane: what you're building (left) · live scope + contact (right, sticky). The sticky
                  summary keeps the estimate in view while selecting features — no scrolling for feedback. */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'minmax(0, 1fr) 420px',
                  },
                  gap: { xs: 3, md: 4 },
                  alignItems: 'start',
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  {/* Compact header in the left column so the sticky summary fills the right from the top —
                      no empty white beside a full-width header. */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: { xs: 3, md: 4 } }}>
                    <Box
                      sx={{
                        width: { xs: 64, md: 80 },
                        height: { xs: 64, md: 80 },
                        flexShrink: 0,
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
                      }}
                    >
                      <Icon sx={{ fontSize: { xs: 32, md: 40 }, color: 'common.white', opacity: 0.95 }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <TextH4Bold>{appLabel}</TextH4Bold>
                      <TextBody1Neutral60>{appTagline}</TextBody1Neutral60>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <TextBody1Neutral60 sx={{ mb: 1 }}>{t('home.platformsLabel')}</TextBody1Neutral60>
                    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                      {PLATFORMS.map((platform) => {
                        const PlatformIcon = platform.Icon
                        const isSelected = selectedPlatforms.includes(platform.key)
                        return (
                          <Box
                            key={platform.key}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onClick={() => togglePlatform(platform.key)}
                            onKeyDown={(event) => onSelectableKeyDown(event, () => togglePlatform(platform.key))}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.25,
                              py: 1.25,
                              px: 2,
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
                            <PlatformIcon
                              sx={{
                                fontSize: 22,
                                color: isSelected ? accent : 'text.secondary',
                                flexShrink: 0,
                              }}
                            />
                            <TextBody1Neutral80>{t(platform.labelKey)}</TextBody1Neutral80>
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

                  <Stack spacing={0.25} sx={{ mb: 4 }}>
                    {features.map((feature) => {
                      const isSelected = selectedFeatureKeys.includes(feature.key)
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
                            py: 0.75,
                            px: 1,
                            mx: -1,
                            outline: 'none',
                            opacity: isSelected ? 1 : 0.5,
                            transition: 'background-color 0.15s ease, opacity 0.15s ease',
                            '&:hover': { backgroundColor: 'action.hover' },
                            '&:focus-visible': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          {isSelected ? (
                            <CheckCircleRounded
                              sx={{
                                color: accent,
                                fontSize: 22,
                                mt: '2px',
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <RadioButtonUnchecked
                              sx={{
                                color: 'text.disabled',
                                fontSize: 22,
                                mt: '2px',
                                flexShrink: 0,
                              }}
                            />
                          )}
                          <Box>
                            <TextBody1Neutral80>{feature.label}</TextBody1Neutral80>
                            <TextCaptionNeutral60>{feature.benefit}</TextCaptionNeutral60>
                          </Box>
                        </Box>
                      )
                    })}
                  </Stack>
                </Box>

                <Box
                  sx={{
                    position: { md: 'sticky' },
                    top: { md: 88 },
                    minWidth: 0,
                  }}
                >
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'baseline',
                        mb: 1,
                      }}
                    >
                      <TextCaptionNeutral60>{t('home.scope.label')}</TextCaptionNeutral60>
                      <Box
                        component="span"
                        sx={{
                          color: accent,
                          fontWeight: 600,
                          fontSize: '0.95rem',
                        }}
                      >
                        {t(`home.scope.${tier}`)}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: 'action.hover',
                        overflow: 'hidden',
                      }}
                    >
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

                  {/* Materials — engagement qualifiers (docs/design), deliberately outside the features
                      list: they describe what the client brings, not what the app contains. */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ mb: 1 }}>
                      <TextCaptionNeutral60>{t('home.materialsLabel')}</TextCaptionNeutral60>
                    </Box>
                    <Stack spacing={1}>
                      <MaterialTick
                        checked={hasDoc}
                        accent={accent}
                        Icon={DescriptionOutlined}
                        label={t('home.hasDocLabel')}
                        benefit={t('home.hasDocBenefit')}
                        onToggle={() => setValue('hasDoc', !hasDoc, { shouldValidate: true })}
                      />
                      <MaterialTick
                        checked={hasDesign}
                        accent={accent}
                        Icon={BrushOutlined}
                        label={t('home.hasDesignLabel')}
                        benefit={t('home.hasDesignBenefit')}
                        onToggle={() => setValue('hasDesign', !hasDesign, { shouldValidate: true })}
                      />
                    </Stack>
                  </Box>

                  <Stack spacing={2} sx={{ mb: error ? 2 : 3 }}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field: { ref, ...field } }) => (
                        <Input label={t('home.nameLabel')} inputRef={ref} {...field} />
                      )}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Controller
                          name="email"
                          control={control}
                          render={({ field: { ref, ...field }, fieldState }) => (
                            <Input
                              type="email"
                              label={t('home.emailLabel')}
                              placeholder="name@email.com"
                              required
                              inputRef={ref}
                              {...field}
                              error={
                                !!fieldState.error &&
                                (showEmailError || fieldState.isTouched || formState.submitCount > 0)
                              }
                              errorText={fieldState.error ? t(`validation.${fieldState.error.message}`) : undefined}
                            />
                          )}
                        />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Controller
                          name="phone"
                          control={control}
                          render={({ field }) => (
                            <PhoneInput
                              key={phoneCountry}
                              label={t('home.phoneLabel')}
                              value={field.value}
                              defaultCountry={phoneCountry}
                              onChange={(value, info) => {
                                field.onChange(value)
                                setPhoneHasNumber(Boolean(info.nationalNumber))
                              }}
                            />
                          )}
                        />
                      </Box>
                    </Box>
                    <Controller
                      name="note"
                      control={control}
                      render={({ field: { ref, ...field } }) => (
                        <Input
                          label={t('home.messageLabel')}
                          placeholder={t('home.messagePlaceholder')}
                          multiline
                          minRows={3}
                          inputRef={ref}
                          {...field}
                        />
                      )}
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
                    loading={submitLead.isPending}
                    disabled={!formState.isValid}
                  >
                    {selectedFeatures.length > 0
                      ? `${t('home.sendCta')} (${selectedFeatures.length})`
                      : t('home.sendCta')}
                  </Button>

                  <Box sx={{ mt: 1.5 }}>
                    <TextCaptionNeutral60>
                      {t.rich('home.consent', {
                        link: (chunks) => (
                          <Box
                            component={Link}
                            href="/privacy"
                            sx={{
                              color: 'primary.main',
                              textDecoration: 'none',
                            }}
                          >
                            {chunks}
                          </Box>
                        ),
                      })}
                    </TextCaptionNeutral60>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

// Bordered toggle row in the platform-chip visual language — selectable things carry a border.
function MaterialTick({
  checked,
  accent,
  Icon,
  label,
  benefit,
  onToggle,
}: {
  checked: boolean
  accent: string
  Icon: typeof DescriptionOutlined
  label: string
  benefit: string
  onToggle: () => void
}) {
  return (
    <Box
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onToggle()
        }
      }}
      sx={{
        display: 'flex',
        gap: 1.25,
        alignItems: 'flex-start',
        cursor: 'pointer',
        borderRadius: 2,
        py: 1,
        px: 1.5,
        outline: 'none',
        border: '1px solid',
        borderColor: checked ? accent : 'divider',
        bgcolor: checked ? `${accent}14` : 'transparent',
        opacity: checked ? 1 : 0.7,
        transition: 'border-color 0.15s ease, background-color 0.15s ease, opacity 0.15s ease',
        '&:hover': { borderColor: accent },
        '&:focus-visible': { borderColor: accent },
      }}
    >
      <Icon sx={{ fontSize: 20, mt: '2px', color: checked ? accent : 'text.secondary', flexShrink: 0 }} />
      <Box>
        <TextBody1Neutral80>{label}</TextBody1Neutral80>
        <TextCaptionNeutral60>{benefit}</TextCaptionNeutral60>
      </Box>
    </Box>
  )
}
