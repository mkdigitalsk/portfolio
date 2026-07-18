import { describe, expect, it } from 'vitest'
import { renderWithProviders, screen } from '@/test/test-utils'
import { Input } from './Input'

const MSG = 'Enter a valid email address'

// Input owns real logic — conditional error render + space reservation — so it earns a component test.
describe('Input error display', () => {
  it('renders the error text only in error state', () => {
    const { rerender } = renderWithProviders(<Input label="Email" error={false} errorText={MSG} />)
    expect(screen.queryByText(MSG)).not.toBeInTheDocument()

    rerender(<Input label="Email" error errorText={MSG} />)
    expect(screen.getByText(MSG)).toBeInTheDocument()
  })

  // The phantom-gap regression: errorText being *defined* (schema computes it continuously) must not
  // reserve space — only an actually shown error may.
  it('reserves error-text space only in error state', () => {
    const { container, rerender } = renderWithProviders(<Input label="Email" error={false} errorText={MSG} />)
    const errorSlot = () => container.firstElementChild!.children[1] as HTMLElement

    expect(getComputedStyle(errorSlot()).minHeight).not.toBe('26px')

    rerender(<Input label="Email" error errorText={MSG} />)
    expect(getComputedStyle(errorSlot()).minHeight).toBe('26px')
  })
})
