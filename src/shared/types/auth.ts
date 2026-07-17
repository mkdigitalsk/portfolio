export type Role = 'ADMIN' | 'CLIENT'

export interface AccountUser {
  email: string
  name: string
  role: Role
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AcceptInviteRequest {
  token: string
  password: string
  name?: string
}

export interface AuthResponse {
  token: string
  user: { email: string; name: string }
}
