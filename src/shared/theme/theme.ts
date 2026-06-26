'use client'

import { createTheme } from '@mui/material/styles'
import { Light, Dark } from './color'

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      0: string
      20: string
      40: string
      60: string
      80: string
      100: string
    }
  }
  interface PaletteOptions {
    neutral?: {
      0: string
      20: string
      40: string
      60: string
      80: string
      100: string
    }
  }
}

const BodyFont = '"Inter", "Helvetica", "Arial", sans-serif'
const HeadingFont = '"Plus Jakarta Sans", "Inter", "Helvetica", sans-serif'

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: Light.primary },
        secondary: { main: Light.secondary },
        error: { main: Light.error },
        success: { main: Light.success },
        warning: { main: Light.warning },
        neutral: Light.neutral,
        background: { default: Light.neutral[0], paper: Light.neutral[0] },
        text: { primary: Light.neutral[80], secondary: Light.neutral[60], disabled: Light.neutral[40] },
      },
    },
    dark: {
      palette: {
        primary: { main: Dark.primary },
        secondary: { main: Dark.secondary },
        error: { main: Dark.error },
        success: { main: Dark.success },
        warning: { main: Dark.warning },
        neutral: Dark.neutral,
        background: { default: Dark.neutral[0], paper: Dark.neutral[20] },
        text: { primary: Dark.neutral[80], secondary: Dark.neutral[60], disabled: Dark.neutral[40] },
      },
    },
  },
  typography: {
    fontFamily: BodyFont,
    h1: {
      fontFamily: HeadingFont,
      fontSize: 'clamp(2rem, 4.2vw, 3.25rem)',
      fontWeight: 700,
      lineHeight: 1.08,
      letterSpacing: '-0.02em',
    },
    h2: { fontFamily: HeadingFont },
    h3: { fontFamily: HeadingFont },
    h4: { fontFamily: HeadingFont },
    h5: { fontFamily: HeadingFont },
    h6: { fontFamily: HeadingFont },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
})
