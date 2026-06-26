// Single source of truth for every color in the app.
// Two layers: raw brand primitives → per-scheme palettes (Light / Dark) the theme consumes.
// Rebrand = edit the primitives; retune a mode = edit that scheme block.

// ── Brand primitives — mode-agnostic hues of the "MK == the stack" identity ──
export const Brand = {
  navy: '#0E2A47', // base / trust
  blue: '#2F6DB0', // stack bridge tone
  blueLight: '#7FB0E0', // dark-mode lift of navy
  teal: '#37C2B4', // signature accent
  tealDark: '#1796A8', // accessible teal for text on light surfaces (pure teal fails contrast)
  white: '#FFFFFF',
} as const

// ── Light scheme ──
export const Light = {
  primary: Brand.navy,
  secondary: Brand.teal,
  error: '#FF1A1A',
  success: '#4CAF50',
  warning: '#FF9800',
  neutral: { 0: '#FFFFFF', 20: '#C8C8C8', 40: '#919191', 60: '#5A5A5A', 80: '#232323', 100: '#000000' },
  stack: [Brand.navy, Brand.blue, Brand.teal] as readonly string[], // logo 3-bar mark / tricolor "MK"
}

// ── Dark scheme — lifted + desaturated per Material dark-theme guidance ──
export const Dark = {
  primary: Brand.blueLight, // navy is too dark on a dark bg
  secondary: Brand.teal,
  error: '#CF6679',
  success: '#81C784',
  warning: '#FFB74D',
  neutral: { 0: '#121212', 20: '#2C2C2C', 40: '#717171', 60: '#B0B0B0', 80: '#ECECEC', 100: '#FFFFFF' },
  stack: [Brand.white, Brand.blueLight, Brand.teal] as readonly string[],
}
