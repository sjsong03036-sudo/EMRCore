import type { ReactNode } from 'react'
import { useAuthStore } from '../features/auth/authStore'
import type { UserRole } from '../types/auth'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const userRole = useAuthStore((state) => state.user?.role)

  if (!userRole || !allowedRoles.includes(userRole)) {
    return fallback
  }

  return children
}
