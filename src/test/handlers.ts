import { http, HttpResponse } from 'msw'
import { fakeAuthResponse, fakeLead } from './fakes'

// Match the axios client's default base URL (client.ts: NEXT_PUBLIC_API_URL ?? this).
const API = 'https://api.mkdigital.sk/v1'

// Happy-path defaults for the whole suite. Per-test error/edge via server.use(...) in the test.
export const handlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    const { email } = (await request.json()) as { email: string; password: string }
    return HttpResponse.json(fakeAuthResponse({ email }))
  }),

  http.get(`${API}/auth/me`, () => HttpResponse.json(fakeAuthResponse())),

  http.post(`${API}/leads`, () => HttpResponse.json({ success: true })),

  http.get(`${API}/admin/leads`, () => HttpResponse.json([fakeLead()])),

  http.patch(`${API}/admin/leads/:email/status`, async ({ request }) => {
    const { status } = (await request.json()) as { status: string }
    return HttpResponse.json(fakeLead({ status: status as never }))
  }),
]
