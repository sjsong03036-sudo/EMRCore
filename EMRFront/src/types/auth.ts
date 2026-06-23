export const USER_ROLES = ['DOCTOR', 'NURSE', 'ADMIN_STAFF'] as const

export type UserRole = (typeof USER_ROLES)[number]

export interface AuthUser {
  id: number
  loginId: string
  name: string
  role: UserRole
}

export interface LoginRequest {
  loginId: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken?: string
  user: AuthUser
}

export interface TokenResponse {
  accessToken: string
  refreshToken?: string
}

export interface SignupRequest {
  loginId: string
  password: string
  passwordConfirm: string
  name: string
  role: UserRole
}
