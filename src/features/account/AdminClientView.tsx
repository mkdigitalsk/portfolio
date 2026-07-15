'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ArrowBack } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { Button, TextCaptionNeutral60, TextH6Bold } from '@/shared/components'
import { AdminProject } from './AdminProject'
import { ClientPreview } from './ClientPreview'

type Perspective = 'admin' | 'client'

// A won lead has graduated to a client — this is the DELIVERY surface, deliberately free of the sales
// pipeline framing (no lead-status select, no requirements/proposal tabs). Back returns to the Clients tab.
export function AdminClientView({ email }: { email: string }) {
  const t = useTranslations('account')
  const router = useRouter()
  const [perspective, setPerspective] = useState<Perspective>('admin')
  const back = () => router.push('/account/leads?tab=clients')

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Button variant="text" onClick={back} startIcon={<ArrowBack />} sx={{ flexShrink: 0 }}>
          {t('clients.back')}
        </Button>
        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <TextH6Bold>{email}</TextH6Bold>
          <TextCaptionNeutral60>{t('clients.deliveryCaption')}</TextCaptionNeutral60>
        </Box>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={perspective}
          onChange={(_, v: Perspective | null) => v && setPerspective(v)}
        >
          <ToggleButton value="admin">{t('delivery.viewAdmin')}</ToggleButton>
          <ToggleButton value="client">{t('delivery.viewClient')}</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {perspective === 'client' ? <ClientPreview email={email} name={email} /> : <AdminProject email={email} />}
    </Stack>
  )
}
