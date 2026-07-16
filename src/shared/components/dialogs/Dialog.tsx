'use client'

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { Button } from '../Button'

interface AlertDialogProps {
  open: boolean
  title: string
  text?: string
  confirmText: string
  dismissText: string
  destructive?: boolean
  onConfirm: () => void
  onDismiss: () => void
}

export function AlertDialog({
  open,
  title,
  text,
  confirmText,
  dismissText,
  destructive = false,
  onConfirm,
  onDismiss,
}: AlertDialogProps) {
  return (
    <Dialog open={open} onClose={onDismiss}>
      <DialogTitle>{title}</DialogTitle>
      {text && (
        <DialogContent>
          <DialogContentText>{text}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button variant="text" onClick={onDismiss}>
          {dismissText}
        </Button>
        <Button onClick={onConfirm} {...(destructive && { color: 'error' })}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
