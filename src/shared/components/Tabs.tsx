'use client'

import { Tab as MuiTab, Tabs as MuiTabs } from '@mui/material'

export interface TabItem {
  value: string
  label: string
}

interface TabsProps {
  value: string
  onChange: (value: string) => void
  items: TabItem[]
}

export function Tabs({ value, onChange, items }: TabsProps) {
  return (
    <MuiTabs
      value={value}
      onChange={(_, next) => onChange(next as string)}
      variant="scrollable"
      scrollButtons="auto"
      allowScrollButtonsMobile
      sx={{ '& .MuiTab-root': { textTransform: 'none', minHeight: 44, fontWeight: 600 } }}
    >
      {items.map((item) => (
        <MuiTab key={item.value} value={item.value} label={item.label} />
      ))}
    </MuiTabs>
  )
}
