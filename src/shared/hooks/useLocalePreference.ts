'use client'

import { useRouter } from 'next/navigation'

const LOCALE_MAX_AGE = 60 * 60 * 24 * 365 // one year

// Raw platform write kept in a plain module function (not a component/hook) so the
// document.cookie mutation lives outside React's render rules. Components depend only
// on this hook's interface, never on the cookie API directly (DIP — see web-conventions).
function writeLocaleCookie(code: string) {
  document.cookie = `locale=${code}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax`
}

export function useLocalePreference() {
  const router = useRouter()

  const setLocale = (code: string) => {
    writeLocaleCookie(code)
    router.refresh()
  }

  return { setLocale }
}
