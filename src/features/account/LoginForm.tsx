'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Button, Input, TextH4Bold, TextBody1Neutral60 } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import { useLoginMutation } from './useLoginMutation'

export function LoginForm() {
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
