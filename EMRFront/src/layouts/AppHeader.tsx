import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../api/authApi'
import { ROUTE_PATHS } from '../app/routePaths'
import { useAuthStore } from '../features/auth/authStore'

export function AppHeader() {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const user = useAuthStore((state) => state.user)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
    } finally {
      clearAuth()
      navigate(ROUTE_PATHS.login, { replace: true })
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <p className="text-xs font-semibold text-teal-700">EMR Core</p>
        <h1 className="text-base font-semibold text-slate-900">관리자 시스템</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-right">
          <p className="text-xs text-slate-500">사용자 영역</p>
          <p className="text-sm font-medium text-slate-800">
            {user ? `${user.name} (${user.role})` : '로그인 사용자'}
          </p>
        </div>
        <button
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={isLoggingOut}
          onClick={handleLogout}
          type="button"
        >
          {isLoggingOut ? '로그아웃 중' : '로그아웃'}
        </button>
      </div>
    </header>
  )
}
