// Marketing reading column (home, /about, /privacy). Chrome is full-bleed and ignores this — only
// content columns use it. App surface goes wider via ACCOUNT_MAX.
export const CONTENT_MAX = 1180

// App-surface width — interactive tools (the /account portal, the configurator), not reading copy, so
// they use the screen. Fills to the chrome's edge gutter on normal screens; caps past 1600 on ultrawide.
export const ACCOUNT_MAX = 1600

// Body-copy measure. 66ch ≈ typographic optimum (50–75; WCAG caps at 80); `ch` holds it across font
// sizes. Cap body copy to this so lines never run too wide.
export const TEXT_MAX = '66ch'

// Top gap under the sticky nav for every page's first block — one source so pages never drift apart.
export const PAGE_PT = { xs: 3, md: 4 }

// Client account panel — semantic spacing tokens (MUI 8px-grid units) so the panel's rhythm lives in
// one place, not scattered magic numbers. Per Material Design 3: cards 16 / list items 8 vertical /
// sections 24 (m3.material.io/components/lists/specs, /components/cards/guidelines).
export const PANEL = {
  max: 880, // px — reading column width for the client SOW panel (narrower than the wide app shell)
  section: 3, // 24px — gap between cards / sections
  card: 2, // 16px — card content padding
  itemY: 1, // 8px — list-item vertical padding
  itemX: 1, // 8px — list-item horizontal padding
} as const
