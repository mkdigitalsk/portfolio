import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material'
import {
  AccountBalance,
  FlightTakeoff,
  MonitorHeart,
  Restaurant,
  RocketLaunchOutlined,
  ShoppingBag,
  Storefront,
} from '@mui/icons-material'
import { Brand } from '@/shared/theme/color'
import type { IconAnimation } from './iconAnimations'

// Text (label, tagline, feature label + benefit) is localized — see the `apps.<id>`
// section in locales/*.json. Here we keep only the structure + feature keys.
export interface ShowcaseApp {
  id: string
  Icon: ComponentType<SvgIconProps>
  accent: string
  iconAnimation: IconAnimation
  featureKeys: string[]
}

export const showcaseApps: ShowcaseApp[] = [
  {
    id: 'food',
    Icon: Restaurant,
    accent: '#FF6B35',
    iconAnimation: 'food',
    featureKeys: [
      'liveTracking',
      'favourites',
      'payments',
      'scheduled',
      'menuFilters',
      'ratings',
      'promos',
      'multiLanguage',
      'supportChat',
    ],
  },
  {
    id: 'fintech',
    Icon: AccountBalance,
    accent: '#103A66',
    iconAnimation: 'flip',
    featureKeys: [
      'biometricLogin',
      'instantTransfers',
      'cardControls',
      'spendingInsights',
      'multiCurrency',
      'savingsGoals',
      'realtimeAlerts',
      'fastOnboarding',
      'billSplitting',
    ],
  },
  {
    id: 'ecommerce',
    Icon: ShoppingBag,
    accent: '#4F46E5', // indigo — distinct from marketplace's purple (was the dead brand purple)
    iconAnimation: 'drop',
    featureKeys: [
      'search',
      'recommendations',
      'wishlist',
      'guestCheckout',
      'payments',
      'orderTracking',
      'reviews',
      'cartReminders',
      'loyalty',
    ],
  },
  {
    id: 'booking',
    Icon: FlightTakeoff,
    accent: '#0288D1',
    iconAnimation: 'fly',
    featureKeys: [
      'search',
      'availability',
      'instantBooking',
      'mapView',
      'payments',
      'manage',
      'reviews',
      'multiLangCurrency',
      'reminders',
    ],
  },
  {
    id: 'marketplace',
    Icon: Storefront,
    accent: '#8E24AA',
    iconAnimation: 'wind',
    featureKeys: [
      'sellerListings',
      'search',
      'chat',
      'escrow',
      'buyerProtection',
      'reviews',
      'verification',
      'shipping',
      'pushOffers',
    ],
  },
  {
    id: 'health',
    Icon: MonitorHeart,
    accent: '#E0457B',
    iconAnimation: 'heart',
    featureKeys: [
      'activityTracking',
      'wearableSync',
      'workoutPlans',
      'nutrition',
      'progressCharts',
      'goalReminders',
      'challenges',
      'sleep',
      'privacy',
    ],
  },
]

// Not part of the home grid — the "Your idea" / Get-in-touch flow opens this in the
// configurator with generic, cross-product features that start UNSELECTED (blank slate).
export const customApp: ShowcaseApp = {
  id: 'custom',
  Icon: RocketLaunchOutlined,
  accent: Brand.teal, // the "your custom app" card represents MK Digital itself
  iconAnimation: 'drop',
  featureKeys: [
    'accounts',
    'payments',
    'notifications',
    'chat',
    'search',
    'adminDashboard',
    'analytics',
    'multiLanguage',
    'offline',
  ],
}

export const detailApps: ShowcaseApp[] = [...showcaseApps, customApp]
