'use client'

import { useFormatter, type DateTimeFormatOptions } from 'next-intl'
import { DateFormats } from '@/shared/dateFormats'
import { TextCaptionNeutral60 } from './TextCaption'
import { type BaseTextProps } from './types'

type TextTimestampProps = Omit<BaseTextProps, 'children'> & {
  value: string | number | Date
  format?: DateTimeFormatOptions
}

export function TextTimestamp({ value, format = DateFormats.DATE, ...props }: TextTimestampProps) {
  const formatter = useFormatter()
  return <TextCaptionNeutral60 {...props}>{formatter.dateTime(new Date(value), format)}</TextCaptionNeutral60>
}
