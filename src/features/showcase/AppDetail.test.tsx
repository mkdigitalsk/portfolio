import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, fireEvent, waitForElementToBeRemoved } from '@testing-library/react'
import { HttpResponse, http, renderWithProviders, screen, server, userEvent } from '@/test/test-utils'
import { AppDetail } from './AppDetail'

const API = 'https://api.mkdigital.sk/v1'
const INVALID_EMAIL_MSG = 'Enter a valid email address'
const DEBOUNCE_MS = 1000

// next/link + the configurator read the app router context; a light mock keeps them mounted in jsdom.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

// Integration: the real configurator — RHF + zod schema (the single required-fields list) + Input +
// debounce display — against a faked backend (MSW). Pins the whole validation contract so a future
// validation/debounce/gating change fails here, not in manual testing.
describe('AppDetail lead form', () => {
  const emailField = () => screen.getByRole('textbox', { name: /your email/i })
  const sendButton = () => screen.getByRole('button', { name: /send via email/i })
  const errorMsg = () => screen.queryByText(INVALID_EMAIL_MSG)

  describe('email error debounce', () => {
    // Value-driven tests: fireEvent sets values directly (userEvent hangs under fake timers with this
    // MUI/motion stack); the realistic-interaction path is covered by the gating block below.
    const setEmail = async (value: string) => {
      fireEvent.change(emailField(), { target: { value } })
      await act(async () => {}) // flush the async zod resolver
    }
    const pause = async (ms: number) => {
      await act(async () => {
        vi.advanceTimersByTime(ms)
      })
    }

    beforeEach(() => {
      // Fake ONLY setTimeout (the debounce) — faking rAF/microtasks hangs MUI + motion in jsdom.
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    it('shows no error while typing an invalid email (before the pause)', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      await setEmail('testujem@gmail.c')
      expect(errorMsg()).not.toBeInTheDocument()
    })

    it('shows the error after a typing pause with an invalid value', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      await setEmail('testujem@gmail.c')
      await pause(DEBOUNCE_MS)
      expect(errorMsg()).toBeInTheDocument()
    })

    // The error text leaves through a ~0.5s exit fade (AnimatePresence) — hiding runs on real time,
    // so these two tests arm the debounce on fake timers, then switch to real timers and wait the
    // exit out (waitForElementToBeRemoved), per the async-disappearance rule in web testing.md.

    it('starts hiding the error on the next keystroke and re-arms after another pause', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      await setEmail('a@b')
      await pause(DEBOUNCE_MS)
      expect(errorMsg()).toBeInTheDocument()

      vi.useRealTimers()
      await setEmail('a@bx')
      await waitForElementToBeRemoved(errorMsg)

      // Debounce re-arms on real time now — the message returns after the pause.
      expect(await screen.findByText(INVALID_EMAIL_MSG, {}, { timeout: DEBOUNCE_MS + 1000 })).toBeInTheDocument()
    })

    it('hides the error once the value becomes valid', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      await setEmail('a@b')
      await pause(DEBOUNCE_MS)
      expect(errorMsg()).toBeInTheDocument()

      vi.useRealTimers()
      await setEmail('a@b.com')
      await waitForElementToBeRemoved(errorMsg)
      expect(errorMsg()).not.toBeInTheDocument()
    })

    it('does not flash the error on blur or on re-editing a touched field', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      await setEmail('a@b')
      fireEvent.blur(emailField()) // blur before the pause elapses
      await act(async () => {})
      expect(errorMsg()).not.toBeInTheDocument()

      fireEvent.focus(emailField())
      await setEmail('a@bx') // re-edit a touched field
      expect(errorMsg()).not.toBeInTheDocument()

      await pause(DEBOUNCE_MS)
      expect(errorMsg()).toBeInTheDocument()
    })

    it('typing char by char never shows the error before a full pause', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      const value = 'testujem@gmail.c'
      for (let i = 1; i <= value.length; i++) {
        await setEmail(value.slice(0, i))
        await pause(DEBOUNCE_MS - 100) // keeps typing — pause never completes
        expect(errorMsg()).not.toBeInTheDocument()
      }
      await pause(DEBOUNCE_MS)
      expect(errorMsg()).toBeInTheDocument()
    })

    it('paste (single change with full value) waits for the pause too', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      await setEmail('pasted@invalid.c')
      expect(errorMsg()).not.toBeInTheDocument()

      await pause(DEBOUNCE_MS)
      expect(errorMsg()).toBeInTheDocument()
    })

    it('re-pasting a previously flagged value waits for the pause again', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      await setEmail('a@b')
      await pause(DEBOUNCE_MS)
      expect(errorMsg()).toBeInTheDocument()

      // Clear the field, let the exit animation finish on real time.
      vi.useRealTimers()
      await setEmail('')
      await waitForElementToBeRemoved(errorMsg)

      // Paste the SAME invalid value back — must wait the full pause again, no instant flash.
      vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
      await setEmail('a@b')
      expect(errorMsg()).not.toBeInTheDocument()

      await pause(DEBOUNCE_MS)
      expect(errorMsg()).toBeInTheDocument()
    })

    it('never shows an error for an empty email while idle', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      fireEvent.focus(emailField())
      fireEvent.blur(emailField())
      await pause(DEBOUNCE_MS * 2)
      expect(screen.queryByText('This field is required')).not.toBeInTheDocument()
    })
  })

  describe('submit gating (schema = the required-fields list)', () => {
    it('starts disabled and enables on a valid email alone (platform is preset)', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      expect(sendButton()).toBeDisabled()

      await userEvent.type(emailField(), 'a@b.com')
      expect(sendButton()).toBeEnabled()
    })

    it('ticking documentation without an email does NOT enable send', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      await userEvent.click(screen.getByRole('checkbox', { name: /own documentation/i }))
      expect(sendButton()).toBeDisabled()
    })

    it('disables again when the email is cleared', async () => {
      renderWithProviders(<AppDetail appId="fintech" />)
      await userEvent.type(emailField(), 'a@b.com')
      expect(sendButton()).toBeEnabled()

      await userEvent.clear(emailField())
      expect(sendButton()).toBeDisabled()
    })

    it('submits the full payload and shows the sent confirmation', async () => {
      let payload: Record<string, unknown> | null = null
      server.use(
        http.post(`${API}/leads`, async ({ request }) => {
          payload = (await request.json()) as Record<string, unknown>
          return HttpResponse.json({ success: true })
        }),
      )
      renderWithProviders(<AppDetail appId="fintech" />)

      await userEvent.type(emailField(), 'a@b.com')
      await userEvent.click(screen.getByRole('checkbox', { name: /own documentation/i }))
      await userEvent.click(screen.getByRole('checkbox', { name: /own design/i }))
      await userEvent.click(sendButton())

      expect(await screen.findByText('Request sent!')).toBeInTheDocument()
      expect(payload).toMatchObject({
        email: 'a@b.com',
        hasDoc: true,
        hasDesign: true,
        platforms: ['Web'],
        features: [],
      })
    })

    it('shows an error and stays on the form when the request fails', async () => {
      server.use(http.post(`${API}/leads`, () => new HttpResponse(null, { status: 500 })))
      renderWithProviders(<AppDetail appId="fintech" />)

      await userEvent.type(emailField(), 'client@example.com')
      await userEvent.click(sendButton())

      expect(await screen.findByText('Something went wrong. Please try again.')).toBeInTheDocument()
      expect(screen.queryByText('Request sent!')).not.toBeInTheDocument()
    })
  })
})
