// Leveled dev logger — a no-op in production builds, so the client console stays silent and no
// data (PII included) ever reaches end users' devtools. Next.js inlines NODE_ENV at build time,
// which also lets the bundler drop the bodies from the prod bundle.
const enabled = process.env.NODE_ENV !== 'production'

export const logger = {
  debug: (...args: unknown[]) => {
    if (enabled) console.debug('[mk]', ...args)
  },
  info: (...args: unknown[]) => {
    if (enabled) console.info('[mk]', ...args)
  },
  warn: (...args: unknown[]) => {
    if (enabled) console.warn('[mk]', ...args)
  },
  error: (...args: unknown[]) => {
    if (enabled) console.error('[mk]', ...args)
  },
}
