import type { ComponentType } from 'react'
import type { SvgIconProps } from '@mui/material'
import {
  AccountBalance,
  FlightTakeoff,
  MonitorHeart,
  Restaurant,
  ShoppingBag,
  Storefront,
} from '@mui/icons-material'
import type { IconAnimation } from './iconAnimations'

export interface AppFeature {
  label: string
  benefit: string
}

export interface ShowcaseApp {
  id: string
  label: string
  Icon: ComponentType<SvgIconProps>
  accent: string
  tagline: string
  features: AppFeature[]
  iconAnimation: IconAnimation
  previewSrc?: string
}

export const showcaseApps: ShowcaseApp[] = [
  {
    id: 'food',
    label: 'Food delivery',
    Icon: Restaurant,
    accent: '#FF6B35',
    previewSrc: '/previews/food.mp4',
    iconAnimation: 'food',
    tagline: 'Everything your customers need to order, track, and reorder with ease.',
    features: [
      { label: 'Live order tracking', benefit: 'Customers watch their driver arrive in real time' },
      { label: 'Favourites & reorder', benefit: 'One-tap reordering brings customers back faster' },
      { label: 'In-app payments', benefit: 'Cards, wallets, and cash all supported securely' },
      { label: 'Scheduled delivery', benefit: 'Let customers pick their ideal delivery time' },
      { label: 'Smart menu filters', benefit: 'Find dishes by diet, allergens, or price' },
      { label: 'Ratings & reviews', benefit: 'Build trust with honest customer feedback' },
      { label: 'Promo codes & loyalty', benefit: 'Reward regulars and boost repeat orders' },
      { label: 'Multi-language support', benefit: 'Reach every customer in their own language' },
      { label: 'In-app support chat', benefit: 'Resolve order issues without leaving the app' },
    ],
  },
  {
    id: 'fintech',
    label: 'Banking & Fintech',
    Icon: AccountBalance,
    accent: '#1E8E5A',
    previewSrc: '/previews/fintech.mp4',
    iconAnimation: 'flip',
    tagline: 'Everything your customers need to bank with confidence.',
    features: [
      { label: 'Biometric login', benefit: 'Secure access with face or fingerprint' },
      { label: 'Instant transfers', benefit: 'Send and receive money in seconds' },
      { label: 'Card freeze & controls', benefit: 'Lock cards and set limits instantly' },
      { label: 'Spending insights', benefit: 'Clear view of where money goes' },
      { label: 'Multi-currency accounts', benefit: 'Hold and spend in many currencies' },
      { label: 'Savings goals', benefit: 'Help customers save toward what matters' },
      { label: 'Real-time alerts', benefit: 'Instant notifications on every transaction' },
      { label: 'Fast onboarding', benefit: 'Verify identity and open accounts in minutes' },
      { label: 'Bill splitting', benefit: 'Share costs with friends effortlessly' },
    ],
  },
  {
    id: 'ecommerce',
    label: 'E-commerce',
    Icon: ShoppingBag,
    accent: '#6200EE',
    previewSrc: '/previews/ecommerce.mp4',
    iconAnimation: 'drop',
    tagline: 'A shopping app that turns browsers into loyal buyers.',
    features: [
      { label: 'Smart search & filters', benefit: 'Shoppers find the right product fast' },
      { label: 'Personalised recommendations', benefit: 'Tailored picks that lift every order' },
      { label: 'Wishlist & stock alerts', benefit: 'Saved items bring shoppers back' },
      { label: 'Fast guest checkout', benefit: 'Fewer abandoned carts, more sales' },
      { label: 'Multiple payment methods', benefit: 'Pay by card, wallet, or instalments' },
      { label: 'Order tracking', benefit: 'Customers follow deliveries with confidence' },
      { label: 'Reviews & ratings', benefit: 'Real feedback builds buyer trust' },
      { label: 'Abandoned-cart reminders', benefit: 'Win back nearly-completed purchases' },
      { label: 'Loyalty & rewards', benefit: 'Repeat customers spend more over time' },
    ],
  },
  {
    id: 'booking',
    label: 'Booking & Travel',
    Icon: FlightTakeoff,
    accent: '#0288D1',
    previewSrc: '/previews/booking.mp4',
    iconAnimation: 'fly',
    tagline: 'Turn every search into a confident, completed booking.',
    features: [
      { label: 'Smart search & filters', benefit: 'Customers find the right option in seconds' },
      { label: 'Availability calendar', benefit: 'Live dates and prices, never double-booked' },
      { label: 'Instant booking', benefit: 'Reserve in a few quick taps' },
      { label: 'Map view', benefit: 'See exactly where everything is located' },
      { label: 'Secure payments', benefit: 'Trusted checkout protects every transaction' },
      { label: 'Booking management', benefit: 'View, change or cancel trips easily' },
      { label: 'Ratings & reviews', benefit: 'Real feedback builds buyer confidence' },
      { label: 'Multi-language & currency', benefit: 'Welcome travellers from anywhere in the world' },
      { label: 'Trip reminders', benefit: 'Timely alerts keep customers on schedule' },
    ],
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    Icon: Storefront,
    accent: '#8E24AA',
    previewSrc: '/previews/marketplace.mp4',
    iconAnimation: 'wind',
    tagline: 'Everything buyers and sellers need to trade with confidence.',
    features: [
      { label: 'Easy seller listings', benefit: 'Sellers list items in seconds with photos' },
      { label: 'Smart search & filters', benefit: 'Buyers find the right item fast' },
      { label: 'In-app chat', benefit: 'Buyers and sellers talk before buying' },
      { label: 'Secure escrow payments', benefit: 'Money released only when buyers are happy' },
      { label: 'Buyer protection', benefit: 'Refunds and dispute support build trust' },
      { label: 'Ratings & reviews', benefit: 'Honest feedback rewards trustworthy users' },
      { label: 'Identity verification', benefit: 'Verified accounts keep out fraud' },
      { label: 'Shipping integration', benefit: 'Labels and tracking handled inside the app' },
      { label: 'Push offers & alerts', benefit: 'Bring shoppers back with timely deals' },
    ],
  },
  {
    id: 'health',
    label: 'Health & Fitness',
    Icon: MonitorHeart,
    accent: '#E0457B',
    previewSrc: '/previews/health.mp4',
    iconAnimation: 'heart',
    tagline: 'Help your users move more, eat better, and stay motivated.',
    features: [
      { label: 'Activity tracking', benefit: 'Logs steps, runs, and workouts automatically' },
      { label: 'Wearable sync', benefit: 'Connects Apple Watch, Fitbit, and Garmin' },
      { label: 'Personalised workout plans', benefit: "Routines tailored to each user's goals" },
      { label: 'Nutrition logging', benefit: 'Easy meal and calorie tracking' },
      { label: 'Progress charts', benefit: 'See improvement at a glance' },
      { label: 'Goal reminders', benefit: 'Gentle nudges keep users on track' },
      { label: 'Social challenges', benefit: 'Friendly competition drives daily engagement' },
      { label: 'Sleep & recovery', benefit: 'Track rest for healthier results' },
      { label: 'Private health data', benefit: 'Personal information stays safe and secure' },
    ],
  },
]
