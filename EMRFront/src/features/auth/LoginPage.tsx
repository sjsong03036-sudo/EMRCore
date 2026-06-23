import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../api/authApi'
import { ROUTE_PATHS } from '../../app/routePaths'
import type { LoginRequest } from '../../types/auth'
import { useAuthStore } from './authStore'

const LOGIN_ERROR_MESSAGE = '아이디 또는 비밀번호가 일치하지 않습니다.'

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [loginError, setLoginError] = useState('')
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginRequest>({
    defaultValues: {
      loginId: '',
      password: '',
    },
  })

  const handleLogin = async (values: LoginRequest) => {
    setLoginError('')

    try {
      const auth = await login(values)
      setAuth(auth)
      navigate(ROUTE_PATHS.dashboard, { replace: true })
    } catch {
      setLoginError(LOGIN_ERROR_MESSAGE)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-teal-700">EMR Core</p>
        <h1 className="mt-3 text-3xl font-semibold">로그인</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          병원 내부 직원을 위한 EMR 관리자 시스템입니다.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleLogin)}>
          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="loginId"
            >
              아이디
            </label>
            <input
              autoComplete="username"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              id="loginId"
              type="text"
              {...register('loginId', {
                required: '아이디를 입력해 주세요.',
              })}
            />
            {errors.loginId && (
              <p className="mt-2 text-sm text-red-600">
                {errors.loginId.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              비밀번호
            </label>
            <input
              autoComplete="current-password"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              id="password"
              type="password"
              {...register('password', {
                required: '비밀번호를 입력해 주세요.',
              })}
            />
            {errors.password && (
              <p className="mt-2 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {loginError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {loginError}
            </p>
          )}

          <button
            className="w-full rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? '로그인 중' : '로그인'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          계정이 없으면{' '}
          <Link
            className="font-semibold text-teal-700 hover:text-teal-800"
            to={ROUTE_PATHS.signup}
          >
            회원가입
          </Link>
        </p>
      </section>
    </main>
  )
}
