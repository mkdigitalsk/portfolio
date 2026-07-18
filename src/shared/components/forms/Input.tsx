'use client'

import Box from '@mui/material/Box'
import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from '@mui/material'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

interface InputProps extends Omit<MuiTextFieldProps, 'error' | 'helperText'> {
  error?: boolean
  errorText?: string
}

// Same tween as the page entrance (Reveal), reversed direction — the error slides
// DOWN from behind the field (top → bottom), not up like Reveal.
const ERROR_TWEEN = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const

export function Input({ error = false, errorText, slotProps, sx, ...props }: InputProps) {
  const reduceMotion = useReducedMotion()

  return (
    <Box>
      <MuiTextField
        fullWidth
        error={error}
        slotProps={{ inputLabel: { shrink: true }, ...slotProps }}
        sx={[
          {
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
            '& .MuiOutlinedInput-input': { py: 2.5, px: 3, fontSize: '1rem' },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...props}
      />
      <Box sx={{ overflow: 'hidden', minHeight: error && errorText ? 26 : undefined }}>
        <AnimatePresence initial={false}>
          {error && errorText && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
              transition={ERROR_TWEEN}
            >
              <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.75, ml: 0.5 }}>{errorText}</Box>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  )
}
