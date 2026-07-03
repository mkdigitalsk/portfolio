'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Box from '@mui/material/Box'

export function Markdown({ children }: { children: string }) {
  return (
    <Box
      sx={(theme) => ({
        ...theme.typography.body2,
        color: 'text.primary',
        overflowWrap: 'anywhere',
        '& h1': { ...theme.typography.h4, mt: 3, mb: 1.5 },
        '& h2': { ...theme.typography.h5, mt: 3, mb: 1 },
        '& h3': { ...theme.typography.h6, mt: 2, mb: 1 },
        '& p': { my: 1 },
        '& ul, & ol': { pl: 3, my: 1 },
        '& li': { my: 0.25 },
        '& a': { color: 'primary.main' },
        '& blockquote': { borderLeft: 3, borderColor: 'divider', pl: 2, ml: 0, my: 1.5, color: 'text.secondary' },
        '& code': { fontFamily: 'monospace', fontSize: '0.85em', bgcolor: 'action.hover', px: 0.5, py: 0.25, borderRadius: 1 },
        '& pre': { bgcolor: 'action.hover', p: 2, borderRadius: 2, overflowX: 'auto' },
        '& pre code': { bgcolor: 'transparent', p: 0, fontSize: 'inherit' },
        '& table': { borderCollapse: 'collapse', width: '100%', my: 2, display: 'block', overflowX: 'auto' },
        '& th, & td': { border: 1, borderColor: 'divider', p: 1, textAlign: 'left', verticalAlign: 'top' },
        '& th': { bgcolor: 'action.hover', fontWeight: theme.typography.fontWeightBold },
        '& hr': { border: 0, borderTop: 1, borderColor: 'divider', my: 3 },
      })}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </Box>
  )
}
