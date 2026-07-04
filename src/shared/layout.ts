// Marketing reading column (home, /about, /privacy). Chrome is full-bleed and ignores this — only
// content columns use it. App surface goes wider via ACCOUNT_MAX.
export const CONTENT_MAX = 1180

// /account app-surface width. Fills to the chrome's edge gutter on normal screens (content aligns with
// the nav); caps past 1600 so tables don't spread into dead gaps on ultrawide.
export const ACCOUNT_MAX = 1600

// Body-copy measure. 66ch ≈ typographic optimum (50–75; WCAG caps at 80); `ch` holds it across font
// sizes. Cap body copy to this so lines never run too wide.
export const TEXT_MAX = '66ch'

// Top gap under the sticky nav for every page's first block — one source so pages never drift apart.
export const PAGE_PT = { xs: 3, md: 4 }
