import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { getApiErrorMessage } from './apiError'
import { unwrapApiResponse } from './apiResponse'
import { ROUTE_PATHS } from '../app/routePaths'
import { useAuthStore } from '../features/auth/authStore'
import type { TokenResponse } from '../types/auth'

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface ApiErrorResponse {
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

function redirectToLogin() {
  if (window.location.pathname !== ROUTE_PATHS.login) {
    window.location.replace(ROUTE_PATHS.login)
  }
}

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as
      | RetryableAxiosRequestConfig
      | undefined
    const status = error.response?.status

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken, updateTokens } = useAuthStore.getState()

        if (!refreshToken) {
          throw new Error('Refresh token is missing.')
        }

        const response = await axios.post<TokenResponse>(
          '/auth/reissue',
          { refreshToken },
          { baseURL: API_BASE_URL },
        )

        const tokenResponse = unwrapApiResponse<TokenResponse>(response.data)

        updateTokens(tokenResponse.accessToken, tokenResponse.refreshToken)
        originalRequest.headers.Authorization = `Bearer ${tokenResponse.accessToken}`

        return axiosInstance(originalRequest)
      } catch (reissueError) {
        useAuthStore.getState().clearAuth()
        redirectToLogin()
        return Promise.reject(reissueError)
      }
    }

    if (status === 403) {
      error.message = getApiErrorMessage(error)
    }

    return Promise.reject(error)
  },
)
