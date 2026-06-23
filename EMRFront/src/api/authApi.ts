import { axiosInstance } from './axiosInstance'
import { unwrapApiResponse } from './apiResponse'
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  TokenResponse,
  UserRole,
} from '../types/auth'

interface ReissueRequest {
  refreshToken: string
}

interface JwtPayload {
  exp?: number
  loginId?: string
  role?: UserRole
  sub?: string
}

function decodeJwtPayload(token: string) {
  const [, payload] = token.split('.')

  if (!payload) {
    throw new Error('Invalid token.')
  }

  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
  const decodedPayload = window.atob(
    normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      '=',
    ),
  )

  return JSON.parse(decodedPayload) as JwtPayload
}

function toLoginResponse(tokenResponse: TokenResponse): LoginResponse {
  const payload = decodeJwtPayload(tokenResponse.accessToken)
  const id = Number(payload.sub)
  const loginId = payload.loginId ?? ''

  if (!Number.isInteger(id) || !payload.role || !loginId) {
    throw new Error('Token payload is missing user claims.')
  }

  return {
    accessToken: tokenResponse.accessToken,
    refreshToken: tokenResponse.refreshToken,
    user: {
      id,
      loginId,
      name: loginId,
      role: payload.role,
    },
  }
}

export async function signup(request: SignupRequest) {
  await axiosInstance.post('/auth/signup', request)
}

export async function login(request: LoginRequest) {
  const response = await axiosInstance.post<TokenResponse>(
    '/auth/login',
    request,
  )

  return toLoginResponse(unwrapApiResponse<TokenResponse>(response.data))
}

export async function reissue(request: ReissueRequest) {
  const response = await axiosInstance.post<TokenResponse>(
    '/auth/reissue',
    request,
  )

  return toLoginResponse(unwrapApiResponse<TokenResponse>(response.data))
}

export async function logout() {
  await axiosInstance.post('/auth/logout')
}
