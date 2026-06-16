// Mirrors the Showcase app's locale model (BCP-47 codes, endonym labels).
// The switcher UI + persistence live here now; wiring to real translation +
// [locale] routing comes with the next-intl phase (see .claude/blueprint.md §7).

export const Locale = {
  EN_GB: 'en-GB',
  SK_SK: 'sk-SK',
  CS_CZ: 'cs-CZ',
  DE_DE: 'de-DE',
} as const

// Open type — predefined locales autocomplete; `| (string & {})` keeps it open
// for future dynamic locales without a type change.
export type Locale = (typeof Locale)[keyof typeof Locale] | (string & {})

export interface LocaleOption {
  code: Locale
  label: string
  flag: string // emoji flag (swap to an SVG flag set later for consistent cross-OS rendering)
}

// Labels in each language's own form (endonyms) — conventional for switchers.
export const LOCALES: LocaleOption[] = [
  { code: Locale.EN_GB, label: 'English', flag: '🇬🇧' },
  { code: Locale.SK_SK, label: 'Slovenčina', flag: '🇸🇰' },
  { code: Locale.CS_CZ, label: 'Čeština', flag: '🇨🇿' },
  { code: Locale.DE_DE, label: 'Deutsch', flag: '🇩🇪' },
]

export const DEFAULT_LOCALE: Locale = Locale.EN_GB
