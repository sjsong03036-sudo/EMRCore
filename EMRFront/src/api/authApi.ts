import { axiosInstance } from './axiosInstance'
import { unwrapApiResponse } from './apiResponse'
import type { LoginRequest, LoginResponse, SignupRequest } from '../types/auth'

interface ReissueRequest {
  refreshToken: string
}

export async function signup(request: SignupRequest) {
  await axiosInstance.post('/auth/signup', request)
}

export async function login(request: LoginRequest) {
  const response = await axiosInstance.post<LoginResponse>(
    '/auth/login',
    request,
  )

  return unwrapApiResponse<LoginResponse>(response.data)
}

export async function reissue(request: ReissueRequest) {
  const response = await axiosInstance.post<LoginResponse>(
    '/auth/reissue',
    request,
  )

  return unwrapApiResponse<LoginResponse>(response.data)
}

export async function logout() {
  await axiosInstance.post('/auth/logout')
}
