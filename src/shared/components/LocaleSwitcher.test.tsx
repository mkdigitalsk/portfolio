import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { renderWithProviders, screen, waitFor } from '@/test/renderWithProviders'
import { LocaleSwitcher } from './LocaleSwitcher'

const refresh = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh, push: vi.fn() }) }))

describe('LocaleSwitcher', () => {
  it('opens a menu listing every locale', async () => {
    renderWithProviders(<LocaleSwitcher />)

    await userEvent.click(screen.getByRole('button', { name: 'Language' }))

    for (const label of ['English', 'Slovenčina', 'Čeština', 'Deutsch']) {
      expect(screen.getByRole('menuitem', { name: new RegExp(label) })).toBeInTheDocument()
    }
  })

  it('applies the chosen locale and closes the menu', async () => {
    renderWithProviders(<LocaleSwitcher />)

    await userEvent.click(screen.getByRole('button', { name: 'Language' }))
    await userEvent.click(screen.getByRole('menuitem', { name: /Slovenčina/ }))

    expect(refresh).toHaveBeenCalledOnce()
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument())
  })
})
