import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { authStore } from '@/shared/auth/authStore'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.mkdigital.sk'

export const client = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStore.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Expired/invalid token — drop the session so the reactive store flips the UI to the login form.
    if (error.response?.status === 401) authStore.clear()
    return Promise.reject(error)
  },
)
