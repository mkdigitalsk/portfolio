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
  liveTracking: 3, favourites: 1, payments: 3, scheduled: 2, menuFilters: 2, ratings: 1, promos: 2, multiLanguage: 1, supportChat: 4,
  // fintech
  biometricLogin: 2, instantTransfers: 3, cardControls: 3, spendingInsights: 3, multiCurrency: 2, savingsGoals: 2, realtimeAlerts: 2, fastOnboarding: 3, billSplitting: 2,
  // ecommerce
  search: 2, recommendations: 3, wishlist: 1, guestCheckout: 1, orderTracking: 3, reviews: 1, cartReminders: 2, loyalty: 2,
  // booking
  availability: 3, instantBooking: 2, mapView: 3, manage: 2, multiLangCurrency: 2, reminders: 2,
  // marketplace
  sellerListings: 3, chat: 4, escrow: 4, buyerProtection: 3, verification: 3, shipping: 2, pushOffers: 1,
  // health
  activityTracking: 2, wearableSync: 4, workoutPlans: 2, nutrition: 2, progressCharts: 3, goalReminders: 2, challenges: 2, sleep: 2, privacy: 3,
  // custom / generic
  accounts: 2, notifications: 1, adminDashboard: 3, analytics: 3, offline: 2,
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
const TIER_MIN: Record<ScopeTier, number> = { compact: 0, standard: 14, comprehensive: 26 }
const SCORE_MAX = 40 // ~ceiling for the meter fill

export function scopeScore(appId: string, features: Iterable<string>, platforms: Iterable<string>): number {
  let score = TYPE_BASE[appId] ?? 2
  for (const f of features) score += FEATURE_DIFFICULTY[f] ?? 2
  // Platform multiplier: mobile is heavier than web (platform-specifics); both is heaviest.
  const set = new Set(platforms)
  if (set.has('web') && set.has('mobile')) score *= BOTH_FACTOR
  else if (set.has('mobile')) score *= MOBILE_ONLY_FACTOR
  return score
}

export function scopeTier(score: number): ScopeTier {
  let tier: ScopeTier = 'compact'
  for (const t of SCOPE_TIERS) {
    if (score >= TIER_MIN[t]) tier = t
  }
  return tier
}

// 0..1 fill for the meter bar.
export function scopeFill(score: number): number {
  return Math.min(1, score / SCORE_MAX)
}
