export const ROUTE_PATHS = {
  root: '/',
  app: '/app',
  login: '/login',
  signup: '/signup',
  dashboard: '/app/dashboard',
  patients: '/app/patients',
  patientNew: '/app/patients/new',
  patientDetail: '/app/patients/:patientId',
  patientEdit: '/app/patients/:patientId/edit',
  patientRecords: '/app/patients/:patientId/records',
  medicalRecords: '/app/medical-records',
  medicalRecordDetail: '/app/medical-records/:recordId',
  nursingRecordNew: '/app/medical-records/nursing/new',
  nursingRecordEdit: '/app/medical-records/nursing/:recordId/edit',
  admissionDischargeRecordNew:
    '/app/medical-records/admission-discharge/new',
  admissionDischargeRecordEdit:
    '/app/medical-records/admission-discharge/:recordId/edit',
} as const
