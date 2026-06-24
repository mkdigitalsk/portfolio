'use client'

import { Close, Home, Menu as MenuIcon } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  const isAnchorActive = (a: NavAnchor) =>
    (a.activePrefix !== undefined && pathname.startsWith(a.activePrefix)) ||
    (pathname === '/' && a.href.slice(2) === activeSection)

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
          px: { xs: 2, md: 3 },
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2.5 }}>
            {ANCHORS.map((a) => (
              <NavItem key={a.href} href={a.href} active={isAnchorActive(a)}>
                <TextH6Bold>{t(a.key)}</TextH6Bold>
              </NavItem>
            ))}
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
            <NavItem href="/about" active={pathname === '/about'}>
              <TextH6Bold>{t('common.about')}</TextH6Bold>
            </NavItem>
          </Box>
          {/* Combo: keep the CTA visible, rest in the drawer — more discoverable than a pure hamburger. */}
          <Box sx={{ display: { xs: 'inline-flex', md: 'none' } }}>
            <NavItem href="/#contact" active={pathname === '/' && activeSection === 'contact'}>
              <TextH6Bold>{t('common.contact')}</TextH6Bold>
            </NavItem>
          </Box>
          <IconButton
            aria-label={t('common.menu')}
            onClick={() => setMenuOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          <LocaleSwitcher />
          <ThemeModeToggle />
        </Box>
      </Box>

      <Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box
          role="navigation"
          sx={{ width: 'min(78vw, 300px)', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <IconButton
            aria-label={t('common.closeMenu')}
            onClick={() => setMenuOpen(false)}
            sx={{ alignSelf: 'flex-end', color: 'text.primary' }}
          >
            <Close />
          </IconButton>
          {ANCHORS.filter((a) => a.key !== 'common.contact').map((a) => (
            <NavItem key={a.href} href={a.href} active={isAnchorActive(a)} onClick={() => setMenuOpen(false)}>
              <TextH6Bold>{t(a.key)}</TextH6Bold>
            </NavItem>
          ))}
          <NavItem href="/about" active={pathname === '/about'} onClick={() => setMenuOpen(false)}>
            <TextH6Bold>{t('common.about')}</TextH6Bold>
          </NavItem>
        </Box>
      </Drawer>
    </Box>
  )
}
