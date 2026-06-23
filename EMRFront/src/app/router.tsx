import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { LoginPage } from '../features/auth/LoginPage'
import { SignupPage } from '../features/auth/SignupPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { AdmissionDischargeRecordCreatePage } from '../features/medicalRecords/AdmissionDischargeRecordCreatePage'
import { AdmissionDischargeRecordEditPage } from '../features/medicalRecords/AdmissionDischargeRecordEditPage'
import { MedicalRecordDetailPage } from '../features/medicalRecords/MedicalRecordDetailPage'
import { MedicalRecordListPage } from '../features/medicalRecords/MedicalRecordListPage'
import { NursingRecordCreatePage } from '../features/medicalRecords/NursingRecordCreatePage'
import { NursingRecordEditPage } from '../features/medicalRecords/NursingRecordEditPage'
import { PatientCreatePage } from '../features/patients/PatientCreatePage'
import { PatientDetailPage } from '../features/patients/PatientDetailPage'
import { PatientEditPage } from '../features/patients/PatientEditPage'
import { PatientListPage } from '../features/patients/PatientListPage'
import { PatientMedicalRecordHistoryPage } from '../features/patients/PatientMedicalRecordHistoryPage'
import { AppLayout } from '../layouts/AppLayout'
import { ROUTE_PATHS } from './routePaths'

export const router = createBrowserRouter([
  {
    path: ROUTE_PATHS.root,
    element: <Navigate to={ROUTE_PATHS.login} replace />,
  },
  {
    path: ROUTE_PATHS.login,
    element: <LoginPage />,
  },
  {
    path: ROUTE_PATHS.signup,
    element: <SignupPage />,
  },
  {
    path: ROUTE_PATHS.app,
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to={ROUTE_PATHS.dashboard} replace />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'patients',
            element: <PatientListPage />,
          },
          {
            path: 'patients/new',
            element: <PatientCreatePage />,
          },
          {
            path: 'patients/:patientId',
            element: <PatientDetailPage />,
          },
          {
            path: 'patients/:patientId/edit',
            element: <PatientEditPage />,
          },
          {
            path: 'patients/:patientId/records',
            element: <PatientMedicalRecordHistoryPage />,
          },
          {
            path: 'medical-records',
            element: <MedicalRecordListPage />,
          },
          {
            path: 'medical-records/:recordId',
            element: <MedicalRecordDetailPage />,
          },
          {
            path: 'medical-records/nursing/new',
            element: <NursingRecordCreatePage />,
          },
          {
            path: 'medical-records/nursing/:recordId/edit',
            element: <NursingRecordEditPage />,
          },
          {
            path: 'medical-records/admission-discharge/new',
            element: <AdmissionDischargeRecordCreatePage />,
          },
          {
            path: 'medical-records/admission-discharge/:recordId/edit',
            element: <AdmissionDischargeRecordEditPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <PlaceholderPage
        description="요청한 경로를 찾을 수 없습니다."
        title="페이지를 찾을 수 없습니다"
      />
    ),
  },
])
