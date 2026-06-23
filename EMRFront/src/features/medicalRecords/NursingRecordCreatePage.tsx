import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getApiErrorStatus } from '../../api/apiError'
import { createNursingRecord } from '../../api/medicalRecordApi'
import { RoleGuard } from '../../components/RoleGuard'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import type {
  CreateNursingRecordRequest,
  UpdateNursingRecordRequest,
} from '../../types/medicalRecord'
import { NursingRecordForm } from './components/NursingRecordForm'

function getMedicalRecordDetailPath(recordId: number) {
  return `/app/medical-records/${recordId}`
}

function getCreateNursingRecordErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error)

  if (status === 403) {
    return '현재 계정 권한으로는 간호기록을 작성할 수 없습니다.'
  }

  if (status === 404) {
    return '간호기록을 작성할 환자를 찾을 수 없습니다.'
  }

  return '간호기록 작성에 실패했습니다. 입력 정보를 확인해 주세요.'
}

export function NursingRecordCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [pendingValues, setPendingValues] =
    useState<CreateNursingRecordRequest | null>(null)

  const mutation = useMutation({
    mutationFn: createNursingRecord,
    onSuccess: async (record) => {
      await queryClient.invalidateQueries({ queryKey: ['medicalRecords'] })
      await queryClient.invalidateQueries({
        queryKey: ['patientMedicalRecords', record.patientId],
      })
      navigate(getMedicalRecordDetailPath(record.id), { replace: true })
    },
  })

  const handleSubmit = (
    values: CreateNursingRecordRequest | UpdateNursingRecordRequest,
  ) => {
    setPendingValues(values as CreateNursingRecordRequest)
  }

  const handleConfirm = () => {
    if (!pendingValues) {
      return
    }

    mutation.mutate(pendingValues)
  }

  return (
    <RoleGuard
      allowedRoles={['NURSE']}
      fallback={
        <ErrorMessage message="현재 계정 권한으로는 간호기록을 작성할 수 없습니다." />
      }
    >
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-teal-700">의무기록</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            간호기록 작성
          </h1>
        </div>

        {mutation.error && (
          <ErrorMessage
            message={getCreateNursingRecordErrorMessage(mutation.error)}
          />
        )}

        <NursingRecordForm
          isSubmitting={mutation.isPending}
          mode="create"
          onSubmit={handleSubmit}
        />

        <ConfirmModal
          confirmLabel="저장"
          description="입력한 내용으로 간호기록을 저장하시겠습니까?"
          isConfirming={mutation.isPending}
          isOpen={pendingValues !== null}
          onClose={() => setPendingValues(null)}
          onConfirm={handleConfirm}
          title="간호기록 저장"
        />
      </div>
    </RoleGuard>
  )
}
