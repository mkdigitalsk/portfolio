'use client'

import { AccountCircleOutlined, Close, Menu as MenuIcon } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useColorScheme } from '@mui/material/styles'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { useScrollSpy } from '@/shared/hooks/useScrollSpy'
import { useScrollToTop } from '@/shared/hooks/useScrollToTop'
import { useAuth } from '@/shared/hooks/useAuth'
import { Light, Dark } from '@/shared/theme/color'
import { Logo } from '../icons/Logo'
import { TextBody1, TextCaptionNeutral60, TextH6Bold } from '../text'
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

function AccountMenu() {
  const t = useTranslations('account')
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const onAccount = pathname.startsWith('/account')
  const color = onAccount ? 'primary.main' : 'text.primary'

  if (!user) {
    return (
      <IconButton
        component={Link}
        href="/account"
        aria-label={t('yourAccount')}
        aria-current={onAccount ? 'page' : undefined}
        sx={{ color }}
      >
        <AccountCircleOutlined />
      </IconButton>
    )
  }

  const roleLabel = user.role === 'ADMIN' ? t('admin') : t('yourAccount')
  const home = user.role === 'ADMIN' ? '/account/leads' : '/account'
  const close = () => setAnchor(null)
  return (
    <>
      <IconButton
        aria-label={roleLabel}
        aria-haspopup="menu"
        aria-expanded={anchor ? true : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ color }}
      >
        <AccountCircleOutlined />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem component={Link} href={home} onClick={close} sx={{ display: 'block', py: 1 }}>
          <TextBody1>{roleLabel}</TextBody1>
          <TextCaptionNeutral60>{user.email}</TextCaptionNeutral60>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            close()
            logout()
          }}
        >
          {t('signOut')}
        </MenuItem>
      </Menu>
    </>
  )
}

export function NavBar() {
  const pathname = usePathname()
  const t = useTranslations()
  const activeSection = useScrollSpy(SECTION_IDS)
  const scrollToTop = useScrollToTop()
  const [menuOpen, setMenuOpen] = useState(false)
  const { mode, systemMode } = useColorScheme()
  const resolvedMode = mode === 'system' ? systemMode : mode

  const isAnchorActive = (a: NavAnchor) =>
    (a.activePrefix !== undefined && pathname.startsWith(a.activePrefix)) ||
    (pathname === '/' && a.href.slice(2) === activeSection)

  return (
    <Box
      component="header"
      className="dark" // brand bar: force on-dark tokens so text + logo read on the navy surface
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: resolvedMode === 'dark' ? Dark.brandBar : Light.brandBar,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
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
          ariaLabel="MK Digital — home"
          onClick={() => {
            if (pathname === '/') scrollToTop()
          }}
        >
          <Logo variant="lockup" height={40} />
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
          <AccountMenu />
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
