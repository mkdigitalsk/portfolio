'use client'

import { useRouter } from 'next/navigation'

const LOCALE_MAX_AGE = 60 * 60 * 24 * 365 // one year

// Cookie mutation kept outside React's render rules; components depend on this
// hook's interface, never on document.cookie (DIP — see web-conventions).
function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${LOCALE_MAX_AGE}; samesite=lax`
}

export function useLocalePreference() {
  const router = useRouter()

  const setLocale = (code: string) => {
    writeCookie('locale', code)
    router.refresh()
  }

  return { setLocale }
}
