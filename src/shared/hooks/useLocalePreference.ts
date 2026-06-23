'use client'

import { useRouter } from 'next/navigation'
import { useSyncExternalStore } from 'react'
import { OTHER_LOCALES_COOKIE } from '../i18n/locales'

const LOCALE_MAX_AGE = 60 * 60 * 24 * 365 // one year

// Cookie mutation kept outside React's render rules; components depend on this
// hook's interface, never on document.cookie (DIP — see web-conventions).
function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax`
}

function readCookie(name: string) {
  return document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))?.split('=')[1]
}

function readDeepLinkParams() {
  const params = new URLSearchParams(window.location.search)
  return { lang: params.get('lang') ?? undefined, wantsOtherLocales: params.get(OTHER_LOCALES_COOKIE) === 'true' }
}

const noopSubscribe = () => () => {}

// Reactive read of the other-locales flag cookie (SSR snapshot is false, so the
// hidden languages appear in the switcher only after the client confirms the cookie).
export function useOtherLocalesEnabled() {
  return useSyncExternalStore(
    noopSubscribe,
    () => readCookie(OTHER_LOCALES_COOKIE) === 'true',
    () => false,
  )
}

export function useLocalePreference() {
  const router = useRouter()

  const applyPreferences = ({ locale, enableOtherLocales }: { locale?: string; enableOtherLocales?: boolean }) => {
    if (enableOtherLocales) writeCookie(OTHER_LOCALES_COOKIE, 'true')
    if (locale) writeCookie('locale', locale)
    router.refresh()
  }

  const setLocale = (code: string) => applyPreferences({ locale: code })

  const otherLocalesEnabled = () => readCookie(OTHER_LOCALES_COOKIE) === 'true'

  return { setLocale, applyPreferences, otherLocalesEnabled, readDeepLinkParams }
}
