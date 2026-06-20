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
      // Hover: natural takeoff (longer along X, then steeper) out through the
      // top-right corner, then off-screen around the OUTSIDE of the card to park
      // bottom-left (invisible, no fade). On unhover it flies back in from the
      // bottom-left to home (Framer reverses to rest).
      active: {
        x: [0, 95, 240, 240, -240],
        y: [0, -30, -180, 300, 200],
        rotate: [0, 12, 26, 26, 20],
        scale: [1, 0.9, 0.7, 0.7, 0.7],
      },
    },
    transition: { duration: 1.2, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.72, 1] },
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
