'use client'

import { useEffect, useState } from 'react'
import { DEFAULT_LOCALE, LOCALES, type Locale } from '../i18n/locales'

const STORAGE_KEY = 'locale'

// Minimal locale state for now: remembers the chosen language in localStorage.
// Starts at DEFAULT_LOCALE so SSR and the first client render match (no hydration
// mismatch), then syncs the stored value after mount.
export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) setLocaleState(stored)
  }, [])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    // TODO(next-intl): navigate to the locale route (/en, /sk, /cs, /de) once i18n lands.
  }

  return { locale, setLocale, locales: LOCALES }
}
