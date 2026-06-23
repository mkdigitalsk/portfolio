'use client'

import { useState } from 'react'
import { useHasHover } from './useHasHover'

// Headless reveal interaction — the component depends on the INTENT (`revealed` + an activate
// callback) and spreads `containerProps`; it never knows hover vs tap (DIP — the platform is the
// implementation, behind this interface). Implementation per input capability ([[useHasHover]]):
//   • hover devices  → reveal on hover, activate on click
//   • touch devices  → reveal on first tap, activate on the second (tap is a 2-state toggle, so for
//                      a showcase we intentionally drop "tap to flip back" — you go in or scroll on)
export function useRevealInteraction(onActivate: () => void) {
  const hasHover = useHasHover()
  const [hovered, setHovered] = useState(false)
  const [tapped, setTapped] = useState(false)
  const revealed = hasHover ? hovered : tapped

  // Touch only: once revealed, the next tap activates — surface a "tap to open" affordance so the
  // user knows a second tap navigates. Hover devices activate on a single click, so no hint needed.
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
