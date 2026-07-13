'use client'

import { useTranslations } from 'next-intl'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Chip, TextBody1, TextCaptionNeutral60, TextTimestamp } from '@/shared/components'
import type { AdminClient, ProjectHealth } from '@/shared/types'

// Collapse a column to its content width so slack flows to the text columns, not dead gaps.
const SHRINK_TO_CONTENT = { width: '1%', whiteSpace: 'nowrap' } as const

const HEALTH_COLOR: Record<ProjectHealth, 'success' | 'warning' | 'error'> = {
  GREEN: 'success',
  AMBER: 'warning',
  RED: 'error',
}

export function ClientsTable({ clients, onSelect }: { clients: AdminClient[]; onSelect: (email: string) => void }) {
  const t = useTranslations('account')
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Table sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow>
            <TableCell>{t('table.customer')}</TableCell>
            <TableCell>{t('table.appType')}</TableCell>
            <TableCell sx={SHRINK_TO_CONTENT}>{t('table.project')}</TableCell>
            <TableCell sx={SHRINK_TO_CONTENT}>{t('table.sent')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map(({ lead, projectState, projectHealth }) => (
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
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {projectState ? (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      size="small"
                      label={t(`project.state.${projectState}`)}
                      color={projectState === 'ACTIVE' ? 'primary' : 'default'}
                      variant={projectState === 'ACTIVE' ? 'filled' : 'outlined'}
                    />
                    {projectHealth && (
                      <Chip
                        size="small"
                        variant="outlined"
                        color={HEALTH_COLOR[projectHealth]}
                        label={t(`project.health.${projectHealth}`)}
                      />
                    )}
                  </Box>
                ) : (
                  <TextCaptionNeutral60>{t('clients.notStarted')}</TextCaptionNeutral60>
                )}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <TextTimestamp value={lead.createdAt} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
