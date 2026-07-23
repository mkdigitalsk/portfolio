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
import { LeadTransitions } from './LeadTransitions'

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

  it('shows status as a read-only chip — no inline editing in the list', async () => {
    server.use(http.get(`${API}/admin/leads`, () => HttpResponse.json([fakeLead({ status: 'NEW' })])))
    renderWithProviders(<AdminLeadsList />)

    expect(await screen.findByText('New')).toBeInTheDocument()
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('transitions: only the legal next actions render and the primary one advances the status', async () => {
    let status: LeadStatus = 'NEW'
    server.use(
      http.patch(`${API}/admin/leads/:email/status`, async ({ request }) => {
        status = ((await request.json()) as { status: LeadStatus }).status
        return HttpResponse.json(fakeLead({ status }))
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<LeadTransitions email="lead@example.com" status="NEW" />)

    expect(screen.getByRole('button', { name: 'Start intake' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Mark won' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start intake' }))
    await waitFor(() => expect(status).toBe('INTAKE'))
  })

  it('decline asks for confirmation before marking the lead declined', async () => {
    let status: LeadStatus = 'PROPOSAL'
    server.use(
      http.patch(`${API}/admin/leads/:email/status`, async ({ request }) => {
        status = ((await request.json()) as { status: LeadStatus }).status
        return HttpResponse.json(fakeLead({ status }))
      }),
    )
    const user = userEvent.setup()
    renderWithProviders(<LeadTransitions email="lead@example.com" status="PROPOSAL" />)

    await user.click(screen.getByRole('button', { name: 'Decline' }))
    expect(await screen.findByText('Decline this lead?')).toBeInTheDocument()
    expect(status).toBe('PROPOSAL')

    await user.click(screen.getAllByRole('button', { name: 'Decline' }).at(-1)!)
    await waitFor(() => expect(status).toBe('DECLINED'))
  })

  it('shows the conflict message when the server rejects a transition with 409', async () => {
    server.use(http.patch(`${API}/admin/leads/:email/status`, () => new HttpResponse(null, { status: 409 })))
    const user = userEvent.setup()
    renderWithProviders(<LeadTransitions email="lead@example.com" status="NEW" />)

    await user.click(screen.getByRole('button', { name: 'Start intake' }))
    expect(await screen.findByText(/not allowed from the current status/)).toBeInTheDocument()
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
