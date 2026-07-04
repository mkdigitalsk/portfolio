import { AdminGuard } from '@/features/account/AdminGuard'

export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>
}
