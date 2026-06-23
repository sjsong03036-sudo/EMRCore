import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getApiErrorStatus } from '../../api/apiError'
import { getPatient, updatePatient } from '../../api/patientApi'
import { RoleGuard } from '../../components/RoleGuard'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import type {
  CreatePatientRequest,
  UpdatePatientRequest,
} from '../../types/patient'
import { PatientForm } from './components/PatientForm'

function getPatientDetailPath(patientId: number) {
  return `/app/patients/${patientId}`
}

function parsePatientId(patientId?: string) {
  const parsedPatientId = Number(patientId)

  if (!Number.isInteger(parsedPatientId) || parsedPatientId <= 0) {
    return null
  }

  return parsedPatientId
}

function getUpdatePatientErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error)

  if (status === 403) {
    return '현재 계정 권한으로는 환자 정보를 수정할 수 없습니다.'
  }

  if (status === 404) {
    return '수정할 환자를 찾을 수 없습니다.'
  }

  return '환자 정보 수정에 실패했습니다. 입력 정보를 확인해 주세요.'
}

export function PatientEditPage() {
  const navigate = useNavigate()
  const { patientId } = useParams()
  const parsedPatientId = parsePatientId(patientId)
  const isValidPatientId = parsedPatientId !== null

  const patientQuery = useQuery({
    enabled: isValidPatientId,
    queryKey: ['patient', parsedPatientId],
    queryFn: () => getPatient(parsedPatientId as number),
  })

  const mutation = useMutation({
    mutationFn: (values: UpdatePatientRequest) =>
      updatePatient(parsedPatientId as number, values),
    onSuccess: (patient) => {
      navigate(getPatientDetailPath(patient.id), { replace: true })
    },
  })

  if (!isValidPatientId) {
    return <ErrorMessage message="올바르지 않은 환자 ID입니다." />
  }

  const handleSubmit = (
    values: CreatePatientRequest | UpdatePatientRequest,
  ) => {
    mutation.mutate(values)
  }

  return (
    <RoleGuard
      allowedRoles={['ADMIN_STAFF']}
      fallback={
        <ErrorMessage message="현재 계정 권한으로는 환자 정보를 수정할 수 없습니다." />
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-teal-700">환자 관리</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            환자 수정
          </h1>
        </div>

        {patientQuery.isLoading && (
          <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            기존 환자 정보를 불러오는 중입니다.
          </p>
        )}

        {patientQuery.error && (
          <ErrorMessage
            message={getUpdatePatientErrorMessage(patientQuery.error)}
          />
        )}

        {mutation.error && (
          <ErrorMessage message={getUpdatePatientErrorMessage(mutation.error)} />
        )}

        {patientQuery.data && (
          <PatientForm
            defaultValues={patientQuery.data}
            isSubmitting={mutation.isPending}
            mode="edit"
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </RoleGuard>
  )
}
