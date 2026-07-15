import { describe, expect, it, vi } from 'vitest'
import {
  HttpResponse,
  fakeLead,
  http,
  renderWithProviders,
  screen,
  server,
  userEvent,
  waitFor,
} from '@/test/test-utils'
import type { LeadStatus } from '@/shared/types'
import { AdminLeadsList } from './AdminLeadsList'

const API = 'https://api.mkdigital.sk/v1'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

// Integration: the admin leads pipeline — useLeadsQuery + adminService + adminApi + axios + the table +
// inline status editing — against a faked backend (MSW). Asserts what the admin sees.
describe('admin leads pipeline', () => {
  it('renders the leads table from the backend', async () => {
    server.use(
      http.get(`${API}/admin/leads`, () =>
        HttpResponse.json([fakeLead({ email: 'acme@example.com', name: 'Acme Corp', appType: 'Food delivery' })]),
      ),
    )
    renderWithProviders(<AdminLeadsList />)

    expect(await screen.findByText('acme@example.com')).toBeInTheDocument()
    expect(screen.getByText('Acme Corp')).toBeInTheDocument()
    expect(screen.getByText('Food delivery')).toBeInTheDocument()
    expect(screen.getByText('Leads (1)')).toBeInTheDocument()
  })

  it('changes a lead status and reflects the new value', async () => {
    let status: LeadStatus = 'NEW'
    server.use(
      http.get(`${API}/admin/leads`, () => HttpResponse.json([fakeLead({ status })])),
      http.patch(`${API}/admin/leads/:email/status`, async ({ request }) => {
        status = ((await request.json()) as { status: LeadStatus }).status
        return HttpResponse.json(fakeLead({ status }))
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<AdminLeadsList />)

    expect(await screen.findByText('New')).toBeInTheDocument()

    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Reviewing' }))

    expect(await screen.findByText('Reviewing')).toBeInTheDocument()
    await waitFor(() => expect(status).toBe('REVIEWING'))
  })

  it('shows a not-authorized message on a 403', async () => {
    server.use(http.get(`${API}/admin/leads`, () => new HttpResponse(null, { status: 403 })))
    renderWithProviders(<AdminLeadsList />)

    expect(await screen.findByText('Not authorized.')).toBeInTheDocument()
  })

  it('shows a load-failed message on a server error', async () => {
    server.use(http.get(`${API}/admin/leads`, () => new HttpResponse(null, { status: 500 })))
    renderWithProviders(<AdminLeadsList />)

    expect(await screen.findByText('Could not load leads.')).toBeInTheDocument()
  })
})
