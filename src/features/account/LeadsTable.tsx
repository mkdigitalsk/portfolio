'use client'

import { useFormatter } from 'next-intl'
import { DescriptionOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import { Chip, TextBody1, TextCaptionNeutral60 } from '@/shared/components'
import type { AdminLead } from './useAdminLeads'
import { statusMeta } from './leadStatus'

export function LeadsTable({ leads, onSelect }: { leads: AdminLead[]; onSelect: (email: string) => void }) {
  const format = useFormatter()
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>App type</TableCell>
            <TableCell>Platforms</TableCell>
            <TableCell align="center">Doc</TableCell>
            <TableCell>Sent</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((lead) => {
            const status = statusMeta(lead.status)
            return (
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
                    <Tooltip title="Has own spec / documentation">
                      <DescriptionOutlined fontSize="small" sx={{ color: 'text.secondary', verticalAlign: 'middle' }} />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  <TextCaptionNeutral60>{format.relativeTime(new Date(lead.createdAt))}</TextCaptionNeutral60>
                </TableCell>
                <TableCell>
                  <Chip label={status.label} color={status.color} size="small" variant="outlined" />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Box>
  )
}
