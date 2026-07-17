'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useMutation } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Button, Input, TextCaptionNeutral60, TextH4Bold, TextBody1Neutral60 } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import { authService } from '@/shared/services'

// Invite-only portal entry: consumes the emailed token, sets the password, signs the client in.
export function AcceptInviteForm() {
  const t = useTranslations('account')
  const router = useRouter()
  const token = useSearchParams().get('token') ?? ''
  const accept = useMutation({ mutationFn: authService.acceptInvite })
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errorKey, setErrorKey] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (accept.isPending) return
    if (password !== confirm) {
      setErrorKey('acceptInvite.mismatch')
      return
    }
    setErrorKey(null)
    try {
      await accept.mutateAsync({ token, password, name: name.trim() || undefined })
      router.push('/account')
    } catch (err) {
      setErrorKey(httpStatus(err) === 400 ? 'acceptInvite.invalid' : 'loginFailed')
    }
  }

  if (!token) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <TextBody1Neutral60>{t('acceptInvite.missing')}</TextBody1Neutral60>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 420, mx: 'auto' }}>
      <Stack spacing={1} sx={{ mb: 4, textAlign: 'center' }}>
        <TextH4Bold>{t('acceptInvite.title')}</TextH4Bold>
        <TextBody1Neutral60>{t('acceptInvite.subtitle')}</TextBody1Neutral60>
      </Stack>
      <form onSubmit={submit}>
        <Stack spacing={2}>
          <Input label={t('acceptInvite.name')} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input
            label={t('acceptInvite.password')}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errorKey}
          />
          <Input
            label={t('acceptInvite.confirm')}
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            error={!!errorKey}
            errorText={errorKey ? t(errorKey) : undefined}
          />
          <TextCaptionNeutral60>{t('acceptInvite.passwordHint')}</TextCaptionNeutral60>
          <Button type="submit" loading={accept.isPending}>
            {t('acceptInvite.submit')}
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
