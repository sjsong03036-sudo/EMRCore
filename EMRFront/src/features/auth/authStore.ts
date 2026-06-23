import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, LoginResponse } from '../../types/auth'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  setAuth: (auth: LoginResponse) => void
  clearAuth: () => void
  updateTokens: (accessToken: string, refreshToken?: string) => void
}

const initialAuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialAuthState,
      setAuth: ({ accessToken, refreshToken, user }) =>
        set({
          accessToken,
          refreshToken: refreshToken ?? null,
          user,
          isAuthenticated: true,
        }),
      clearAuth: () => set(initialAuthState),
      updateTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken: refreshToken ?? null,
          isAuthenticated: true,
        }),
    }),
    {
      name: 'emr-auth-store',
    },
  ),
)
