import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getApiErrorStatus } from '../../api/apiError'
import { createPatient } from '../../api/patientApi'
import { RoleGuard } from '../../components/RoleGuard'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import type {
  CreatePatientRequest,
  UpdatePatientRequest,
} from '../../types/patient'
import { PatientForm } from './components/PatientForm'

const SUCCESS_MESSAGE = '환자가 등록되었습니다.'

function getPatientDetailPath(patientId: number) {
  return `/app/patients/${patientId}`
}

function getCreatePatientErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error)

  if (status === 403) {
    return '현재 계정 권한으로는 환자를 등록할 수 없습니다.'
  }

  if (status === 409) {
    return '이미 등록된 환자 정보가 있습니다.'
  }

  return '환자 등록에 실패했습니다. 입력 정보를 확인해 주세요.'
}

export function PatientCreatePage() {
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState('')
  const [createdPatientId, setCreatedPatientId] = useState<number | null>(null)
  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: (patient) => {
      setSuccessMessage(SUCCESS_MESSAGE)
      setCreatedPatientId(patient.id)
    },
  })

  useEffect(() => {
    if (!createdPatientId) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      navigate(getPatientDetailPath(createdPatientId), { replace: true })
    }, 700)

    return () => window.clearTimeout(timeoutId)
  }, [createdPatientId, navigate])

  const handleSubmit = (
    values: CreatePatientRequest | UpdatePatientRequest,
  ) => {
    mutation.mutate(values as CreatePatientRequest)
  }

  return (
    <RoleGuard
      allowedRoles={['ADMIN_STAFF']}
      fallback={
        <ErrorMessage message="현재 계정 권한으로는 환자를 등록할 수 없습니다." />
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-teal-700">환자 관리</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            환자 등록
          </h1>
        </div>

        {successMessage && (
          <p
            className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
            role="status"
          >
            {successMessage}
          </p>
        )}

        {mutation.error && (
          <ErrorMessage message={getCreatePatientErrorMessage(mutation.error)} />
        )}

        <PatientForm
          isSubmitting={mutation.isPending}
          mode="create"
          onSubmit={handleSubmit}
        />
      </div>
    </RoleGuard>
  )
}
