import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getApiErrorStatus } from '../../api/apiError'
import {
  getMedicalRecord,
  updateAdmissionDischargeRecord,
} from '../../api/medicalRecordApi'
import { RoleGuard } from '../../components/RoleGuard'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import type {
  CreateAdmissionDischargeRecordRequest,
  UpdateAdmissionDischargeRecordRequest,
} from '../../types/medicalRecord'
import { useAuthStore } from '../auth/authStore'
import { AdmissionDischargeRecordForm } from './components/AdmissionDischargeRecordForm'

function getMedicalRecordDetailPath(recordId: number) {
  return `/app/medical-records/${recordId}`
}

function parseRecordId(recordId?: string) {
  const parsedRecordId = Number(recordId)

  if (!Number.isInteger(parsedRecordId) || parsedRecordId <= 0) {
    return null
  }

  return parsedRecordId
}

function getUpdateAdmissionDischargeRecordErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error)

  if (status === 403) {
    return '현재 계정 권한으로는 입퇴원기록을 수정할 수 없습니다.'
  }

  if (status === 404) {
    return '수정할 입퇴원기록을 찾을 수 없습니다.'
  }

  return '입퇴원기록 수정에 실패했습니다. 입력 정보를 확인해 주세요.'
}

export function AdmissionDischargeRecordEditPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const { recordId } = useParams()
  const parsedRecordId = parseRecordId(recordId)
  const isValidRecordId = parsedRecordId !== null

  const recordQuery = useQuery({
    enabled: isValidRecordId,
    queryKey: ['medicalRecord', parsedRecordId],
    queryFn: () => getMedicalRecord(parsedRecordId as number),
  })

  const mutation = useMutation({
    mutationFn: (values: UpdateAdmissionDischargeRecordRequest) =>
      updateAdmissionDischargeRecord(parsedRecordId as number, values),
    onSuccess: async (record) => {
      await queryClient.invalidateQueries({
        queryKey: ['medicalRecord', record.id],
      })
      await queryClient.invalidateQueries({ queryKey: ['medicalRecords'] })
      await queryClient.invalidateQueries({
        queryKey: ['patientMedicalRecords', record.patientId],
      })
      navigate(getMedicalRecordDetailPath(record.id), { replace: true })
    },
  })

  if (!isValidRecordId) {
    return <ErrorMessage message="올바르지 않은 의무기록 ID입니다." />
  }

  const record = recordQuery.data
  const isAdmissionDischargeRecord = record?.type === 'ADMISSION_DISCHARGE'
  const canEditRecord =
    !!record &&
    isAdmissionDischargeRecord &&
    !!user &&
    user.role === 'NURSE' &&
    user.id === record.authorId

  const handleSubmit = (
    values:
      | CreateAdmissionDischargeRecordRequest
      | UpdateAdmissionDischargeRecordRequest,
  ) => {
    mutation.mutate(values)
  }

  return (
    <RoleGuard
      allowedRoles={['NURSE']}
      fallback={
        <ErrorMessage message="현재 계정 권한으로는 입퇴원기록을 수정할 수 없습니다." />
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-teal-700">의무기록</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            입퇴원기록 수정
          </h1>
        </div>

        {recordQuery.isLoading && (
          <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
            기존 입퇴원기록을 불러오는 중입니다.
          </p>
        )}

        {recordQuery.error && (
          <ErrorMessage
            message={getUpdateAdmissionDischargeRecordErrorMessage(
              recordQuery.error,
            )}
          />
        )}

        {mutation.error && (
          <ErrorMessage
            message={getUpdateAdmissionDischargeRecordErrorMessage(
              mutation.error,
            )}
          />
        )}

        {record && !isAdmissionDischargeRecord && (
          <ErrorMessage message="입퇴원기록만 이 화면에서 수정할 수 있습니다." />
        )}

        {record && isAdmissionDischargeRecord && !canEditRecord && (
          <ErrorMessage message="본인이 작성한 입퇴원기록만 수정할 수 있습니다." />
        )}

        {canEditRecord && (
          <AdmissionDischargeRecordForm
            defaultValues={record}
            isSubmitting={mutation.isPending}
            mode="edit"
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </RoleGuard>
  )
}
