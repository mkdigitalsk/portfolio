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

// Booking: the exhaust-plume reveal uses an SVG clip-path with REAL bezier curves
// (see planePaths + AppRevealCard). Only the timing below is read for `fly`; the CSS
// clip values are unused. Times match `fly`.
const planeReveal: RevealConfig = {
  rest: clip('inset(0% 0% 100% 0%)'),
  active: clip('inset(0% 0% 0% 0%)'),
  // Five keyframes: point -> three growing exhaust cones -> full. Times equal the plane's
  // progress so each cone's apex stays glued to the plane as it flies on and the trail grows.
  transition: { duration: 1.2, times: [0, 0.28, 0.46, 0.66, 0.82], ease: 'easeInOut' },
}

// Curved plume in objectBoundingBox units (0..1, y down): a point at the plane ->
// a billowing cone with two bowed bezier sides -> the full card. Every keyframe keeps
// the SAME path structure (M + 4×C + Z) so motion can morph `d` smoothly.
// Newton's 3rd law: the exhaust ejects exactly OPPOSITE to the plane's motion, so the
// trail is a SYMMETRIC cone on the plane's flight axis, opening straight behind it. As the
// plane flies on, the apex tracks it and the cone keeps GROWING (longer + wider) until it
// covers the card. Each cone is computed about the reversed velocity vector (aspect-
// corrected). All keyframes share the structure (M + 4×C + Z) so `d` morphs cleanly:
// point at the plane -> three growing cones -> full card.
export const planePaths = [
  'M 0.5 0.38 C 0.5 0.38 0.5 0.38 0.5 0.38 C 0.5 0.38 0.5 0.38 0.5 0.38 C 0.5 0.38 0.5 0.38 0.5 0.38 C 0.5 0.38 0.5 0.38 0.5 0.38 Z',
  'M 0.688 0.362 C 0.688 0.362 0.688 0.362 0.688 0.362 C 0.415 0.437 0.168 0.608 -0.052 0.876 C -0.105 0.683 -0.158 0.491 -0.211 0.298 C 0.115 0.416 0.415 0.437 0.688 0.362 Z',
  'M 0.947 0.237 C 0.947 0.237 0.947 0.237 0.947 0.237 C 0.548 0.571 0.22 1.014 -0.038 1.566 C -0.248 1.242 -0.459 0.917 -0.669 0.593 C -0.059 0.583 0.479 0.464 0.947 0.237 Z',
  'M 1.358 -0.195 C 1.358 -0.195 1.358 -0.195 1.358 -0.195 C 0.985 0.606 0.759 1.513 0.678 2.525 C 0.111 2.114 -0.455 1.702 -1.021 1.29 C -0.082 0.901 0.71 0.406 1.358 -0.195 Z',
  'M 0 0 C 0.33 0 0.66 0 1 0 C 1 0.33 1 0.66 1 1 C 0.66 1 0.33 1 0 1 C 0 0.66 0 0.33 0 0 Z',
]

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
