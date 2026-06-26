// Page-shell width — the single column EVERY part of the site aligns to: the nav bar, the
// footer and every content section share these exact left/right edges (with a px: 3 gutter).
// One source so the chrome and the content can never drift apart.
export const CONTENT_MAX = 1180

// Readable text column WITHIN the page shell. 66 characters per line is the typographic optimum
// (range 50–75; WCAG caps at 80). The `ch` unit fixes the measure to ~66 chars regardless of font
// size (1ch = width of the "0" glyph). Every content page (home sections, /about, /privacy) caps
// its body copy to this so lines never run too wide.
export const TEXT_MAX = '66ch'

// Top padding (the gap under the sticky nav) for the first content block of EVERY page —
// one source of truth so /about, home, the app detail and privacy never drift apart again.
export const PAGE_PT = { xs: 3, md: 4 }
