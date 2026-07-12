import { describe, expect, it } from 'vitest'
import { HttpResponse, http, renderWithProviders, screen, server, userEvent } from '@/test/test-utils'
import { AccountGate } from './AccountGate'

const API = 'https://api.mkdigital.sk/v1'
const PORTAL = 'Protected portal'

// Integration: drives the real login flow through the AccountGate shell — LoginForm + useLoginMutation +
// authService + authApi + axios + authStore + useAuth — against a faked backend (MSW). Asserts what the
// user sees, not internals.
function renderGate() {
  return renderWithProviders(
    <AccountGate>
      <div>{PORTAL}</div>
    </AccountGate>,
  )
}

describe('account login flow', () => {
  it('keeps sign-in disabled until both fields are filled', async () => {
    renderGate()

    const submit = screen.getByRole('button', { name: 'Sign in' })
    expect(submit).toBeDisabled()

    await userEvent.type(screen.getByLabelText('Email'), 'a@b.c')
    expect(submit).toBeDisabled()

    await userEvent.type(screen.getByLabelText('Password'), 'secret')
    expect(submit).toBeEnabled()
  })

  it('signs in and reveals the protected portal on valid credentials', async () => {
    renderGate()
    expect(screen.queryByText(PORTAL)).not.toBeInTheDocument()

    await userEvent.type(screen.getByLabelText('Email'), '  a@b.c  ')
    await userEvent.type(screen.getByLabelText('Password'), 'secret')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText(PORTAL)).toBeInTheDocument()
    expect(localStorage.getItem('mk_account_token')).toBe('fake.jwt.token')
  })

  it('shows an invalid-credentials error and stays on the login form on 401', async () => {
    server.use(http.post(`${API}/auth/login`, () => new HttpResponse(null, { status: 401 })))
    renderGate()

    await userEvent.type(screen.getByLabelText('Email'), 'a@b.c')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByText('Invalid email or password.')).toBeInTheDocument()
    expect(screen.queryByText(PORTAL)).not.toBeInTheDocument()
  })
})
