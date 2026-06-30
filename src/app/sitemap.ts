import type { MetadataRoute } from 'next'
import { detailApps } from '@/features/showcase/apps'

const BASE = 'https://mkdigital.sk'

// Locale is cookie/header-based (no URL prefix), so each page is a single canonical URL.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
  const appPages: MetadataRoute.Sitemap = detailApps.map((app) => ({
    url: `${BASE}/app/${app.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))
  return [...staticPages, ...appPages]
}
