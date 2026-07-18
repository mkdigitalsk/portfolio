'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import { AlertDialog, Button, TextCaption } from '@/shared/components'
import { httpStatus } from '@/shared/api'
import type { LeadStatus } from '@/shared/types'
import { CAN_DECLINE, NEXT_TRANSITIONS } from './leadStatus'
import { useUpdateStatusMutation } from './useUpdateStatusMutation'

// Jira-style transition actions: the state is a fact (chip), changing it is a decision (button).
// Only legal next steps render (NEXT_TRANSITIONS mirrors the server graph); decline is the separate
// destructive path with a confirm; force/override deliberately has NO UI.
export function LeadTransitions({ email, status }: { email: string; status: LeadStatus }) {
  const t = useTranslations('account')
  const mutation = useUpdateStatusMutation(email)
  const [confirmDecline, setConfirmDecline] = useState(false)

  const [primary, ...secondary] = NEXT_TRANSITIONS[status]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      {primary && (
        <Button size="small" variant="primary" loading={mutation.isPending} onClick={() => mutation.mutate(primary)}>
          {t(`transition.${primary}`)}
        </Button>
      )}
      {secondary.map((next) => (
        <Button key={next} size="small" variant="outline" disabled={mutation.isPending} onClick={() => mutation.mutate(next)}>
          {t(`transition.${next}`)}
        </Button>
      ))}
      {CAN_DECLINE[status] && (
        <Button
          size="small"
          variant="outline"
          color="error"
          disabled={mutation.isPending}
          onClick={() => setConfirmDecline(true)}
        >
          {t('transition.LOST')}
        </Button>
      )}
      {mutation.isError && (
        <Box sx={{ color: 'error.main' }}>
          <TextCaption>
            {t(httpStatus(mutation.error) === 409 ? 'transition.conflict' : 'transition.failed')}
          </TextCaption>
        </Box>
      )}

      <AlertDialog
        open={confirmDecline}
        title={t('transition.declineConfirmTitle')}
        text={t('transition.declineConfirmText')}
        confirmText={t('transition.LOST')}
        dismissText={t('delivery.cancel')}
        destructive
        onConfirm={() => {
          mutation.mutate('LOST')
          setConfirmDecline(false)
        }}
        onDismiss={() => setConfirmDecline(false)}
      />
    </Box>
  )
}
