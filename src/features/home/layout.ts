// Shared layout rhythm for the home sections — lives here, in one place, so every section
// aligns to the SAME left/right edges and uses the SAME vertical padding. Tune the whole page
// from here; never hardcode widths/padding per section (that's what made it look scattered).
// CONTENT_MAX is the page-shell width, shared with the nav bar + footer via @/shared/layout.
export { CONTENT_MAX, PAGE_PT } from '@/shared/layout'
export const TEXT_MAX = 680 // readable text column WITHIN a section (~65–75 chars per line)
export const SECTION_PY = { xs: 6, md: 8 } // standard vertical padding between sections
