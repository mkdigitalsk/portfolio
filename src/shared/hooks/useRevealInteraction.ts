'use client'

import { useState } from 'react'
import { useHasHover } from './useHasHover'

// Hover: reveal on hover, activate on click. Touch: first tap reveals, second activates — one gesture
// can't do reveal + back + activate, so a showcase drops "tap to flip back".
export function useRevealInteraction(onActivate: () => void) {
  const hasHover = useHasHover()
  const [hovered, setHovered] = useState(false)
  const [tapped, setTapped] = useState(false)
  const revealed = hasHover ? hovered : tapped

  const showActivateHint = !hasHover && revealed

  const containerProps = hasHover
    ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        onClick: onActivate,
      }
    : {
        onClick: () => {
          if (tapped) onActivate()
          else setTapped(true)
        },
      }

  return { revealed, containerProps, showActivateHint }
}
