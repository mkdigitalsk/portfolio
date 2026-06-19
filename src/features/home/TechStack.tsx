'use client'

import { Box, Stack } from '@mui/material'
import { useTranslations } from 'next-intl'
import { Chip, Reveal, TextBody1Neutral60, TextH4Bold } from '@/shared/components'
import { TechIcon } from './TechIcon'

export interface TechGroup {
  labelKey: string
  items: string[]
  withIcons?: boolean
}

export function TechStack({ groups }: { groups: TechGroup[] }) {
  const t = useTranslations()

  return (
    <>
      <Reveal>
        <TextH4Bold sx={{ mb: 2 }}>{t('techStack.title')}</TextH4Bold>
      </Reveal>
      <Stack spacing={2.5}>
        {groups.map((group, index) => (
          <Reveal key={group.labelKey} delay={0.06 * index}>
            <Box>
              <TextBody1Neutral60 sx={{ mb: 1 }}>{t(group.labelKey)}</TextBody1Neutral60>
              <Stack direction="row" useFlexGap spacing={1} sx={{ flexWrap: 'wrap' }}>
                {group.items.map((tech) => (
                  <Chip
                    key={tech}
                    variant="outlined"
                    label={
                      group.withIcons ? (
                        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, verticalAlign: 'middle' }}>
                          <TechIcon tech={tech} />
                          {tech}
                        </Box>
                      ) : (
                        tech
                      )
                    }
                  />
                ))}
              </Stack>
            </Box>
          </Reveal>
        ))}
      </Stack>
    </>
  )
}
