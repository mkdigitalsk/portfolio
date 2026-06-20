import type { Transition } from 'motion/react'
import type { IconAnimation } from './iconAnimations'

type RevealTarget = Record<string, string | number | string[] | number[]>

export interface RevealConfig {
  rest: RevealTarget
  active: RevealTarget
  transition: Transition
}

const clip = (value: string) => ({ clipPath: value, WebkitClipPath: value })

// Default: circular reveal growing from the icon to cover the whole card.
const circleReveal: RevealConfig = {
  rest: clip('circle(0% at 50% 38%)'),
  active: clip('circle(150% at 50% 38%)'),
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
}

// E-commerce: the curtain splits at the middle and parts vertically, synced to the drop.
const curtainReveal: RevealConfig = {
  rest: clip('inset(50% 0% 50% 0%)'),
  active: clip('inset(0% 0% 0% 0%)'),
  transition: { duration: 0.55, ease: [0.45, 0, 0.55, 1] },
}

// Marketplace: a full-width curtain that falls from the top to the bottom.
const fallReveal: RevealConfig = {
  rest: clip('inset(0% 0% 100% 0%)'),
  active: clip('inset(0% 0% 0% 0%)'),
  transition: { duration: 0.55, ease: [0.5, 0, 0.75, 0] },
}

// Booking: the scrim is attached to the plane and trails ~180deg behind its
// flight direction. The plane banks up-right, so the cloth fans down-left behind
// it; its apex tracks the plane, then it unfurls to the whole card. Times match `fly`.
const PLANE_P0 = 'polygon(50% 38%, 50% 38%, 50% 38%, 50% 38%)'
const PLANE_P1 = 'polygon(100% 0%, 100% 0%, 60% 140%, -40% 50%)'
const PLANE_P2 = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
const planeReveal: RevealConfig = {
  rest: { clipPath: PLANE_P0, WebkitClipPath: PLANE_P0 },
  active: {
    clipPath: [PLANE_P0, PLANE_P1, PLANE_P2],
    WebkitClipPath: [PLANE_P0, PLANE_P1, PLANE_P2],
  },
  transition: { duration: 1.2, times: [0, 0.36, 0.5], ease: 'easeInOut' },
}

// Health: the heart grows over the whole card, then the video crossfades in
// underneath as the heart fades — so the reveal is an alpha transition, not a clip.
const heartReveal: RevealConfig = {
  rest: { opacity: 0, clipPath: 'inset(0% 0% 0% 0%)', WebkitClipPath: 'inset(0% 0% 0% 0%)' },
  active: { opacity: [0, 0, 0, 1] },
  transition: { duration: 1, times: [0, 0.4, 0.75, 1], ease: 'easeInOut' },
}

export const revealAnimations: Record<IconAnimation, RevealConfig> = {
  flip: circleReveal,
  food: circleReveal,
  drop: curtainReveal,
  fly: planeReveal,
  wind: fallReveal,
  heart: heartReveal,
}
