export const Locale = {
  EN_GB: 'en-GB',
  SK_SK: 'sk-SK',
  CS_CZ: 'cs-CZ',
  DE_DE: 'de-DE',
} as const

export type Locale = (typeof Locale)[keyof typeof Locale] | (string & {})

export interface LocaleOption {
  code: Locale
  label: string
  flag: string
}

export const LOCALES: LocaleOption[] = [
  { code: Locale.EN_GB, label: 'English', flag: '🇬🇧' },
  { code: Locale.SK_SK, label: 'Slovenčina', flag: '🇸🇰' },
  { code: Locale.CS_CZ, label: 'Čeština', flag: '🇨🇿' },
  { code: Locale.DE_DE, label: 'Deutsch', flag: '🇩🇪' },
]

export const DEFAULT_LOCALE: Locale = Locale.EN_GB
