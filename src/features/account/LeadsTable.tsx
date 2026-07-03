'use client'

import { useTranslations } from 'next-intl'
import { DescriptionOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import { Chip, TextBody1, TextCaptionNeutral60, TextTimestamp } from '@/shared/components'
import type { AdminLead } from '@/shared/types'
import { STATUS_COLOR } from './leadStatus'

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
            <TableCell align="center">{t('table.doc')}</TableCell>
            <TableCell>{t('table.sent')}</TableCell>
            <TableCell>{t('table.status')}</TableCell>
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
                {lead.hasDoc && (
                  <Tooltip title={t('hasDoc')}>
                    <DescriptionOutlined fontSize="small" sx={{ color: 'text.secondary', verticalAlign: 'middle' }} />
                  </Tooltip>
                )}
              </TableCell>
              <TableCell>
                <TextTimestamp value={lead.createdAt} />
              </TableCell>
              <TableCell>
                <Chip label={t(`status.${lead.status}`)} color={STATUS_COLOR[lead.status]} size="small" variant="outlined" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
