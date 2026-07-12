import { describe, expect, it } from 'vitest'
import { scopeColor, scopeFill, scopeScore, scopeTier } from './complexity'

// Pure configurator scope maths — no price, only the public complexity signal. Unit-tested in isolation.
describe('scopeScore', () => {
  it('sums the type base with each feature difficulty', () => {
    // food base 3 + payments 3 + favourites 1, web-only (no platform multiplier) = 7
    expect(scopeScore('food', ['payments', 'favourites'], ['web'])).toBe(7)
  })

  it('applies the mobile multiplier and the heavier both-platforms multiplier', () => {
    expect(scopeScore('food', ['payments', 'favourites'], ['mobile'])).toBeCloseTo(8.4)
    expect(scopeScore('food', ['payments', 'favourites'], ['web', 'mobile'])).toBeCloseTo(10.5)
  })

  it('falls back to a default for an unknown type and unknown feature', () => {
    // unknown type base 2 + unknown feature 2 = 4
    expect(scopeScore('unknown', ['nope'], ['web'])).toBe(4)
  })
})

describe('scopeFill', () => {
  it('is the ratio of score to max, clamped to 1', () => {
    expect(scopeFill(5, 10)).toBe(0.5)
    expect(scopeFill(20, 10)).toBe(1)
  })

  it('is 0 when the max is 0', () => {
    expect(scopeFill(3, 0)).toBe(0)
  })
})

describe('scopeTier', () => {
  it('maps fill to the compact / standard / comprehensive tiers', () => {
    expect(scopeTier(0)).toBe('compact')
    expect(scopeTier(0.39)).toBe('compact')
    expect(scopeTier(0.4)).toBe('standard')
    expect(scopeTier(0.74)).toBe('standard')
    expect(scopeTier(0.75)).toBe('comprehensive')
    expect(scopeTier(1)).toBe('comprehensive')
  })
})

describe('scopeColor', () => {
  it('returns a valid hex colour that darkens from compact to comprehensive', () => {
    const compact = scopeColor('#FF6B35', 'compact')
    const comprehensive = scopeColor('#FF6B35', 'comprehensive')
    expect(compact).toMatch(/^#[0-9a-f]{6}$/)
    expect(comprehensive).toMatch(/^#[0-9a-f]{6}$/)
    expect(compact).not.toBe(comprehensive)
  })
})
