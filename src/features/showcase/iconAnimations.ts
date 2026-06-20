import type { Transition, Variants } from 'motion/react'

export type IconAnimation = 'flip' | 'food' | 'drop' | 'fly' | 'wind' | 'heart'

interface IconAnimationConfig {
  variants: Variants
  transition: Transition
}

export const iconAnimations: Record<IconAnimation, IconAnimationConfig> = {
  flip: {
    variants: { rest: { rotateY: 0, opacity: 1 }, active: { rotateY: 180, opacity: 0 } },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  food: {
    variants: { rest: { opacity: 1 }, active: { opacity: [1, 1, 1, 0.7, 0] } },
    transition: { duration: 0.9, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut' },
  },
  drop: {
    variants: { rest: { y: 0, rotate: 0, opacity: 1 }, active: { y: 96, rotate: -10, opacity: 0 } },
    transition: { duration: 0.45, ease: [0.5, 0, 0.75, 0] },
  },
  fly: {
    variants: {
      rest: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
      // Real takeoff profile (FAA: ground roll -> rotation -> climb-out). First a flat,
      // accelerating runway roll (y stays ~0 while x speeds up), then a smooth rotation
      // knee, then a steady climb-out off-card. Densely sampled so it reads as a curve,
      // not a polygon. The plane keeps climbing far off-card while the reveal finishes;
      // the card's overflow clips it, so it "flies on" unseen.
      active: {
        x: [0, 18, 50, 100, 170, 255, 355, 470, 600],
        y: [0, 0, -2, -12, -45, -110, -210, -345, -510],
        rotate: [0, 0, 1, 4, 12, 20, 27, 32, 35],
        scale: [1, 1, 0.99, 0.96, 0.9, 0.8, 0.7, 0.6, 0.52],
      },
    },
    transition: { duration: 1.2, ease: 'linear' },
  },
  wind: {
    variants: {
      rest: { rotate: 0, opacity: 1 },
      active: { rotate: [0, -7, 5, -4, 2, 0], opacity: [1, 1, 1, 1, 1, 0] },
    },
    transition: { duration: 0.75, ease: 'easeInOut' },
  },
  heart: {
    variants: { rest: { opacity: 1 }, active: { opacity: [1, 1, 0] } },
    transition: { duration: 1.2, times: [0, 0.78, 1], ease: 'easeInOut' },
  },
}
