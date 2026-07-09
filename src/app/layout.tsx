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
import { cookies } from 'next/headers'
import { InitialSchemeProvider, SchemeCookieSync } from '@/shared/theme/colorSchemeCookie'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Footer, NavBar } from '@/shared/components'
import { QueryProvider } from '@/shared/query/QueryProvider'
import { theme } from '@/shared/theme'
import './globals.css'

const TITLE = 'MK Digital — Cross-platform apps (mobile · web · backend)'
const DESCRIPTION =
  'We build cross-platform apps end to end — iOS, Android, web, and backend — with clean architecture and production-grade patterns.'

export const metadata: Metadata = {
  metadataBase: new URL('https://mkdigital.sk'),
  title: TITLE,
  description: DESCRIPTION,
  // og:image + twitter:image come from app/opengraph-image.png + app/twitter-image.png (file convention).
  openGraph: {
    type: 'website',
    siteName: 'MK Digital',
    url: 'https://mkdigital.sk',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
  // Adaptive SVG favicon (Chrome/Firefox swap colours via prefers-color-scheme); PNG light/dark
  // fallbacks for Safari, which renders SVG favicons but ignores their embedded @media. apple-icon
  // is wired separately via the app/apple-icon.png file convention.
  icons: {
    icon: [
      { url: '/favicon-adaptive.svg', type: 'image/svg+xml' },
      { url: '/favicon-mark-light.png', type: 'image/png', sizes: '48x48', media: '(prefers-color-scheme: light)' },
      { url: '/favicon-mark-dark.png', type: 'image/png', sizes: '48x48', media: '(prefers-color-scheme: dark)' },
    ],
  },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale()
  const messages = await getMessages()
  const cookieScheme = (await cookies()).get('scheme')?.value
  const initialScheme = cookieScheme === 'dark' || cookieScheme === 'light' ? cookieScheme : undefined

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" defaultMode="system" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <ThemeProvider theme={theme} defaultMode="system">
                <CssBaseline />
                <InitialSchemeProvider value={initialScheme}>
                  <SchemeCookieSync />
                  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
                    <NavBar />
                    <Box sx={{ flex: 1 }}>{children}</Box>
                    <Footer />
                  </Box>
                </InitialSchemeProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </QueryProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
