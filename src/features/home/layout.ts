// Shared layout rhythm for the home sections — lives here, in one place, so every section
// aligns to the SAME left/right edges and uses the SAME vertical padding. Tune the whole page
// from here; never hardcode widths/padding per section (that's what made it look scattered).
export const CONTENT_MAX = 1180 // single content width — every section shares these edges
export const TEXT_MAX = 680 // readable text column WITHIN a section (~65–75 chars per line)
export const SECTION_PY = { xs: 6, md: 8 } // standard vertical padding between sections
