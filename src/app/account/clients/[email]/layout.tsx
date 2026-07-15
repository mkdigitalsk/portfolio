import { AdminGuard } from '@/features/account/AdminGuard'

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return <AdminGuard>{children}</AdminGuard>
}
