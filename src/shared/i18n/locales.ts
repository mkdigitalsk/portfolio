export const Locale = {
  EN_GB: 'en-GB',
  SK_SK: 'sk-SK',
  CS_CZ: 'cs-CZ',
  DE_DE: 'de-DE',
  TH_TH: 'th-TH',
  VI_VN: 'vi-VN',
} as const

export type Locale = (typeof Locale)[keyof typeof Locale] | (string & {})

export interface LocaleOption {
  code: Locale
  label: string
  flag: string
  other?: boolean
}

export const FEATURES = {
  otherLocales: true,
} as const

export const OTHER_LOCALES_COOKIE = 'otherLocales'

export const VISIBLE_LOCALES: LocaleOption[] = [
  { code: Locale.EN_GB, label: 'English', flag: '🇬🇧' },
  { code: Locale.SK_SK, label: 'Slovenčina', flag: '🇸🇰' },
  { code: Locale.CS_CZ, label: 'Čeština', flag: '🇨🇿' },
  { code: Locale.DE_DE, label: 'Deutsch', flag: '🇩🇪' },
]

export const OTHER_LOCALES: LocaleOption[] = FEATURES.otherLocales
  ? [
      { code: Locale.TH_TH, label: 'ไทย', flag: '🇹🇭', other: true },
      { code: Locale.VI_VN, label: 'Tiếng Việt', flag: '🇻🇳', other: true },
    ]
  : []

export const LOCALES: LocaleOption[] = [...VISIBLE_LOCALES, ...OTHER_LOCALES]

export const DEFAULT_LOCALE: Locale = Locale.EN_GB
