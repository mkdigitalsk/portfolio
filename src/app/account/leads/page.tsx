import { Suspense } from 'react'
import { AdminLeadsList } from '@/features/account/AdminLeadsList'

// Suspense boundary: AdminLeadsList reads useSearchParams (?tab) to restore the active tab.
export default function Page() {
  return (
    <Suspense>
      <AdminLeadsList />
    </Suspense>
  )
}
