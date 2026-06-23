'use client'

import { useLocale } from 'next-intl'
import { useEffect } from 'react'
import { useLocalePreference } from '../hooks/useLocalePreference'
import { LOCALES } from '../i18n/locales'

// Activates an "other" locale from a shareable link, e.g. `/?otherLocales=true`
// (auto-detects the visitor's browser language) or `/?otherLocales=true&lang=vi-VN`.
export function LocaleDeepLink() {
  const activeLocale = useLocale()
  const { applyPreferences, otherLocalesEnabled, readDeepLinkParams } = useLocalePreference()

  useEffect(() => {
    const { lang, wantsOtherLocales } = readDeepLinkParams()
    const target = lang ? LOCALES.find((option) => option.code === lang) : undefined

    const needsLocale = Boolean(target) && target?.code !== activeLocale
    const needsFlag = wantsOtherLocales && !otherLocalesEnabled()
    if (!needsLocale && !needsFlag) return

    applyPreferences({
      locale: needsLocale ? (target?.code as string) : undefined,
      enableOtherLocales: wantsOtherLocales || undefined,
    })
  }, [activeLocale, applyPreferences, otherLocalesEnabled, readDeepLinkParams])

  return null
}
