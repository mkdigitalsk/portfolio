'use client'

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { useServerInsertedHTML } from 'next/navigation'

// Injects MUI's color-scheme init script into the server HTML stream instead of
// rendering a <script> element in the React tree. Rendering a raw inline <script>
// in a component triggers React 19's "script tag while rendering" warning (the
// script still runs, but the warning is noisy). useServerInsertedHTML emits it
// server-side only, so there's no client-rendered <script> and no warning — while
// still running before paint to prevent a light/dark flash.
export function ColorSchemeScript() {
  useServerInsertedHTML(() => <InitColorSchemeScript defaultMode="system" />)
  return null
}
