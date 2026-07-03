'use client'

import { Select as MuiSelect, type SelectProps as MuiSelectProps } from '@mui/material'

export function Select<Value = unknown>({ sx, ...props }: MuiSelectProps<Value>) {
  return <MuiSelect<Value> size="small" sx={sx} {...props} />
}
