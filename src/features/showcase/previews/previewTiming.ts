import { CARD_FLIP_S, ICON_FLIP_S } from '../flipTiming'
import type { IconAnimation } from '../iconAnimations'
import { revealAnimations } from '../revealAnimations'

// ── Shared flow animation constants — reused across every preview, no magic numbers in the JSX. ──
export const SCREEN_FADE_S = 0.3 // screen enter/exit fade
export const SCREEN_SLIDE_PX = 10 // screen enter/exit horizontal slide
export const TAP_TO_FLIP_MS = 400 // tap ripple → screen flip
export const TAP_RIPPLE_S = 0.45 // tap ripple expand
export const FIRST_BEAT_MS = 300 // first in-screen beat after a detail screen mounts
export const STEP_MS = 600 // gap between sequential beats (toppings, cart items, …)
export const CONFIRM_GAP_MS = 200 // extra beat before a confirm / CTA fires
export const DETAIL_HOLD_MS = 3000 // how long a detail screen holds before looping back to the list
export const LOOP_GAP_MS = 600 // pause on the list screen before the cycle restarts
export const POP_SPRING = { type: 'spring' as const, stiffness: 500, damping: 16 } // checkmark / badge pop
export const PRESS_DIP = [1, 0.94, 1] // tap press: the button/row scale dips then releases (a real "click")
export const PRESS_TRANSITION = { duration: 0.28, ease: 'easeOut' as const }

// fintech/food flip in 3D (FlipRevealCard): icon flip then card flip.
const FLIP_OPEN_MS = (ICON_FLIP_S + CARD_FLIP_S) * 1000 // ≈ 840ms
// everything else (AppRevealCard) reveals via a clip/alpha animation with its own duration.
const clipRevealMs = (ia: IconAnimation) =>
  ((revealAnimations[ia].transition as { duration?: number }).duration ?? 0.55) * 1000

// Per card type: `reveal` = how long that card's open animation runs (derived from the real flip /
// clip durations, can't drift). `offset` = where the in-screen action starts relative to the reveal
// END — 0 means "right as the reveal finishes", negative means "start during the reveal" (used for
// the long reveals so they don't feel late). The action MUST land after the card is on screen,
// otherwise it plays hidden and the first visible run is deferred to the next loop (≈ feels seconds
// late). Tune each card here.
export const CARD_TIMING: Record<IconAnimation, { reveal: number; offset: number }> = {
  flip: { reveal: FLIP_OPEN_MS, offset: 300 }, // fintech — tap Main Account just after the overview reveals (~1140ms) → detail → credit
  food: { reveal: FLIP_OPEN_MS, offset: 1570 }, // food — menu scrolls to the burger (~2.26s), then tap (~2410ms) → ingredients
  drop: { reveal: clipRevealMs('drop'), offset: 300 }, // ecommerce — tap the product after the shop reveals (~850ms) → colorway → size → bag
  wind: { reveal: clipRevealMs('wind'), offset: 250 }, // marketplace — tiny pause before the first add-to-cart (~800ms)
  fly: { reveal: clipRevealMs('fly'), offset: 300 }, // booking — tap the featured stay after the plane reveal (~1500ms) → detail → nights → Book
  heart: { reveal: clipRevealMs('heart'), offset: 150 }, // health — tap "Start workout" after the dashboard reveals (~1150ms)
}

export const actionStartMs = (ia: IconAnimation) =>
  Math.max(100, Math.round(CARD_TIMING[ia].reveal + CARD_TIMING[ia].offset))
