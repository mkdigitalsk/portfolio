'use client'

import Box from '@mui/material/Box'
import { ACCOUNT_MAX, PAGE_PT } from '@/shared/layout'
import { useAuth } from '@/shared/hooks/useAuth'
import { LoginForm } from './LoginForm'

// Auth gate + width shell for the whole /account portal. One place — every sub-route (list, detail)
// renders inside it, so login is enforced once and the app-surface width is consistent across routes.
export function AccountGate({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuth()
  return (
    <Box sx={{ maxWidth: ACCOUNT_MAX, mx: 'auto', px: { xs: 2, md: 3 }, pt: PAGE_PT, pb: 10, width: '100%' }}>
      {!token || !user ? <LoginForm /> : children}
    </Box>
  )
}
