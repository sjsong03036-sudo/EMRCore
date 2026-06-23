import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../../api/authApi'
import { ROUTE_PATHS } from '../../app/routePaths'
import { USER_ROLES, type SignupRequest, type UserRole } from '../../types/auth'

const SIGNUP_ERROR_MESSAGE = '회원가입에 실패했습니다. 입력 정보를 확인해 주세요.'

const roleLabels: Record<UserRole, string> = {
  ADMIN_STAFF: '원무과',
  DOCTOR: '의사',
  NURSE: '간호사',
}

export function SignupPage() {
  const navigate = useNavigate()
  const [signupError, setSignupError] = useState('')
  const {
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
  } = useForm<SignupRequest>({
    defaultValues: {
      loginId: '',
      name: '',
      password: '',
      passwordConfirm: '',
      role: 'NURSE',
    },
  })

  const handleSignup = async (values: SignupRequest) => {
    setSignupError('')

    try {
      await signup(values)
      navigate(ROUTE_PATHS.login, { replace: true })
    } catch {
      setSignupError(SIGNUP_ERROR_MESSAGE)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-teal-700">EMR Core</p>
        <h1 className="mt-3 text-3xl font-semibold">회원가입</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          업무 역할에 맞는 계정을 등록합니다.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(handleSignup)}>
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
              htmlFor="name"
            >
              이름
            </label>
            <input
              autoComplete="name"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              id="name"
              type="text"
              {...register('name', {
                required: '이름을 입력해 주세요.',
              })}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="role"
            >
              역할
            </label>
            <select
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              id="role"
              {...register('role', {
                required: '역할을 선택해 주세요.',
              })}
            >
              {USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {roleLabels[role]} ({role})
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-2 text-sm text-red-600">
                {errors.role.message}
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
              autoComplete="new-password"
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

          <div>
            <label
              className="block text-sm font-medium text-slate-700"
              htmlFor="passwordConfirm"
            >
              비밀번호 확인
            </label>
            <input
              autoComplete="new-password"
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              id="passwordConfirm"
              type="password"
              {...register('passwordConfirm', {
                required: '비밀번호 확인을 입력해 주세요.',
                validate: (value) =>
                  value === getValues('password') ||
                  '비밀번호가 일치하지 않습니다.',
              })}
            />
            {errors.passwordConfirm && (
              <p className="mt-2 text-sm text-red-600">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>

          {signupError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {signupError}
            </p>
          )}

          <button
            className="w-full rounded-md bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? '가입 중' : '회원가입'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          이미 계정이 있으면{' '}
          <Link
            className="font-semibold text-teal-700 hover:text-teal-800"
            to={ROUTE_PATHS.login}
          >
            로그인
          </Link>
        </p>
      </section>
    </main>
  )
}
