import type { ComponentType } from 'react'
import { BookingFlow } from './BookingFlow'
import { EcommerceFlow } from './EcommerceFlow'
import { FintechFlow } from './FintechFlow'
import { FoodFlow } from './FoodFlow'
import { HealthFlow } from './HealthFlow'
import { MarketplaceFlow } from './MarketplaceFlow'
import type { PreviewProps } from './PreviewKit'

// The animated app-screen preview shown in each card's reveal — keyed by app id.
export const APP_PREVIEWS: Record<string, ComponentType<PreviewProps>> = {
  food: FoodFlow,
  fintech: FintechFlow,
  ecommerce: EcommerceFlow,
  booking: BookingFlow,
  marketplace: MarketplaceFlow,
  health: HealthFlow,
}
