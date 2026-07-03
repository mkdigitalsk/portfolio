'use client'

import { useCallback, useEffect, useState } from 'react'
import { API_BASE } from '@/shared/api'
import type { AdminLead } from './useAdminLeads'
import type { LeadStatus } from './leadStatus'

export interface LeadArtifact {
  stage: string
  content: string
  updatedAt: string // ISO-8601 UTC
}

export interface LeadDetail {
  lead: AdminLead
  artifacts: LeadArtifact[]
}

export function useAdminLeadDetail(token: string | null, email: string | null) {
  const [detail, setDetail] = useState<LeadDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token || !email) return
    let active = true
    fetch(`${API_BASE}/api/v1/admin/leads/${encodeURIComponent(email)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 403 ? 'Not authorized.' : 'Could not load this lead.')
        return (await res.json()) as LeadDetail
      })
      .then((data) => {
        if (active) setDetail(data)
      })
      .catch((e: Error) => {
        if (active) setError(e.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [token, email])

  // Optimistic — apply immediately, revert if the PATCH fails.
  const updateStatus = useCallback(
    async (status: LeadStatus) => {
      if (!token || !email) return
      const previous = detail
      setDetail((d) => (d ? { ...d, lead: { ...d.lead, status } } : d))
      try {
        const res = await fetch(`${API_BASE}/api/v1/admin/leads/${encodeURIComponent(email)}/status`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
        if (!res.ok) throw new Error('status update failed')
        const updated = (await res.json()) as AdminLead
        setDetail((d) => (d ? { ...d, lead: updated } : d))
      } catch {
        setDetail(previous)
      }
    },
    [token, email, detail],
  )

  return { detail, loading, error, updateStatus }
}
