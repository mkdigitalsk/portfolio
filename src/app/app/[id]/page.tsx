import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AppDetail } from '@/features/showcase/AppDetail'
import { detailApps } from '@/features/showcase/apps'

export function generateStaticParams() {
  return detailApps.map((app) => ({ id: app.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  if (!detailApps.some((app) => app.id === id)) return {}
  const t = await getTranslations()
  return {
    title: `${t(`apps.${id}.label`)} — MK Digital`,
    description: t(`apps.${id}.tagline`),
  }
}

export default async function AppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!detailApps.some((app) => app.id === id)) notFound()
  return <AppDetail appId={id} />
}
