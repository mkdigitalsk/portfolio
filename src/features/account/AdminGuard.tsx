'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/hooks/useAuth'

// UX guard for the admin CRM area (/account/leads/*). Real enforcement is the server API — its admin
// endpoints are role-gated (403). This just keeps a logged-in non-admin out of the admin screens.
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user && user.role !== 'ADMIN') router.replace('/account')
  }, [user, router])

  if (!user || user.role !== 'ADMIN') return null
  return <>{children}</>
}
