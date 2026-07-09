import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { DEFAULT_LOCALE, LOCALES } from '../shared/i18n/locales'

function matchBrowserLocale(supported: string[], acceptLanguage: string | null): string {
  if (!acceptLanguage) return DEFAULT_LOCALE as string

  const requested = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=')
      return { tag: tag.toLowerCase(), q: q ? Number.parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)

  for (const { tag } of requested) {
    const language = tag.split('-')[0]
    const match = supported.find((code) => code.toLowerCase() === tag || code.toLowerCase().split('-')[0] === language)
    if (match) return match
  }

  return DEFAULT_LOCALE as string
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const supported = LOCALES.map((l) => l.code as string)

  const cookieLocale = cookieStore.get('locale')?.value
  const locale =
    cookieLocale && supported.includes(cookieLocale)
      ? cookieLocale
      : matchBrowserLocale(supported, (await headers()).get('accept-language'))

  return {
    locale,
    messages: (await import(`../../locales/${locale}.json`)).default,
  }
})
