'use client'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { useServerInsertedHTML } from 'next/navigation'

export function ColorSchemeScript() {
  useServerInsertedHTML(() => <InitColorSchemeScript defaultMode="system" />)
  return null
}
