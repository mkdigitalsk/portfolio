import type { AdminLead, AuthResponse } from '@/shared/types'

export function fakeAuthResponse(overrides?: Partial<AuthResponse['user']> & { token?: string }): AuthResponse {
  const { token = 'fake.jwt.token', ...user } = overrides ?? {}
  return { token, user: { email: 'client@example.com', name: 'Test Client', ...user } }
}

export function fakeLead(overrides?: Partial<AdminLead>): AdminLead {
  return {
    id: 1,
    email: 'lead@example.com',
    appType: 'mobile',
    platforms: ['android', 'ios'],
    features: ['auth', 'push'],
    name: 'Acme Corp',
    phone: null,
    note: null,
    hasDoc: false,
    hasDesign: false,
    createdAt: '2026-01-01T00:00:00Z',
    status: 'NEW',
    ...overrides,
  }
}
