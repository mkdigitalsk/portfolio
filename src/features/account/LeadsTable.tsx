'use client'

import { useTranslations } from 'next-intl'
import { BrushOutlined, DescriptionOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import { TextBody1, TextCaptionNeutral60, TextTimestamp } from '@/shared/components'
import type { AdminLead } from '@/shared/types'
import { LeadStatusChip } from './LeadStatusChip'

// Collapse a column to its content width so the slack flows to the text columns instead of dead gaps
// (a stretched, evenly-spaced table isolates the data). Intent-based sizing, not a hardcoded px width.
const SHRINK_TO_CONTENT = { width: '1%', whiteSpace: 'nowrap' } as const

export function LeadsTable({ leads, onSelect }: { leads: AdminLead[]; onSelect: (email: string) => void }) {
  const t = useTranslations('account')
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow>
            <TableCell>{t('table.customer')}</TableCell>
            <TableCell>{t('table.appType')}</TableCell>
            <TableCell>{t('table.platforms')}</TableCell>
            <TableCell align="center" sx={SHRINK_TO_CONTENT}>
              {t('table.doc')}
            </TableCell>
            <TableCell sx={SHRINK_TO_CONTENT}>{t('table.sent')}</TableCell>
            <TableCell sx={SHRINK_TO_CONTENT}>{t('table.status')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => (
            <TableRow
              key={lead.email}
              hover
              onClick={() => onSelect(lead.email)}
              sx={{ cursor: 'pointer', '&:last-child td': { border: 0 } }}
            >
              <TableCell>
                <Box sx={{ fontWeight: 'medium' }}>
                  <TextBody1>{lead.email}</TextBody1>
                </Box>
                {lead.name && <TextCaptionNeutral60>{lead.name}</TextCaptionNeutral60>}
              </TableCell>
              <TableCell>{lead.appType}</TableCell>
              <TableCell>
                <TextCaptionNeutral60>{lead.platforms.join(' · ')}</TextCaptionNeutral60>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: 'inline-flex', gap: 0.5, verticalAlign: 'middle' }}>
                  {lead.hasDoc && (
                    <Tooltip title={t('hasDoc')}>
                      <DescriptionOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </Tooltip>
                  )}
                  {lead.hasDesign && (
                    <Tooltip title={t('leadDocs.designClaim')}>
                      <BrushOutlined fontSize="small" sx={{ color: 'text.secondary' }} />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <TextTimestamp value={lead.createdAt} />
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <LeadStatusChip value={lead.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
