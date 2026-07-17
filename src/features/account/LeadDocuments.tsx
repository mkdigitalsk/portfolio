'use client'

import { useTranslations } from 'next-intl'
import type { AdminDocument } from '@/shared/types'
import { DescriptionOutlined, UploadFileOutlined } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { Button, TextBody1Neutral60, TextCaption, TextCaptionNeutral60, TextH6Bold } from '@/shared/components'
import { downloadFile, isServedDocument } from '@/shared/api'
import { useLeadDocumentsQuery, useUploadLeadDocumentMutation } from './useLeadDocuments'

// Right-rail documentation card on the lead detail: the lead's claimed-docs note (configurator
// checkbox — a claim, not a file) + the real stored files (admin uploads what the client emails in).
export function LeadDocuments({ email, claimsDocs }: { email: string; claimsDocs: boolean }) {
  const t = useTranslations('account')
  const { data: documents = [] } = useLeadDocumentsQuery(email)
  const upload = useUploadLeadDocumentMutation(email)

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1] ?? ''
      upload.mutate({
        type: 'DOCUMENTATION',
        title: picked.name.replace(/\.[^.]+$/, ''),
        filename: picked.name,
        contentType: picked.type || 'application/octet-stream',
        base64,
      })
    }
    reader.readAsDataURL(picked)
    e.target.value = ''
  }

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <TextH6Bold>{t('leadDocs.title')}</TextH6Bold>
        {claimsDocs && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <DescriptionOutlined fontSize="small" />
            <TextCaptionNeutral60>{t('hasDocLong')}</TextCaptionNeutral60>
          </Box>
        )}
        {documents.length === 0 ? (
          <TextBody1Neutral60>{t('leadDocs.empty')}</TextBody1Neutral60>
        ) : (
          <Stack spacing={0.5} sx={{ alignSelf: 'stretch' }}>
            {documents.map((d: AdminDocument) => (
              <Box key={d.id} sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                {isServedDocument(d.url) ? (
                  <Button variant="text" sx={{ px: 0.5 }} onClick={() => downloadFile(d.url, d.title)}>
                    {d.title}
                  </Button>
                ) : (
                  <Button variant="text" sx={{ px: 0.5 }} href={d.url} target="_blank" rel="noopener">
                    {d.title}
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
        )}
        <Button variant="outline" component="label" startIcon={<UploadFileOutlined />} loading={upload.isPending}>
          {t('leadDocs.upload')}
          <input type="file" hidden onChange={pickFile} />
        </Button>
        {upload.isError && (
          <Box sx={{ color: 'error.main' }}>
            <TextCaption>{t('leadDocs.uploadFailed')}</TextCaption>
          </Box>
        )}
      </Stack>
    </Box>
  )
}
