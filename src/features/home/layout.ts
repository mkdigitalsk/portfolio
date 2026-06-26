// Shared layout rhythm for the home sections — lives here, in one place, so every section
// aligns to the SAME left/right edges and uses the SAME vertical padding. Tune the whole page
// from here; never hardcode widths/padding per section (that's what made it look scattered).
// CONTENT_MAX (shell width) + TEXT_MAX (readable column) are global, shared via @/shared/layout.
export { CONTENT_MAX, PAGE_PT, TEXT_MAX } from '@/shared/layout'
export const SECTION_PY = { xs: 6, md: 8 } // standard vertical padding between sections
