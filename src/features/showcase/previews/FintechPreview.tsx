'use client'

import Box from '@mui/material/Box'
import { AutoScroll, PreviewScreen, Thumb, type PreviewProps } from './PreviewKit'

const PILLS = ['Invoices', 'Cards', 'Savings']

const TRANSACTIONS = [
  { emoji: '🛒', name: 'Tesco', meta: 'Groceries', amount: '−€42.10', positive: false },
  { emoji: '💸', name: 'Salary', meta: 'Income', amount: '+€2,400.00', positive: true },
  { emoji: '☕', name: 'Starbucks', meta: 'Coffee', amount: '−€4.50', positive: false },
  { emoji: '🏠', name: 'Rent', meta: 'Housing', amount: '−€650.00', positive: false },
  { emoji: '📱', name: 'Vodafone', meta: 'Bills', amount: '−€25.00', positive: false },
  { emoji: '💳', name: 'Refund', meta: 'Shopping', amount: '+€18.99', positive: true },
]

export function FintechPreview({ accent }: PreviewProps) {
  return (
    <PreviewScreen>
      {/* balance header */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box sx={{ fontSize: 10, color: 'text.secondary' }}>Total balance</Box>
        <Box sx={{ fontSize: 22, fontWeight: 800, color: accent, lineHeight: 1.2 }}>€12,480.50</Box>
        <Box sx={{ display: 'flex', gap: 0.75, mt: 0.75 }}>
          {PILLS.map((p) => (
            <Box
              key={p}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 5,
                bgcolor: 'action.hover',
                fontSize: 10,
                color: 'text.secondary',
              }}
            >
              {p}
            </Box>
          ))}
        </Box>
      </Box>

      {/* signature: this month summary */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${accent}1A` }}>
          <Box sx={{ fontSize: 11, fontWeight: 700, color: 'text.primary', mb: 0.25 }}>This month</Box>
          <Box sx={{ fontSize: 11, fontWeight: 700, color: accent }}>Income €2,400 · Spent €1,180</Box>
        </Box>
      </Box>

      {/* scrolling transactions */}
      <AutoScroll>
        {TRANSACTIONS.map((t) => (
          <Box
            key={t.name}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75 }}
          >
            <Thumb emoji={t.emoji} bg={`${accent}1A`} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ fontSize: 11.5, fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t.name}
              </Box>
              <Box sx={{ fontSize: 10, color: 'text.secondary' }}>{t.meta}</Box>
            </Box>
            <Box sx={{ fontSize: 11.5, fontWeight: 800, color: t.positive ? 'success.main' : 'text.primary' }}>
              {t.amount}
            </Box>
          </Box>
        ))}
      </AutoScroll>
    </PreviewScreen>
  )
}
