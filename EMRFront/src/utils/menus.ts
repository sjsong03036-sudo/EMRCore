import { ROUTE_PATHS } from '../app/routePaths'
import type { UserRole } from '../types/auth'

export interface AppMenu {
  allowedRoles: UserRole[]
  label: string
  to: string
}

const allRoles: UserRole[] = ['DOCTOR', 'NURSE', 'ADMIN_STAFF']

export const appMenus: AppMenu[] = [
  {
    allowedRoles: allRoles,
    label: '대시보드',
    to: ROUTE_PATHS.dashboard,
  },
  {
    allowedRoles: allRoles,
    label: '환자 관리',
    to: ROUTE_PATHS.patients,
  },
  {
    allowedRoles: allRoles,
    label: '의무기록 조회',
    to: ROUTE_PATHS.medicalRecords,
  },
  {
    allowedRoles: ['NURSE'],
    label: '간호기록 작성',
    to: ROUTE_PATHS.nursingRecordNew,
  },
  {
    allowedRoles: ['DOCTOR', 'NURSE'],
    label: '입퇴원기록 작성',
    to: ROUTE_PATHS.admissionDischargeRecordNew,
  },
]

export function getMenusByRole(role: UserRole | null | undefined) {
  if (!role) {
    return appMenus.filter((menu) => menu.allowedRoles.length === allRoles.length)
  }

  return appMenus.filter((menu) => menu.allowedRoles.includes(role))
}
