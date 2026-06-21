import type { Metadata } from 'next'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Footer, NavBar } from '@/shared/components'
import { theme } from '@/shared/theme'
import './globals.css'

export const metadata: Metadata = {
  title: 'MK Digital — Cross-platform apps (mobile · web · backend)',
  description:
    'We build cross-platform apps end to end — iOS, Android, web, and backend — with clean architecture and production-grade patterns.',
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" defaultMode="system" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme} defaultMode="system">
              <CssBaseline />
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
                <NavBar />
                <Box sx={{ flex: 1 }}>{children}</Box>
                <Footer />
              </Box>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
