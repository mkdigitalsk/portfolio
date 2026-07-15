'use client'

import { Mail } from '@mui/icons-material'
import { track } from '@vercel/analytics'
import { Button } from '@/shared/components'

// The primary contact CTA (mailto), shared by the server-rendered home sections. A client component so
// the click can fire an analytics event; `section` records which section drove it. PII-free.
export function ContactCtaButton({ label, section }: { label: string; section: string }) {
  return (
    <Button
      variant="primary"
      startIcon={<Mail />}
      href="mailto:admin@mkdigital.sk"
      onClick={() => track('cta_email', { section })}
    >
      {label}
    </Button>
  )
}
