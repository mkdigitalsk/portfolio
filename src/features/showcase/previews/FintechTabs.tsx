'use client'

import Box from '@mui/material/Box'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const TABS = ['Accounts', 'Cards', 'Invoices']

function Row({
  emoji,
  name,
  meta,
  value,
  valueColor,
}: {
  emoji: string
  name: string
  meta: string
  value: string
  valueColor: string
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.6 }}>
      <Thumb emoji={emoji} bg="action.hover" />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </Box>
        <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{meta}</Box>
      </Box>
      <Box sx={{ fontSize: 11.5, fontWeight: 800, color: valueColor, fontVariantNumeric: 'tabular-nums' }}>{value}</Box>
    </Box>
  )
}

function AccountsPanel({ accent }: { accent: string }) {
  return (
    <Box>
      <Box sx={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'text.secondary' }}>
        Available
      </Box>
      <Box sx={{ fontSize: 22, fontWeight: 800, color: accent, mb: 0.75, fontVariantNumeric: 'tabular-nums' }}>€12,480.50</Box>
      <Row emoji="🏦" name="Current Account" meta="•• 4821" value="€8,940.10" valueColor="text.primary" />
      <Row emoji="💰" name="Savings" meta="•• 7702" value="€3,540.40" valueColor="text.primary" />
    </Box>
  )
}

function CardsPanel({ accent }: { accent: string }) {
  return (
    <Box>
      <Box
        sx={{
          borderRadius: 2,
          p: 1.25,
          mb: 1,
          bgcolor: accent,
          color: 'common.white',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontSize: 10, fontWeight: 700, opacity: 0.85 }}>Platinum</Box>
          <Box sx={{ fontSize: 13 }}>💳</Box>
        </Box>
        <Box sx={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5 }}>•••• •••• •••• 4821</Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
        <Box sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary' }}>Monthly limit</Box>
        <Box sx={{ fontSize: 10, fontWeight: 700, color: 'text.primary', fontVariantNumeric: 'tabular-nums' }}>€1,840 / €3,000</Box>
      </Box>
      <Box sx={{ height: 5, borderRadius: 2.5, bgcolor: 'action.selected', overflow: 'hidden' }}>
        <Box sx={{ width: '61%', height: 1, borderRadius: 2.5, bgcolor: accent }} />
      </Box>
    </Box>
  )
}

function InvoicesPanel() {
  return (
    <Box>
      <Row emoji="📄" name="Invoice #1042" meta="Due Jun 28" value="€1,250.00" valueColor="text.primary" />
      <Row emoji="📄" name="Invoice #1041" meta="Paid Jun 12" value="€890.00" valueColor="success.main" />
      <Row emoji="📄" name="Invoice #1039" meta="Overdue" value="€420.00" valueColor="text.primary" />
    </Box>
  )
}

export function FintechTabs({ accent }: PreviewProps) {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reduceMotion) return
    const id = setInterval(() => setActive((prev) => (prev + 1) % TABS.length), 2500)
    return () => clearInterval(id)
  }, [reduceMotion])

  return (
    <PreviewScreen>
      {/* segmented control */}
      <Box sx={{ px: 1.5, pb: 1.25 }}>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            p: 0.4,
            borderRadius: 2,
            bgcolor: 'action.hover',
          }}
        >
          {TABS.map((tab, i) => (
            <Box key={tab} sx={{ position: 'relative', flex: 1, display: 'grid', placeItems: 'center', py: 0.6 }}>
              {active === i && (
                <Box
                  component={motion.div}
                  layoutId="fintech-tab-pill"
                  transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 32 }}
                  sx={{ position: 'absolute', inset: 0, borderRadius: 1.5, bgcolor: accent }}
                />
              )}
              <Box
                sx={{
                  position: 'relative',
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: active === i ? 'common.white' : 'text.secondary',
                  zIndex: 1,
                }}
              >
                {tab}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* content area */}
      <Box sx={{ px: 1.5, flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          <Box
            key={active}
            component={motion.div}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' }}
          >
            {active === 0 && <AccountsPanel accent={accent} />}
            {active === 1 && <CardsPanel accent={accent} />}
            {active === 2 && <InvoicesPanel />}
          </Box>
        </AnimatePresence>
      </Box>
    </PreviewScreen>
  )
}
