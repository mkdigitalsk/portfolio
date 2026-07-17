import type { Metadata } from 'next'
import { Suspense } from 'react'
import Container from '@mui/material/Container'
import { AcceptInviteForm } from '@/features/account/AcceptInviteForm'

// Public (pre-auth) entry — /account/* sits behind the auth gate, so the invite lands here.
export const metadata: Metadata = {
  title: 'Portal invitation — MK Digital',
  robots: { index: false, follow: false },
}

export default function Page() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Suspense>
        <AcceptInviteForm />
      </Suspense>
    </Container>
  )
}
