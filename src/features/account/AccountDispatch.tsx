'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/hooks/useAuth'
import { ClientOverview } from './ClientOverview'

// /account entry. Client sees their own overview; admin is sent to their workspace (/account/leads).
// The parent AccountGate guarantees a logged-in user before this renders.
export function AccountDispatch() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === 'ADMIN') router.replace('/account/leads')
  }, [user, router])

  if (!user || user.role === 'ADMIN') return null
  return <ClientOverview name={user.name} />
}
