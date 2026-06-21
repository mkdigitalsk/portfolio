'use client'

// Raw platform call kept in a plain module function (not a component/hook) so the window API
// stays outside React; components depend only on the hook's interface (DIP — see web-conventions).
function scrollWindowToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Smoothly scroll the page to the top — used by the Home nav item to "reset" the home page.
export function useScrollToTop() {
  return scrollWindowToTop
}
