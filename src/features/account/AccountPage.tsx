'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import { Button, Input, TextH4Bold, TextH6Bold, TextBody1, TextBody1Neutral60 } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import { CONTENT_MAX, PAGE_PT } from '@/shared/layout'
import { useAuth } from './useAuth'
import { useLoginMutation } from './useLoginMutation'
import { useLeadsQuery } from './useLeadsQuery'
import { LeadsTable } from './LeadsTable'
import { LeadDetail } from './LeadDetail'

export function AccountPage() {
  const t = useTranslations('account')
  const { token, user, logout } = useAuth()

  return (
    <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: 3, pt: PAGE_PT, pb: 10, width: '100%' }}>
      {!token || !user ? (
        <LoginForm />
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
              <TextH4Bold>{user.role === 'ADMIN' ? t('admin') : t('yourAccount')}</TextH4Bold>
              <TextBody1Neutral60>{user.email}</TextBody1Neutral60>
            </Box>
            <Button variant="outline" onClick={logout}>
              {t('signOut')}
            </Button>
          </Box>
          {user.role === 'ADMIN' ? <AdminLeadsPanel /> : <ClientPanel name={user.name} />}
        </Stack>
      )}
    </Box>
  )
}

function LoginForm() {
  const t = useTranslations('account')
  const loginMutation = useLoginMutation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorKey, setErrorKey] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loginMutation.isPending) return
    setErrorKey(null)
    try {
      await loginMutation.mutateAsync({ email: email.trim(), password })
    } catch (err) {
      setErrorKey(httpStatus(err) === 401 ? 'invalidCredentials' : 'loginFailed')
    }
  }

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Stack spacing={1} sx={{ mb: 4, textAlign: 'center' }}>
        <TextH4Bold>{t('signIn')}</TextH4Bold>
        <TextBody1Neutral60>{t('signInSubtitle')}</TextBody1Neutral60>
      </Stack>
      <form onSubmit={submit}>
        <Stack spacing={2}>
          <Input
            label={t('email')}
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={t('password')}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errorKey}
            errorText={errorKey ? t(`errors.${errorKey}`) : undefined}
          />
          <Button type="submit" loading={loginMutation.isPending} disabled={!email || !password} sx={{ py: 1.5 }}>
            {t('signIn')}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}

function ClientPanel({ name }: { name: string }) {
  const t = useTranslations('account')
  return (
    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
      <Stack spacing={1}>
        <TextH6Bold>{name ? t('welcomeNamed', { name }) : t('welcome')}</TextH6Bold>
        <TextBody1Neutral60>{t('clientComingSoon')}</TextBody1Neutral60>
      </Stack>
    </Paper>
  )
}

function AdminLeadsPanel() {
  const t = useTranslations('account')
  const { data: leads = [], isLoading, error } = useLeadsQuery()
  const [selected, setSelected] = useState<string | null>(null)

  if (isLoading) return <TextBody1Neutral60>{t('loadingLeads')}</TextBody1Neutral60>
  if (error)
    return (
      <Box sx={{ color: 'error.main' }}>
        <TextBody1>{t(`errors.${httpStatus(error) === 403 ? 'notAuthorized' : 'loadLeadsFailed'}`)}</TextBody1>
      </Box>
    )
  if (selected) return <LeadDetail email={selected} onBack={() => setSelected(null)} />
  if (leads.length === 0) return <TextBody1Neutral60>{t('noLeads')}</TextBody1Neutral60>

  return (
    <Stack spacing={2}>
      <TextH6Bold>{t('leads', { count: leads.length })}</TextH6Bold>
      <LeadsTable leads={leads} onSelect={setSelected} />
    </Stack>
  )
}
