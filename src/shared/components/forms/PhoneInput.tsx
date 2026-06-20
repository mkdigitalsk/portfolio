'use client'

import type { SxProps, Theme } from '@mui/material/styles'
import { MuiTelInput, type MuiTelInputCountry, type MuiTelInputInfo } from 'mui-tel-input'

interface PhoneInputProps {
  label?: string
  value: string
  defaultCountry: MuiTelInputCountry
  onChange?: (value: string, info: MuiTelInputInfo) => void
  sx?: SxProps<Theme>
}

export function PhoneInput({ label, value, defaultCountry, onChange, sx }: PhoneInputProps) {
  return (
    <MuiTelInput
      fullWidth
      label={label}
      value={value}
      forceCallingCode
      defaultCountry={defaultCountry}
      preferredCountries={['SK', 'CZ', 'DE', 'GB']}
      focusOnSelectCountry
      autoComplete="tel-national"
      onChange={(newValue, info) => onChange?.(newValue, info)}
      sx={[
        {
          '& .MuiOutlinedInput-root': { borderRadius: 2 },
          '& .MuiOutlinedInput-input': { py: 2.5, fontSize: '1rem' },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  )
}
