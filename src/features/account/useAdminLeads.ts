'use client'

import { useEffect, useState } from 'react'
import { API_BASE } from '@/shared/api'
import type { LeadStatus } from './leadStatus'

export interface AdminLead {
  id: number
  email: string
  appType: string
  platforms: string[]
  features: string[]
  name: string | null
  phone: string | null
  note: string | null
  hasDoc: boolean
  createdAt: string // ISO-8601 UTC
  status: LeadStatus
}

export function useAdminLeads(token: string | null) {
  const [leads, setLeads] = useState<AdminLead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let active = true
    fetch(`${API_BASE}/api/v1/admin/leads`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 403 ? 'notAuthorized' : 'loadLeadsFailed')
        return (await res.json()) as AdminLead[]
      })
      .then((data) => {
        if (active) setLeads(data)
      })
      .catch((e: Error) => {
        if (active) setError(e.message === 'notAuthorized' ? 'notAuthorized' : 'loadLeadsFailed')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [token])

  return { leads, loading, error }
}
