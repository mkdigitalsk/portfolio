import type { Metadata } from 'next'
import { AccountPage } from '@/features/account/AccountPage'

export const metadata: Metadata = {
  title: 'Account — MK Digital',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <AccountPage />
}
