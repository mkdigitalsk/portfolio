// Public complexity / scope signal for the configurator — shows the PRODUCT SCOPE, never a price.
// Difficulty weights are derived from the 2026 product-pricing research (.claude/research): the
// RELATIVE ordering of features is the robust part. The € price (difficulty × country coefficient)
// stays INTERNAL — see .claude/research/PRICING-INTERNAL.md. Nothing here maps to money.

// Inherent base complexity per product type (regulated/fintech is heaviest).
const TYPE_BASE: Record<string, number> = {
  food: 3,
  fintech: 5,
  ecommerce: 3,
  booking: 3,
  marketplace: 4,
  health: 3,
  custom: 2,
}

// Per-feature difficulty (1 = light, 4 = heavy). Keyed by the feature keys in apps.ts.
const FEATURE_DIFFICULTY: Record<string, number> = {
  // food
  liveTracking: 3,
  favourites: 1,
  payments: 3,
  scheduled: 2,
  menuFilters: 2,
  ratings: 1,
  promos: 2,
  multiLanguage: 1,
  supportChat: 4,
  // fintech
  biometricLogin: 2,
  instantTransfers: 3,
  cardControls: 3,
  spendingInsights: 3,
  multiCurrency: 2,
  savingsGoals: 2,
  realtimeAlerts: 2,
  fastOnboarding: 3,
  billSplitting: 2,
  // ecommerce
  search: 2,
  recommendations: 3,
  wishlist: 1,
  guestCheckout: 1,
  orderTracking: 3,
  reviews: 1,
  cartReminders: 2,
  loyalty: 2,
  // booking
  availability: 3,
  instantBooking: 2,
  mapView: 3,
  manage: 2,
  multiLangCurrency: 2,
  reminders: 2,
  // marketplace
  sellerListings: 3,
  chat: 4,
  escrow: 4,
  buyerProtection: 3,
  verification: 3,
  shipping: 2,
  pushOffers: 1,
  // health
  activityTracking: 2,
  wearableSync: 4,
  workoutPlans: 2,
  nutrition: 2,
  progressCharts: 3,
  goalReminders: 2,
  challenges: 2,
  sleep: 2,
  privacy: 3,
  // custom / generic
  accounts: 2,
  notifications: 1,
  adminDashboard: 3,
  analytics: 3,
  offline: 2,
}

// Platform is a scope MULTIPLIER. Even with KMP, mobile carries platform-specific work (push,
// permissions, per-OS testing, store submission) so it's heavier than web; both surfaces together
// is heaviest — but well under 2× because the KMP mobile codebase and the backend are shared.
const MOBILE_ONLY_FACTOR = 1.2
const BOTH_FACTOR = 1.5

// Scope tiers by score (tune thresholds freely — only the public label changes).
// Three tiers only — choice-overload research shows 4+ tiers convert ~30% worse (see the
// path-to-quote deep-research in .claude/research). Framed as scope-fit, never price.
export const SCOPE_TIERS = ['compact', 'standard', 'comprehensive'] as const
export type ScopeTier = (typeof SCOPE_TIERS)[number]
// Thresholds are FILL RATIOS (0..1) relative to the app's own max (all its features + both
// platforms), so selecting everything fills the bar and reads Comprehensive.
const TIER_MIN: Record<ScopeTier, number> = { compact: 0, standard: 0.4, comprehensive: 0.75 }

export function scopeScore(appId: string, features: Iterable<string>, platforms: Iterable<string>): number {
  let score = TYPE_BASE[appId] ?? 2
  for (const f of features) score += FEATURE_DIFFICULTY[f] ?? 2
  // Platform multiplier: mobile is heavier than web (platform-specifics); both is heaviest.
  const set = new Set(platforms)
  if (set.has('web') && set.has('mobile')) score *= BOTH_FACTOR
  else if (set.has('mobile')) score *= MOBILE_ONLY_FACTOR
  return score
}

export function scopeTier(fill: number): ScopeTier {
  let tier: ScopeTier = 'compact'
  for (const t of SCOPE_TIERS) {
    if (fill >= TIER_MIN[t]) tier = t
  }
  return tier
}

// 0..1 fill of the bar = the chosen scope relative to the app's maximum (all features + both platforms).
export function scopeFill(score: number, maxScore: number): number {
  return maxScore > 0 ? Math.min(1, score / maxScore) : 0
}

// Single-hue sequential colour scale for the meter bar: keep the accent's HUE, move LIGHTNESS from
// a lighter tint (low scope) to a darker, slightly more saturated shade (high scope) — the
// "progressively stronger" colour (best practice: vary lightness, add saturation at the dark end).
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')
  return `#${to(r)}${to(g)}${to(b)}`
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return [0, 0, l]
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h: number
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / d + 2) / 6
  else h = ((rn - gn) / d + 4) / 6
  return [h, s, l]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) return [l * 255, l * 255, l * 255]
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue = (t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  return [hue(h + 1 / 3) * 255, hue(h) * 255, hue(h - 1 / 3) * 255]
}

// Discrete shade per TIER (not a subtle continuous % change) — 3 clearly distinct steps: a light
// tint at Compact to a darker, more saturated shade at Comprehensive. Reads far better than a faint
// gradient on a thin bar, and ties the colour to the tier label. The bar WIDTH still tracks % fill.
const TIER_SHADE: Record<ScopeTier, { dl: number; ds: number }> = {
  compact: { dl: 0.16, ds: -0.05 },
  standard: { dl: 0, ds: 0 },
  comprehensive: { dl: -0.14, ds: 0.12 },
}

export function scopeColor(accent: string, tier: ScopeTier): string {
  const [h, s, l] = rgbToHsl(...hexToRgb(accent))
  const { dl, ds } = TIER_SHADE[tier]
  return rgbToHex(...hslToRgb(h, clamp(s + ds, 0, 1), clamp(l + dl, 0.12, 0.92)))
}
