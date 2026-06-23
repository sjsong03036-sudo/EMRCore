import { Link } from 'react-router-dom'
import { Badge } from '../../components/ui/Badge'
import { EmptyState } from '../../components/ui/EmptyState'
import { useAuthStore } from '../auth/authStore'
import { getMenusByRole } from '../../utils/menus'

const roleLabels = {
  ADMIN_STAFF: '원무과',
  DOCTOR: '의사',
  NURSE: '간호사',
} as const

export function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const menus = getMenusByRole(user?.role)

  if (!user) {
    return (
      <EmptyState
        description="로그인 사용자 정보를 불러온 뒤 대시보드를 표시합니다."
        title="사용자 정보가 없습니다."
      />
    )
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-teal-700">대시보드</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {user.name}님, 환영합니다.
            </h1>
            <p className="mt-3 text-sm text-slate-600">
              EMR Core 백엔드 API 흐름을 확인하는 관리자 화면입니다.
            </p>
          </div>
          <Badge tone="teal">
            {roleLabels[user.role]} ({user.role})
          </Badge>
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">주요 메뉴</h2>
          <p className="mt-1 text-sm text-slate-600">
            현재 역할에서 접근 가능한 기능만 표시됩니다.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {menus.map((menu) => (
            <Link
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow"
              key={menu.to}
              to={menu.to}
            >
              <p className="text-base font-semibold text-slate-900">
                {menu.label}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {menu.to}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
