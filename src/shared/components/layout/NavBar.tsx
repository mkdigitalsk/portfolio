'use client'

import { Home } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { TextH6Bold } from '../text'
import { ThemeModeToggle } from '../ThemeModeToggle'
import { LocaleSwitcher } from '../LocaleSwitcher'
import { MotionToggle } from '../MotionToggle'

interface NavItemProps {
  href: string
  active: boolean
  ariaLabel?: string
  children: ReactNode
}

function NavItem({ href, active, ariaLabel, children }: NavItemProps) {
  return (
    <Box
      component={Link}
      href={href}
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

export function NavBar() {
  const pathname = usePathname()

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
          maxWidth: 880,
          mx: 'auto',
          px: 3,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <NavItem href="/" active={pathname === '/'} ariaLabel="Home">
          <Home />
        </NavItem>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <NavItem href="/about" active={pathname === '/about'}>
            <TextH6Bold>About</TextH6Bold>
          </NavItem>
          <LocaleSwitcher />
          <MotionToggle />
          <ThemeModeToggle />
        </Box>
      </Box>
    </Box>
  )
}
