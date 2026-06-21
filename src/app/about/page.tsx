import { Bolt, CheckCircle, Forum, Hub, Mail, OpenInNew, Verified, VpnKey } from '@mui/icons-material'
import { Box, Stack } from '@mui/material'
import { getTranslations } from 'next-intl/server'
import {
  Button,
  Reveal,
  TextBody1Neutral60,
  TextBody1Neutral80,
  TextCaptionNeutral60,
  TextH1Bold,
  TextH4Bold,
  TextH6Bold,
} from '@/shared/components'
import { ShowcaseList, type Showcase } from '@/features/home/ShowcaseList'
import { TechStack, type TechGroup } from '@/features/home/TechStack'
import { TEXT_MAX } from '@/features/home/layout'
import { CONTENT_MAX } from '@/shared/layout'

const GITHUB = 'https://github.com/mkdigitalsk'
const LINKEDIN = 'https://www.linkedin.com/in/miroslavkusnir/'

const showcases: Showcase[] = [
  { platform: 'kotlin', label: 'Kotlin Multiplatform', descriptionKey: 'kmpDesc', repoUrl: `${GITHUB}/kmp-showcase` },
  { platform: 'android', label: 'Android', descriptionKey: 'androidDesc', repoUrl: `${GITHUB}/android-showcase` },
  { platform: 'react', label: 'React Native', descriptionKey: 'rnDesc', repoUrl: `${GITHUB}/rn-showcase` },
  {
    platform: 'typescript',
    label: 'Web',
    descriptionKey: 'webDesc',
    repoUrl: `${GITHUB}/kmp-showcase/tree/master/web`,
  },
]

const techGroups: TechGroup[] = [
  {
    labelKey: 'techStack.mobile',
    withIcons: true,
    items: [
      'iOS',
      'Android',
      'Kotlin Multiplatform',
      'Compose Multiplatform',
      'Flutter',
      'React Native',
      'SwiftUI',
      'Kotlin',
      'Swift',
    ],
  },
  {
    labelKey: 'techStack.web',
    withIcons: true,
    items: ['React', 'Next.js', 'TypeScript', 'Material UI', 'Tailwind CSS', 'TanStack Query'],
  },
  { labelKey: 'techStack.backend', withIcons: true, items: ['Ktor', 'PostgreSQL', 'Firebase'] },
  { labelKey: 'techStack.devops', withIcons: true, items: ['Docker', 'Vercel', 'GitHub Actions'] },
  {
    labelKey: 'techStack.foundations',
    items: ['AI-assisted development', 'Clean Architecture', 'MVVM', 'Hook Pattern', 'CI/CD', 'Deployment'],
  },
]

// The model's advantages, research-backed (see the "advantages of the senior-led model" deep research).
// Each is framed as a mechanism — no quantified speed claims (those were refuted in verification).
const WHY = [
  { key: 'coordination', Icon: Bolt },
  { key: 'translation', Icon: Hub },
  { key: 'accountability', Icon: Verified },
  { key: 'directLine', Icon: Forum },
] as const

export default async function AboutPage() {
  const t = await getTranslations()
  const credibility = [t('hero.exp1'), t('hero.exp2'), t('hero.exp3')]

  return (
    <Box component="main">
      <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: 3, pt: { xs: 6, md: 12 }, pb: { xs: 6, md: 10 } }}>
        <Reveal>
          <TextH1Bold sx={{ mb: 3 }}>{t('hero.headline')}</TextH1Bold>
        </Reveal>
        <Reveal delay={0.08}>
          <Box sx={{ maxWidth: TEXT_MAX, mb: 4 }}>
            <TextBody1Neutral60>{t('hero.subline')}</TextBody1Neutral60>
          </Box>
        </Reveal>
        <Reveal delay={0.12}>
          <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 3 } }}>
            {credibility.map((item) => (
              <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <CheckCircle sx={{ fontSize: 18, color: 'primary.main' }} />
                <TextBody1Neutral80>{item}</TextBody1Neutral80>
              </Box>
            ))}
          </Box>
        </Reveal>
        <Reveal delay={0.16}>
          <Stack direction="row" useFlexGap spacing={1.5} sx={{ flexWrap: 'wrap' }}>
            <Button variant="primary" startIcon={<Mail />} href="mailto:admin@mkdigital.sk">
              {t('hero.cta')}
            </Button>
            <Button
              variant="outline"
              startIcon={<OpenInNew />}
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('hero.linkedinCta')}
            </Button>
          </Stack>
        </Reveal>
      </Box>

      <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: 3, pb: { xs: 6, md: 8 } }}>
        <Reveal>
          <TextH4Bold sx={{ mb: 1 }}>{t('about.why.title')}</TextH4Bold>
        </Reveal>
        <Reveal delay={0.06}>
          <Box sx={{ maxWidth: TEXT_MAX, mb: 4 }}>
            <TextBody1Neutral60>{t('about.why.subtitle')}</TextBody1Neutral60>
          </Box>
        </Reveal>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {WHY.map(({ key, Icon }, i) => (
            <Reveal key={key} delay={0.08 * i}>
              <Box
                sx={{
                  height: '100%',
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Icon sx={{ fontSize: 22, color: 'primary.main' }} />
                  <TextH6Bold>{t(`about.why.${key}.title`)}</TextH6Bold>
                </Box>
                <TextBody1Neutral60>{t(`about.why.${key}.body`)}</TextBody1Neutral60>
              </Box>
            </Reveal>
          ))}
        </Box>
      </Box>

      <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: 3, pb: { xs: 6, md: 8 } }}>
        <Reveal>
          <Box sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, bgcolor: 'action.hover' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <VpnKey sx={{ fontSize: 22, color: 'primary.main' }} />
              <TextH6Bold>{t('about.continuity.title')}</TextH6Bold>
            </Box>
            <Box sx={{ maxWidth: TEXT_MAX }}>
              <TextBody1Neutral60>{t('about.continuity.body')}</TextBody1Neutral60>
            </Box>
          </Box>
        </Reveal>
      </Box>

      <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: 3, pb: { xs: 6, md: 8 } }}>
        <Reveal>
          <TextH4Bold sx={{ mb: 1 }}>{t('showcases.title')}</TextH4Bold>
        </Reveal>
        <Reveal delay={0.06}>
          <Box sx={{ maxWidth: TEXT_MAX, mb: 2 }}>
            <TextBody1Neutral60>{t('showcases.subtitle')}</TextBody1Neutral60>
          </Box>
        </Reveal>
        <Reveal delay={0.12}>
          <ShowcaseList items={showcases} />
        </Reveal>
      </Box>

      <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: 3, pb: { xs: 6, md: 8 } }}>
        <TechStack groups={techGroups} />
      </Box>

      <Box sx={{ maxWidth: CONTENT_MAX, mx: 'auto', px: 3, pb: { xs: 8, md: 12 } }}>
        <Reveal>
          <Box sx={{ maxWidth: TEXT_MAX, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <TextCaptionNeutral60>{t('hero.company')}</TextCaptionNeutral60>
          </Box>
        </Reveal>
      </Box>
    </Box>
  )
}
