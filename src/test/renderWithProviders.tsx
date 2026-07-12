import { type ReactElement, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@mui/material/styles'
import { NextIntlClientProvider } from 'next-intl'
import { render, type RenderOptions } from '@testing-library/react'
import { theme } from '@/shared/theme'
import messages from '../../locales/en-GB.json'

function makeQueryClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
}

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={makeQueryClient()}>
      <NextIntlClientProvider locale="en-GB" messages={messages}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </NextIntlClientProvider>
    </QueryClientProvider>
  )
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options })
}

export * from '@testing-library/react'
