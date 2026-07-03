'use client'

import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import { Button, Input, TextH4Bold, TextH6Bold, TextBody1, TextBody1Neutral60 } from '@/shared/components'
import { CONTENT_MAX, PAGE_PT } from '@/shared/layout'
import { useAuth } from './useAuth'
import { useAdminLeads } from './useAdminLeads'
import { LeadsTable } from './LeadsTable'
import { LeadDetail } from './LeadDetail'

export function AccountPage() {
  const { token, user, login, logout } = useAuth()

  return (
    <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: 3, pt: PAGE_PT, pb: 10, width: '100%' }}>
      {!token || !user ? (
        <LoginForm onLogin={login} />
      ) : (
        <Stack spacing={4}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box>
              <TextH4Bold>{user.role === 'ADMIN' ? 'Admin' : 'Your account'}</TextH4Bold>
              <TextBody1Neutral60>{user.email}</TextBody1Neutral60>
            </Box>
            <Button variant="outline" onClick={logout}>
              Sign out
            </Button>
          </Box>
          {user.role === 'ADMIN' ? <AdminLeadsPanel token={token} /> : <ClientPanel name={user.name} />}
        </Stack>
      )}
    </Box>
  )
}

function LoginForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    try {
      await onLogin(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Stack spacing={1} sx={{ mb: 4, textAlign: 'center' }}>
        <TextH4Bold>Sign in</TextH4Bold>
        <TextBody1Neutral60>Access your MK Digital account.</TextBody1Neutral60>
      </Stack>
      <form onSubmit={submit}>
        <Stack spacing={2}>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            errorText={error ?? undefined}
          />
          <Button type="submit" loading={busy} disabled={!email || !password} sx={{ py: 1.5 }}>
            Sign in
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

function ClientPanel({ name }: { name: string }) {
  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
      <Stack spacing={1}>
        <TextH6Bold>Welcome{name ? `, ${name}` : ''}</TextH6Bold>
        <TextBody1Neutral60>
          Your engagement overview — proposals, milestones and demos — will appear here. Coming soon.
        </TextBody1Neutral60>
      </Stack>
    </Paper>
  )
}

function AdminLeadsPanel({ token }: { token: string }) {
  const { leads, loading, error } = useAdminLeads(token)
  const [selected, setSelected] = useState<string | null>(null)

  if (loading) return <TextBody1Neutral60>Loading leads…</TextBody1Neutral60>
  if (error)
    return (
      <Box sx={{ color: 'error.main' }}>
        <TextBody1>{error}</TextBody1>
      </Box>
    )
  if (selected) return <LeadDetail token={token} email={selected} onBack={() => setSelected(null)} />
  if (leads.length === 0) return <TextBody1Neutral60>No leads yet.</TextBody1Neutral60>

  return (
    <Stack spacing={2}>
      <TextH6Bold>Leads ({leads.length})</TextH6Bold>
      <LeadsTable leads={leads} onSelect={setSelected} />
    </Stack>
  )
}
