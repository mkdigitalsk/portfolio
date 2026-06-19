'use client'

import { type IconType } from 'react-icons'
import { BrandColors } from '@/shared/theme/brandColors'
import {
  SiAndroid,
  SiApple,
  SiDocker,
  SiFirebase,
  SiFlutter,
  SiGithubactions,
  SiJetpackcompose,
  SiKotlin,
  SiKtor,
  SiMui,
  SiNextdotjs,
  SiPostgresql,
  SiReact,
  SiReactquery,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si'

const ICONS: Record<string, IconType> = {
  iOS: SiApple,
  Android: SiAndroid,
  'Kotlin Multiplatform': SiKotlin,
  'Compose Multiplatform': SiJetpackcompose,
  Flutter: SiFlutter,
  'React Native': SiReact,
  SwiftUI: SiSwift,
  Kotlin: SiKotlin,
  Swift: SiSwift,
  React: SiReact,
  'Next.js': SiNextdotjs,
  TypeScript: SiTypescript,
  'Material UI': SiMui,
  'Tailwind CSS': SiTailwindcss,
  'TanStack Query': SiReactquery,
  Ktor: SiKtor,
  PostgreSQL: SiPostgresql,
  Firebase: SiFirebase,
  Docker: SiDocker,
  Vercel: SiVercel,
  'GitHub Actions': SiGithubactions,
}

export function TechIcon({ tech }: { tech: string }) {
  const Icon = ICONS[tech]
  if (!Icon) {
    return null
  }
  return <Icon size={15} color={BrandColors[tech]} aria-hidden />
}
