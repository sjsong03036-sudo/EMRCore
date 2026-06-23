import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getApiErrorStatus } from '../../api/apiError'
import {
  deleteAdmissionDischargeRecord,
  deleteNursingRecord,
  getMedicalRecord,
} from '../../api/medicalRecordApi'
import { ROUTE_PATHS } from '../../app/routePaths'
import { Button } from '../../components/ui/Button'
import { ConfirmModal } from '../../components/ui/ConfirmModal'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import { useAuthStore } from '../auth/authStore'
import type {
  MedicalRecordDetail,
  MedicalRecordType,
} from '../../types/medicalRecord'
import { MedicalRecordTypeBadge } from './components/MedicalRecordTypeBadge'

interface DetailFieldProps {
  label: string
  value?: number | string
}

const editableRecordTypes: MedicalRecordType[] = [
  'NURSING',
  'ADMISSION_DISCHARGE',
]

function canManageMedicalRecord(
  record: MedicalRecordDetail | undefined,
  user: { id: number; role: string } | null,
) {
  if (!record || !user || !editableRecordTypes.includes(record.type)) {
    return false
  }

  if (record.type === 'NURSING') {
    return user.role === 'NURSE' && user.id === record.authorId
  }

  if (record.type === 'ADMISSION_DISCHARGE') {
    return user.role === 'DOCTOR' || user.role === 'NURSE'
  }

  return false
}

function parseRecordId(recordId?: string) {
  const parsedRecordId = Number(recordId)

  if (!Number.isInteger(parsedRecordId) || parsedRecordId <= 0) {
    return null
  }

  return parsedRecordId
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <dt className="text-xs font-semibold text-slate-500">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-slate-900">
        {value ?? '-'}
      </dd>
    </div>
  )
}

function getEditPath(record: MedicalRecordDetail) {
  if (record.type === 'NURSING') {
    return `/app/medical-records/nursing/${record.id}/edit`
  }

  if (record.type === 'ADMISSION_DISCHARGE') {
    return `/app/medical-records/admission-discharge/${record.id}/edit`
  }

  return null
}

function getDeleteRecordErrorMessage(error: unknown) {
  const status = getApiErrorStatus(error)

  if (status === 403) {
    return '현재 계정 권한으로는 의무기록을 삭제할 수 없습니다.'
  }

  if (status === 404) {
    return '삭제할 의무기록을 찾을 수 없습니다.'
  }

  return '의무기록 삭제에 실패했습니다.'
}

function renderTypeSpecificFields(record: MedicalRecordDetail) {
  switch (record.type) {
    case 'NURSING':
      return (
        <>
          <DetailField label="간호 내용" value={record.nursingContent} />
          <DetailField label="관찰 내용" value={record.observation} />
        </>
      )
    case 'ADMISSION_DISCHARGE':
      return (
        <>
          <DetailField label="입원일" value={record.admissionDate} />
          <DetailField label="퇴원일" value={record.dischargeDate} />
          <DetailField label="입원 사유" value={record.admissionReason} />
          <DetailField label="퇴원 메모" value={record.dischargeNote} />
        </>
      )
    case 'INITIAL':
      return (
        <>
          <DetailField label="주호소" value={record.chiefComplaint} />
          <DetailField label="현병력" value={record.presentIllness} />
          <DetailField label="진단" value={record.diagnosis} />
        </>
      )
    case 'FOLLOW_UP':
      return (
        <>
          <DetailField label="경과 기록" value={record.progressNote} />
          <DetailField label="계획" value={record.plan} />
        </>
      )
    case 'OPERATION':
      return (
        <>
          <DetailField label="수술명" value={record.operationName} />
          <DetailField label="집도의" value={record.surgeon} />
          <DetailField label="마취 유형" value={record.anesthesiaType} />
        </>
      )
  }
}

export function MedicalRecordDetailPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const { recordId } = useParams()
  const parsedRecordId = parseRecordId(recordId)
  const isValidRecordId = parsedRecordId !== null
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const recordQuery = useQuery({
    enabled: isValidRecordId,
    queryKey: ['medicalRecord', parsedRecordId],
    queryFn: () => getMedicalRecord(parsedRecordId as number),
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (recordQuery.data?.type === 'NURSING') {
        await deleteNursingRecord(recordQuery.data.id)
        return
      }

      if (recordQuery.data?.type === 'ADMISSION_DISCHARGE') {
        await deleteAdmissionDischargeRecord(recordQuery.data.id)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['medicalRecords'] })
      await queryClient.invalidateQueries({ queryKey: ['patientMedicalRecords'] })
      navigate(ROUTE_PATHS.medicalRecords, { replace: true })
    },
  })

  if (!isValidRecordId) {
    return <ErrorMessage message="올바르지 않은 의무기록 ID입니다." />
  }

  const record = recordQuery.data
  const editPath = record ? getEditPath(record) : null
  const canManageRecord = canManageMedicalRecord(record, user)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-teal-700">의무기록</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            의무기록 상세
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            to={ROUTE_PATHS.medicalRecords}
          >
            목록
          </Link>
          {canManageRecord && editPath && (
            <Link
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              to={editPath}
            >
              수정
            </Link>
          )}
          {canManageRecord && (
            <Button
              onClick={() => setIsDeleteModalOpen(true)}
              variant="danger"
            >
              삭제
            </Button>
          )}
        </div>
      </div>

      {recordQuery.error && (
        <ErrorMessage message="의무기록 상세 정보를 불러오지 못했습니다." />
      )}
      {deleteMutation.error && (
        <ErrorMessage
          message={getDeleteRecordErrorMessage(deleteMutation.error)}
        />
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {recordQuery.isLoading && (
          <p className="text-sm text-slate-600">
            의무기록 상세 정보를 불러오는 중입니다.
          </p>
        )}
        {record && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  기록 ID: {record.id}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  환자 ID: {record.patientId}
                </p>
              </div>
              <MedicalRecordTypeBadge type={record.type} />
            </div>

            <dl className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <DetailField label="환자" value={record.patientName} />
              <DetailField label="작성자" value={record.authorName} />
              <DetailField label="기록일시" value={record.recordDate} />
              <DetailField label="생성일시" value={record.createdAt} />
              <DetailField label="수정일시" value={record.updatedAt} />
            </dl>
          </div>
        )}
      </section>

      {record && (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">상세 내용</h2>
          <dl className="mt-5 grid gap-4 md:grid-cols-2">
            {renderTypeSpecificFields(record)}
          </dl>
        </section>
      )}

      <ConfirmModal
        confirmLabel="삭제"
        description="삭제한 의무기록은 목록에서 제외됩니다. 계속 진행하시겠습니까?"
        isConfirming={deleteMutation.isPending}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        title="의무기록 삭제"
      />
    </div>
  )
}
