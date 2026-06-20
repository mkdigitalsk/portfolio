'use client'

import { Animation, MotionPhotosOff } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import { useTranslations } from 'next-intl'
import { useMotion } from '@/shared/context/MotionContext'

export function MotionToggle() {
  const { motionEnabled, toggle } = useMotion()
  const t = useTranslations()

  return (
    <IconButton onClick={toggle} aria-label={t('common.animations')} sx={{ color: 'text.secondary' }}>
      {motionEnabled ? <Animation /> : <MotionPhotosOff />}
    </IconButton>
  )
}
