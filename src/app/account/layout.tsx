import type { Metadata } from 'next'
import { AccountGate } from '@/features/account/AccountGate'

// noindex covers every /account sub-route (list + detail); the auth gate wraps them all.
export const metadata: Metadata = {
  title: 'Account — MK Digital',
  robots: { index: false, follow: false },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountGate>{children}</AccountGate>
}
