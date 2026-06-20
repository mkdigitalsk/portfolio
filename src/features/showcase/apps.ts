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
import type { IconAnimation } from './iconAnimations'

// Text (label, tagline, feature label + benefit) is localized — see the `apps.<id>`
// section in locales/*.json. Here we keep only the structure + feature keys.
export interface ShowcaseApp {
  id: string
  Icon: ComponentType<SvgIconProps>
  accent: string
  iconAnimation: IconAnimation
  featureKeys: string[]
  previewSrc?: string
}

export const showcaseApps: ShowcaseApp[] = [
  {
    id: 'food',
    Icon: Restaurant,
    accent: '#FF6B35',
    iconAnimation: 'food',
    previewSrc: '/previews/food.mp4',
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
    accent: '#1E8E5A',
    iconAnimation: 'flip',
    previewSrc: '/previews/fintech.mp4',
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
    accent: '#6200EE',
    iconAnimation: 'drop',
    previewSrc: '/previews/ecommerce.mp4',
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
    previewSrc: '/previews/booking.mp4',
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
    previewSrc: '/previews/marketplace.mp4',
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
    previewSrc: '/previews/health.mp4',
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
  accent: '#6200EE',
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
