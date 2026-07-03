import { type DateTimeFormatOptions } from 'next-intl'

export const DateFormats = {
  DATE: { year: 'numeric', month: 'short', day: 'numeric' },
  DATETIME: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false },
} satisfies Record<string, DateTimeFormatOptions>
