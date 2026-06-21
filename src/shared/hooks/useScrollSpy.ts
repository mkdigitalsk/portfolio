'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// Scroll-spy: reports which section is currently near the middle of the viewport, so the nav can
// highlight it while the user scrolls. IntersectionObserver is the modern best practice (no scroll
// listeners); the shrunk rootMargin creates a thin trigger band so exactly one section is active.
// Re-runs on route change (the observed sections only exist on the home page) and disconnects on
// cleanup (safe under React 18 strict-mode double mount). Pass a STABLE sectionIds reference.
export function useScrollSpy(sectionIds: string[]): string | null {
  const pathname = usePathname()
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    // No observed sections on this route (e.g. /about, /app) — leave activeId as-is; the nav only
    // consumes it on the home page, so a stale value is never shown elsewhere.
    if (elements.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id)
          } else {
            visible.delete(entry.target.id)
          }
        }
        // null when no observed section is in the band (e.g. scrolled up to the hero) — so the
        // nav highlight clears at the top instead of sticking on the last section.
        const current = sectionIds.find((id) => visible.has(id))
        setActiveId(current ?? null)
      },
      // Margins sum to -100% → a single detection LINE (exactly one section active at a time).
      // The line sits ~20% from the top so a section lights up as it scrolls just under the nav.
      { rootMargin: '-20% 0px -80% 0px' },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [sectionIds, pathname])

  return activeId
}
