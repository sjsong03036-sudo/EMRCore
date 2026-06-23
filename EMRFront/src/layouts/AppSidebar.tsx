import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../features/auth/authStore'
import { getMenusByRole } from '../utils/menus'

export function AppSidebar() {
  const userRole = useAuthStore((state) => state.user?.role)
  const sidebarMenus = getMenusByRole(userRole)

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white px-4 py-6">
      <p className="px-3 text-xs font-semibold uppercase text-slate-400">
        메뉴 영역
      </p>
      <nav className="mt-4 space-y-1" aria-label="주요 메뉴">
        {sidebarMenus.map((menu) => (
          <NavLink
            className={({ isActive }) =>
              [
                'block rounded-md px-3 py-2 text-sm font-medium',
                isActive
                  ? 'bg-teal-50 text-teal-800'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')
            }
            key={menu.to}
            to={menu.to}
          >
            {menu.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
