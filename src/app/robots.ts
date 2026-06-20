import type { MetadataRoute } from 'next'

// While the pre-launch gate is on (SITE_PASSWORD set) keep crawlers out entirely; once the
// gate is removed for launch, allow indexing. Same env var drives both — no launch edit.
export default function robots(): MetadataRoute.Robots {
  const gated = Boolean(process.env.SITE_PASSWORD)
  return {
    rules: { userAgent: '*', ...(gated ? { disallow: '/' } : { allow: '/' }) },
  }
}
