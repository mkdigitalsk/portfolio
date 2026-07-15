import { AdminClientView } from '@/features/account/AdminClientView'

// email is the client's resource key (API is email-keyed). decodeURIComponent so the raw email reaches the
// API layer (which re-encodes once) — otherwise `@`→%40 in the URL would get double-encoded to %2540.
export default async function Page({ params }: { params: Promise<{ email: string }> }) {
  const { email } = await params
  return <AdminClientView email={decodeURIComponent(email)} />
}
