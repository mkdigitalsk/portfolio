import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'
import { DEFAULT_LOCALE, LOCALES } from '../shared/i18n/locales'

const SUPPORTED = LOCALES.map((l) => l.code as string)

export default getRequestConfig(async () => {
  const store = await cookies()
  const cookieLocale = store.get('locale')?.value
  const locale = cookieLocale && SUPPORTED.includes(cookieLocale) ? cookieLocale : (DEFAULT_LOCALE as string)

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
