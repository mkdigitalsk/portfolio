'use client'

import { Home } from '@mui/icons-material'
import Box from '@mui/material/Box'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { useScrollSpy } from '@/shared/hooks/useScrollSpy'
import { useScrollToTop } from '@/shared/hooks/useScrollToTop'
import { CONTENT_MAX } from '@/shared/layout'
import { TextH6Bold } from '../text'
import { ThemeModeToggle } from '../ThemeModeToggle'
import { LocaleSwitcher } from '../LocaleSwitcher'

interface NavItemProps {
  href: string
  active: boolean
  ariaLabel?: string
  onClick?: () => void
  children: ReactNode
}

function NavItem({ href, active, ariaLabel, onClick, children }: NavItemProps) {
  return (
    <Box
      component={Link}
      href={href}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={active ? 'page' : undefined}
      sx={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: active ? 'primary.main' : 'text.primary',
        transition: 'color 0.2s ease',
        py: 0.5,
        '&:hover': { color: 'primary.main' },
      }}
    >
      {children}
    </Box>
  )
}

// Home section anchors for serious buyers to drill into (research: a services firm needs more than
// two nav items). Hash hrefs work from /about too — they route home, then scroll to the section.
// `activePrefix` (optional) keeps the item highlighted while the current route starts with it —
// e.g. Products stays active across the /app/* product-detail pages.
interface NavAnchor {
  href: string
  key: string
  activePrefix?: string
}

const ANCHORS: NavAnchor[] = [
  { href: '/#services', key: 'common.services' },
  { href: '/#demos', key: 'common.demos', activePrefix: '/app' },
  { href: '/#process', key: 'common.process' },
  { href: '/#proof', key: 'common.proof' },
  { href: '/#contact', key: 'common.contact' },
]

// Section ids for scroll-spy — derived once from the hash anchors above (stable reference).
const SECTION_IDS = ANCHORS.filter((a) => a.href.startsWith('/#')).map((a) => a.href.slice(2))

export function NavBar() {
  const pathname = usePathname()
  const t = useTranslations()
  const activeSection = useScrollSpy(SECTION_IDS)
  const scrollToTop = useScrollToTop()

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          maxWidth: CONTENT_MAX,
          mx: 'auto',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NavItem
          href="/"
          active={pathname === '/'}
          ariaLabel="Home"
          onClick={() => {
            if (pathname === '/') scrollToTop()
          }}
        >
          <Home />
        </NavItem>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2.5 }}>
            {ANCHORS.map((a) => (
              <NavItem
                key={a.href}
                href={a.href}
                active={
                  (a.activePrefix !== undefined && pathname.startsWith(a.activePrefix)) ||
                  (pathname === '/' && a.href.slice(2) === activeSection)
                }
              >
                <TextH6Bold>{t(a.key)}</TextH6Bold>
              </NavItem>
            ))}
          </Box>
          <NavItem href="/about" active={pathname === '/about'}>
            <TextH6Bold>{t('common.about')}</TextH6Bold>
          </NavItem>
          <LocaleSwitcher />
          <ThemeModeToggle />
        </Box>
      </Box>
    </Box>
  )
}
