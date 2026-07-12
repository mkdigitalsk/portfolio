import { describe, expect, it, vi } from 'vitest'
import { HttpResponse, http, renderWithProviders, screen, server, userEvent } from '@/test/test-utils'
import { AppDetail } from './AppDetail'

const API = 'https://api.mkdigital.sk/v1'

// next/link + the configurator read the app router context; a light mock keeps them mounted in jsdom.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

// Integration: drives the real conversion path — the configurator (AppDetail) + useSubmitLeadMutation +
// leadService + leadApi + axios — against a faked backend (MSW). Asserts what the client sees.
describe('lead submission (configurator)', () => {
  it('keeps submit disabled until at least one feature is chosen', () => {
    renderWithProviders(<AppDetail appId="food" />)

    expect(screen.getByRole('button', { name: /Send via email/ })).toBeDisabled()
  })

  it('submits the selected scope and shows the sent confirmation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AppDetail appId="food" />)

    await user.click(screen.getByRole('checkbox', { name: /Live order tracking/ }))
    await user.type(screen.getByLabelText(/Your email/), 'client@example.com')

    const submit = screen.getByRole('button', { name: /Send via email/ })
    expect(submit).toBeEnabled()
    await user.click(submit)

    expect(await screen.findByText('Request sent!')).toBeInTheDocument()
  })

  it('shows an error and stays on the form when the request fails', async () => {
    server.use(http.post(`${API}/leads`, () => new HttpResponse(null, { status: 500 })))
    const user = userEvent.setup()
    renderWithProviders(<AppDetail appId="food" />)

    await user.click(screen.getByRole('checkbox', { name: /Live order tracking/ }))
    await user.type(screen.getByLabelText(/Your email/), 'client@example.com')
    await user.click(screen.getByRole('button', { name: /Send via email/ }))

    expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument()
    expect(screen.queryByText('Request sent!')).not.toBeInTheDocument()
  })
})
