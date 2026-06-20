import Box from '@mui/material/Box'
import { BookingCarousel } from '@/features/showcase/previews/BookingCarousel'
import { BookingFlow } from '@/features/showcase/previews/BookingFlow'
import { BookingPreview } from '@/features/showcase/previews/BookingPreview'
import { BookingSearch } from '@/features/showcase/previews/BookingSearch'
import { EcommerceCarousel } from '@/features/showcase/previews/EcommerceCarousel'
import { EcommerceFlow } from '@/features/showcase/previews/EcommerceFlow'
import { EcommerceGrid } from '@/features/showcase/previews/EcommerceGrid'
import { EcommercePreview } from '@/features/showcase/previews/EcommercePreview'
import { FintechDashboard } from '@/features/showcase/previews/FintechDashboard'
import { FintechFlow } from '@/features/showcase/previews/FintechFlow'
import { FintechPreview } from '@/features/showcase/previews/FintechPreview'
import { FintechTabs } from '@/features/showcase/previews/FintechTabs'
import { FoodFlow } from '@/features/showcase/previews/FoodFlow'
import { FoodPreview } from '@/features/showcase/previews/FoodPreview'
import { HealthChart } from '@/features/showcase/previews/HealthChart'
import { HealthFlow } from '@/features/showcase/previews/HealthFlow'
import { HealthPreview } from '@/features/showcase/previews/HealthPreview'
import { HealthRings } from '@/features/showcase/previews/HealthRings'
import { MarketplaceFlow } from '@/features/showcase/previews/MarketplaceFlow'
import { MarketplaceGrid } from '@/features/showcase/previews/MarketplaceGrid'
import { MarketplacePreview } from '@/features/showcase/previews/MarketplacePreview'
import { MarketplaceTabs } from '@/features/showcase/previews/MarketplaceTabs'

// Temporary review page. The "Flow" (first in each group) is the chosen direction —
// an auto-simulated interaction flow with a per-vertical micro-theme. The rest are
// earlier single-pattern variants kept for reference.
type Variant = { name: string; Preview: (props: { accent: string }) => React.ReactNode }
type Group = { vertical: string; accent: string; variants: Variant[] }

const GROUPS: Group[] = [
  {
    vertical: 'Food',
    accent: '#FF6B35',
    variants: [
      { name: 'Flow ⭐', Preview: FoodFlow },
      { name: 'Scroll', Preview: FoodPreview },
    ],
  },
  {
    vertical: 'Fintech',
    accent: '#103A66',
    variants: [
      { name: 'Flow ⭐', Preview: FintechFlow },
      { name: 'List', Preview: FintechPreview },
      { name: 'Dashboard', Preview: FintechDashboard },
      { name: 'Tabs', Preview: FintechTabs },
    ],
  },
  {
    vertical: 'Ecommerce',
    accent: '#6200EE',
    variants: [
      { name: 'Flow ⭐', Preview: EcommerceFlow },
      { name: 'List', Preview: EcommercePreview },
      { name: 'Carousel', Preview: EcommerceCarousel },
      { name: 'Grid', Preview: EcommerceGrid },
    ],
  },
  {
    vertical: 'Booking',
    accent: '#0288D1',
    variants: [
      { name: 'Flow ⭐', Preview: BookingFlow },
      { name: 'List', Preview: BookingPreview },
      { name: 'Carousel', Preview: BookingCarousel },
      { name: 'Search', Preview: BookingSearch },
    ],
  },
  {
    vertical: 'Marketplace',
    accent: '#8E24AA',
    variants: [
      { name: 'Flow ⭐', Preview: MarketplaceFlow },
      { name: 'List', Preview: MarketplacePreview },
      { name: 'Tabs', Preview: MarketplaceTabs },
      { name: 'Grid', Preview: MarketplaceGrid },
    ],
  },
  {
    vertical: 'Health',
    accent: '#E0457B',
    variants: [
      { name: 'Flow ⭐', Preview: HealthFlow },
      { name: 'List', Preview: HealthPreview },
      { name: 'Rings', Preview: HealthRings },
      { name: 'Chart', Preview: HealthChart },
    ],
  },
]

export default function PreviewTestPage() {
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 5 }}>
      {GROUPS.map(({ vertical, accent, variants }) => (
        <Box key={vertical} sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: accent }} />
            <Box sx={{ fontSize: 18, fontWeight: 800 }}>{vertical}</Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {variants.map(({ name, Preview }) => (
              <Box key={name}>
                <Box
                  sx={{
                    position: 'relative',
                    width: 320,
                    height: 240,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    overflow: 'hidden',
                    boxShadow: '0 12px 24px -14px rgba(0,0,0,0.3)',
                  }}
                >
                  <Preview accent={accent} />
                </Box>
                <Box sx={{ mt: 0.75, fontSize: 13, color: 'text.secondary' }}>{name}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
